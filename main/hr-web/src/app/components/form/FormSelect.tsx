import {
   Box,
   BoxProps,
   FormControl,
   FormHelperText,
   FormLabel,
   MenuItem,
   Select,
   SelectChangeEvent,
   styled
} from '@mui/material'
import React from 'react'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

const FormStyled = styled(Box)<BoxProps>({})

type FormSelectProps = BoxProps & {
   error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
   label?: string
   value?: string | number
   onChange?: (event: SelectChangeEvent<string>) => void
   options: { label: string; value: string }[] // Đây là mảng các lựa chọn trong dropdown
   placeholder: string
}
const FormSelect: React.FC<FormSelectProps> = (props) => {
   const {
      error,
      label = 'Label',
      value = '',
      onChange,
      options,
      placeholder,
      ...restProps
   } = props

   return (
      <FormStyled {...restProps}>
         {/* Hiển thị Label cho FormSelect */}
         <FormLabel
            sx={{ display: 'block', fontSize: '14px', paddingBottom: '7px' }}
         >
            {label}
         </FormLabel>

         {/* FormControl để nhóm Select và InputLabel */}
         <FormControl fullWidth error={!!error}>
            <Select
               value={value !== undefined ? String(value) : ''}
               onChange={onChange} // Hàm `onChange` sẽ nhận đối tượng sự kiện kiểu `SelectChangeEvent<string>`
               size="small"
               displayEmpty
               renderValue={(selected) => {
                  if (!selected) {
                     return (
                        <span
                           style={{
                              color: 'rgba(0, 0, 0, 0.38)',
                              fontSize: '14px'
                           }}
                        >
                           {placeholder}
                        </span>
                     ) // Tạo hiệu ứng mờ cho placeholder
                  }
                  return selected
               }}
            >
               {/* Mỗi MenuItem đại diện cho một lựa chọn trong mảng options */}
               {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                     {option.label}
                  </MenuItem>
               ))}
            </Select>
            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
               <FormHelperText sx={{ fontSize: '12px' }}>
                  {typeof error.message === 'string' ? error.message : 'Error'}
               </FormHelperText>
            )}
         </FormControl>
      </FormStyled>
   )
}

export default FormSelect
