// Tunisian Dinar Denominations

export const BILL_DENOMINATIONS = [
  { value: 5, label: "5 TND", type: "BILL" as const },
  { value: 10, label: "10 TND", type: "BILL" as const },
  { value: 20, label: "20 TND", type: "BILL" as const },
  { value: 30, label: "30 TND", type: "BILL" as const },
  { value: 50, label: "50 TND", type: "BILL" as const },
] as const

export const COIN_DENOMINATIONS = [
  { value: 0.005, label: "5 Millimes", type: "COIN" as const },
  { value: 0.01, label: "10 Millimes", type: "COIN" as const },
  { value: 0.02, label: "20 Millimes", type: "COIN" as const },
  { value: 0.05, label: "50 Millimes", type: "COIN" as const },
  { value: 0.1, label: "100 Millimes", type: "COIN" as const },
  { value: 0.2, label: "200 Millimes", type: "COIN" as const },
  { value: 0.5, label: "500 Millimes", type: "COIN" as const },
  { value: 1, label: "1 TND", type: "COIN" as const },
  { value: 2, label: "2 TND", type: "COIN" as const },
  { value: 5, label: "5 TND", type: "COIN" as const },
] as const

export const ALL_DENOMINATIONS = [...BILL_DENOMINATIONS, ...COIN_DENOMINATIONS]

export const REQUEST_TYPES = [
  { value: "PROVISIONNEMENT", label: "Fund Supply (Provisionnement)" },
  { value: "VERSEMENT", label: "Deposit (Versement)" },
] as const

export const REQUEST_STATUSES = [
  { value: "SUBMITTED", label: "Submitted", color: "blue" },
  { value: "VALIDATED", label: "Validated", color: "green" },
  { value: "REJECTED", label: "Rejected", color: "red" },
  { value: "ASSIGNED", label: "Team Assigned", color: "purple" },
  { value: "DISPATCHED", label: "Dispatched", color: "indigo" },
  { value: "RECEIVED", label: "Received", color: "teal" },
  { value: "COMPLETED", label: "Completed", color: "green" },
  { value: "CANCELLED", label: "Cancelled", color: "gray" },
] as const

export function getStatusColor(status: string): string {
  const statusConfig = REQUEST_STATUSES.find((s) => s.value === status)
  return statusConfig?.color || "gray"
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
  }).format(amount)
}