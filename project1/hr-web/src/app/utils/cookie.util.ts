import Cookie from 'js-cookie'
import * as SSRCookie from 'cookie'
import { GetServerSidePropsContext } from 'next'
import { AccountType } from '../types'

type CookieProps = {
   accessToken?: string
   user?: AccountType | null
}

export const setCookies = (
   { accessToken, user }: CookieProps,
   options?: { expires: number | Date | undefined }
) => {
   if (accessToken) {
      Cookie.set(
         'accessToken',
         typeof accessToken === 'string'
            ? accessToken
            : JSON.stringify(accessToken),
         {
            secure: true,
            expires: options?.expires,
            sameSite: 'strict'
         }
      )
   }

   if (user) {
      Cookie.set('user', JSON.stringify(user), {
         secure: true,
         expires: options?.expires,
         sameSite: 'strict'
      })
   }
}

export const getCookie = (
   name: string,
   context?: GetServerSidePropsContext
) => {
   if (context) {
      return SSRCookie.parse(context?.req?.headers?.cookie || '')
   }

   let cookie = Cookie.get(name) || ''
   if (cookie && cookie.charAt(0) === '"') {
      cookie = cookie.substring(1)
   }
   if (cookie && cookie.charAt(cookie.length - 1) === '"') {
      cookie = cookie.substring(0, cookie.length - 1)
   }

   return cookie
}

export const clearCookies = () => {
   Cookie.remove('accessToken')
   Cookie.remove('user')
}
