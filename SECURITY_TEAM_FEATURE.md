# Security Team Assignment Feature

## Overview
This document describes the implementation of the security team assignment feature for Tunisia Security role in the Amen Bank Fund Management System.

## Database Changes

### New Model: SecurityTeam

Added a new `SecurityTeam` model to store team assignments:

```prisma
model SecurityTeam {
  id              String   @id @default(cuid())
  teamName        String                    // Team name/identifier
  cinChauffeur    String                    // CIN of the driver
  cinTransporteur String                    // CIN of the transporter
  assignedBy      String?                   // User who assigned the team
  assignedAt      DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @default(now())
  
  // Relations
  requests        Request[]
}
```

### Updated Model: Request

Modified the `Request` model to include security team relationship:

- Removed: `teamAssigned` (String field)
- Added: `securityTeamId` (Foreign key to SecurityTeam)
- Added: `securityTeam` relation

## API Routes

### POST /api/requests/[id]/assign-team

Assigns a security team to a validated request.

**Authorization:** Tunisia Security role required

**Request Body:**
```json
{
  "teamName": "Team Alpha",
  "cinChauffeur": "12345678",
  "cinTransporteur": "87654321"
}
```

**Validation:**
- All fields are required
- CIN fields must be at least 8 digits
- CIN fields must contain only numbers
- Request must exist
- Request status must be "VALIDATED"

**Response:**
```json
{
  "success": true,
  "message": "Security team assigned successfully",
  "data": {
    // Updated request with security team details
  }
}
```

**Side Effects:**
- Creates new SecurityTeam record
- Updates Request status to "ASSIGNED"
- Creates ActionLog entry

## Validation Schema

Created `/lib/validations/team.ts`:

```typescript
export const assignTeamSchema = z.object({
  teamName: z.string().min(2, 'Team name must be at least 2 characters'),
  cinChauffeur: z.string()
    .min(8, 'CIN Chauffeur must be at least 8 characters')
    .regex(/^[0-9]+$/, 'CIN Chauffeur must contain only numbers'),
  cinTransporteur: z.string()
    .min(8, 'CIN Transporteur must be at least 8 characters')
    .regex(/^[0-9]+$/, 'CIN Transporteur must contain only numbers')
})
```

## UI Components

### AssignTeamDialog Component

Location: `/components/assign-team-dialog.tsx`

A reusable dialog component for assigning security teams with:
- Team name input field
- CIN Chauffeur input field (with validation)
- CIN Transporteur input field (with validation)
- Form validation using react-hook-form and Zod
- Toast notifications for success/error

**Props:**
```typescript
interface AssignTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: string
  onSuccess: () => void
}
```

### Updated Tunisia Security Page

Location: `/app/tunisia-security/page.tsx`

**Features:**
- Lists validated requests pending team assignment
- "Assign Team" button opens the assignment dialog
- Displays assigned teams with CIN details in the "Ready for Dispatch" section
- Shows team name, CIN Chauffeur, and CIN Transporteur for assigned requests

**Display Format:**
```
Team Name: Team Alpha
Chauffeur: 12345678
Transporteur: 87654321
```

## Workflow

1. **Central Cash** validates a request → Status becomes "VALIDATED"
2. **Tunisia Security** views validated requests
3. Clicks "Assign Team" button
4. Dialog opens with three fields:
   - Team Name
   - CIN Chauffeur
   - CIN Transporteur
5. Submits the form
6. System creates SecurityTeam record
7. Request status changes to "ASSIGNED"
8. Request appears in "Ready for Dispatch" section
9. Tunisia Security can then dispatch the assigned request

## Database Migration

Run the following commands to apply changes:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

**Warning:** The migration will drop the `teamAssigned` column from the `requests` table. Existing data in this column will be lost.

## Testing

### Test Credentials

Use Tunisia Security role account to test the feature.

### Test Scenario

1. Login as Tunisia Security user
2. Navigate to Tunisia Security dashboard
3. Find a request with "VALIDATED" status
4. Click "Assign Team"
5. Enter:
   - Team Name: "Test Team"
   - CIN Chauffeur: "12345678"
   - CIN Transporteur: "87654321"
6. Submit
7. Verify request moves to "Ready for Dispatch" section
8. Verify team details are displayed correctly

### Validation Tests

- Try submitting with empty fields → Should show validation errors
- Try submitting CIN with letters → Should show "must contain only numbers" error
- Try submitting CIN with less than 8 digits → Should show minimum length error
- Try assigning team to non-validated request → Should return 400 error

## Security Considerations

- Role-based access control enforced at API level
- Only Tunisia Security role can assign teams
- Only validated requests can receive team assignments
- All actions are logged in ActionLog table
- CIN numbers are stored as strings to preserve leading zeros

## Future Enhancements

- Add team management page to view/edit security teams
- Add validation for Tunisian CIN format (8 digits)
- Add ability to reassign teams
- Add team availability tracking
- Add driver and transporter profiles with full details
- Export team assignment reports

---

*Implementation Date: October 10, 2025*
*Developer: GitHub Copilot*
