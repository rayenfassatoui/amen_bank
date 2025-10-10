"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { assignTeamSchema, type AssignTeamInput } from "@/lib/validations/team"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface AssignTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: string
  onSuccess: () => void
}

export function AssignTeamDialog({
  open,
  onOpenChange,
  requestId,
  onSuccess
}: AssignTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AssignTeamInput>({
    resolver: zodResolver(assignTeamSchema)
  })

  const onSubmit = async (data: AssignTeamInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${requestId}/assign-team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to assign team")
      }

      toast.success("Security team assigned successfully!")
      reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("Error assigning team:", error)
      toast.error(error instanceof Error ? error.message : "Failed to assign team")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Security Team</DialogTitle>
          <DialogDescription>
            Enter the security team details including driver and transporter CIN numbers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              placeholder="e.g., Team Alpha, Security Unit 1"
              {...register("teamName")}
              disabled={isSubmitting}
            />
            {errors.teamName && (
              <p className="text-sm text-red-600">{errors.teamName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cinChauffeur">CIN Chauffeur (Driver)</Label>
            <Input
              id="cinChauffeur"
              placeholder="e.g., 12345678"
              {...register("cinChauffeur")}
              disabled={isSubmitting}
            />
            {errors.cinChauffeur && (
              <p className="text-sm text-red-600">{errors.cinChauffeur.message}</p>
            )}
            <p className="text-xs text-gray-500">
              National ID number of the driver (numbers only, min 8 digits)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cinTransporteur">CIN Transporteur</Label>
            <Input
              id="cinTransporteur"
              placeholder="e.g., 87654321"
              {...register("cinTransporteur")}
              disabled={isSubmitting}
            />
            {errors.cinTransporteur && (
              <p className="text-sm text-red-600">{errors.cinTransporteur.message}</p>
            )}
            <p className="text-xs text-gray-500">
              National ID number of the transporter (numbers only, min 8 digits)
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}