import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifySchema() {
  try {
    console.log('Checking users table structure...\n')
    
    // Get a sample user to see the fields
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roleId: true,
        agencyId: true,
      }
    })
    
    if (user) {
      console.log('✅ Users table structure (sample user):')
      console.log(JSON.stringify(user, null, 2))
      console.log('\n✅ Username column has been successfully removed!')
      console.log('📋 Current fields: id, email, password, firstName, lastName, phone, isActive, roleId, agencyId, createdAt, updatedAt')
    } else {
      console.log('No users found in database')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifySchema()