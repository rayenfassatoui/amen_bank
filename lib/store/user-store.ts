import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  isActive: boolean
  roleId: string
  agencyId: string
  role: {
    id: string
    name: string
    description?: string
  }
  agency: {
    id: string
    name: string
    code: string
  }
}

interface UserState {
  users: User[]
  currentUser: User | null
  setUsers: (users: User[]) => void
  setCurrentUser: (user: User | null) => void
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      users: [],
      currentUser: null,

      setUsers: (users) =>
        set({ users }, false, "setUsers"),

      setCurrentUser: (user) =>
        set({ currentUser: user }, false, "setCurrentUser"),

      addUser: (user) =>
        set(
          (state) => ({ users: [...state.users, user] }),
          false,
          "addUser"
        ),

      updateUser: (id, updates) =>
        set(
          (state) => ({
            users: state.users.map((user) =>
              user.id === id ? { ...user, ...updates } : user
            ),
            currentUser:
              state.currentUser?.id === id
                ? { ...state.currentUser, ...updates }
                : state.currentUser,
          }),
          false,
          "updateUser"
        ),

      deleteUser: (id) =>
        set(
          (state) => ({
            users: state.users.filter((user) => user.id !== id),
            currentUser:
              state.currentUser?.id === id ? null : state.currentUser,
          }),
          false,
          "deleteUser"
        ),
    }),
    { name: "user-store" }
  )
)