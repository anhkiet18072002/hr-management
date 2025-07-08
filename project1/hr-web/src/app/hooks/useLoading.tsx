'use client'

import { LoadingContext } from '@/app/contexts/LoadingContext'
import { useContext } from 'react'

const useLoading = () => {
   const context = useContext(LoadingContext)
   if (context === undefined) {
      throw new Error('useLoading must be used within an LoadingProvider')
   }

   return context
}

export default useLoading
