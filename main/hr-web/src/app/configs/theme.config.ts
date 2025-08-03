'use client'

import { Theme } from '@/app/types/theme.type'
import { createTheme, Theme as MuiTheme } from '@mui/material'

const theme: MuiTheme = createTheme({
   cssVariables: true,
   palette: {
      primary: {
         main: '#1677ff'
      },
      secondary: {
         main: '#19857b'
      },
      error: {
         main: '#ff4d4f'
      },
      divider: '#f0f0f0',
      text: {
         primary: '#262626'
      }
   }
})

const commonTheme: Theme = {
   ...theme,
   space: {
      padding: {
         container: '20px'
      },
      form: {
         horizontal: 2
      }
   },
   border: `1px solid ${theme.palette.divider}`,
   borderRadius: '4px'
}

export { commonTheme }
export default theme
