import { PAGE_ROUTES, PROTECTED_PAGE_ROUTES } from '@/app/configs/route.config'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const middleware = async (req: NextRequest) => {
   const path = req.nextUrl.pathname || ''

   const isProtectedRoute =
      PROTECTED_PAGE_ROUTES.filter((route) => path.startsWith(route))?.length >=
      0
   const accessToken: string =
      ((await cookies()).get('accessToken')?.value as string) || ''

   if (
      isProtectedRoute &&
      !accessToken &&
      !path.startsWith(PAGE_ROUTES.LOGIN)
   ) {
      return NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, req.nextUrl))
   }

   if (accessToken && path.startsWith(PAGE_ROUTES.LOGIN)) {
      return NextResponse.redirect(
         new URL(PAGE_ROUTES.ADMIN.DASHBOARD, req.nextUrl)
      )
   }

   return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}

export default middleware
