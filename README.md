# Amen Bank - Fund Management System

A comprehensive fund management application built with Next.js, featuring authentication, role-based access control, and PostgreSQL database integration.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Neon account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rayenfassatoui/amen_bank.git
cd amen_bank
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://your-database-url"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up the database**

Generate Prisma client:
```bash
npm run db:generate
```

Push the schema to your database:
```bash
npm run db:push
```

Seed the database with initial data:
```bash
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Default Login Credentials

After seeding the database, you can log in with:

- **Email:** admin@amenbank.com
- **Password:** admin123

⚠️ **Important:** Change these credentials in production!

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

### Database Management
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and apply migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 🏗️ Project Structure

```
amen_bank/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/            # Login page
│   ├── dashboard/        # Dashboard page
│   └── admin/            # Admin pages
├── components/            # React components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # NextAuth configuration
│   └── validations/      # Validation schemas
├── prisma/               # Database schema and seeds
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── middleware.ts         # Route protection middleware
└── .env                  # Environment variables
```

## 🔐 Authentication & Roles

The system supports role-based access control with the following roles:

| Role | Permissions |
|------|-------------|
| **Administrator** | Full system access, user management, view all requests |
| **Agency** | Create fund requests, view own agency requests |
| **Central Cash** | View and validate/reject fund requests |
| **Tunisia Security** | Assign teams and manage fund dispatch |

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

- **User** - User accounts with authentication
- **Role** - User roles and permissions
- **Agency** - Bank agency/branch information
- **Request** - Fund requests (provisionnement/versement)
- **RequestDetails** - Additional request information
- **ActionLog** - System activity logs

## 🛠️ Technologies Used

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Authentication:** NextAuth.js with JWT
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Validation:** Zod
- **Password Hashing:** bcryptjs
- **TypeScript:** Full type safety

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Users
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create new user (Admin only)

### Health Check
- `GET /api/health` - Database connection status

## 🔧 Configuration

### Database Setup

The project uses Prisma as the ORM. The schema includes:
- Email-based authentication (no username)
- Role-based access control
- Agency management
- Request tracking with detailed logs

### Middleware Protection

Protected routes are automatically secured by middleware:
- `/dashboard` - All authenticated users
- `/admin/*` - Administrator only
- `/requests/*` - Role-specific access

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, the dev server will automatically use the next available port (e.g., 3001).

### Database Connection Issues
Ensure your `DATABASE_URL` in `.env` is correct and includes SSL parameters for Neon:
```
?sslmode=require&channel_binding=require
```

### Prisma Client Not Generated
Run:
```bash
npm run db:generate
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is proprietary software developed for Amen Bank.

## 👥 Author

**Rayen Fassatoui**
- GitHub: [@rayenfassatoui](https://github.com/rayenfassatoui)

---

*Last Updated: October 10, 2025*
