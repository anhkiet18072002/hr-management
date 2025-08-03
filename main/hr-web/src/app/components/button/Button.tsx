import {
   ButtonProps as MuiButtonProps,
   Button as MuiButton,
   styled,
   Typography
} from '@mui/material'
import React from 'react'

const MuiButtonStyled = styled(MuiButton)<MuiButtonProps>(
   ({ theme, color }) => ({
      backgroundColor:
         color === 'error'
            ? 'rgb(255, 77, 79)'
            : color === 'secondary'
               ? 'white'
               : theme.palette.primary.main,
      border:
         color === 'secondary' ? '1px solid rgba(0, 0, 0, 0.23)' : undefined,
      color: color === 'secondary' ? 'rgba(0, 0, 0, 0.87)' : 'white',
      padding: '8px 18px',
      textTransform: 'none',
      whiteSpace: 'nowrap'
   })
)

type ButtonProps = Omit<MuiButtonProps, 'size'> & {
   size?: 'tiny' | 'small' | 'standard'
}

const Button: React.FC<ButtonProps> = (props) => {
   const { size = 'standard', sx, title, ...restProps } = props

   return (
      <MuiButtonStyled
         {...restProps}
         sx={{
            ...sx,
            height:
               size === 'tiny' ? '32px' : size === 'small' ? '40px' : undefined
         }}
      >
         <Typography
            component={'span'}
            sx={{
               fontSize: size === 'tiny' ? '12px' : '14px'
            }}
         >
            {title}
         </Typography>
      </MuiButtonStyled>
   )
}

export default Button
