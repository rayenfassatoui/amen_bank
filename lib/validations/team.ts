import { z } from 'zod'

export const assignTeamSchema = z.object({
  teamName: z.string().min(2, 'Team name must be at least 2 characters'),
  cinChauffeur: z.string()
    .min(8, 'CIN Chauffeur must be at least 8 characters')
    .regex(/^[0-9]+$/, 'CIN Chauffeur must contain only numbers'),
  cinTransporteur: z.string()
    .min(8, 'CIN Transporteur must be at least 8 characters')
    .regex(/^[0-9]+$/, 'CIN Transporteur must contain only numbers')
})

export type AssignTeamInput = z.infer<typeof assignTeamSchema>