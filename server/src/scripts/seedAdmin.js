import 'dotenv/config'
import mongoose from 'mongoose'

import connectDatabase from '../config/database.js'
import User from '../models/User.js'
import { USER_ROLES } from '../constants/index.js'

const seedAdmin = async () => {
  try {
    await connectDatabase()

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    })

    if (existingAdmin) {
      console.log('✅ Admin already exists')
      console.log(`📧 Email: ${existingAdmin.email}`)

      await mongoose.connection.close()
      process.exit(0)
    }

    await User.create({
      firstName: process.env.ADMIN_FIRST_NAME,
      lastName: process.env.ADMIN_LAST_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      phone: process.env.ADMIN_PHONE,
      role: USER_ROLES.ADMIN,
      isActive: true,
      isEmailVerified: true,
    })

    console.log('🎉 Admin created successfully')
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`)
    console.log('🔑 Password: (from ADMIN_PASSWORD in .env)')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to seed admin')
    console.error(error)

    await mongoose.connection.close()
    process.exit(1)
  }
}

seedAdmin()