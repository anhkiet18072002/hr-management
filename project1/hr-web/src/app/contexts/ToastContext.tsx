import Toast from '@/app/components/toast/Toast'
import { UseToastOptions } from '@/app/hooks/useToast'
import { createContext, useState } from 'react'
import React from 'react'

type ToastContextType = {
   show: (message: string, options?: UseToastOptions) => void
   error: (message: string | { message: string }) => void
   info: (message: string) => void
   success: (message: string) => void
   warning: (message: string) => void
}

export type ToastType = UseToastOptions & {
   open: boolean
   message: string
}

const ToastContext = createContext<ToastContextType>({
   show: () => { },
   error: () => { },
   info: () => { },
   success: () => { },
   warning: () => { }
})

interface ToastProviderProps {
   children: React.ReactNode
}

const ToastProvider = ({ children }: ToastProviderProps) => {
   const [toast, setToast] = useState<ToastType>({
      open: false,
      message: '',
      severity: 'info'
   })

   const show = (message: string, options?: UseToastOptions) => {
      setToast({ open: true, message, severity: options?.severity || 'info' })
   }

   const error = (message: string | { message: string }) => {
      if (typeof message === 'string') {
         show(message, { severity: 'error' })
      } else if (typeof message === 'object') {
         show(message.message, { severity: 'error' })
      }
   }

   const info = (message: string) => {
      show(message, { severity: 'info' })
   }

   const success = (message: string) => {
      show(message, { severity: 'success' })
   }

   const warning = (message: string) => {
      show(message, { severity: 'warning' })
   }

   return (
      <ToastContext.Provider value={{ show, error, info, success, warning }}>
         {children}
         <Toast toast={toast} />
      </ToastContext.Provider>
   )
}

export { ToastContext, ToastProvider }
