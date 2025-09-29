import { z } from "zod"

export const denominationDetailSchema = z.object({
  denomination: z.number().positive("Denomination must be positive"),
  denominationType: z.enum(["BILL", "COIN"], {
    required_error: "Denomination type is required",
  }),
  quantity: z.number().int().min(0, "Quantity must be at least 0"),
  totalValue: z.number().min(0, "Total value must be at least 0"),
})

export const createRequestSchema = z.object({
  requestType: z.enum(["PROVISIONNEMENT", "VERSEMENT"], {
    required_error: "Request type is required",
  }),
  totalAmount: z.number().positive("Total amount must be positive"),
  currency: z.string().default("TND"),
  description: z.string().optional(),
  denominationDetails: z
    .array(denominationDetailSchema)
    .min(1, "At least one denomination detail is required"),
})
  .refine(
    (data) => {
      // Validate that sum of denomination totals equals total amount
      const sum = data.denominationDetails.reduce(
        (acc, detail) => acc + detail.totalValue,
        0
      )
      return Math.abs(sum - data.totalAmount) < 0.01 // Allow for floating point errors
    },
    {
      message: "Sum of denomination totals must equal the total amount",
      path: ["totalAmount"],
    }
  )

export const validateRequestSchema = z.object({
  action: z.enum(["validate", "reject"]),
  reason: z.string().optional(),
})

export const assignTeamSchema = z.object({
  teamAssigned: z.string().min(1, "Team name is required"),
})

export const confirmDispatchSchema = z.object({
  dispatchedBy: z.string().min(1, "Dispatcher name is required"),
})

export const confirmReceiptSchema = z.object({
  receivedBy: z.string().min(1, "Receiver name is required"),
  nonCompliance: z.enum(["YES", "NO"]).optional(),
  nonComplianceDetails: z.string().optional(),
  password: z.string().min(1, "Password is required for confirmation"),
})
  .refine(
    (data) => {
      // If non-compliance is YES, details must be provided
      if (data.nonCompliance === "YES") {
        return !!data.nonComplianceDetails && data.nonComplianceDetails.length > 0
      }
      return true
    },
    {
      message: "Non-compliance details are required when reporting non-compliance",
      path: ["nonComplianceDetails"],
    }
  )

export type DenominationDetailInput = z.infer<typeof denominationDetailSchema>
export type CreateRequestInput = z.infer<typeof createRequestSchema>
export type ValidateRequestInput = z.infer<typeof validateRequestSchema>
export type AssignTeamInput = z.infer<typeof assignTeamSchema>
export type ConfirmDispatchInput = z.infer<typeof confirmDispatchSchema>
export type ConfirmReceiptInput = z.infer<typeof confirmReceiptSchema>