import Button from '@/app/components/button/Button'
import FormInput from '@/app/components/form/FormInput'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { useAddSkill, useEditSkill } from '@/app/hooks/api'
import { useUpload } from '@/app/hooks/api/file.storage.hook'
import { useToast } from '@/app/hooks/useToast'
import { FileStorageType, SkillType } from '@/app/types'
import {
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'
import { FileImageOutlined, UploadOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar, Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { object, string } from 'yup'

interface AddEditProps {
   data?: SkillType
}

const AddEdit = (props: AddEditProps) => {
   const router = useRouter()
   const toast = useToast()
   const queryClient = useQueryClient()

   const { data } = props

   const { mutate: addSkill } = useAddSkill()
   const { mutate: editSkill } = useEditSkill()
   const { mutateAsync: uploadThumbnail } = useUpload()

   const [selectedFile, setSelectedFile] = useState()
   const fileInputRef = useRef<HTMLInputElement | null>(null)
   const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

   useEffect(() => {
      if (data?.thumbnail?.path) {
         setThumbnailUrl(`http://localhost:3001/${data?.thumbnail?.path}`)
      } else {
         setThumbnailUrl(null)
      }
   }, [data?.thumbnail?.path])

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
      let thumbnailId: string | null | undefined = ''

      if (selectedFile) {
         const formData = new FormData()
         formData.append('context', 'skill/thumbnail')
         formData.append('file', selectedFile)

         const uploadResponse: FileStorageType = await uploadThumbnail(formData)
         if (uploadResponse?.id) {
            await queryClient.invalidateQueries(
               `${API_ROUTES.FILE_STORAGE.UPLOAD}`
            )

            thumbnailId = uploadResponse.id
         } else {
            toast.error('Error while uploading skill thumbnail')
         }
      }

      if (data) {
         editSkill(
            { ...payload, thumbnailId, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.SKILL.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     toast.success('Successfully updated skill')

                     router.replace(PAGE_ROUTES.ADMIN.SKILL.INDEX)
                  }
               },
               onError: async (err) => {
                  toast.error('Error while updating skill')
               }
            }
         )
      } else {
         addSkill(
            { ...payload, thumbnailId },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(API_ROUTES.SKILL.INDEX)

                  if (res?.id) {
                     toast.success(`Successfully created a new skill: ${payload.name}`)

                     router.replace(PAGE_ROUTES.ADMIN.SKILL.INDEX)
                  }
               },
               onError: async (err) => {
                  toast.error('Error while creating skill')
               }
            }
         )
      }
   }

   const handleThumbnailSelected = (event: any) => {
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0]
         if (file.size > 5 * 1024 * 1024) {
            toast.error('The user avatar size must be smaller 5MB')

            return
         }

         setSelectedFile(file)

         const imageUrl = URL.createObjectURL(file)
         setThumbnailUrl(imageUrl)

         if (fileInputRef.current) {
            fileInputRef.current.value = ''
         }
      }
   }

   const handleClickUpload = async () => {
      fileInputRef.current?.click()
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
               <Grid size={7}>
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
               </Grid>
               <Grid
                  size={5}
                  sx={{
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center'
                  }}
               >
                  <Box
                     sx={{
                        backgroundColor: '#e6f7ff',
                        border: commonTheme.border,
                        display: 'flex',
                        height: '200px',
                        justifyContent: 'center',
                        marginTop: '24px',
                        padding: '12px',
                        width: '200px'
                     }}
                  >
                     {thumbnailUrl ? (
                        <Avatar
                           src={thumbnailUrl}
                           sx={{ width: '100%', height: '100%' }}
                        />
                     ) : (
                        <FileImageOutlined
                           style={{ fontSize: '120px', color: '#1890ff' }}
                        />
                     )}
                  </Box>
                  <Typography
                     accept="image/*"
                     component={'input'}
                     onChange={handleThumbnailSelected}
                     ref={fileInputRef}
                     style={{ display: 'none' }}
                     type="file"
                  />
                  <Button
                     sx={{ marginTop: '16px' }}
                     onClick={handleClickUpload}
                     startIcon={<UploadOutlined />}
                     title="Thumbnail"
                  />
               </Grid>
               <Grid container size={{ xs: 12, sm: 1 }}>
                  <Button
                     size="small"
                     sx={{ width: '100%' }}
                     title="Submit"
                     type="submit"
                  />
               </Grid>
            </Grid>
         </Box>
      </>
   )
}

export default AddEdit
