import Checkbox from '@/app/components/checkbox/Checkbox'
import { FormControlLabel } from '@mui/material'
import React from 'react'

type FormCheckboxProps = {
   label?: string
   value: boolean
   onChange?: (
      event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean
   ) => void
}

const FormCheckbox: React.FC<FormCheckboxProps> = (props) => {
   const { label, onChange, value } = props

   return (
      <FormControlLabel
         control={<Checkbox onChange={onChange} checked={value} />}
         label={label || 'Checkbox'}
         slotProps={{
            typography: {
               fontSize: '14px'
            }
         }}
      />
   )
}

export default FormCheckbox
