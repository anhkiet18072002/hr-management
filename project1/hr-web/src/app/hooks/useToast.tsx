import { ToastContext } from '@/app/contexts/ToastContext'
import { useContext } from 'react'

export type UseToastOptions = {
   severity?: 'error' | 'warning' | 'info' | 'success'
}

export const useToast = () => {
   const context = useContext(ToastContext)
   if (context === undefined) {
      throw new Error('useToast must be used within an AuthProvider')
   }

   return context
}
