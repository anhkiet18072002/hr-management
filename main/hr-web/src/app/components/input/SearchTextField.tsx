import IconButton from '@/app/components/button/IconButton'
import TextField from '@/app/components/input/TextField'
import { SearchOutlined } from '@ant-design/icons'
import { InputAdornment } from '@mui/material'
import { ChangeEvent } from 'react'

type SearchTextFieldProps = {
   placeholder?: string
   onChange?: (value: string | undefined) => void
}

const SearchTextField: React.FC<SearchTextFieldProps> = ({
   placeholder,
   onChange
}: SearchTextFieldProps) => {
   return (
      <TextField
         placeholder={placeholder || 'Search'}
         slotProps={{
            input: {
               endAdornment: (
                  <InputAdornment position="end">
                     <IconButton width={32} height={32} onClick={() => { }}>
                        <SearchOutlined style={{ fontSize: '14px' }} />
                     </IconButton>
                  </InputAdornment>
               )
            }
         }}
         onChange={(
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
         ) => {
            const inputValue = event.currentTarget.value
            onChange?.(inputValue)
         }}
         sx={{
            '& .MuiOutlinedInput-root': {
               marginTop: '0px'
            },
            maxWidth: '276px'
         }}
      />
   )
}

export default SearchTextField
