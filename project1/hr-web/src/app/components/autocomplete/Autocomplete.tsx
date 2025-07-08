import {
   alpha,
   AutocompleteRenderInputParams,
   Autocomplete as MuiAutocomplete,
   AutocompleteProps as MuiAutocompleteProps,
   styled,
   TextField,
   TextFieldProps
} from '@mui/material'

const TextFieldStyled = styled(TextField)<TextFieldProps>(({ theme }) => {
   return {
      fontSize: '14px',
      width: '100%',
      padding: '2px',
      '& .MuiInputBase-root': {
         padding: '0px'
      },
      '& .MuiOutlinedInput-root': {
         marginTop: '6px',
         paddingTop: '7.5px !important',
         paddingBottom: '7.5px !important',
         '& .MuiOutlinedInput-input': {
            fontSize: '14px',
            paddingLeft: '4px !important'
         },
         '& .MuiAutocomplete-endAdornment': {
            right: '6px'
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

type MuiAutocompleteExcludedProps = 'small' | 'renderInput'

type AutocompleteProps = Omit<
   MuiAutocompleteProps<
      any,
      boolean | undefined,
      boolean | undefined,
      boolean | undefined
   >,
   MuiAutocompleteExcludedProps
> & {
   error?: any
   placeholder?: string
}

const Autocomplete: React.FC<AutocompleteProps> = (props: AutocompleteProps) => {
   const { placeholder = 'Select', error, ...restProps } = props

   return (
      <MuiAutocomplete
         {...restProps}
         size="small"
         renderInput={(params: AutocompleteRenderInputParams) => (
            <TextFieldStyled
               {...params}
               placeholder={placeholder}
               {...(error && { helperText: error?.message })}
               slotProps={{
                  formHelperText: {
                     sx: (theme) => {
                        return {
                           border: 'none',
                           boxShadow: 'none !important',
                           color: theme.palette.error.main,
                           fontStyle: 'italic',
                           outline: 'none'
                        }
                     }
                  }
               }}
            />
         )}
         clearOnBlur={false}
         slotProps={{
            popupIndicator: {
               sx: () => {
                  return {
                     borderRadius: '4px',
                     height: 32,
                     width: 32
                  }
               }
            },
            paper: {
               sx: () => {
                  return {
                     fontSize: '14px'
                  }
               }
            }
         }}
      />
   )
}

export default Autocomplete
