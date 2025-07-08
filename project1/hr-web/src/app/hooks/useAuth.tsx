import { AuthContext } from '@/app/contexts/AuthContext'
import { useContext } from 'react'

export const useAuth = () => {
   const context = useContext(AuthContext)
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider')
   }

   return context
}

export const useIsAuthed = () => {
   const context = useAuth()
   return context.isAuthenticated
}
