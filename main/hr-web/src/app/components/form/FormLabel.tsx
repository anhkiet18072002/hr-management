import {
   FormLabel as MuiFormLabel,
   FormLabelProps as MuiFormLabelProps,
   styled
} from '@mui/material'
import React from 'react'

type FormLabelProps = MuiFormLabelProps & {
   children: React.ReactNode
}

const MuiFormLabelStyled = styled(MuiFormLabel)<FormLabelProps>({
   fontSize: '14px',
   marginBottom: '6px !important'
})

const FormLabel: React.FC<FormLabelProps> = (props) => {
   const { children, ...restProps } = props

   return <MuiFormLabelStyled {...restProps}>{children}</MuiFormLabelStyled>
}

export default FormLabel
