'use client'

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import {
   alpha,
   IconButton,
   InputAdornment,
   TextField as MuiTextField,
   TextFieldProps as MuiTextFieldProps,
   styled,
   useTheme
} from '@mui/material'
import { useState } from 'react'
import { FieldError } from 'react-hook-form'

const MuiTextFieldStyled = styled(MuiTextField)<MuiTextFieldProps>(({
   theme
}) => {
   return {
      fontSize: '14px',
      width: '100%',
      padding: '2px',
      '& .MuiInputBase-root': {
         padding: '0px'
      },
      '& .MuiOutlinedInput-root': {
         marginTop: '6px',
         paddingRight: '4px',
         '& .MuiOutlinedInput-input': {
            fontSize: '14px',
            padding: '10px 8px 10px 12px'
         },
         '& .Mui-error': {
            '& fieldset': {
               borderColor: '#d32f2f'
            }
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
      }
   }
})

type TextFieldProps = MuiTextFieldProps & {
   errors?: FieldError | undefined
}

const TextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
   const { type, errors, slotProps, ...restProps } = props

   const theme = useTheme()

   const [isReveal, setIsReveal] = useState(false)

   return (
      <>
         <MuiTextFieldStyled
            {...restProps}
            {...(errors && { helperText: errors.message })}
            error={errors?.message !== undefined && errors?.message !== null}
            type={type === 'password' ? (isReveal ? 'text' : 'password') : type}
            slotProps={{
               input: {
                  autoComplete: 'off',
                  endAdornment:
                     type === 'password' ? (
                        <InputAdornment position="end">
                           <IconButton
                              sx={{
                                 borderRadius: '4px',
                                 height: 32,
                                 width: 32
                              }}
                              onClick={() => setIsReveal(!isReveal)}
                           >
                              {isReveal === true ? (
                                 <EyeInvisibleOutlined
                                    style={{ fontSize: '16px' }}
                                 />
                              ) : (
                                 <EyeOutlined style={{ fontSize: '16px' }} />
                              )}
                           </IconButton>
                        </InputAdornment>
                     ) : undefined,
                  ...slotProps?.input
               },
               htmlInput: {
                  autoComplete: 'off'
               },
               formHelperText: {
                  sx: {
                     border: 'none',
                     boxShadow: 'none !important',
                     color: theme.palette.error.main,
                     fontStyle: 'italic',
                     outline: 'none'
                  }
               }
            }}
         />
      </>
   )
}

export default TextField
