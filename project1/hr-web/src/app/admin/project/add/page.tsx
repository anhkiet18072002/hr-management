'use client'

import { commonTheme } from '@/app/configs/theme.config'
import { Box, BoxProps, styled } from '@mui/material'
import AddEdit from '../AddEdit'

const ContainerStyled = styled(Box)<BoxProps>(({}) => ({
   backgroundColor: 'white',
   padding: commonTheme.space?.padding?.container,
   border: commonTheme.border,
   borderRadius: commonTheme.borderRadius
}))

const Page = () => {
   return (
      <ContainerStyled>
         <AddEdit />
      </ContainerStyled>
   )
}

export default Page
