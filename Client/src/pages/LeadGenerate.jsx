import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { leadsApi, clearCacheEntry } from '@/services/api'
import { textFieldSx, selectSx, inputLabelSx, secondaryButtonSx, primaryButtonSx, successAlertSx, menuItemSx, menuPaperSx } from '../constants/formStyles'
import { containerVariants } from '../constants/formAnimations'
import { countries, states, cities, collegeTypes, leadStatuses, departments, priorities } from '../constants/leadOptions'
import { STUDENT_AGE, GRADUATION_YEAR, SUCCESS_SNACKBAR_DURATION, FORM_RESET_DELAY } from '../constants/formConstants'
import { TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText, Button, Card, CardContent, Stepper, Step, StepLabel, Typography, Alert, Snackbar } from '@mui/material'
import { User, Plane, School, FileText, ChevronRight, ChevronLeft, Save, Send } from 'lucide-react'

const LeadGenerate = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editLeadId = searchParams.get('edit')

  const [activeStep, setActiveStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [availableStates, setAvailableStates] = useState([])
  const [availableCities, setAvailableCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!editLeadId

  const steps = [
    { label: 'Employee Details', icon: User },
    { label: 'Abroad Details', icon: Plane },
    { label: 'Student Details', icon: School },
    { label: 'Lead Status', icon: FileText }
  ]

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      // Employee Details
      employeeName: '',
      employeeEmail: '',
      employeePhone: '',
      employeeDepartment: '',
      employeeId: '',

      // Abroad Details
      country: '',
      state: '',
      city: '',
      address: '',
      zipCode: '',

      // Student Details
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      studentAge: '',
      collegeName: '',
      collegeType: '',
      course: '',
      graduationYear: '',

      // Lead Status
      status: 'new',
      priority: 'medium',
      source: '',
      assignedTo: '',
      notes: '',
      followUpDate: ''
    }
  })

  const watchedCountry = watch('country')
  const watchedState = watch('state')

  console.log('=== WATCH VALUES ===')
  console.log('watchedCountry:', watchedCountry)
  console.log('watchedState:', watchedState)
  console.log('availableStates:', availableStates)
  console.log('availableCities:', availableCities)

  useEffect(() => {
    console.log('=== COUNTRY USE EFFECT ===')
    console.log('watchedCountry changed to:', watchedCountry)

    if (watchedCountry) {
      const countryStates = states[watchedCountry] || []
      console.log('countryStates from states[watchedCountry]:', countryStates)

      setAvailableStates(countryStates)

      // ✅ Sirf New Lead me reset kare
      if (!editLeadId) {
        setAvailableCities([])
        setValue('state', '')
        setValue('city', '')
        console.log('Cleared state and city (New Lead)')
      }
    } else {
      setAvailableStates([])
      setAvailableCities([])
      console.log('Cleared availableStates and availableCities')
    }
  }, [watchedCountry, editLeadId, setValue])

  useEffect(() => {
    console.log('=== STATE USE EFFECT ===')
    console.log('watchedState changed to:', watchedState)

    if (watchedState) {
      const stateCities = cities[watchedState] || []

      console.log('stateCities:', stateCities)

      setAvailableCities(stateCities)

      // Only reset for NEW Lead
      if (!editLeadId) {
        setValue('city', '')
      }

    } else {
      setAvailableCities([])
    }
  }, [watchedState, editLeadId, setValue])

  // Fetch lead data for edit mode
  useEffect(() => {
    const fetchLeadData = async () => {
      if (!editLeadId) return

      console.log('=== FETCH LEAD DATA ===')
      console.log('editLeadId:', editLeadId)

      try {
        setLoading(true)
        setError(null)

        const response = await leadsApi.getById(editLeadId)
        const leadData = response?.data || response

        console.log('leadData from API:', leadData)
        console.log('leadData.country:', leadData.country)
        console.log('leadData.state:', leadData.state)
        console.log('leadData.city:', leadData.city)

        // Map backend field names to form field names
        const formData = {
          employeeName: leadData.employeeName || '',
          employeeEmail: leadData.email || '',
          employeePhone: leadData.phone || '',
          employeeDepartment: leadData.department === 'IT' ? 'Information Technology' : leadData.department || '',
          employeeId: leadData.employeeId || '',
          country: leadData.country || '',
          state: leadData.state || '',
          city: leadData.city || '',
          address: leadData.address || '',
          zipCode: leadData.zipCode || '',
          studentName: leadData.studentName || '',
          studentEmail: leadData.studentEmail || '',
          studentPhone: leadData.studentPhone || '',
          studentAge: leadData.studentAge || '',
          collegeName: leadData.university || '',
          collegeType: leadData.collegeType || '',
          course: leadData.course || '',
          graduationYear: leadData.graduationYear || '',
          status: leadData.leadStatus || 'New',
          priority: leadData.priority || 'Medium',
          source: leadData.source || '',
          assignedTo: leadData.assignedTo || '',
          followUpDate: leadData.followUpDate || '',
          notes: leadData.notes || ''
        }

        console.log('formData to reset with:', formData)
        console.log('formData.country:', formData.country)
        console.log('formData.state:', formData.state)
        console.log('formData.city:', formData.city)

        reset(formData)

        console.log('After reset - calling watch to check values')
        console.log('watch country after reset:', watch('country'))
        console.log('watch state after reset:', watch('state'))
        console.log('watch city after reset:', watch('city'))

        // Set available states and cities based on country/state
        if (leadData.country) {
          const countryStates = states[leadData.country] || []
          console.log('Setting availableStates from leadData.country:', countryStates)
          setAvailableStates(countryStates)
          if (leadData.state) {
            const stateCities = cities[leadData.state] || []
            console.log('Setting availableCities from leadData.state:', stateCities)
            console.log('cities[leadData.state] lookup result:', cities[leadData.state])
            setAvailableCities(stateCities)
          }
        }
      } catch (err) {
        console.error('Error fetching lead:', err)
        if (err.response?.status === 404) {
          setError('Lead not found. It may have been deleted.')
        } else if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.')
        } else {
          setError('Failed to load lead data. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLeadData()
  }, [editLeadId, reset, watch])

  const handleNext = async () => {
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const onSubmit = async (data) => {

    console.log("=== SUBMIT START ===")
    console.log("RAW FORM DATA:", data)
    console.log("employeeEmail:", data.employeeEmail)
    console.log("employeePhone:", data.employeePhone)
    console.log("employeeDepartment:", data.employeeDepartment)
    console.log("collegeName:", data.collegeName)

    // Comprehensive validation - check if fields exist in data
    const missingFields = []
    if (!data.employeeEmail) missingFields.push('employeeEmail')
    if (!data.employeePhone) missingFields.push('employeePhone')
    if (!data.employeeDepartment) missingFields.push('employeeDepartment')
    if (!data.collegeName) missingFields.push('collegeName')

    if (missingFields.length > 0) {
      console.error("MISSING FIELDS:", missingFields)
      console.error("Form data is incomplete. Please fill all required fields.")
      setError(`Missing required fields: ${missingFields.join(', ')}`)
      return
    }

    // Validate required fields before submission
    if (!data.state || data.state === '') {
      console.log("VALIDATION FAILED: state is empty")
      setActiveStep(1)
      return
    }

    if (!data.city || data.city === '') {
      console.log("VALIDATION FAILED: city is empty")
      setActiveStep(1)
      return
    }

    // Validate employee required fields
    if (!data.employeeEmail || data.employeeEmail === '') {
      console.log("VALIDATION FAILED: employeeEmail is empty")
      setActiveStep(0)
      return
    }

    if (!data.employeePhone || data.employeePhone === '') {
      console.log("VALIDATION FAILED: employeePhone is empty")
      setActiveStep(0)
      return
    }

    if (!data.employeeDepartment || data.employeeDepartment === '') {
      console.log("VALIDATION FAILED: employeeDepartment is empty")
      setActiveStep(0)
      return
    }

    // Validate student required fields
    if (!data.collegeName || data.collegeName === '') {
      console.log("VALIDATION FAILED: collegeName is empty")
      setActiveStep(2)
      return
    }

    const formattedData = formatLeadData(data);
    try {

      if (isEditMode) {
        await leadsApi.update(editLeadId, formattedData)
        clearCacheEntry('/leads', 'GET')
      } else {
        // await leadsApi.create(data)
        const response = await leadsApi.create(data)
        clearCacheEntry('/leads', 'GET')

        console.log("CREATE RESPONSE:", response)
      }

      setShowSuccess(true)

      setTimeout(() => {
        if (isEditMode) {
          navigate('/admin/leads')
        } else {
          reset()
          setActiveStep(0)
        }
      }, FORM_RESET_DELAY)

    }

    catch (error) {
      console.error('FULL ERROR:', error);
      console.error('STATUS:', error.status);
      console.error('MESSAGE:', error.message);
      console.error('DETAILS:', error.details);

      console.log("==============");
      console.log(error);
      console.log(error?.details);
      console.log(JSON.stringify(error?.details, null, 2));
      console.log("==============");

      if (error.status === 404) {
        setError(isEditMode ? 'Lead not found. It may have been deleted.' : 'Resource not found.')
      } else if (error.status === 401) {
        setError('Unauthorized. Please log in again.')
      } else if (error.status === 422) {
        setError('Validation error. Please check your input.')
      } else {
        setError(isEditMode ? 'Failed to update lead. Please try again.' : 'Failed to create lead. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatLeadData = (data) => {
    return {
      employeeName: data.employeeName,
      email: data.employeeEmail,
      phone: data.employeePhone,
      employeeId: data.employeeId,
      department: data.employeeDepartment === 'Information Technology' ? 'IT' : data.employeeDepartment,
      country: data.country,
      state: data.state,
      city: data.city,
      address: data.address,
      zipCode: data.zipCode,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      studentPhone: data.studentPhone,
      studentAge: data.studentAge,
      university: data.collegeName,
      collegeType: data.collegeType,
      course: data.course,
      graduationYear: data.graduationYear,
      leadStatus: data.status || 'new',
      priority: data.priority || 'medium',
      source: data.source,
      assignedTo: data.assignedTo || '',
      notes: data.notes,
      followUpDate: data.followUpDate
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">Employee Details</h3>
                <p className="text-muted-foreground text-sm">Enter the employee information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="employeeName"
                  control={control}
                  rules={{
                    required: 'Employee name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Employee Name"
                      variant="outlined"
                      error={!!errors.employeeName}
                      helperText={errors.employeeName?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="employeeEmail"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      error={!!errors.employeeEmail}
                      helperText={errors.employeeEmail?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="employeePhone"
                  control={control}
                  rules={{
                    required: 'Phone number is required',
                    pattern: { value: /^[+]?[\d\s-()]+$/, message: 'Invalid phone format' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      error={!!errors.employeePhone}
                      helperText={errors.employeePhone?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="employeeId"
                  control={control}
                  rules={{ required: 'Employee ID is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Employee ID"
                      variant="outlined"
                      error={!!errors.employeeId}
                      helperText={errors.employeeId?.message}
                      sx={textFieldSx}
                      disabled={isEditMode}
                    />
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <Controller
                  name="employeeDepartment"
                  control={control}
                  rules={{ required: 'Department is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.employeeDepartment}>
                      <InputLabel sx={inputLabelSx}>Department</InputLabel>
                      <Select
                        {...field}
                        label="Department"
                        sx={selectSx}
                        MenuProps={{
                          PaperProps: {
                            sx: menuPaperSx
                          }
                        }}
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept} sx={menuItemSx}>{dept}</MenuItem>
                        ))}
                      </Select>
                      {errors.employeeDepartment && (
                        <FormHelperText>{errors.employeeDepartment.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">Abroad Details</h3>
                <p className="text-muted-foreground text-sm">Location and address information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: 'Country is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.country}>
                      <InputLabel sx={inputLabelSx}>Country</InputLabel>
                      <Select
                        {...field}
                        label="Country"
                        sx={selectSx}
                        MenuProps={{
                          PaperProps: {
                            sx: menuPaperSx
                          }
                        }}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code} sx={menuItemSx}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.country && (
                        <FormHelperText>{errors.country.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="state"
                  control={control}
                  rules={{ required: 'State is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.state}>
                      <InputLabel sx={inputLabelSx}>State</InputLabel>
                      <Select
                        {...field}
                        label="State"
                        disabled={!availableStates.length}
                        sx={selectSx}
                        MenuProps={{
                          PaperProps: {
                            sx: menuPaperSx
                          }
                        }}
                      >
                        {availableStates.map((state) => (
                          <MenuItem key={state.code} value={state.code} sx={menuItemSx}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.state && (
                        <FormHelperText>{errors.state.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: 'City is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.city}>
                      <InputLabel sx={inputLabelSx}>City</InputLabel>
                      <Select
                        {...field}
                        label="City"
                        disabled={!availableCities.length}
                        sx={selectSx}
                        MenuProps={{
                          PaperProps: {
                            sx: menuPaperSx
                          }
                        }}
                      >
                        {availableCities.map((city) => {
                          console.log("Rendering City:", city);

                          return (
                            <MenuItem
                              key={city.code}
                              value={city.code}
                              sx={menuItemSx}
                            >
                              {city.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.city && (
                        <FormHelperText>{errors.city.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Street Address"
                      multiline
                      rows={2}
                      variant="outlined"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="zipCode"
                  control={control}
                  rules={{
                    required: 'ZIP code is required',
                    pattern: { value: /^\d{5,6}(-\d{4})?$/, message: 'Invalid ZIP code format' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="ZIP Code"
                      variant="outlined"
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <School className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">Student Details</h3>
                <p className="text-muted-foreground text-sm">Student and college information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="studentName"
                  control={control}
                  rules={{
                    required: 'Student name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Student Name"
                      variant="outlined"
                      error={!!errors.studentName}
                      helperText={errors.studentName?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="studentEmail"
                  control={control}
                  rules={{
                    required: 'Student email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Student Email"
                      type="email"
                      variant="outlined"
                      error={!!errors.studentEmail}
                      helperText={errors.studentEmail?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="studentPhone"
                  control={control}
                  rules={{
                    required: 'Student phone is required',
                    pattern: { value: /^[+]?[\d\s-()]+$/, message: 'Invalid phone format' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Student Phone"
                      variant="outlined"
                      error={!!errors.studentPhone}
                      helperText={errors.studentPhone?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="studentAge"
                  control={control}
                  rules={{
                    required: 'Age is required',
                    min: { value: STUDENT_AGE.MIN, message: `Age must be at least ${STUDENT_AGE.MIN}` },
                    max: { value: STUDENT_AGE.MAX, message: `Age must not exceed ${STUDENT_AGE.MAX}` }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Age"
                      type="number"
                      variant="outlined"
                      error={!!errors.studentAge}
                      helperText={errors.studentAge?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="collegeName"
                  control={control}
                  rules={{ required: 'College name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="College Name"
                      variant="outlined"
                      error={!!errors.collegeName}
                      helperText={errors.collegeName?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="collegeType"
                  control={control}
                  rules={{ required: 'College type is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.collegeType}>
                      <InputLabel sx={inputLabelSx}>College Type</InputLabel>
                      <Select
                        {...field}
                        label="College Type"
                        sx={selectSx}
                        MenuProps={{
                          PaperProps: {
                            sx: menuPaperSx
                          }
                        }}
                      >
                        {collegeTypes.map((type) => (
                          <MenuItem key={type} value={type} sx={menuItemSx}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.collegeType && (
                        <FormHelperText>{errors.collegeType.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="course"
                  control={control}
                  rules={{ required: 'Course is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Course/Program"
                      variant="outlined"
                      error={!!errors.course}
                      helperText={errors.course?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="graduationYear"
                  control={control}
                  rules={{
                    required: 'Graduation year is required',
                    min: { value: GRADUATION_YEAR.MIN, message: `Year must be ${GRADUATION_YEAR.MIN} or later` },
                    max: { value: GRADUATION_YEAR.MAX, message: `Year must not exceed ${GRADUATION_YEAR.MAX}` }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Expected Graduation Year"
                      type="number"
                      variant="outlined"
                      error={!!errors.graduationYear}
                      helperText={errors.graduationYear?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">Lead Status</h3>
                <p className="text-muted-foreground text-sm">Lead management and status information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'Status is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel sx={inputLabelSx}>Lead Status</InputLabel>
                      <Select
                        {...field}
                        label="Lead Status"
                        sx={selectSx}
                        MenuProps={{
                          PaperProps: {
                            sx: menuPaperSx
                          }
                        }}
                      >
                        {leadStatuses.map((status) => (
                          <MenuItem key={status} value={status} sx={menuItemSx}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && (
                        <FormHelperText>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: 'Priority is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.priority}>
                      <InputLabel sx={inputLabelSx}>Priority</InputLabel>
                      <Select
                        {...field}
                        label="Priority"
                        sx={selectSx}
                        MenuProps={{
                          PaperProps: {
                            sx: menuPaperSx
                          }
                        }}
                      >
                        {priorities.map((priority) => (
                          <MenuItem key={priority} value={priority} sx={menuItemSx}>{priority}</MenuItem>
                        ))}
                      </Select>
                      {errors.priority && (
                        <FormHelperText>{errors.priority.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="source"
                  control={control}
                  rules={{ required: 'Lead source is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Lead Source"
                      variant="outlined"
                      error={!!errors.source}
                      helperText={errors.source?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="assignedTo"
                  control={control}
                  rules={{ required: 'Assigned To is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Assigned To"
                      variant="outlined"
                      error={!!errors.assignedTo}
                      helperText={errors.assignedTo?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="followUpDate"
                  control={control}
                  rules={{ required: 'Follow-up date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Follow-up Date"
                      type="date"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.followUpDate}
                      helperText={errors.followUpDate?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Additional Notes"
                      multiline
                      rows={4}
                      variant="outlined"
                      placeholder="Enter any additional information or notes about this lead..."
                      sx={textFieldSx}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-6 lg:p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Lead' : 'Generate New Lead'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isEditMode ? 'Update lead information' : 'Create a new lead with detailed information'}
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${activeStep === index
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                        : activeStep > index
                          ? 'bg-green-500 text-white shadow-md shadow-green-500/30'
                          : 'bg-muted text-muted-foreground'
                        }`}>
                        {activeStep > index ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                    )}
                  >
                    <Typography className={activeStep === index ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </div>

        {/* Form Content */}
        <div>
          {loading ? (
            <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl">
              <CardContent className="p-8 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-muted-foreground">Loading lead data...</p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl">
              <CardContent className="p-8 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button
                    onClick={() => navigate('/admin/leads')}
                    sx={primaryButtonSx}
                    variant="contained"
                  >
                    Back to Leads
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl">
              <CardContent className="p-8 min-h-[600px]">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ minHeight: '500px' }}
                >
                  {renderStepContent(activeStep)}
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ChevronLeft className="w-4 h-4" />}
                    sx={secondaryButtonSx}
                    variant="outlined"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center space-x-3">
                    {activeStep === steps.length - 1 ? (
                      <>
                        <Button
                          onClick={() => reset()}
                          startIcon={<Save className="w-4 h-4" />}
                          sx={secondaryButtonSx}
                          variant="outlined"
                        >
                          Save Draft
                        </Button>
                        <Button
                          onClick={handleSubmit(onSubmit)}
                          endIcon={<Send className="w-4 h-4" />}
                          sx={primaryButtonSx}
                          variant="contained"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Lead' : 'Submit Lead')}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleNext}
                        endIcon={<ChevronRight className="w-4 h-4" />}
                        sx={primaryButtonSx}
                        variant="contained"
                      >
                        Next Step
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Progress Summary */}
        <div className="mt-6">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">Form Progress</span>
              <span className="text-sm text-foreground font-semibold">
                {activeStep + 1} of {steps.length}
              </span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={SUCCESS_SNACKBAR_DURATION}
        onClose={() => {
          setShowSuccess(false)
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        sx={{
          mt: '90px',
          zIndex: 999999
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          elevation={6}
          onClose={() => setShowSuccess(false)}
        >
          {isEditMode ? 'Lead updated successfully!' : 'Lead generated successfully!'}
        </Alert>
      </Snackbar>
    </motion.div>
  )
}

export default LeadGenerate
