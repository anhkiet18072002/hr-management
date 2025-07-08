'use client'

import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import api from '@/app/providers/ApiProvider'
import { LoginResponseType } from '@/app/types/auth.type'
import { clearCookies, getCookie, setCookies } from '@/app/utils/cookie.util'
import { useRouter } from 'next/navigation'
import { createContext, useEffect, useState } from 'react'
import { AccountType } from '../types'

type AuthContextType = {
   user: AccountType | null
   isAuthenticated: boolean
   login: any
   logout: any
}

const AuthContext = createContext<AuthContextType>({
   user: null,
   isAuthenticated: false,
   login: () => {},
   logout: () => {}
})

interface AuthProviderProps {
   children: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
   const [user, setUser] = useState<AccountType | null>(null)
   const [isAuthenticated, setIsAuthenticated] = useState(false)

   const route = useRouter()

   useEffect(() => {
      const user = JSON.parse((getCookie('user') as string) || '{}')
      if (user) {
         setUser(user)
         setIsAuthenticated(true)
      }
   }, [])

   const login = async (
      { email, password }: { email: string; password: string },
      errorCallback?: (err: any) => void
   ) => {
      api.post(
         API_ROUTES.AUTH.LOGIN,
         { email, password },
         { headers: { 'Content-Type': 'application/json' } }
      )
         .then(async (res: any) => {
            if (res) {
               const { data }: { data: LoginResponseType } = res
               if (data.account.id && data.account.email) {
                  // Set user and cookie
                  setCookies(
                     {
                        accessToken: data.token.access
                     },
                     {
                        expires: Math.floor(data.token.expiration) / (3600 * 24)
                     }
                  )

                  // Save user
                  setUser(data.account)
                  setIsAuthenticated(true)

                  setCookies({ user: data.account })

                  // Navigate to dashboard page
                  route.push(PAGE_ROUTES.ADMIN.DASHBOARD)
               }
            }

            return res
         })
         .catch((err: any) => errorCallback?.(err))
   }

   const logout = () => {
      setUser(null)
      setIsAuthenticated(false)

      clearCookies()

      // Navigate to login page
      route.push(PAGE_ROUTES.LOGIN)
   }

   return (
      <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
         {children}
      </AuthContext.Provider>
   )
}

export { AuthContext, AuthProvider }
