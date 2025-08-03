import api from '@/app/providers/ApiProvider'

export * from './staff.api'
export * from './staff.hook'
export * from './skill.api'
export * from './skill.hook'
export * from './project.hook'
export * from './project.api'
export * from './project.assignment.hook'
export * from './project.type.hook'
export * from './project.type.api'
export * from './project.assignment.api'
export * from './project.role.api'
export * from './project.role.hook'

import { AxiosRequestConfig } from 'axios'

export class HttpClient {
   static async get<T>(url: string, params?: any) {
      const res = await api.get<T>(
         `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
         { params }
      )

      return res.data
   }

   static async post<T>(
      url: string,
      payload?: any,
      config?: AxiosRequestConfig
   ) {
      const res = await api.post<T>(
         `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
         payload,
         config
      )

      return res.data
   }

   static async patch<T>(
      url: string,
      payload?: any,
      config?: AxiosRequestConfig
   ) {
      const res = await api.patch<T>(
         `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
         payload,
         config
      )

      return res.data
   }

   static async delete<T>(url: string) {
      const res = await api.delete<T>(
         `${process.env.NEXT_PUBLIC_API_URL}/${url}`
      )

      return res.data
   }
}
