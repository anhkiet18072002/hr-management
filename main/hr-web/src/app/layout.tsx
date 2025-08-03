'use client'

import AclGuard from '@/app/components/acl/AclGuard'
import AppLoading from '@/app/components/loading/AppLoading'
import { AuthProvider } from '@/app/contexts/AuthContext'
import { LoadingProvider } from '@/app/contexts/LoadingContext'
import { ToastProvider } from '@/app/contexts/ToastContext'
import { ApiProvider } from '@/app/providers/ApiProvider'
import { CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useState } from 'react'
import {
   MutationCache,
   QueryCache,
   QueryClient,
   QueryClientProvider
} from 'react-query'
import './globals.css'

const RootLayout = ({
   children
}: Readonly<{
   children: React.ReactNode
}>) => {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  retry: 0,
                  cacheTime: 60000
               }
            },
            mutationCache: new MutationCache(),
            queryCache: new QueryCache()
         })
   )

   return (
      <html lang="en">
         <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
               rel="preconnect"
               href="https://fonts.gstatic.com"
               crossOrigin="anonymous"
            />
            <link
               href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"
               rel="stylesheet"
            />
         </head>
         <body>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
               <QueryClientProvider client={queryClient}>
                  <ToastProvider>
                     <LoadingProvider>
                        <ApiProvider>
                           <AuthProvider>
                              <AclGuard>
                                 <CssBaseline />
                                 <AppLoading />
                                 {children}
                              </AclGuard>
                           </AuthProvider>
                        </ApiProvider>
                     </LoadingProvider>
                  </ToastProvider>
               </QueryClientProvider>
            </LocalizationProvider>
         </body>
      </html>
   )
}

export default RootLayout
