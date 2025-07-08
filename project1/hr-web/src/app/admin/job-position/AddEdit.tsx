import Button from '@/app/components/button/Button'
import FormInput from '@/app/components/form/FormInput'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import {
   useAddJobPosition,
   useEditJobPosition
} from '@/app/hooks/api/job.position.hook'
import { JobPositionType } from '@/app/types/job.types'
import {
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { object, string } from 'yup'

interface AddEditProps {
   data?: JobPositionType
}

const AddEdit = (props: AddEditProps) => {
   const router = useRouter()
   const queryClient = useQueryClient()

   const { data } = props

   const { mutate: addJobPosition } = useAddJobPosition()
   const { mutate: editJobPosition } = useEditJobPosition()

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
              name: data.name,
              description: data.description || '',
              shortName: data.shortName || '',
              specification: data.specification || ''
           }
         : {
              name: '',
              description: '',
              specification: '',
              shortName: ''
           },
      mode: 'onChange',
      resolver: yupResolver(
         object().shape({
            name: string().required('Job position name is required'),
            description: string().optional(),
            shortName: string().optional(),
            specification: string().optional()
         })
      )
   })

   const onSubmit = (payload: Record<string, any>) => {
      if (data) {
         editJobPosition(
            { ...payload, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.JOB_POSITION.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     router.replace(PAGE_ROUTES.ADMIN.JOB_POSITION.INDEX)
                  }
               },
               onError: async (err) => {
                  // Show toast
               }
            }
         )
      } else {
         addJobPosition(payload, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(
                  API_ROUTES.JOB_POSITION.INDEX
               )

               if (res?.id) {
                  router.replace(PAGE_ROUTES.ADMIN.JOB_POSITION.INDEX)
               }
            },
            onError: async (err) => {
               // Show toast
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
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="shortName"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.shortName}
                                       label={'Short name (optional)'}
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
                                 name="specification"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.specification}
                                       label={'Specification (optional)'}
                                       type="text"
                                       multiline
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
                  <Grid container size={{ xs: 12, sm: 1 }}>
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
