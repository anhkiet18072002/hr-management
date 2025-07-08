'use client'

import Button from '@/app/components/button/Button'
import FormInput from '@/app/components/form/FormInput'
import { useAuth } from '@/app/hooks/useAuth'
import { useToast } from '@/app/hooks/useToast'
import { getCommonSchema } from '@/app/utils/schema.util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Card, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { object } from 'yup'
import React from 'react'

const Page = () => {
   const { login } = useAuth()
   const toast = useToast()

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({
      defaultValues: {
         email: 'admin@nexlesoft.com',
         password: 'Apple123@'
      },
      mode: 'onChange',
      resolver: yupResolver(
         object().shape({
            email: getCommonSchema('email'),
            password: getCommonSchema('password')
         })
      )
   })

   const onSubmit = (data: any) => {
      login({ ...data }, (err: any) => {
         console.log(err)

         toast.error(
            'Email or password is incorrect. Try again or click "Forgot Password" to reset your password.'
         )
      })
   }

   return (
      <Box
         sx={{
            backgroundColor: '#fafafb',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
         }}
      >
         <Card elevation={1} sx={{ padding: '40px', width: '476px' }}>
            <Box>
               <Typography
                  variant="h3"
                  sx={{ fontSize: '24px', fontWeight: '600' }}
               >
                  Login
               </Typography>
               <Box>
                  <Box
                     component={'form'}
                     noValidate
                     autoComplete="off"
                     onSubmit={handleSubmit(onSubmit)}
                     onInvalid={console.log}
                  >
                     <Controller
                        name="email"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                           <FormInput
                              error={errors.email}
                              label={'Email address'}
                              type="email"
                              value={value}
                              onChange={onChange}
                              sx={{ marginTop: '24px' }}
                           />
                        )}
                     />
                     <Controller
                        name="password"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                           <FormInput
                              error={errors.password}
                              label={'Password'}
                              type="password"
                              value={value}
                              onChange={onChange}
                              sx={{ marginTop: '24px' }}
                           />
                        )}
                     />
                     <Button
                        sx={{ width: '100%', marginTop: '24px' }}
                        title="Login"
                        type="submit"
                     >
                        Login
                     </Button>
                  </Box>
               </Box>
            </Box>
         </Card>
      </Box>
   )
}

export default Page
