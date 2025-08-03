'use client'

import Button from '@/app/components/button/Button'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useGetAccounts } from '@/app/hooks/api/account.hook'
import { useAddAccountRole, useEditAccountRole, useGetAccountRoles } from '@/app/hooks/api/account.role.hook'
import { useGetRoles } from '@/app/hooks/api/role.hook'
import useLoading from '@/app/hooks/useLoading'
import { useToast } from '@/app/hooks/useToast'
import { AccountType } from '@/app/types'
import { AccountRoleType } from '@/app/types/account-role'
import { RoleType } from '@/app/types/role.type'
import { SectionTitleStyled } from '@/styles/common.styles'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, BoxProps, Grid, styled } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { object, string } from 'yup'

const SectionContainerStyled = styled(Box)<BoxProps>({
   width: '100%',
   marginBottom: '40px'
})

interface AddEditProps {
   data?: AccountRoleType
}

const AddEdit = (props: AddEditProps) => {
   const { data } = props

   const router = useRouter()
   const toast = useToast()
   const queryClient = useQueryClient()
   const { setLoading } = useLoading()

   const [accountRoleTypes, setAccountRoleTypes] = useState<AccountRoleType[]>([])
   const [roles, setRoles] = useState<RoleType[]>([])
   const [accounts, setAccounts] = useState<AccountType[]>([])

   const { mutate: addAccountRole } = useAddAccountRole()
   const { mutate: editAccountRole } = useEditAccountRole()

   const { data: accountRoleResponse } = useGetAccountRoles({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: 1
   })
   const { data: accountResponse } = useGetAccounts({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: 1
   })
   const { data: roleResponse } = useGetRoles({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: 1
   })

   useEffect(() => {
      setAccountRoleTypes((accountRoleResponse?.data as AccountRoleType[]) || [])
      setAccounts((accountResponse?.data as AccountType[]) || [])
      setRoles((roleResponse?.data as RoleType[]) || [])
   }, [accountRoleResponse?.data, accountResponse?.data, roleResponse?.data])

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
            accountId: data?.account?.id,
            roleId: data?.role?.id
         }
         : {
            accountId: '',
            roleId: ''
         },
      mode: 'onChange',
      resolver: yupResolver(
         object({
            accountId: string().required('Account name is required'),
            roleId: string().required('role is required'),

         })
      )
   })

   const onSubmit = (payload: Record<string, any>) => {
      console.log("Payload: ", payload)
      setLoading(true)
      if (data) {
         editAccountRole(
            { ...payload, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.ACCOUNT_ROLE.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     toast.success('Successfully updated account-role')
                     router.replace(PAGE_ROUTES.ADMIN.ACCOUNT_ROLE.INDEX)
                  }
               },
               onError: async () => {
                  toast.error('Error while account-role')
               }
            }
         )
      } else {
         addAccountRole(
            { ...payload },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(API_ROUTES.ACCOUNT_ROLE.INDEX)

                  if (res?.id) {
                     toast.success('Successfully created a new account-role')

                     router.replace(PAGE_ROUTES.ADMIN.ACCOUNT_ROLE.INDEX)
                  }
               },
               onError: async () => {
                  toast.error('Error while creating account-role')
               }
            }
         )
      }
      setLoading(false)
   }

   return (
      <>
         <Box
            component={'form'}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            onInvalid={console.log}
         >
            <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
               <Grid size={6}>
                  <SectionContainerStyled>
                     <Box
                        sx={{
                           borderBottom: '1px solid #c7c7c7',
                           width: '100%'
                        }}
                     >
                        <SectionTitleStyled>Information</SectionTitleStyled>
                     </Box>
                     <Box sx={{ width: '100%' }}>
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 12, sm: 9 }}>
                              <Controller
                                 name="accountId"
                                 control={control}
                                 render={({ field: { value, onChange } }) => {
                                    return (
                                       <FormAutocomplete
                                          error={errors.accountId}
                                          label="Account"
                                          getOptionLabel={(option: AccountType) => {
                                             if (option?.id) {
                                                return `${option.email || ''}`
                                             }
                                             return ''
                                          }}
                                          onChange={(value: any) => {
                                             onChange(value?.id)
                                          }}
                                          options={accounts}
                                          placeholder="Select account"
                                          value={
                                             accounts.find(
                                                (account: AccountType) =>
                                                   account.id === value
                                             ) || null
                                          }
                                          sx={{ marginTop: '24px' }}
                                       />
                                    )
                                 }}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 9 }}>
                              <Controller
                                 name="roleId"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormAutocomplete
                                       error={errors.roleId}
                                       label="Role *"
                                       getOptionLabel={(option: RoleType) => {
                                          if (option?.id) {
                                             return `${option.name || ''}`
                                          }

                                          return ''
                                       }}
                                       onChange={(value: any) => {
                                          onChange(value?.id)
                                       }}
                                       options={roles}
                                       placeholder="Select role type"
                                       value={
                                          roles.find(
                                             (role: RoleType) =>
                                                role.id === value
                                          ) || null
                                       }
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                        </Grid>
                     </Box>
                  </SectionContainerStyled>
                  <Grid container size={{ xs: 12, sm: 2 }}>
                     <Button
                        size="small"
                        sx={{ width: '100%' }}
                        title="Submit"
                        type="submit"
                     />
                  </Grid>
               </Grid>
            </Grid>
         </Box>
      </>
   )
}

export default AddEdit
