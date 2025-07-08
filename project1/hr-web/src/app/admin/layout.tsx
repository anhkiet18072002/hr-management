'use client'

import React from 'react'
import Breadcrumbs from '@/app/components/breadcrumb/Breadcrumbs'
import LeftNavigation from '@/app/components/navigation/LeftNavigation'
import { Box, BoxProps, styled } from '@mui/material'
import TopNavigation from '@/app/components/navigation/TopNavigation'

const LayoutContainer = styled(Box)<BoxProps>({
   display: 'flex',
   width: '100%',
   height: '100vh'
})

const ContentContainer = styled(Box)<BoxProps>({
   backgroundColor: '#FAFAFA',
   width: '100%',
   minHeight: '100vh',
   overflow: 'auto'
})

const ContentWrapper = styled(Box)<BoxProps>({
   paddingLeft: '24px',
   paddingRight: '24px',
   width: '100%',
   height: '100%'
})

const Layout = ({
   children
}: Readonly<{
   children: React.ReactNode
}>) => {
   return (
      <LayoutContainer>
         <LeftNavigation />
         <ContentContainer>
            <ContentWrapper>
               <TopNavigation />
               <Breadcrumbs />
               <Box sx={{ marginTop: '22px', width: '100%' }}>{children}</Box>
            </ContentWrapper>
         </ContentContainer>
      </LayoutContainer>
   )
}

export default Layout
