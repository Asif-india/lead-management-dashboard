import 'dotenv/config'
import mongoose from 'mongoose'

import connectDatabase from '../config/database.js'
import User from '../models/User.js'
import { USER_ROLES } from '../constants/index.js'

const resetAdminPassword = async () => {
  try {
    await connectDatabase()

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const newPassword = process.env.ADMIN_PASSWORD || 'Admin@123'

    const adminUser = await User.findOne({
      email: adminEmail,
    })

    if (!adminUser) {
      console.log('❌ Admin user not found')
      console.log(`📧 Email: ${adminEmail}`)
      await mongoose.connection.close()
      process.exit(1)
    }

    if (adminUser.role !== USER_ROLES.ADMINISTRATOR && adminUser.role !== USER_ROLES.ADMIN) {
      console.log('❌ User exists but is not an Administrator')
      console.log(`📧 Email: ${adminEmail}`)
      console.log(`👤 Role: ${adminUser.role}`)
      await mongoose.connection.close()
      process.exit(1)
    }

    adminUser.password = newPassword
    adminUser.changedPasswordAt = Date.now()
    adminUser.passwordResetToken = undefined
    adminUser.passwordResetExpires = undefined
    await adminUser.save()

    console.log('✅ Admin password reset successfully')
    console.log(`📧 Email: ${adminEmail}`)
    console.log(`🔑 New Password: (from ADMIN_PASSWORD in .env)`)
    console.log(`👤 Role: ${adminUser.role}`)
    console.log(`🟢 Active: ${adminUser.isActive}`)
    console.log(`📊 Account Status: ${adminUser.accountStatus}`)

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to reset admin password')
    console.error(error)

    await mongoose.connection.close()
    process.exit(1)
  }
}

resetAdminPassword()
