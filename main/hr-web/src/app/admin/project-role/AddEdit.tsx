import Button from '@/app/components/button/Button'
import FormInput from '@/app/components/form/FormInput'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { useAddProjectRole, useEditProjectRole } from '@/app/hooks/api'
import { useToast } from '@/app/hooks/useToast'
import { ProjectRoleType } from '@/app/types/project.type'
import {
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { object, string } from 'yup'

interface AddEditProps {
   data?: ProjectRoleType
}

const AddEdit = (props: AddEditProps) => {
   const router = useRouter()
   const toast = useToast()
   const queryClient = useQueryClient()

   const { data } = props

   const { mutate: addProjectRole } = useAddProjectRole()
   const { mutate: editProjectRole } = useEditProjectRole()

   const [loading, setLoading] = useState(false)

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
              name: data.name,
              description: data.description
           }
         : {
              name: '',
              description: ''
           },
      mode: 'onChange',
      resolver: yupResolver(
         object().shape({
            name: string().required('Name is required'),
            description: string().optional()
         })
      )
   })

   const onSubmit = async (payload: Record<string, any>) => {
      if (data) {
         editProjectRole(
            { ...payload, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.PROJECT_ROLE.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     toast.success(
                        `Successfully update project role: ${payload.name}`
                     )

                     router.replace(PAGE_ROUTES.ADMIN.PROJECT.ROLE.INDEX)
                  }
               },
               onError: async (err) => {
                  toast.error(
                     `Error while updating project role: ${payload.name}`
                  )
               }
            }
         )
      } else {
         addProjectRole(payload, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(
                  API_ROUTES.PROJECT_ROLE.INDEX
               )

               if (res?.id) {
                  toast.success(
                     `Successfully add new project role: ${payload.name}`
                  )

                  router.replace(PAGE_ROUTES.ADMIN.PROJECT.ROLE.INDEX)
               }
            },
            onError: async (err) => {
               toast.error(`Error while adding project role: ${payload.name}`)
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
