import { create } from "zustand"
import { devtools } from "zustand/middleware"

export type RequestStatus =
  | "SUBMITTED"
  | "VALIDATED"
  | "REJECTED"
  | "ASSIGNED"
  | "DISPATCHED"
  | "RECEIVED"
  | "COMPLETED"
  | "CANCELLED"

export type RequestType = "PROVISIONNEMENT" | "VERSEMENT"

export interface DenominationDetail {
  id?: string
  denomination: number
  denominationType: "BILL" | "COIN"
  quantity: number
  totalValue: number
}

export interface Request {
  id: string
  requestType: RequestType
  status: RequestStatus
  totalAmount: number
  currency: string
  description?: string
  teamAssigned?: string
  dispatchedBy?: string
  dispatchedAt?: Date
  receivedBy?: string
  receivedAt?: Date
  nonCompliance?: string
  nonComplianceDetails?: string
  createdAt: Date
  updatedAt: Date
  userId: string
  agencyId: string
  denominationDetails: DenominationDetail[]
}

interface RequestState {
  requests: Request[]
  currentRequest: Request | null
  filters: {
    status?: RequestStatus
    type?: RequestType
    agencyId?: string
    dateFrom?: Date
    dateTo?: Date
  }
  setRequests: (requests: Request[]) => void
  setCurrentRequest: (request: Request | null) => void
  addRequest: (request: Request) => void
  updateRequest: (id: string, updates: Partial<Request>) => void
  deleteRequest: (id: string) => void
  setFilters: (filters: RequestState["filters"]) => void
  clearFilters: () => void
}

export const useRequestStore = create<RequestState>()(
  devtools(
    (set) => ({
      requests: [],
      currentRequest: null,
      filters: {},

      setRequests: (requests) =>
        set({ requests }, false, "setRequests"),

      setCurrentRequest: (request) =>
        set({ currentRequest: request }, false, "setCurrentRequest"),

      addRequest: (request) =>
        set(
          (state) => ({ requests: [...state.requests, request] }),
          false,
          "addRequest"
        ),

      updateRequest: (id, updates) =>
        set(
          (state) => ({
            requests: state.requests.map((req) =>
              req.id === id ? { ...req, ...updates } : req
            ),
            currentRequest:
              state.currentRequest?.id === id
                ? { ...state.currentRequest, ...updates }
                : state.currentRequest,
          }),
          false,
          "updateRequest"
        ),

      deleteRequest: (id) =>
        set(
          (state) => ({
            requests: state.requests.filter((req) => req.id !== id),
            currentRequest:
              state.currentRequest?.id === id ? null : state.currentRequest,
          }),
          false,
          "deleteRequest"
        ),

      setFilters: (filters) =>
        set({ filters }, false, "setFilters"),

      clearFilters: () =>
        set({ filters: {} }, false, "clearFilters"),
    }),
    { name: "request-store" }
  )
)