'use client'

import AddEditMember from '@/app/admin/project/member/AddEdit'
import MemberList from '@/app/admin/project/member/MemberList'
import Button from '@/app/components/button/Button'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import FormDatePicker from '@/app/components/form/FormDatePicker'
import FormInput from '@/app/components/form/FormInput'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useAddProject, useEditProject } from '@/app/hooks/api/project.hook'
import { useGetProjectTypes } from '@/app/hooks/api/project.type.hook'
import { useGetProjectPriceTypes } from '@/app/hooks/api/projectprice.type.hook'
import { useToast } from '@/app/hooks/useToast'
import {
   ProjectAssignmentType,
   ProjectPriorityEnum,
   ProjectStatusEnum,
   ProjectType,
   ProjectTypeType
} from '@/app/types/project.type'
import { ProjectPriceType } from '@/app/types/projectprice.type'
import { toSentenceCase } from '@/app/utils/string.util'
import { PlusOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import {
   Box,
   BoxProps,
   Grid,
   styled,
   Typography,
   TypographyProps
} from '@mui/material'
import { parseISO } from 'date-fns'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { array, date, number, object, string } from 'yup'

const SectionTitleStyled = styled(Typography)<TypographyProps>({
   color: commonTheme.palette.text.primary,
   fontWeight: '600',
   fontSize: '16px',
   lineHeight: '24px',
   paddingBottom: '12px'
})

const SectionContainerStyled = styled(Box)<BoxProps>({
   width: '100%',
   marginBottom: '40px'
})

interface AddEditProps {
   data?: ProjectType
}

const PriorityOptions = Object.values(ProjectPriorityEnum).map(
   (value: string) => ({ label: toSentenceCase(value), value: value })
)

const StatusOptions = Object.values(ProjectStatusEnum).map((value: string) => ({
   label: toSentenceCase(value),
   value: value
}))

const projectAssignmentSchema = object().shape({
   staffId: string().required('Staff is required'),
   roleId: array().of(string().required('role of staff is required')),
   workload: number()
      .required('workload of staff is required')
      .typeError('workload must be a number'),
   startDate: date().required('Start date is required'),
   endDate: date().required('End date is required')
})

const AddEdit = (props: AddEditProps) => {
   const { data } = props

   const router = useRouter()
   const toast = useToast()

   const queryClient = useQueryClient()

   const [types, setTypes] = useState<ProjectTypeType[]>([])
   const [priceTypes, setPriceTypes] = useState<ProjectPriceType[]>([])

   const [isAddingMember, setIsAddingMember] = useState(false)
   const [isEditingMember, setIsEditingMember] = useState<
      ProjectAssignmentType | undefined
   >()

   const [staffAssignments, setStaffAssignments] = useState<any[]>([])

   const { mutate: addProject } = useAddProject()
   const { mutate: editProject } = useEditProject()

   const { data: projectPriceTypeResponse } = useGetProjectPriceTypes({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: 1
   })

   const { data: projectTypeResponse } = useGetProjectTypes({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: 1
   })

   useEffect(() => {
      if (!data?.projectAssignments) return

      const grouped = data.projectAssignments.reduce(
         (acc, curr) => {
            const key = curr.staffId

            if (!acc[key]) {
               acc[key] = {
                  id: curr.id,
                  staffId: curr.staffId,
                  workload: curr.workload,
                  startDate: curr.startDate
                     ? new Date(curr.startDate)
                     : undefined,
                  endDate: curr.endDate ? new Date(curr.endDate) : undefined,
                  roleId: Array.isArray(curr.roleId)
                     ? curr.roleId
                     : [curr.roleId]
               }
            } else {
               const existingRoles = acc[key].roleId || []
               const newRoles = Array.isArray(curr.roleId)
                  ? curr.roleId
                  : [curr.roleId]
               acc[key].roleId = Array.from(
                  new Set([...existingRoles, ...newRoles])
               ) // loại bỏ trùng lặp
            }

            return acc
         },
         {} as Record<string, any>
      )

      setStaffAssignments(Object.values(grouped))
   }, [data])

   useEffect(() => {
      setTypes((projectTypeResponse?.data as ProjectTypeType[]) || [])
      setPriceTypes(
         (projectPriceTypeResponse?.data as ProjectPriceType[]) || []
      )
   }, [projectTypeResponse, projectPriceTypeResponse])

   const handleMemberChanged = (
      projectAssignment: Omit<
         ProjectAssignmentType,
         'createdAt' | 'updatedAt' | 'projectId'
      >
   ) => {
      let updatedAssignments = [...staffAssignments]

      // Replace the existing assignment if it exists
      if (
         staffAssignments.some(
            (assignment) => assignment.staffId === projectAssignment.staffId
         )
      ) {
         updatedAssignments = staffAssignments.filter(
            (assignment) => assignment.staffId !== projectAssignment.staffId
         )
         setStaffAssignments([...updatedAssignments, projectAssignment])

         return
      }

      setStaffAssignments([...updatedAssignments, projectAssignment])
   }

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
            name: data.name,
            description: data.description,
            priority: data.priority,
            status: data.status,
            typeId: data.type.id,
            priceTypeId: data.priceType.id,
            startDate: data?.startDate
               ? parseISO(data?.startDate as string)
               : new Date(),
            endDate: data?.endDate
               ? parseISO(data?.endDate as string)
               : undefined
         }
         : {
            name: '',
            description: '',
            priority: '',
            status: ProjectStatusEnum.ACTIVE,
            typeId: '',
            priceTypeId: '',
            projectAssignments: [],
            startDate: new Date(),
            endDate: undefined
         },
      mode: 'onChange',
      resolver: yupResolver(
         object({
            name: string().required('Name is required'),
            description: string().optional(),
            priority: string().optional(),
            status: string()
               .oneOf(Object.values(ProjectStatusEnum), 'Invalid status')
               .required('Status is required'),
            typeId: string().required('Type is required'),
            priceTypeId: string().optional(),
            projectAssignments: array().of(projectAssignmentSchema).optional(),
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

   const onSubmit = (payload: Record<string, any>) => {
      const fullPayload =
         staffAssignments.length < 1
            ? {
               ...payload,
               projectAssignments: undefined // Loại bỏ projectAssignments khỏi payload
            }
            : {
               ...payload,
               projectAssignments: staffAssignments
            }

      if (data) {
         editProject(
            { ...fullPayload, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.PROJECT.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     toast.success(
                        `Successfully update project: ${payload.name}`
                     )

                     router.replace(PAGE_ROUTES.ADMIN.PROJECT.INDEX)
                  }
               },
               onError: async () => {
                  toast.error(`Error while updating project: ${payload.name}`)
               }
            }
         )
      } else {
         addProject(fullPayload, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(API_ROUTES.PROJECT.INDEX)

               if (res?.id) {
                  toast.show(`Successfully adding new project: ${payload.name}`)

                  router.replace(PAGE_ROUTES.ADMIN.PROJECT.INDEX)
               }
            },
            onError: async () => {
               toast.error(`Error while adding project: ${payload.name}`)
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
                        </Grid>
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
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
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
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="typeId"
                                 control={control}
                                 render={({
                                    field: { value, onChange },
                                 }) => (
                                    <FormAutocomplete
                                       error={errors.typeId}
                                       label="Type"
                                       getOptionLabel={(option) => option.name}
                                       onChange={(value: any) => {
                                          onChange(value?.id)
                                       }}
                                       options={types}
                                       placeholder="Select Type"
                                       value={
                                          types.find(
                                             (type) => type.id === value
                                          ) || null
                                       }
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="priceTypeId"
                                 control={control}
                                 render={({
                                    field: { value, onChange },
                                 }) => (
                                    <FormAutocomplete
                                       error={errors.priceTypeId}
                                       label="Price Type"
                                       getOptionLabel={(option) => option.name}
                                       onChange={(value: any) => {
                                          onChange(value?.id)
                                       }}
                                       options={priceTypes}
                                       placeholder="Select Price Type"
                                       value={
                                          priceTypes.find(
                                             (option) => option.id === value
                                          ) || null
                                       }
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
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="priority"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormAutocomplete
                                       error={errors.priority}
                                       label="Priority"
                                       getOptionLabel={(option) => option.label}
                                       onChange={(option: any) => {
                                          onChange(option?.value)
                                       }}
                                       options={PriorityOptions}
                                       placeholder="Select Priority"
                                       value={
                                          PriorityOptions.find(
                                             (option) => option.value === value
                                          ) || null
                                       }
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                 name="status"
                                 control={control}
                                 render={({
                                    field: { value, onChange },
                                 }) => (
                                    <FormAutocomplete
                                       error={errors.status}
                                       label="Status"
                                       getOptionLabel={(option) => option.label}
                                       onChange={(option: any) => {
                                          onChange(option?.value)
                                       }}
                                       options={StatusOptions}
                                       placeholder="Select Status"
                                       value={
                                          StatusOptions.find(
                                             (option) => option.value === value
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
                           <SectionTitleStyled>Team</SectionTitleStyled>
                           <Button
                              onClick={() => {
                                 setIsAddingMember(true)
                              }}
                              startIcon={
                                 <PlusOutlined style={{ fontSize: '14px' }} />
                              }
                              size="tiny"
                              title="Add"
                           />
                        </Box>
                     </Grid>
                     <Grid container>
                        <Box
                           sx={{
                              paddingTop: '20px',
                              width: '100%'
                           }}
                        >
                           <MemberList
                              data={staffAssignments}
                              onChange={(updatedAssignments) =>
                                 setStaffAssignments(updatedAssignments)
                              }
                              onEdit={(
                                 projectAssignment?: ProjectAssignmentType
                              ) => {
                                 setIsEditingMember(projectAssignment)
                              }}
                           />
                        </Box>
                     </Grid>
                  </Box>
               </Grid>
            </Grid>
         </Box>
         <AddEditMember
            onChange={handleMemberChanged}
            open={isAddingMember || isEditingMember !== undefined}
            onClose={() => {
               setIsAddingMember(false)
               setIsEditingMember(undefined)
            }}
            data={isEditingMember}
         />
      </>
   )
}

export default AddEdit
