import { prisma } from '../lib/db'
import { hashPassword } from '../lib/auth'

async function seedAdmin() {
  console.log('🔐 Seeding admin user...')

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@xflix.xyz' }
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists')
      return
    }

    // Create admin with hashed password
    const hashedPassword = await hashPassword('admin123')

    const admin = await prisma.admin.create({
      data: {
        email: 'admin@xflix.xyz',
        password: hashedPassword,
        name: 'Admin User'
      }
    })

    console.log('✅ Admin user created successfully')
    console.log(`   Email: ${admin.email}`)
    console.log('   Password: admin123')
    console.log('')
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    throw error
  }
}

seedAdmin()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
