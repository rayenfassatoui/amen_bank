"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DenominationInput } from "@/components/requests/denomination-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const createRequestSchema = z.object({
  requestType: z.enum(["PROVISIONNEMENT", "VERSEMENT"]),
  totalAmount: z.string().min(1, "Total amount is required"),
  denominationDetails: z.array(z.object({
    denominationType: z.enum(["BILL", "COIN"]),
    denomination: z.number(),
    quantity: z.number(),
    totalValue: z.number()
  })).min(1, "At least one denomination is required")
}).refine(
  (data) => {
    const enteredAmount = parseFloat(data.totalAmount)
    const calculatedAmount = data.denominationDetails.reduce((sum, detail) => sum + detail.totalValue, 0)
    return Math.abs(enteredAmount - calculatedAmount) < 0.01
  },
  {
    message: "The calculated total from denominations must match the entered total amount",
    path: ["totalAmount"]
  }
)

type CreateRequestInput = z.infer<typeof createRequestSchema>

export default function CreateRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [denominationDetails, setDenominationDetails] = useState<Array<{
    denominationType: "BILL" | "COIN"
    denomination: number
    quantity: number
    totalValue: number
  }>>([])

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateRequestInput>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      requestType: "PROVISIONNEMENT",
      totalAmount: "",
      denominationDetails: []
    }
  })

  const requestType = watch("requestType")

  const onSubmit = async (data: CreateRequestInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requestType: data.requestType,
          totalAmount: parseFloat(data.totalAmount),
          denominationDetails: data.denominationDetails
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create request")
      }

      toast.success("Request created successfully!")
      router.push("/requests")
    } catch (error) {
      console.error("Error creating request:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDenominationChange = (value: typeof denominationDetails) => {
    setDenominationDetails(value)
    setValue("denominationDetails", value, { shouldValidate: true })
  }

  const calculatedTotal = denominationDetails.reduce((sum, detail) => sum + detail.totalValue, 0)
  const enteredTotal = parseFloat(watch("totalAmount") || "0")
  const totalsMatch = Math.abs(calculatedTotal - enteredTotal) < 0.01

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Request</h1>
        <p className="text-gray-600 mt-2">Submit a new fund provisioning or deposit request</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="requestType">Request Type *</Label>
              <Select
                defaultValue="PROVISIONNEMENT"
                onValueChange={(value) => setValue("requestType", value as "PROVISIONNEMENT" | "VERSEMENT")}
              >
                <SelectTrigger id="requestType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROVISIONNEMENT">Provisionnement (Fund Request)</SelectItem>
                  <SelectItem value="VERSEMENT">Versement (Deposit)</SelectItem>
                </SelectContent>
              </Select>
              {errors.requestType && (
                <p className="text-red-500 text-sm">{errors.requestType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (TND) *</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.001"
                placeholder="Enter total amount"
                {...register("totalAmount")}
              />
              {errors.totalAmount && (
                <p className="text-red-500 text-sm">{errors.totalAmount.message}</p>
              )}
              {enteredTotal > 0 && (
                <div className={`text-sm ${totalsMatch ? "text-green-600" : "text-red-600"}`}>
                  {totalsMatch ? "✓ Totals match!" : "⚠ Totals don't match - please verify denominations"}
                </div>
              )}
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Denomination Details</h2>
          <DenominationInput
            value={denominationDetails}
            onChange={handleDenominationChange}
          />
          {errors.denominationDetails && (
            <p className="text-red-500 text-sm mt-2">{errors.denominationDetails.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !totalsMatch}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  )
}