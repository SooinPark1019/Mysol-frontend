"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types/blog"
import { getCurrentUser, refreshToken } from "@/lib/api"

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser(retries = 0) {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
        setIsLoading(false)
      } catch (error) {
        console.error(`Attempt ${retries + 1} failed to load user:`, error)

        if (retries < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`)
          setTimeout(() => loadUser(retries + 1), RETRY_DELAY)
        } else {
          console.error("Max retries reached. Attempting to refresh token...")
          try {
            await refreshToken()
            const userData = await getCurrentUser()
            setUser(userData)
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError)
            setUser(null)
          } finally {
            setIsLoading(false)
          }
        }
      }
    }

    loadUser()
  }, [])

  return <AuthContext.Provider value={{ user, setUser, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

