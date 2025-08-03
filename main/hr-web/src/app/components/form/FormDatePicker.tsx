import { CalendarOutlined } from '@ant-design/icons'
import {
   alpha,
   Box,
   BoxProps,
   FormLabel,
   IconButton,
   InputProps,
   styled
} from '@mui/material'
import {
   DatePicker as MuiDatePicker,
   DatePickerProps as MuiDatePickerProps
} from '@mui/x-date-pickers/DatePicker'
import { Dayjs } from 'dayjs'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

const FormStyled = styled(Box)<BoxProps>({})

type FormDatePickerProps = MuiDatePickerProps & {
   error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
   label?: string
   onChange?: InputProps['onChange']
   value: Dayjs | null
}

const FormDatePicker: React.FC<FormDatePickerProps> = (
   props: FormDatePickerProps
) => {
   const {
      error,
      label = 'Label',
      value,
      onChange,
      minDate,
      maxDate,
      ...restProps
   } = props

   return (
      <FormStyled sx={restProps ? { ...restProps.sx } : undefined}>
         <FormLabel sx={{ display: 'block', fontSize: '14px' }}>
            {label}
         </FormLabel>
         <MuiDatePicker
            {...props}
            value={value}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            slotProps={{
               textField: {
                  fullWidth: true,
                  label: null,
                  size: 'small',
                  variant: 'outlined',
                  helperText: (error as FieldError | undefined)?.message,
                  sx: (theme) => {
                     return {
                        fontSize: '14px',
                        padding: '2px',
                        '& .MuiOutlinedInput-root': {
                           marginTop: '6px',
                           paddingRight: '4px',
                           '& .MuiOutlinedInput-input': {
                              width: 'initial',
                              flexGrow: '1',
                              fontSize: '14px',
                              padding: '10px 8px 10px 12px'
                           },
                           '&:hover': {
                              '& fieldset': {
                                 borderColor: theme.palette.primary.main,
                                 borderWidth: '1px !important'
                              }
                           }
                        },
                        '& .Mui-focused': {
                           boxShadow: `${alpha(theme.palette.primary.main, 0.2)} 0px 0px 0px 2px;`,

                           '& fieldset': {
                              borderWidth: '1px !important'
                           }
                        },
                        '& .MuiFormHelperText-root': {
                           border: 'none',
                           boxShadow: 'none !important',
                           color: theme.palette.error.main,
                           fontStyle: 'italic',
                           outline: 'none'
                        }
                     }
                  }
               },
               inputAdornment: {
                  sx: () => {
                     return {
                        width: 32
                     }
                  }
               }
            }}
            slots={{
               openPickerButton: (params) => {
                  return (
                     <IconButton
                        {...params}
                        sx={{
                           borderRadius: '4px',
                           height: 32,
                           width: 32
                        }}
                     >
                        <CalendarOutlined style={{ fontSize: '16px' }} />
                     </IconButton>
                  )
               }
            }}
         />
      </FormStyled>
   )
}

export default FormDatePicker
