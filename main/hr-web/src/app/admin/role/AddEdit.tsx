'use client'
import Button from '@/app/components/button/Button'
import FormInput from '@/app/components/form/FormInput'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { useAddRole, useEditRole } from '@/app/hooks/api/role.hook'
import { useToast } from '@/app/hooks/useToast'
import { RoleType } from '@/app/types/role.type'
import {
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'
import { PlusOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { array, object, string } from 'yup'
import AddPermission from './AddPermission'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { PermissionType } from '@/app/types/permission.type'
import { useGetPermissions } from '@/app/hooks/api/permission.hook'

interface AddEditProps {
   data?: RoleType
}

const AddEdit = (props: AddEditProps) => {
   const { data } = props
   console.log(data)

   const toast = useToast()

   const router = useRouter()
   const queryClient = useQueryClient()

   const [permissionSet, setPermissionSet] = useState<PermissionType[]>([])

   const { mutate: addRole } = useAddRole()
   const { mutate: editRole } = useEditRole()

   const permissionAssignmentSchema = object().shape({
      permissionId: string().required('permissionId is required')
   })

   const { data: permissionResponse } = useGetPermissions({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: DEFAULT_PAGINATION.page + 1
   })

   useEffect(() => {
      setPermissionSet((permissionResponse?.data as PermissionType[]) || [])
   }, [permissionResponse?.data])

   const {
      control,
      handleSubmit,
      setValue,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
              name: data.name,
              key: data.key,
              description: data?.description,
              roleFeaturePermissions: data?.roleFeaturePermissions
           }
         : {
              name: '',
              key: '',
              description: '',
              roleFeaturePermissions: []
           },
      mode: 'onChange',
      resolver: yupResolver(
         object({
            name: string().required('Role name is required'),
            key: string()
               .required('Key is required')
               .matches(/^[A-Z_.]+$/, {
                  message:
                     'Only uppercase letters A-Z, underscore (_) and dot (.) are allowed'
               }),
            description: string().optional(),
            roleFeaturePermissions: array()
               .of(permissionAssignmentSchema)
               .optional()
         })
      )
   })

   const onSubmit = (payload: Record<string, any>) => {
      const update_payload =
         payload.roleFeaturePermissions.length < 1
            ? { ...payload, roleFeaturePermissions: undefined }
            : { ...payload }

      console.log(update_payload)
      if (data) {
         editRole(
            { ...update_payload, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.ROLE.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     toast.success(`Successfully update role: ${payload.name}`)

                     router.replace(PAGE_ROUTES.ADMIN.ROLE.INDEX)
                  }
               },
               onError: async (err) => {
                  toast.error(`Error while updating role: ${payload.name}`)
               }
            }
         )
      } else {
         addRole(update_payload, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(API_ROUTES.ROLE.INDEX)

               if (res?.id) {
                  toast.success(`Successfully added new role: ${payload.name}`)

                  router.replace(PAGE_ROUTES.ADMIN.ROLE.INDEX)
               }
            },
            onError: async (err) => {
               toast.show(`Error while adding new role: ${payload.name}`)
            }
         })
      }
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
               <Grid size={5}>
                  <SectionContainerStyled>
                     <Box sx={{ width: '100%' }}>
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Box
                              sx={{
                                 borderBottom: '1px solid #c7c7c7',
                                 width: '100%'
                              }}
                           >
                              <SectionTitleStyled>
                                 Information
                              </SectionTitleStyled>
                           </Box>
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="name"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.name}
                                       label={'Name *'}
                                       type="text"
                                       value={value}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="key"
                                 control={control}
                                 render={({
                                    field: { value, onChange },
                                    fieldState: { error }
                                 }) => (
                                    <FormInput
                                       error={errors.key}
                                       label={'Key *'}
                                       type="text"
                                       value={value}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                        </Grid>
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 6, sm: 12 }}>
                              <Controller
                                 name="description"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.description}
                                       label={'Description (optional)'}
                                       multiline
                                       type="text"
                                       value={value}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                        </Grid>
                     </Box>
                  </SectionContainerStyled>
                  <Grid container size={{ xs: 12, sm: 2 }}>
                     <Button size="small" title="Submit" type="submit" />
                  </Grid>
               </Grid>
               <Grid size={7}>
                  <Grid
                     container
                     columnSpacing={commonTheme.space?.form?.horizontal}
                  >
                     <Box
                        sx={{
                           borderBottom: '1px solid #c7c7c7',
                           width: '100%',
                           display: 'flex',
                           justifyContent: 'space-between'
                        }}
                     >
                        <SectionTitleStyled>Permission</SectionTitleStyled>
                     </Box>

                     <AddPermission
                        control={control}
                        errors={errors.roleFeaturePermissions}
                        permissionSet={permissionSet}
                     />
                  </Grid>
               </Grid>
            </Grid>
         </Box>
      </>
   )
}

export default AddEdit
