# Authentication Use Case Diagram

## Amen Bank Fund Management System

## PlantUML Use Case Diagram

```plantuml
@startuml Authentication Use Case Diagram

left to right direction
skinparam packageStyle rectangle

actor "User" as User #LightBlue
actor "Administrator" as Admin #LightCoral

rectangle "Authentication System" {
  usecase "Login" as UC1
  usecase "Logout" as UC2
  usecase "Change Password" as UC3
  usecase "Manage Users" as UC4
  usecase "Validate Credentials" as UC5
  usecase "Create Session" as UC6
}

User --> UC1
User --> UC2
User --> UC3

Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4

UC1 ..> UC5 : <<include>>
UC1 ..> UC6 : <<include>>

@enduml
```

---

## PlantUML Sequence Diagram

```plantuml
@startuml Authentication Flow

actor User
participant "Login Page" as Login
participant "NextAuth" as Auth
participant Database
participant Middleware
participant Dashboard

User -> Login: Enter email & password
Login -> Auth: Submit credentials
Auth -> Database: Query user by email
Database --> Auth: Return user record
Auth -> Auth: Validate password (bcrypt)

alt Valid Credentials & Active Account
    Auth -> Auth: Create JWT token
    Auth --> Login: Authentication success
    Login -> Dashboard: Redirect to dashboard
    Dashboard -> Middleware: Request protected route
    Middleware -> Middleware: Validate JWT token
    Middleware --> Dashboard: Access granted
    Dashboard --> User: Display dashboard
else Invalid Credentials
    Auth --> Login: Authentication failed
    Login --> User: Display error message
else Inactive Account
    Auth --> Login: Account inactive
    Login --> User: Display error message
end

@enduml
```

---

## PlantUML Class Diagram

```plantuml
@startuml Database Schema

class User {
  +id: String
  +email: String
  +password: String
  +firstName: String
  +lastName: String
  +phone: String
  +isActive: Boolean
  +roleId: String
  +agencyId: String
  +createdAt: DateTime
  +updatedAt: DateTime
}

class Role {
  +id: String
  +name: String
  +description: String
  +createdAt: DateTime
  +updatedAt: DateTime
}

class Agency {
  +id: String
  +name: String
  +code: String
  +address: String
  +city: String
  +phone: String
  +email: String
  +createdAt: DateTime
  +updatedAt: DateTime
}

class Request {
  +id: String
  +requestType: RequestType
  +status: RequestStatus
  +totalAmount: Decimal
  +currency: String
  +description: String
  +userId: String
  +agencyId: String
  +createdAt: DateTime
  +updatedAt: DateTime
}

User "N" -- "1" Role
User "N" -- "1" Agency
User "1" -- "N" Request
Agency "1" -- "N" Request

@enduml
```

---

## Mermaid Version (Alternative)

```mermaid
graph LR
    User((User))
    Admin((Administrator))
    
    subgraph Authentication
        Login[Login]
        Logout[Logout]
        ChangePassword[Change Password]
    end
    
    subgraph Admin Only
        ManageUsers[Manage Users]
    end
    
    %% User connections
    User --> Login
    User --> Logout
    User --> ChangePassword
    
    %% Admin connections
    Admin --> Login
    Admin --> Logout
    Admin --> ChangePassword
    Admin --> ManageUsers
    
    %% Relationships
    Login -.includes.-> ValidateCredentials[Validate Credentials]
    Login -.includes.-> CreateSession[Create Session]
    
    style User fill:#3498db,stroke:#2980b9,color:#fff
    style Admin fill:#e74c3c,stroke:#c0392b,color:#fff
```

## Use Cases

### 1. Login
**Actors:** User, Administrator

**Main Flow:**
1. User enters email and password
2. System validates credentials
3. System creates session with JWT token
4. User is redirected to dashboard

**Alternative Flow:**
- Invalid credentials → Display error message
- Account inactive → Display "Account is inactive"

---

### 2. Logout
**Actors:** User, Administrator

**Main Flow:**
1. User clicks logout button
2. System terminates session
3. User is redirected to login page

---

### 3. Change Password
**Actors:** User, Administrator

**Main Flow:**
1. User enters current password
2. User enters new password
3. System validates current password
4. System updates password (hashed with bcrypt)
5. Display success message

**Alternative Flow:**
- Current password incorrect → Display error
- Weak new password → Display validation error

---

### 4. Manage Users (Admin Only)
**Actors:** Administrator

**Main Flow:**
1. Admin views user list
2. Admin can create, edit, or deactivate users
3. Admin assigns roles and agencies
4. System saves changes


---

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant System
    participant Database

    User->>System: Enter email & password
    System->>Database: Validate credentials
    Database-->>System: Return user data
    
    alt Valid Credentials
        System->>System: Create JWT session
        System-->>User: Redirect to dashboard
    else Invalid Credentials
        System-->>User: Display error
    end
```

---

## User Roles

| Role | Permissions |
|------|------------|
| **Administrator** | Full access, user management |
| **Agency** | Create requests, view own requests |
| **Central Cash** | Validate/reject requests |
| **Tunisia Security** | Assign teams, manage dispatch |

---

## Security

- ✅ Passwords hashed with bcrypt
- ✅ JWT session tokens
- ✅ Role-based access control
- ✅ SSL/TLS database connection

---

## Default Login (Development)

**Email:** admin@amenbank.com  
**Password:** admin123

⚠️ Change in production!

---

*Last Updated: October 10, 2025*
