import { Theme as MuiTheme } from '@mui/material'

export type Theme = MuiTheme & {
   space?: {
      padding?: {
         container?: string
      }
      form?: {
         horizontal?: number | string
         vertical?: number | string
      }
   }
   border?: string
   borderRadius?: string
}
