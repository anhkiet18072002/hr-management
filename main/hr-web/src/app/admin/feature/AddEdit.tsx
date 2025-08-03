import Button from '@/app/components/button/Button'
import FormInput from '@/app/components/form/FormInput'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useAddFeature, useEditFeature } from '@/app/hooks/api/feature.hook'
import { roleClient } from '@/app/hooks/api/role.api'
import { useGetRoles } from '@/app/hooks/api/role.hook'
import { useToast } from '@/app/hooks/useToast'
import { FeatureType } from '@/app/types/feature.type'
import { RoleType } from '@/app/types/role.type'
import {
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'
import { yupResolver } from '@hookform/resolvers/yup'
import {
   Box,
   Grid
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { array, object, string } from 'yup'
import { PermissionType } from '@/app/types/permission.type'
import { useGetPermissions } from '@/app/hooks/api/permission.hook'
import RolePermissionList from './rolepermissionlist/RolePermissionList'
import useLoading from '@/app/hooks/useLoading'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'

interface AddEditProps {
   data?: FeatureType
}

const roleAssignmentSchema = object().shape({
   roleId: string().required('RoleId is required.'),
   permissionId: array().of(string().required('Permission is required.'))
})

const AddEdit = (props: AddEditProps) => {
   const router = useRouter()
   const toast = useToast()

   const queryClient = useQueryClient()
   const { setLoading } = useLoading()
   const { data } = props

   const { mutate: addFeature } = useAddFeature()
   const { mutate: editFeature } = useEditFeature()

   const [roles, setRoles] = useState<RoleType[]>([])
   const [permissions, setPermissions] = useState<PermissionType[]>([])
   const [selectedRole, setSelectedRole] = useState<RoleType | null>(null)
   
   const { data: roleResponse } = useGetRoles({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: DEFAULT_PAGINATION.page + 1
   })

   const { data: permissionResponse } = useGetPermissions({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: DEFAULT_PAGINATION.page + 1
   })
   const groupPermissions = (
      raw: { role?: { id: string }; permission?: { id: string } }[] = []
   ): { roleId: string; permissionId: string[] }[] => {
      const grouped = raw.reduce(
         (acc, curr) => {
            const roleId = curr.role?.id
            const permissionId = curr.permission?.id

            if (!roleId || !permissionId) return acc

            if (!acc[roleId]) {
               acc[roleId] = {
                  roleId,
                  permissionId: [permissionId]
               }
            } else {
               acc[roleId].permissionId = Array.from(
                  new Set([...acc[roleId].permissionId, permissionId])
               )
            }

            return acc
         },
         {} as Record<string, { roleId: string; permissionId: string[] }>
      )

      return Object.values(grouped)
   }

   useEffect(() => {
      setRoles((roleResponse?.data as RoleType[]) || [])
      setPermissions((permissionResponse?.data as PermissionType[]) || [])
   }, [roleResponse?.data, permissionResponse?.data])

   const {
      control,
      handleSubmit,
      reset,
      watch,
      setValue,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
            name: data.name,
            description: data.description,
            roleFeaturePermissions: []
         }
         : {
            name: '',
            description: '',
            roleFeaturePermissions: []
         },
      mode: 'onChange',
      resolver: yupResolver(
         object().shape({
            name: string().required('Name is required.'),
            description: string().optional(),
            roleFeaturePermissions: array().of(roleAssignmentSchema).optional()
         })
      )
   })

   const [isReset, setIsReset] = useState(false)

   useEffect(() => {
      if (!data?.roleFeaturePermissions || isReset) return

      const grouped = groupPermissions(data.roleFeaturePermissions)
      reset({
         name: data.name,
         description: data.description,
         roleFeaturePermissions: grouped
      })
      setIsReset(true)
   }, [data, reset, isReset])

   const { append, remove } = useFieldArray({
      control,
      name: 'roleFeaturePermissions'
   })
   const dataProp = watch('roleFeaturePermissions') ?? []
   const onSubmit = async (payload: Record<string, any>) => {
      setLoading(true)
      const fullPayload =
         payload.roleFeaturePermissions.length < 1
            ? {
               ...payload,
               roleFeaturePermissions: undefined
            }
            : {
               ...payload
            }
      if (data) {
         editFeature(
            { ...fullPayload, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.FEATURE.INDEX}/${data.id}`
                  )
                  if (res?.id) {
                     toast.success(
                        `Successfully updated feature: ${payload.name}`)
                     router.replace(PAGE_ROUTES.ADMIN.FEATURE.INDEX)
                  }
               },
               onError: async (err) => {
                  toast.error('Error while updating feature.')
               }
            }
         )
      } else {
         addFeature(fullPayload, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(API_ROUTES.FEATURE.INDEX)

               if (res?.id) {
                  toast.success(
                     `Successfully created a new feature: ${payload.name}`
                  )

                  router.replace(PAGE_ROUTES.ADMIN.FEATURE.INDEX)
               }
            },
            onError: async (err) => {
               toast.error('Error while creating feature.')
            }
         })
      }
      setLoading(false)
   }

   const toggleRole = async (
      roleId: string,
      value: any[]
   ) => {
      const index = value.findIndex((item) => item.roleId === roleId)
      if (index !== -1) {
         // Nếu đã chọn role, bỏ chọn
         remove(index)
      } else {
         try {
            // Nếu chưa chọn role, thêm vào danh sách
            const res = await roleClient.findOne(roleId)
            const permissions =
               res?.roleFeaturePermissions?.map((p) => p.permissionId) || []
            append({
               roleId,
               permissionId: permissions
            })
         } catch (err) {
            toast.error('Unable to get list permissions')
         }
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
                           <Grid size={{ xs: 12 }}>
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
                        </Grid>
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 12 }}>
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
                  <SectionContainerStyled>
                     <Box sx={{ width: '100%' }}>
                        <Grid size={{ xs: 12 }}>
                           <Controller
                              name="roleFeaturePermissions"
                              control={control}
                              render={({ field: { value = [], onChange } }) => (
                                 <FormAutocomplete
                                    label="Select roles"
                                    key={`role-autocomplete-${value.length}`}
                                    getOptionLabel={(option: RoleType) => {
                                       if (option.id) {
                                          return option.name
                                       }
                                       return ''
                                    }}
                                    onChange={(role: RoleType | null) => {
                                       if (role?.id) {
                                          toggleRole(role.id, value)
                                       }
                                       setSelectedRole(null)
                                    }}
                                    options={roles.filter(
                                       (role) => Array.isArray(value) && !value.some((item: any) => item.roleId === role.id)
                                    )}
                                    placeholder="Select role *"
                                    value={selectedRole}
                                    sx={{ marginTop: '24px' }}
                                 />
                              )} 
                           />
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
               <Grid size={7}>
                  <Box sx={{ width: '100%' }}>
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
                           <SectionTitleStyled>
                              Role Permission
                           </SectionTitleStyled>
                        </Box>
                     </Grid>
                     <Grid container>
                        <Box
                           sx={{
                              paddingTop: '20px',
                              width: '100%'
                           }}
                        >
                           <RolePermissionList
                              control={control}
                              roleSet={roles}
                              onRemove={(roleIndex) => {
                                 remove(roleIndex)
                              }}
                              setValue={setValue}
                              data={dataProp}
                              permissions={permissions}
                              roles={roles}
                           />
                        </Box>
                     </Grid>
                  </Box>
               </Grid>
            </Grid>
         </Box>
      </>
   )
}

export default AddEdit
