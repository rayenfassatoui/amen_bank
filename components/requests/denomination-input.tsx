"use client"

import { useState } from "react"
import { BILL_DENOMINATIONS, COIN_DENOMINATIONS } from "@/lib/constants/denominations"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface DenominationInputProps {
  value: Array<{
    denominationType: "BILL" | "COIN"
    denomination: number
    quantity: number
    totalValue: number
  }>
  onChange: (value: Array<{
    denominationType: "BILL" | "COIN"
    denomination: number
    quantity: number
    totalValue: number
  }>) => void
}

export function DenominationInput({ value, onChange }: DenominationInputProps) {
  const [billQuantities, setBillQuantities] = useState<Record<number, number>>({})
  const [coinQuantities, setCoinQuantities] = useState<Record<number, number>>({})

  const handleQuantityChange = (
    type: "BILL" | "COIN",
    denominationValue: number,
    quantity: string
  ) => {
    const qty = parseInt(quantity) || 0

    if (type === "BILL") {
      setBillQuantities(prev => ({ ...prev, [denominationValue]: qty }))
    } else {
      setCoinQuantities(prev => ({ ...prev, [denominationValue]: qty }))
    }

    // Update the value array
    const newValue = [
      ...BILL_DENOMINATIONS.map(d => ({
        denominationType: "BILL" as const,
        denomination: d.value,
        quantity: type === "BILL" && d.value === denominationValue ? qty : billQuantities[d.value] || 0,
        totalValue: (type === "BILL" && d.value === denominationValue ? qty : billQuantities[d.value] || 0) * d.value
      })),
      ...COIN_DENOMINATIONS.map(d => ({
        denominationType: "COIN" as const,
        denomination: d.value,
        quantity: type === "COIN" && d.value === denominationValue ? qty : coinQuantities[d.value] || 0,
        totalValue: (type === "COIN" && d.value === denominationValue ? qty : coinQuantities[d.value] || 0) * d.value
      }))
    ].filter(item => item.quantity > 0)

    onChange(newValue)
  }

  const calculateTotal = () => {
    return value.reduce((sum, item) => sum + item.totalValue, 0)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-[rgb(var(--amen-green))]">Bills (Billets)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {BILL_DENOMINATIONS.map((denomination) => (
            <div key={denomination.value} className="space-y-2">
              <Label htmlFor={`bill-${denomination.value}`}>
                {denomination.label}
              </Label>
              <Input
                id={`bill-${denomination.value}`}
                type="number"
                min="0"
                placeholder="Quantity"
                value={billQuantities[denomination.value] || ""}
                onChange={(e) => handleQuantityChange("BILL", denomination.value, e.target.value)}
              />
              {billQuantities[denomination.value] > 0 && (
                <p className="text-sm text-gray-600">
                  Total: {(billQuantities[denomination.value] * denomination.value).toFixed(3)} TND
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-[rgb(var(--amen-blue))]">Coins (Pièces)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {COIN_DENOMINATIONS.map((denomination) => (
            <div key={denomination.value} className="space-y-2">
              <Label htmlFor={`coin-${denomination.value}`}>
                {denomination.label}
              </Label>
              <Input
                id={`coin-${denomination.value}`}
                type="number"
                min="0"
                placeholder="Quantity"
                value={coinQuantities[denomination.value] || ""}
                onChange={(e) => handleQuantityChange("COIN", denomination.value, e.target.value)}
              />
              {coinQuantities[denomination.value] > 0 && (
                <p className="text-sm text-gray-600">
                  Total: {(coinQuantities[denomination.value] * denomination.value).toFixed(3)} TND
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-gray-50">
        <div className="text-xl font-bold text-center">
          Calculated Total: <span className="text-[rgb(var(--amen-green))]">{calculateTotal().toFixed(3)} TND</span>
        </div>
      </Card>
    </div>
  )
}