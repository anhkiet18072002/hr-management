import {
   Box,
   BoxProps,
   FormControl,
   FormHelperText,
   FormLabel,
   FormControlLabel,
   Radio,
   RadioGroup,
   styled
} from '@mui/material'
import React from 'react'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

const FormStyled = styled(Box)<BoxProps>({})

type FormRadioGroupProps = Omit<BoxProps, 'onChange'> & {
   disabled?: boolean
   error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
   label?: string
   onChange?: (value: any) => void
   options: {
      label: string
      value: string
   }[]
   value: any
   row?: boolean
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
   error,
   label = 'Label',
   onChange,
   options,
   value,
   disabled = false,
   row = true,
   ...restProps
}) => {
   return (
      <FormStyled {...restProps}>
         <FormLabel sx={{ display: 'block', fontSize: '14px' }}>
            {label}
         </FormLabel>
         <RadioGroup value={value} onChange={(e) => onChange?.(e.target.value)}>
            {options.map((option) => (
               <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
               />
            ))}
         </RadioGroup>
         {error && (
            <FormHelperText>{(error as FieldError)?.message}</FormHelperText>
         )}
      </FormStyled>
   )
}

export default FormRadioGroup
