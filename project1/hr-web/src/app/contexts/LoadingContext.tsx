'use client'

import { createContext, useState } from 'react'
import React from 'react'

type LoadingContextType = {
   isLoading: boolean
   setLoading: (value: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
   isLoading: false,
   setLoading: () => { }
})

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
   const [isLoading, setIsLoading] = useState(false)

   return (
      <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
         {children}
      </LoadingContext.Provider>
   )
}

export { LoadingContext, LoadingProvider }
