import { commonTheme } from '@/app/configs/theme.config'
import {
   Box,
   BoxProps,
   styled,
   Typography,
   TypographyProps
} from '@mui/material'

export const ContainerStyled = styled(Box)<BoxProps>(({}) => ({
   backgroundColor: 'white',
   padding: commonTheme.space?.padding?.container,
   border: commonTheme.border,
   borderRadius: commonTheme.borderRadius
}))

export const SectionTitleStyled = styled(Typography)<TypographyProps>({
   color: commonTheme.palette.text.primary,
   fontWeight: '600',
   fontSize: '16px',
   lineHeight: '24px',
   paddingBottom: '12px'
})

export const SectionContainerStyled = styled(Box)<BoxProps>({
   width: '100%',
   marginBottom: '40px'
})
