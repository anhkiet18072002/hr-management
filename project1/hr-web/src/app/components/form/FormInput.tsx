import TextField from '@/app/components/input/TextField'
import { Box, BoxProps, FormLabel, InputProps, styled } from '@mui/material'
import { Property } from 'csstype'
import React from 'react'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

const FormStyled = styled(Box)<BoxProps>({})

type FormInputProps = BoxProps & {
   error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
   label?: string
   multiline?: boolean
   placeholder?: string
   transform?: Property.TextTransform | undefined
   type?: string
   value?: string
   onChange?: InputProps['onChange']
}

const FormInput: React.FC<FormInputProps> = (props) => {
   const {
      error,
      label = 'Label',
      multiline = false,
      placeholder,
      transform,
      type = 'text',
      value = '',
      onChange,
      ...restProps
   } = props

   return (
      <FormStyled {...restProps}>
         <FormLabel sx={{ display: 'block', fontSize: '14px' }}>
            {label}
         </FormLabel>
         <TextField
            errors={error as FieldError | undefined}
            type={type}
            value={value}
            multiline={multiline}
            maxRows={multiline ? 4 : undefined}
            minRows={multiline ? 4 : undefined}
            onChange={onChange}
            placeholder={placeholder}
            slotProps={{
               input: {
                  sx: {
                     textTransform: transform
                  }
               }
            }}
         />
      </FormStyled>
   )
}

export default FormInput
