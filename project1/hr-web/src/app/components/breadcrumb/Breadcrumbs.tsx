'use client'

import { LEFT_NAVIGATION } from '@/app/configs/navigation.config'
import { PAGE_ROUTES } from '@/app/configs/route.config'
import {
   NavigationGroupType,
   NavigationType
} from '@/app/types/navigation.type'
import { HomeOutlined } from '@ant-design/icons'
import {
   Link,
   LinkProps,
   Breadcrumbs as MuiBreadcrumbs,
   styled,
   Typography,
   TypographyProps
} from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LinkStyled = styled(Link)<LinkProps>({
   color: '#00000073',
   cursor: 'pointer',
   fontSize: '14px',
   display: 'flex'
})

const NoneLinkStyled = styled(Typography)<TypographyProps>({
   color: 'black',
   fontSize: '14px'
})

const Breadcrumbs = () => {
   const router = useRouter()
   const path = usePathname()

   const [links, setLinks] = useState<NavigationType[]>([])

   useEffect(() => {
      const navigation: NavigationType | undefined = LEFT_NAVIGATION.findLast(
         (navigation: NavigationType | NavigationGroupType) => {
            const nav = navigation as NavigationType
            if (
               nav &&
               nav.route !== undefined &&
               path?.indexOf(nav.route) >= 0
            ) {
               return true
            }

            const navGroup = navigation as NavigationGroupType
            if (navGroup.children && navGroup.children.length > 0) {
               const found = navGroup.children.findLast(
                  (navChild) => navChild.route === path
               )
               if (found) {
                  return found
               }
            }

            return navigation.route === path
         }
      )

      if (navigation) {
         setLinks([navigation])
      } else {
         setLinks([])
      }
   }, [path])

   return (
      <MuiBreadcrumbs
         aria-label="breadcrumb"
         sx={{
            alignItems: 'center',
            backgroundColor: 'white',
            border: '1px solid #F0F0F0',
            borderRadius: '4px',
            display: 'flex',
            height: '52px',
            marginTop: '22px',
            padding: '15px'
         }}
      >
         <LinkStyled
            underline="hover"
            color="inherit"
            onClick={() => router.replace(PAGE_ROUTES.ADMIN.DASHBOARD)}
         >
            <HomeOutlined style={{ marginRight: '8px' }} />
            <Typography sx={{ color: '#00000073', fontSize: '14px' }}>
               Home
            </Typography>
         </LinkStyled>
         {links?.length >= 1 &&
            links?.map(
               (link: NavigationType | NavigationGroupType, index: number) => {
                  return (
                     <LinkStyled
                        key={index}
                        underline="hover"
                        color="inherit"
                        href={link.route}
                     >
                        {link.title}
                     </LinkStyled>
                  )
               }
            )}
      </MuiBreadcrumbs>
   )
}

export default Breadcrumbs
