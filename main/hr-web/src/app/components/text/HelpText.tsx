import { FormHelperText, FormHelperTextProps, styled } from '@mui/material'
import React from 'react'

const HelpTextStyled = styled(FormHelperText)(({ theme }) => ({
   border: 'none',
   boxShadow: 'none !important',
   color: theme.palette.error.main,
   fontStyle: 'italic',
   outline: 'none',
   margin: '4px 14px 0 14px'
}))

type HelpTextProps = FormHelperTextProps & {}

const HelpText: React.FC<HelpTextProps> = (props) => {
   const { children, ...restProps } = props

   return <HelpTextStyled {...restProps}>{children}</HelpTextStyled>
}

export default HelpText
