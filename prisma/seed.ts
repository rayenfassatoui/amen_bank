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

  // Create additional agency users for different agencies
  const carthageAgencyUser = await prisma.user.upsert({
    where: { email: 'agency.carthage@amenbank.com.tn' },
    update: {},
    create: {
      email: 'agency.carthage@amenbank.com.tn',
      password: userPassword,
      firstName: 'Leila',
      lastName: 'Kacem',
      phone: '+216 71 731 201',
      roleId: agencyRole.id,
      agencyId: carthageAgency.id,
      isActive: true
    }
  })

  const sfaxAgencyUser = await prisma.user.upsert({
    where: { email: 'agency.sfax@amenbank.com.tn' },
    update: {},
    create: {
      email: 'agency.sfax@amenbank.com.tn',
      password: userPassword,
      firstName: 'Karim',
      lastName: 'Jebali',
      phone: '+216 74 225 301',
      roleId: agencyRole.id,
      agencyId: sfaxAgency.id,
      isActive: true
    }
  })

  // Create sample requests with different statuses
  console.log('\nCreating sample requests...')

  // Request 1: SUBMITTED (Provisionnement)
  const request1 = await prisma.request.create({
    data: {
      requestType: 'PROVISIONNEMENT',
      totalAmount: 50000.000,
      status: 'SUBMITTED',
      userId: agencyUser.id,
      agencyId: mainAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, denominationType: 'BILL', quantity: 100, totalValue: 20000.000 },
          { denomination: 100, denominationType: 'BILL', quantity: 150, totalValue: 15000.000 },
          { denomination: 50, denominationType: 'BILL', quantity: 200, totalValue: 10000.000 },
          { denomination: 20, denominationType: 'BILL', quantity: 250, totalValue: 5000.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy: agencyUser.id,
            details: 'Fund request created by agency',
          }
        ]
      }
    }
  })

  // Request 2: VALIDATED (Versement)
  const request2 = await prisma.request.create({
    data: {
      requestType: 'VERSEMENT',
      totalAmount: 75000.000,
      status: 'VALIDATED',
      userId: carthageAgencyUser.id,
      agencyId: carthageAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 200, denominationType: 'BILL', totalValue:40000.000 },
          { denomination: 100, quantity: 200, denominationType: 'BILL', totalValue:20000.000 },
          { denomination: 50, quantity: 150, denominationType: 'BILL', totalValue:7500.000 },
          { denomination: 20, quantity: 250, denominationType: 'BILL', totalValue:5000.000 },
          { denomination: 10, quantity: 250, denominationType: 'BILL', totalValue:2500.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:carthageAgencyUser.id,
            details: 'Fund request created by agency',
          },
          {
            action: 'REQUEST_VALIDATED',
            performedBy:centralCashUser.id,
            details: 'Request validated by Central Cash',
          }
        ]
      }
    }
  })

  // Request 3: ASSIGNED (Provisionnement)
  const request3 = await prisma.request.create({
    data: {
      requestType: 'PROVISIONNEMENT',
      totalAmount: 100000.000,
      status: 'ASSIGNED',
      teamAssigned: 'Team Alpha',
      userId: sfaxAgencyUser.id,
      agencyId: sfaxAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 300, denominationType: 'BILL', totalValue:60000.000 },
          { denomination: 100, quantity: 250, denominationType: 'BILL', totalValue:25000.000 },
          { denomination: 50, quantity: 200, denominationType: 'BILL', totalValue:10000.000 },
          { denomination: 20, quantity: 200, denominationType: 'BILL', totalValue:4000.000 },
          { denomination: 10, quantity: 100, denominationType: 'BILL', totalValue:1000.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:sfaxAgencyUser.id,
            details: 'Fund request created by agency',
          },
          {
            action: 'REQUEST_VALIDATED',
            performedBy:centralCashUser.id,
            details: 'Request validated by Central Cash',
          },
          {
            action: 'REQUEST_ASSIGNED',
            performedBy:securityUser.id,
            details: 'Request assigned to Team Alpha',
          }
        ]
      }
    }
  })

  // Request 4: DISPATCHED (Versement)
  const request4 = await prisma.request.create({
    data: {
      requestType: 'VERSEMENT',
      totalAmount: 35000.000,
      status: 'DISPATCHED',
      teamAssigned: 'Team Beta',
      userId: agencyUser.id,
      agencyId: mainAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 100, denominationType: 'BILL', totalValue:20000.000 },
          { denomination: 100, quantity: 100, denominationType: 'BILL', totalValue:10000.000 },
          { denomination: 50, quantity: 50, denominationType: 'BILL', totalValue:2500.000 },
          { denomination: 20, quantity: 100, denominationType: 'BILL', totalValue:2000.000 },
          { denomination: 5, quantity: 100, denominationType: 'BILL', totalValue:500.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:agencyUser.id,
            details: 'Fund request created by agency',
          },
          {
            action: 'REQUEST_VALIDATED',
            performedBy:centralCashUser.id,
            details: 'Request validated by Central Cash',
          },
          {
            action: 'REQUEST_ASSIGNED',
            performedBy:securityUser.id,
            details: 'Request assigned to Team Beta',
          },
          {
            action: 'REQUEST_DISPATCHED',
            performedBy:securityUser.id,
            details: 'Funds dispatched by security team',
          }
        ]
      }
    }
  })

  // Request 5: RECEIVED (Provisionnement)
  const request5 = await prisma.request.create({
    data: {
      requestType: 'PROVISIONNEMENT',
      totalAmount: 80000.000,
      status: 'RECEIVED',
      teamAssigned: 'Team Gamma',
      receivedBy: carthageAgencyUser.id,
      receivedAt: new Date(),
      userId: carthageAgencyUser.id,
      agencyId: carthageAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 250, denominationType: 'BILL', totalValue:50000.000 },
          { denomination: 100, quantity: 200, denominationType: 'BILL', totalValue:20000.000 },
          { denomination: 50, quantity: 150, denominationType: 'BILL', totalValue:7500.000 },
          { denomination: 20, quantity: 100, denominationType: 'BILL', totalValue:2000.000 },
          { denomination: 5, quantity: 100, denominationType: 'BILL', totalValue:500.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:carthageAgencyUser.id,
            details: 'Fund request created by agency',
          },
          {
            action: 'REQUEST_VALIDATED',
            performedBy:centralCashUser.id,
            details: 'Request validated by Central Cash',
          },
          {
            action: 'REQUEST_ASSIGNED',
            performedBy:securityUser.id,
            details: 'Request assigned to Team Gamma',
          },
          {
            action: 'REQUEST_DISPATCHED',
            performedBy:securityUser.id,
            details: 'Funds dispatched by security team',
          },
          {
            action: 'REQUEST_RECEIVED',
            performedBy:carthageAgencyUser.id,
            details: 'Funds received with no non-compliance',
          }
        ]
      }
    }
  })

  // Request 6: RECEIVED with non-compliance (Versement)
  const request6 = await prisma.request.create({
    data: {
      requestType: 'VERSEMENT',
      totalAmount: 45000.000,
      status: 'RECEIVED',
      teamAssigned: 'Team Delta',
      receivedBy: sfaxAgencyUser.id,
      receivedAt: new Date(),
      nonCompliance: 'YES',
      nonComplianceDetails: 'Missing 10 bills of 50 TND denomination',
      userId: sfaxAgencyUser.id,
      agencyId: sfaxAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 150, denominationType: 'BILL', totalValue:30000.000 },
          { denomination: 100, quantity: 100, denominationType: 'BILL', totalValue:10000.000 },
          { denomination: 50, quantity: 100, denominationType: 'BILL', totalValue:5000.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:sfaxAgencyUser.id,
            details: 'Fund request created by agency',
          },
          {
            action: 'REQUEST_VALIDATED',
            performedBy:centralCashUser.id,
            details: 'Request validated by Central Cash',
          },
          {
            action: 'REQUEST_ASSIGNED',
            performedBy:securityUser.id,
            details: 'Request assigned to Team Delta',
          },
          {
            action: 'REQUEST_DISPATCHED',
            performedBy:securityUser.id,
            details: 'Funds dispatched by security team',
          },
          {
            action: 'REQUEST_RECEIVED',
            performedBy:sfaxAgencyUser.id,
            details: 'Funds received with non-compliance: Missing 10 bills of 50 TND',
          }
        ]
      }
    }
  })

  // Request 7: REJECTED (Provisionnement)
  const request7 = await prisma.request.create({
    data: {
      requestType: 'PROVISIONNEMENT',
      totalAmount: 25000.000,
      status: 'REJECTED',
      description: 'Rejected - Insufficient documentation provided',
      userId: agencyUser.id,
      agencyId: mainAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 100, denominationType: 'BILL', totalValue:20000.000 },
          { denomination: 50, quantity: 100, denominationType: 'BILL', totalValue:5000.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:agencyUser.id,
            details: 'Fund request created by agency',
          },
          {
            action: 'REQUEST_REJECTED',
            performedBy:centralCashUser.id,
            details: 'Request rejected: Insufficient documentation provided',
          }
        ]
      }
    }
  })

  // Request 8: Another SUBMITTED (Versement)
  const request8 = await prisma.request.create({
    data: {
      requestType: 'VERSEMENT',
      totalAmount: 60000.000,
      status: 'SUBMITTED',
      userId: carthageAgencyUser.id,
      agencyId: carthageAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 200, denominationType: 'BILL', totalValue:40000.000 },
          { denomination: 100, quantity: 150, denominationType: 'BILL', totalValue:15000.000 },
          { denomination: 50, quantity: 100, denominationType: 'BILL', totalValue:5000.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:carthageAgencyUser.id,
            details: 'Fund request created by agency',
          }
        ]
      }
    }
  })

  // Request 9: VALIDATED (Provisionnement)
  const request9 = await prisma.request.create({
    data: {
      requestType: 'PROVISIONNEMENT',
      totalAmount: 120000.000,
      status: 'VALIDATED',
      userId: sfaxAgencyUser.id,
      agencyId: sfaxAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 400, denominationType: 'BILL', totalValue:80000.000 },
          { denomination: 100, quantity: 300, denominationType: 'BILL', totalValue:30000.000 },
          { denomination: 50, quantity: 150, denominationType: 'BILL', totalValue:7500.000 },
          { denomination: 20, quantity: 100, denominationType: 'BILL', totalValue:2000.000 },
          { denomination: 5, quantity: 100, denominationType: 'BILL', totalValue:500.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:sfaxAgencyUser.id,
            details: 'Fund request created by agency',
          },
          {
            action: 'REQUEST_VALIDATED',
            performedBy:centralCashUser.id,
            details: 'Request validated by Central Cash',
          }
        ]
      }
    }
  })

  // Request 10: ASSIGNED (Versement)
  const request10 = await prisma.request.create({
    data: {
      requestType: 'VERSEMENT',
      totalAmount: 90000.000,
      status: 'ASSIGNED',
      teamAssigned: 'Team Epsilon',
      userId: agencyUser.id,
      agencyId: mainAgency.id,
      denominationDetails: {
        create: [
          { denomination: 200, quantity: 300, denominationType: 'BILL', totalValue:60000.000 },
          { denomination: 100, quantity: 200, denominationType: 'BILL', totalValue:20000.000 },
          { denomination: 50, quantity: 150, denominationType: 'BILL', totalValue:7500.000 },
          { denomination: 20, quantity: 100, denominationType: 'BILL', totalValue:2000.000 },
          { denomination: 5, quantity: 100, denominationType: 'BILL', totalValue:500.000 },
        ]
      },
      actionLogs: {
        create: [
          {
            action: 'REQUEST_CREATED',
            performedBy:agencyUser.id,
            details: 'Fund request created by agency',
          },
          {
            action: 'REQUEST_VALIDATED',
            performedBy:centralCashUser.id,
            details: 'Request validated by Central Cash',
          },
          {
            action: 'REQUEST_ASSIGNED',
            performedBy:securityUser.id,
            details: 'Request assigned to Team Epsilon',
          }
        ]
      }
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
  console.log('- agency.carthage@amenbank.com.tn / password123')
  console.log('- agency.sfax@amenbank.com.tn / password123')
  console.log('- cash@amenbank.com.tn / password123')
  console.log('- security@tunisiasecurity.tn / password123')

  console.log('\n=== SAMPLE REQUESTS ===')
  console.log('Total requests created: 10')
  console.log('- 2 SUBMITTED requests')
  console.log('- 2 VALIDATED requests')
  console.log('- 2 ASSIGNED requests')
  console.log('- 1 DISPATCHED request')
  console.log('- 2 RECEIVED requests (1 with non-compliance)')
  console.log('- 1 REJECTED request')
  console.log('\nTotal amount across all requests: 680,000.000 TND')
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