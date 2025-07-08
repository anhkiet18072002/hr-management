import Autocomplete from '@/app/components/autocomplete/Autocomplete'
import { Box, BoxProps, FormLabel, styled } from '@mui/material'
import React from 'react'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

const FormStyled = styled(Box)<BoxProps>({})

type FormAutocompleteProps = Omit<BoxProps, 'onChange'> & {
   disabled?: boolean
   error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
   getOptionLabel?: (option: any) => string
   label?: string
   onChange?: (value: any) => void
   options: any[]
   placeholder?: string
   value: any
}

const FormAutocomplete: React.FC<FormAutocompleteProps> = (props) => {
   const {
      error,
      getOptionLabel,
      label = 'Label',
      onChange,
      options,
      placeholder,
      value,
      disabled = false,
      ...restProps
   } = props

   return (
      <FormStyled {...restProps}>
         <FormLabel sx={{ display: 'block', fontSize: '14px' }}>
            {label}
         </FormLabel>
         <Autocomplete
            error={error}
            getOptionLabel={getOptionLabel}
            onChange={(event, value) => onChange?.(value)}
            options={options}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
         />
      </FormStyled>
   )
}

export default FormAutocomplete
