# Database Integration Documentation

## Overview
This document describes the PostgreSQL database integration for the Amen Bank Fund Management Application.

## Database Configuration

### Provider
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Connection**: SSL required

### Environment Variables
```
DATABASE_URL="postgresql://neondb_owner:npg_zbjNMLv2SF0W@ep-solitary-violet-adqclrq6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

## Database Schema

### Models Created

1. **Role**
   - id: String (CUID)
   - name: String (unique)
   - description: String (optional)
   - timestamps: createdAt, updatedAt

2. **Agency**
   - id: String (CUID)
   - name: String (unique)
   - code: String (unique)
   - address, city, phone, email: String (optional)
   - timestamps: createdAt, updatedAt

3. **User**
   - id: String (CUID)
   - email: String (unique)
   - password: String (hashed with bcrypt)
   - firstName, lastName: String
   - phone: String (optional)
   - isActive: Boolean (default: true)
   - roleId, agencyId: Foreign keys
   - timestamps: createdAt, updatedAt

4. **Request**
   - id: String (CUID)
   - requestType: String
   - status: RequestStatus enum
   - amount: Decimal (optional)
   - currency: String (default: "TND")
   - description: String (optional)
   - priority: Priority enum
   - dueDate: DateTime (optional)
   - userId, agencyId: Foreign keys
   - timestamps: createdAt, updatedAt

5. **RequestDetails**
   - id: String (CUID)
   - fieldName: String
   - value: String
   - requestId: Foreign key
   - timestamps: createdAt, updatedAt

### Enums

- **RequestStatus**: PENDING, APPROVED, REJECTED, IN_PROGRESS, COMPLETED, CANCELLED
- **Priority**: LOW, NORMAL, HIGH, URGENT

## Initial Data Seeded

- **Roles**: admin, manager, employee
- **Agency**: Amen Bank - Main Branch (MAIN001)
- **User**: admin@amenbank.com (password: admin123)

## Available Scripts

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (without migrations)
npm run db:push

# Create and apply migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Test database connection and get counts

### Users
- **GET** `/api/users` - Get all users with role and agency information

## Usage Example

```typescript
import { prisma } from '@/lib/db'

// Create a new user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Doe',
    roleId: 'role-id',
    agencyId: 'agency-id'
  }
})

// Get users with relations
const users = await prisma.user.findMany({
  include: {
    role: true,
    agency: true
  }
})
```

## Testing

To test the database integration:

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3001/api/health` to check database connection
3. Visit `http://localhost:3001/api/users` to see seeded users
4. Use `npm run db:studio` to open Prisma Studio and view data

## Security Notes

- Passwords are hashed using bcryptjs with salt rounds of 12
- Database connection uses SSL with required channel binding
- Environment variables should never be committed to version control
- Default admin credentials should be changed in production