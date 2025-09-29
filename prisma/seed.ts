import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create roles for fund management system
  const administratorRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'System Administrator - Full access to user management and system configuration'
    }
  })

  const agencyRole = await prisma.role.upsert({
    where: { name: 'Agency' },
    update: {},
    create: {
      name: 'Agency',
      description: 'Agency User - Can create fund requests (provisionnement/versement)'
    }
  })

  const centralCashRole = await prisma.role.upsert({
    where: { name: 'Central Cash' },
    update: {},
    create: {
      name: 'Central Cash',
      description: 'Central Cash - Validates or rejects fund requests'
    }
  })

  const tunisiaSecurityRole = await prisma.role.upsert({
    where: { name: 'Tunisia Security' },
    update: {},
    create: {
      name: 'Tunisia Security',
      description: 'Tunisia Security - Assigns teams and manages fund dispatch'
    }
  })

  // Create agencies
  const mainAgency = await prisma.agency.upsert({
    where: { code: 'AG001' },
    update: {},
    create: {
      name: 'Amen Bank - Tunis Centre',
      code: 'AG001',
      address: '163 Avenue de la Liberté',
      city: 'Tunis',
      phone: '+216 71 835 500',
      email: 'tunis.centre@amenbank.com.tn'
    }
  })

  const carthageAgency = await prisma.agency.upsert({
    where: { code: 'AG002' },
    update: {},
    create: {
      name: 'Amen Bank - Carthage',
      code: 'AG002',
      address: 'Avenue Habib Bourguiba',
      city: 'Carthage',
      phone: '+216 71 731 200',
      email: 'carthage@amenbank.com.tn'
    }
  })

  const sfaxAgency = await prisma.agency.upsert({
    where: { code: 'AG003' },
    update: {},
    create: {
      name: 'Amen Bank - Sfax',
      code: 'AG003',
      address: 'Avenue Hedi Chaker',
      city: 'Sfax',
      phone: '+216 74 225 300',
      email: 'sfax@amenbank.com.tn'
    }
  })

  // Create Central Cash "agency" (for Central Cash users)
  const centralCashAgency = await prisma.agency.upsert({
    where: { code: 'CENTRAL' },
    update: {},
    create: {
      name: 'Central Cash Department',
      code: 'CENTRAL',
      address: '163 Avenue de la Liberté',
      city: 'Tunis',
      phone: '+216 71 835 500',
      email: 'central.cash@amenbank.com.tn'
    }
  })

  // Create Tunisia Security "agency"
  const securityAgency = await prisma.agency.upsert({
    where: { code: 'SECURITY' },
    update: {},
    create: {
      name: 'Tunisia Security Services',
      code: 'SECURITY',
      address: 'Rue de la Sécurité',
      city: 'Tunis',
      phone: '+216 71 845 600',
      email: 'security@tunisiasecurity.tn'
    }
  })

  // Create default users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('password123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@amenbank.com.tn' },
    update: {},
    create: {
      email: 'admin@amenbank.com.tn',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'System',
      phone: '+216 71 835 500',
      roleId: administratorRole.id,
      agencyId: mainAgency.id,
      isActive: true
    }
  })

  const agencyUser = await prisma.user.upsert({
    where: { email: 'agency@amenbank.com.tn' },
    update: {},
    create: {
      email: 'agency@amenbank.com.tn',
      password: userPassword,
      firstName: 'Ahmed',
      lastName: 'Ben Ali',
      phone: '+216 71 835 501',
      roleId: agencyRole.id,
      agencyId: mainAgency.id,
      isActive: true
    }
  })

  const centralCashUser = await prisma.user.upsert({
    where: { email: 'cash@amenbank.com.tn' },
    update: {},
    create: {
      email: 'cash@amenbank.com.tn',
      password: userPassword,
      firstName: 'Fatma',
      lastName: 'Trabelsi',
      phone: '+216 71 835 510',
      roleId: centralCashRole.id,
      agencyId: centralCashAgency.id,
      isActive: true
    }
  })

  const securityUser = await prisma.user.upsert({
    where: { email: 'security@tunisiasecurity.tn' },
    update: {},
    create: {
      email: 'security@tunisiasecurity.tn',
      password: userPassword,
      firstName: 'Mohamed',
      lastName: 'Amari',
      phone: '+216 71 845 601',
      roleId: tunisiaSecurityRole.id,
      agencyId: securityAgency.id,
      isActive: true
    }
  })

  console.log('Database seeded successfully!')
  console.log('\n=== ROLES ===')
  console.log('- Administrator:', administratorRole.id)
  console.log('- Agency:', agencyRole.id)
  console.log('- Central Cash:', centralCashRole.id)
  console.log('- Tunisia Security:', tunisiaSecurityRole.id)

  console.log('\n=== AGENCIES ===')
  console.log('- Tunis Centre:', mainAgency.code)
  console.log('- Carthage:', carthageAgency.code)
  console.log('- Sfax:', sfaxAgency.code)
  console.log('- Central Cash:', centralCashAgency.code)
  console.log('- Security:', securityAgency.code)

  console.log('\n=== USERS (email / password) ===')
  console.log('- admin@amenbank.com.tn / admin123')
  console.log('- agency@amenbank.com.tn / password123')
  console.log('- cash@amenbank.com.tn / password123')
  console.log('- security@tunisiasecurity.tn / password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })