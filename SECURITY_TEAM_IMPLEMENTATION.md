# Security Team Assignment Implementation

## Overview
Successfully implemented the security team assignment feature for Tunisia Security role with CIN chauffeur and CIN transporteur fields.

## Changes Made

### 1. Database Schema Updates (`prisma/schema.prisma`)

#### Added SecurityTeam Model
```prisma
model SecurityTeam {
  id              String   @id @default(cuid())
  teamName        String
  cinChauffeur    String   // CIN of the driver
  cinTransporteur String   // CIN of the transporter
  assignedBy      String?  // User who assigned the team
  assignedAt      DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  requests        Request[]

  @@map("security_teams")
}
```

#### Updated Request Model
- Added `securityTeamId` foreign key field
- Added relation to `SecurityTeam`
- Added `ASSIGNED` status to `RequestStatus` enum

### 2. API Route (`app/api/requests/[id]/assign-team/route.ts`)

Created POST endpoint to assign security teams:

**Features:**
- Authentication check (Tunisia Security role only)
- Validates required fields (teamName, cinChauffeur, cinTransporteur)
- Checks if request exists and is in VALIDATED status
- Creates SecurityTeam record
- Updates Request with team assignment
- Changes request status to ASSIGNED
- Creates action log entry

**Endpoint:** `POST /api/requests/:id/assign-team`

**Request Body:**
```json
{
  "teamName": "Team Alpha",
  "cinChauffeur": "12345678",
  "cinTransporteur": "87654321"
}
```

**Response:**
```json
{
  "message": "Security team assigned successfully",
  "request": { ... }
}
```

### 3. Validation Schema (`lib/validations/team.ts`)

Created Zod validation schema:

```typescript
export const assignTeamSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  cinChauffeur: z.string()
    .min(8, "CIN Chauffeur must be at least 8 characters")
    .regex(/^[0-9]+$/, "CIN must contain only numbers"),
  cinTransporteur: z.string()
    .min(8, "CIN Transporteur must be at least 8 characters")
    .regex(/^[0-9]+$/, "CIN must contain only numbers")
})
```

### 4. UI Component (`components/assign-team-dialog.tsx`)

Created reusable dialog component:

**Features:**
- Form with three fields: Team Name, CIN Chauffeur, CIN Transporteur
- Real-time validation with error messages
- Loading states during submission
- Success/error notifications with toast
- Automatically refreshes parent data on success

**Usage:**
```tsx
<AssignTeamDialog
  open={assignDialogOpen}
  onOpenChange={setAssignDialogOpen}
  requestId={selectedRequestId}
  onSuccess={handleAssignSuccess}
/>
```

### 5. Tunisia Security Page Updates (`app/tunisia-security/page.tsx`)

**Added Features:**
- Import AssignTeamDialog component
- Display security team info in requests table
- "Assign Team" button for VALIDATED requests
- Shows team details (name, CIN chauffeur, CIN transporteur) for ASSIGNED requests
- Handles dialog open/close states
- Refreshes data after successful assignment

**Table Columns:**
- Request Type
- Agency
- Amount
- Status
- Security Team (if assigned)
- Actions (Assign Team / Dispatch buttons)

## Request Status Flow

1. **SUBMITTED** - Agency creates request
2. **VALIDATED** - Central Cash validates → Can assign team
3. **ASSIGNED** - Tunisia Security assigns team → Can dispatch
4. **DISPATCHED** - Tunisia Security confirms dispatch
5. **RECEIVED** - Agency confirms receipt
6. **COMPLETED** - Request completed

## Database Tables

### security_teams
- `id` - Unique identifier
- `teamName` - Name of the security team
- `cinChauffeur` - CIN number of the driver
- `cinTransporteur` - CIN number of the transporter
- `assignedBy` - Email/name of Tunisia Security user who assigned
- `assignedAt` - Timestamp of assignment
- `createdAt` - Record creation timestamp
- `updatedAt` - Last update timestamp

### requests (updated fields)
- `securityTeamId` - Foreign key to security_teams
- `status` - Now includes ASSIGNED status

## Security Features

1. **Role-Based Access Control**
   - Only Tunisia Security users can assign teams
   - API endpoint validates user role

2. **Request Status Validation**
   - Only VALIDATED requests can have teams assigned
   - Prevents assignment to inappropriate requests

3. **Data Validation**
   - CIN numbers must be numeric
   - Minimum 8 characters for CIN
   - Required fields enforced

4. **Audit Trail**
   - Action logs created for team assignments
   - Tracks who assigned, when, and details

## Testing

To test the feature:

1. **Login as Tunisia Security user**
2. **Navigate to Tunisia Security dashboard**
3. **Find a VALIDATED request**
4. **Click "Assign Team" button**
5. **Fill in the form:**
   - Team Name (e.g., "Team Alpha")
   - CIN Chauffeur (8+ digit number)
   - CIN Transporteur (8+ digit number)
6. **Submit the form**
7. **Verify:**
   - Request status changes to ASSIGNED
   - Team details appear in the table
   - Success notification shown
   - Action log created

## Fixed Issues

1. **500 Internal Server Error**
   - **Cause:** Prisma Client was not regenerated after schema changes
   - **Solution:** Killed node processes and ran `npx prisma generate`

2. **Missing Import Error**
   - **Cause:** AssignTeamDialog not imported in tunisia-security page
   - **Solution:** Added import statement

3. **Type Errors**
   - **Cause:** Outdated Prisma types
   - **Solution:** Regenerated Prisma Client

## Commands Used

```bash
# Update database schema
npx prisma db push

# Regenerate Prisma Client
npx prisma generate

# Restart development server
npm run dev
```

## Files Modified

1. `prisma/schema.prisma` - Added SecurityTeam model
2. `app/api/requests/[id]/assign-team/route.ts` - New API endpoint
3. `lib/validations/team.ts` - Validation schema
4. `components/assign-team-dialog.tsx` - Dialog component
5. `app/tunisia-security/page.tsx` - Page updates

## Next Steps

Potential enhancements:
- Add team member contact information
- Allow editing assigned teams
- Add vehicle information (license plate)
- Generate PDF dispatch orders
- Track team location/status
- Add team performance metrics

---

*Implementation completed: October 10, 2025*
