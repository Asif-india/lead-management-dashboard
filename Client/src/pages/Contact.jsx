import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  MessageCircle,
  HelpCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button,
  Box,
  Alert
} from '@mui/material'

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@modernapp.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'San Francisco, CA',
      description: 'Come say hello at our office'
    }
  ]

  const faqs = [
    {
      question: 'What is your response time?',
      answer: 'We typically respond to all inquiries within 24 hours during business days.'
    },
    {
      question: 'Do you offer technical support?',
      answer: 'Yes, we provide 24/7 technical support for all our customers through email and chat.'
    },
    {
      question: 'Can I schedule a demo?',
      answer: 'Absolutely! Click the "Schedule Demo" button and pick a time that works for you.'
    },
    {
      question: 'Do you have a refund policy?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all our paid plans.'
    }
  ]

  const onSubmit = (data) => {
    console.log('Form submitted:', data)
    setIsSubmitted(true)
    reset()
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Typography variant="h1" className="heading-1 mb-6">
              Get in
              <span className="gradient-text"> Touch</span>
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground mb-8">
              We'd love to hear from you. Whether you have a question about features, pricing, 
              or anything else, our team is ready to answer all your questions.
            </Typography>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section">
        <div className="container">
          <Grid container spacing={6}>
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="text-center hover-lift h-full">
                      <CardContent className="p-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <Typography variant="h6" className="font-semibold mb-2">
                          {info.title}
                        </Typography>
                        <Typography variant="body1" className="text-primary mb-2">
                          {info.content}
                        </Typography>
                        <Typography variant="body2" className="text-muted-foreground">
                          {info.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              )
            })}
          </Grid>
        </div>
      </section>

      {/* Contact Form & FAQ Section */}
      <section className="section bg-secondary/30">
        <div className="container">
          <Grid container spacing={8}>
            {/* Contact Form */}
            <Grid item xs={12} lg={7}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="shadow-xl">
                  <CardContent className="p-8">
                    <Typography variant="h3" className="heading-3 mb-6">
                      Send us a Message
                    </Typography>
                    
                    {isSubmitted && (
                      <Alert severity="success" className="mb-6">
                        Thank you for your message! We'll get back to you soon.
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            {...register('firstName', { required: 'First name is required' })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            {...register('lastName', { required: 'Last name is required' })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />

                      <TextField
                        fullWidth
                        label="Subject"
                        {...register('subject', { required: 'Subject is required' })}
                        error={!!errors.subject}
                        helperText={errors.subject?.message}
                      />

                      <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={6}
                        {...register('message', { required: 'Message is required' })}
                        error={!!errors.message}
                        helperText={errors.message?.message}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        endIcon={<Send />}
                        className="w-full"
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* FAQ Section */}
            <Grid item xs={12} lg={5}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-8">
                  <Typography variant="h3" className="heading-3 mb-6">
                    Frequently Asked Questions
                  </Typography>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={index} className="shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <Typography variant="subtitle2" className="font-semibold mb-2">
                                {faq.question}
                              </Typography>
                              <Typography variant="body2" className="text-muted-foreground">
                                {faq.answer}
                              </Typography>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Support Hours */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-6 h-6 text-primary" />
                      <Typography variant="h6" className="font-semibold">
                        Support Hours
                      </Typography>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Typography variant="body2">Monday - Friday</Typography>
                        <Typography variant="body2" className="font-medium">8:00 AM - 5:00 PM PST</Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="body2">Saturday</Typography>
                        <Typography variant="body2" className="font-medium">10:00 AM - 2:00 PM PST</Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="body2">Sunday</Typography>
                        <Typography variant="body2" className="font-medium">Closed</Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary to-accent">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <Typography variant="h2" className="heading-2 mb-4">
              Still Have Questions?
            </Typography>
            <Typography variant="body1" className="text-body mb-8 max-w-2xl mx-auto opacity-90">
              Can't find the answer you're looking for? Our friendly customer support team is here to help!
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="contained" 
                size="large"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Start Live Chat
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Schedule Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
