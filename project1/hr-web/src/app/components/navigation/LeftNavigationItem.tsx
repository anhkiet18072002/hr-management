import React from 'react'
import { PAGE_ROUTES } from '@/app/configs/route.config'
import {
   NavigationGroupType,
   NavigationType
} from '@/app/types/navigation.type'
import {
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemProps,
   ListItemText
} from '@mui/material'
import { useRouter } from 'next/navigation'

type LeftNavigationItemProps = ListItemProps & {
   data: NavigationType | NavigationGroupType
}

const LeftNavigationItem: React.FC<LeftNavigationItemProps> = (props) => {
   const router = useRouter()

   const { data, ...restProps } = props
   const { title, icon, kind, route } = data

   const handleClick = () => {
      router.push(route || PAGE_ROUTES.ADMIN.DASHBOARD)
   }

   return (
      <ListItem {...restProps} sx={{ display: 'block' }}>
         {kind === 'header' ? (
            <ListItemText
               primary={title}
               sx={{
                  paddingLeft: '18px',
                  paddingRight: '24px',
                  '& .MuiTypography-root': {
                     color: '#8c8c8c',
                     fontSize: '12px',
                     fontWeight: 500
                  }
               }}
            />
         ) : (
            <ListItemButton
               sx={{ paddingLeft: '24px', paddingRight: '24px' }}
               onClick={route ? handleClick : undefined}
            >
               {icon !== undefined && <ListItemIcon></ListItemIcon>}
               <ListItemText
                  primary={title}
                  sx={{
                     '& .MuiTypography-root': {
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: 400
                     }
                  }}
               />
            </ListItemButton>
         )}
      </ListItem>
   )
}

export default LeftNavigationItem
