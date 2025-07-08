import React from 'react'
import LeftNavigationItem from '@/app/components/navigation/LeftNavigationItem'
import { LEFT_NAVIGATION } from '@/app/configs/navigation.config'
import {
   NavigationGroupType,
   NavigationType
} from '@/app/types/navigation.type'
import {
   Box,
   BoxProps,
   CSSObject,
   Divider,
   Drawer,
   DrawerProps,
   List,
   styled,
   Theme
} from '@mui/material'

const navigationWidth = 260

const openedMixin = (theme: Theme): CSSObject => ({
   width: navigationWidth,
   transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
   }),
   overflowX: 'hidden'
})

const closedMixin = (theme: Theme): CSSObject => ({
   transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
   }),
   overflowX: 'hidden',
   width: `calc(${theme.spacing(7)} + 1px)`,
   [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`
   }
})

const DrawerContainer = styled(Drawer)<DrawerProps>(({ theme }) => ({
   boxSizing: 'border-box',
   flexShrink: 0,
   whiteSpace: 'nowrap',
   width: navigationWidth,
   variants: [
      {
         props: ({ open }) => open,
         style: {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme)
         }
      },
      {
         props: ({ open }) => !open,
         style: {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme)
         }
      }
   ]
}))

const DrawerHeader = styled(Box)<BoxProps>({})

const LeftNavigation = () => {
   return (
      <DrawerContainer variant="permanent" open={true}>
         {/* Header */}
         <DrawerHeader></DrawerHeader>
         <Divider />
         <List>
            {LEFT_NAVIGATION.map(
               (
                  navigation: NavigationType | NavigationGroupType,
                  index: number
               ) => {
                  return (
                     <LeftNavigationItem
                        data={navigation}
                        key={`${navigation.title}_${index}`}
                        disablePadding
                        sx={{ display: 'block' }}
                     />
                  )
               }
            )}
         </List>
      </DrawerContainer>
   )
}

export default LeftNavigation
