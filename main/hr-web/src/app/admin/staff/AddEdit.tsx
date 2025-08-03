'use client'

import AddEditSkill from '@/app/admin/staff/AddEditSkill'
import Button from '@/app/components/button/Button'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import FormDatePicker from '@/app/components/form/FormDatePicker'
import FormInput from '@/app/components/form/FormInput'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useAddStaff, useEditStaff, useGetSkills } from '@/app/hooks/api'
import { useUpload } from '@/app/hooks/api/file.storage.hook'
import { useGetJobLevels } from '@/app/hooks/api/job.level.hook'
import { useGetJobPositions } from '@/app/hooks/api/job.position.hook'
import { useGetSkillLevels } from '@/app/hooks/api/skill.level.hook'
import useLoading from '@/app/hooks/useLoading'
import { useToast } from '@/app/hooks/useToast'
import { FileStorageType, SkillLevelType, SkillType } from '@/app/types'
import { JobLevelType, JobPositionType } from '@/app/types/job.types'
import { StaffType } from '@/app/types/staff.type'
import { getCommonSchema } from '@/app/utils/schema.util'
import {
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import {
   Avatar,
   Box,
   Grid,
   IconButton,
   Tooltip,
   Typography
} from '@mui/material'
import { GridPaginationModel } from '@mui/x-data-grid'
import { parseISO } from 'date-fns'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { array, boolean, date, number, object, string } from 'yup'

interface AddEditProps {
   data?: StaffType
}

const skillAssignmentSchema = object().shape({
   skillId: string().required('Skill is required'),
   yearOfExp: number()
      .required('Year of Experience is required')
      .min(0.25, 'Year of Experience must be greater than 0.25')
      .max(25, 'Year of Experience must be less than 25')
      .typeError('Year of Experience must be a number'),
   levelId: string().required('Skill level is required'),
   primary: boolean().optional()
})

const AddEdit = (props: AddEditProps) => {
   const { data } = props

   const router = useRouter()
   const toast = useToast()
   const queryClient = useQueryClient()
   const { setLoading } = useLoading()

   const { mutate: addStaff } = useAddStaff()
   const { mutate: editStaff } = useEditStaff()
   const { mutateAsync: uploadPhoto } = useUpload()

   const [selectedFile, setSelectedFile] = useState()
   const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

   const fileInputRef = useRef<HTMLInputElement | null>(null)

   const [skillSet, setSkillSet] = useState<SkillType[]>([])
   const [skillLevelSet, setSkillLevelSet] = useState<SkillLevelType[]>([])

   const [jobPositions, setJobPosition] = useState<JobPositionType[]>([])
   const [jobLevels, setJobLevels] = useState<JobLevelType[]>([])

   const [paginationModel] = useState<GridPaginationModel>(DEFAULT_PAGINATION)

   const { data: jobPositionResponse } = useGetJobPositions({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: paginationModel.page + 1
   })

   const { data: jobLevelResponse } = useGetJobLevels({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: paginationModel.page + 1
   })

   const { data: skillResponse } = useGetSkills({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: paginationModel.page + 1
   })

   const { data: skillLevelResponse } = useGetSkillLevels({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: paginationModel.page + 1
   })

   useEffect(() => {
      if (data?.avatar?.path) {
         setAvatarUrl(`http://localhost:3001/${data?.avatar?.path}`)
      } else {
         setAvatarUrl(null)
      }
   }, [data?.avatar?.path])

   useEffect(() => {
      setJobPosition((jobPositionResponse?.data as JobPositionType[]) || [])
      setJobLevels((jobLevelResponse?.data as JobLevelType[]) || [])
      setSkillSet((skillResponse?.data as SkillType[]) || [])
      setSkillLevelSet(skillLevelResponse?.data as SkillLevelType[])
   }, [
      jobPositionResponse,
      jobLevelResponse,
      skillResponse,
      skillLevelResponse
   ])

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
            ...data?.account,
            password: '********',
            jobPositionId: data.jobPosition?.id,
            jobLevelId: data.jobLevel?.id,
            startDate: data?.startDate
               ? parseISO(data?.startDate as string)
               : undefined,
            endDate: data?.endDate ? parseISO(data?.endDate as string) : null,
            skillAssignments: data?.skillAssignments
         }
         : {
            email: '',
            endDate: null,
            firstName: '',
            jobPositionId: '',
            jobLevelId: '',
            lastName: '',
            middleName: '',
            password: '',
            skillAssignments: [],
            startDate: new Date(),
            username: ''
         },
      mode: 'onChange',
      resolver: yupResolver(
         object().shape({
            username: string().required('Username is required'),
            firstName: string().required('First name is required'),
            lastName: string().required('Last name is required'),
            middleName: string().optional(),
            email: getCommonSchema('email'),
            password: getCommonSchema('password', data === undefined),
            jobPositionId: string().optional(),
            jobLevelId: string().optional(),
            skillAssignments: array().of(skillAssignmentSchema).optional(),
            startDate: date()
               .typeError('Start date is invalid')
               .required('Start date is required'),
            endDate: date()
               .typeError('End date is invalid')
               .optional()
               .nullable()
         })
      )
   })

   const { fields, append, remove } = useFieldArray({
      control,
      name: 'skillAssignments'
   })

   const onSubmit = async (payload: Record<string, any>) => {
      setLoading(true)

      if (payload.skillAssignments.length === 0) {
         payload.skillAssignments = undefined
      }

      let avatarId: string | null | undefined = ''

      if (selectedFile) {
         const formData = new FormData()
         formData.append('context', 'staff/avatar')
         formData.append('file', selectedFile)

         const uploadResponse: FileStorageType = await uploadPhoto(formData)
         if (uploadResponse?.id) {
            await queryClient.invalidateQueries(
               `${API_ROUTES.FILE_STORAGE.UPLOAD}`
            )

            avatarId = uploadResponse.id
         } else {
            toast.error('Error while uploading staff photo')
         }
      }

      if (data) {
         editStaff(
            { ...payload, avatarId, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.STAFF.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     toast.success('Successfully updated staff')

                     router.replace(PAGE_ROUTES.ADMIN.STAFF.INDEX)
                  }
               },
               onError: async () => {
                  toast.error('Error while updating staff')
               }
            }
         )
      } else {
         addStaff(
            { ...payload, avatarId },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(API_ROUTES.STAFF.INDEX)

                  if (res?.id) {
                     toast.success('Successfully created a new staff')

                     router.replace(PAGE_ROUTES.ADMIN.STAFF.INDEX)
                  }
               },
               onError: async () => {
                  toast.error('Error while creating staff')
               }
            }
         )
      }

      setLoading(false)
   }

   const handlePhotoSelected = (event: any) => {
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0]
         if (file.size > 5 * 1024 * 1024) {
            toast.error('The user avatar size must be smaller 5MB')

            return
         }

         setSelectedFile(file)

         const imageUrl = URL.createObjectURL(file)
         setAvatarUrl(imageUrl)

         if (fileInputRef.current) {
            fileInputRef.current.value = ''
         }
      }
   }

   const handleClickUpload = async () => {
      fileInputRef.current?.click()
   }

   const handleAssignNewSkill = () => {
      append({
         levelId: '',
         primary: false,
         skillId: '',
         yearOfExp: 1
      })
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
               <Grid size={9}>
                  <SectionContainerStyled>
                     <Box
                        sx={{
                           borderBottom: '1px solid #c7c7c7',
                           width: '100%'
                        }}
                     >
                        <SectionTitleStyled>Account</SectionTitleStyled>
                     </Box>
                     <Box sx={{ width: '100%' }}>
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="username"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.username}
                                       label={'Username *'}
                                       type="text"
                                       value={value}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="email"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.email}
                                       label={'Email *'}
                                       type="text"
                                       value={value}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="password"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.password}
                                       label={'Password *'}
                                       type="password"
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
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="firstName"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.firstName}
                                       label={'First name *'}
                                       type="text"
                                       value={value}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="lastName"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.lastName}
                                       label={'Last name *'}
                                       type="text"
                                       value={value}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="middleName"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.middleName}
                                       label={'Middle name'}
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
                                 name="startDate"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormDatePicker
                                       error={errors.startDate}
                                       label={'Start Date *'}
                                       value={value ? dayjs(value) : null}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="endDate"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormDatePicker
                                       error={errors.endDate}
                                       label={'End Date'}
                                       value={value ? dayjs(value) : null}
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
                     <Box
                        sx={{
                           borderBottom: '1px solid #c7c7c7',
                           width: '100%'
                        }}
                     >
                        <SectionTitleStyled>Job Position</SectionTitleStyled>
                     </Box>
                     <Box sx={{ width: '100%' }}>
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="jobPositionId"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormAutocomplete
                                       error={errors.jobPositionId}
                                       label="Job position"
                                       getOptionLabel={(
                                          option: JobPositionType
                                       ) => {
                                          if (option?.id) {
                                             return `${option.name} - ${option.shortName}`
                                          }

                                          return ''
                                       }}
                                       onChange={(value: any) => {
                                          onChange(value?.id)
                                       }}
                                       options={jobPositions}
                                       placeholder="Select Job position"
                                       value={
                                          jobPositions.find(
                                             (jobPosition: JobPositionType) =>
                                                jobPosition.id === value
                                          ) || null
                                       }
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="jobLevelId"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormAutocomplete
                                       error={errors.jobLevelId}
                                       label="Job Level"
                                       getOptionLabel={(
                                          option: JobLevelType
                                       ) => {
                                          if (option?.id) {
                                             return `${option.name}`
                                          }

                                          return ''
                                       }}
                                       onChange={(value: any) => {
                                          onChange(value?.id)
                                       }}
                                       options={jobLevels}
                                       placeholder="Select Job level"
                                       value={
                                          jobLevels.find(
                                             (jobPosition: JobLevelType) =>
                                                jobPosition.id === value
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
                  <SectionContainerStyled>
                     <Box
                        sx={{
                           borderBottom: '1px solid #c7c7c7',
                           width: '100%'
                        }}
                     >
                        <SectionTitleStyled
                           sx={{
                              alignItems: 'center',
                              display: 'flex',
                              justifyContent: 'space-between'
                           }}
                        >
                           <Typography
                              component={'span'}
                              sx={{
                                 color: commonTheme.palette.text.primary,
                                 fontWeight: '600',
                                 fontSize: '16px',
                                 lineHeight: '24px',
                                 borderBottom: ''
                              }}
                           >
                              Skill Set
                           </Typography>
                           <Tooltip title="Add a new skill">
                              <IconButton
                                 onClick={handleAssignNewSkill}
                                 color="primary"
                                 sx={{
                                    border: '1px solid #c7c7c7',
                                    width: '38px',
                                    height: '38px'
                                 }}
                              >
                                 <AddIcon />
                              </IconButton>
                           </Tooltip>
                        </SectionTitleStyled>
                     </Box>
                     <Box sx={{ marginTop: '24px' }}>
                        {/* Render danh sách skill */}
                        {fields.map((skillAssignment, index) => (
                           <AddEditSkill
                              control={control}
                              data={skillAssignment}
                              errors={errors.skillAssignments?.[index]}
                              key={skillAssignment.id}
                              name={`skillAssignments[${index}]`}
                              skillLevelSet={skillLevelSet}
                              skillSet={skillSet}
                              onRemove={(skillIndex) => {
                                 remove(skillIndex)
                              }}
                           />
                        ))}
                     </Box>
                  </SectionContainerStyled>
               </Grid>
               <Grid
                  size={3}
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
                        borderRadius: '50%',
                        display: 'flex',
                        height: '200px',
                        justifyContent: 'center',
                        marginTop: '24px',
                        width: '200px'
                     }}
                  >
                     {avatarUrl ? (
                        <Avatar
                           src={avatarUrl}
                           sx={{ width: '100%', height: '100%' }}
                        />
                     ) : (
                        <UserOutlined
                           style={{ fontSize: '120px', color: '#1890ff' }}
                        />
                     )}
                  </Box>
                  <Typography
                     accept="image/*"
                     component={'input'}
                     onChange={handlePhotoSelected}
                     ref={fileInputRef}
                     style={{ display: 'none' }}
                     type="file"
                  />
                  <Button
                     onClick={handleClickUpload}
                     startIcon={<UploadOutlined />}
                     sx={{ marginTop: '16px' }}
                     title="Upload Photo"
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
