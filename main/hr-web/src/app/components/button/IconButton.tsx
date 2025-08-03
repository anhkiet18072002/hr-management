import React from 'react'
import {
   IconButton as MuiIconButton,
   IconButtonProps as MuiIconButtonProps,
   styled
} from '@mui/material'

const MuiIconButtonStyled = styled(MuiIconButton)<MuiIconButtonProps>({
   borderRadius: '4px',
   '& .MuiTouchRipple-root .MuiTouchRipple-child': {
      borderRadius: '4px'
   }
})

type IconButtonProps = MuiIconButtonProps & {
   width?: number
   height?: number
}

const IconButton: React.FC<IconButtonProps> = (props) => {
   const { children, width, height } = props

   return (
      <MuiIconButtonStyled
         {...props}
         sx={{
            height: width || 44,
            width: height || 44
         }}
      >
         {children}
      </MuiIconButtonStyled>
   )
}

export default IconButton
