'use client'

import { getCookie } from '@/app/utils/cookie.util'
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { Fragment } from 'react'

interface ApiProviderProps {
   children: React.ReactNode
}

const api: AxiosInstance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
   headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
   }
})

const ApiProvider: React.FC<ApiProviderProps> = ({ children }: ApiProviderProps) => {
   // Use request interceptor
   api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
         const token: string = (getCookie('accessToken') as string) || ''
         if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
         }

         return config
      },
      (err: any) => {
         return Promise.reject(err)
      }
   )

   return <Fragment>{children}</Fragment>
}

export { ApiProvider }
export default api
