import Button from '@/app/components/button/Button'
import Checkbox from '@/app/components/checkbox/Checkbox'
import Dialog from '@/app/components/dialog/Dialog'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import FormDatePicker from '@/app/components/form/FormDatePicker'
import FormLabel from '@/app/components/form/FormLabel'
import HelpText from '@/app/components/text/HelpText'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useGetProjectRoles, useGetStaffs } from '@/app/hooks/api'
import { StaffType } from '@/app/types'
import {
   ProjectAssignmentType,
   ProjectRoleType
} from '@/app/types/project.type'
import { getFullname } from '@/app/utils/name.util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, BoxProps, Grid, List, ListItem, styled } from '@mui/material'
import { startOfToday } from 'date-fns'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { v4 } from 'uuid'
import { array, date, object, string } from 'yup'

const SectionContainerStyled = styled(Box)<BoxProps>({
   width: '100%',
   marginBottom: '40px'
})

const workloadOptions = Array.from({ length: 21 }, (_, i) => {
   const decimal = (i * 0.05).toFixed(2)

   return {
      label: `${(parseFloat(decimal) * 100).toFixed(0)}%`,
      value: decimal
   }
})

const defaultValues = {
   endDate: null,
   roleId: [],
   staffId: '',
   startDate: startOfToday(),
   workload: '1.00'
}

const AddEdit = ({
   open,
   onClose,
   onChange,
   data
}: {
   open: boolean
   data?: ProjectAssignmentType | null
   onClose?: () => void
   onChange?: (
      staffAssignment: Omit<
         ProjectAssignmentType,
         'createdAt' | 'updatedAt' | 'projectId'
      >
   ) => void
}) => {
   const isDisabled = Boolean(data)

   const [staffs, setStaffs] = useState<StaffType[]>([])
   const [projectRoles, setProjectRoles] = useState<ProjectRoleType[]>([])

   const { data: staffResponse } = useGetStaffs({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: DEFAULT_PAGINATION.page + 1
   })
   const { data: projectRoleResponse } = useGetProjectRoles({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: DEFAULT_PAGINATION.page + 1
   })

   useEffect(() => {
      setStaffs((staffResponse?.data as StaffType[]) || [])
      setProjectRoles((projectRoleResponse?.data as ProjectRoleType[]) || [])
   }, [staffResponse?.data, projectRoleResponse?.data])

   const {
      control,
      watch,
      getValues,
      reset,
      formState: { errors }
   } = useForm({
      defaultValues: defaultValues,
      mode: 'onChange',
      resolver: yupResolver(
         object({
            staffId: string().required('Staff is required'),
            roleId: array()
               .required('Role date is required')
               .min(1, 'Role is required')
               .of(string().required('Role is required')),
            workload: string().required('Workload is required'),
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

   useEffect(() => {
      if (open && data) {
         reset({
            staffId: data.staffId,
            roleId: Array.isArray(data.roleId) ? data.roleId : [data.roleId],
            workload: data.workload?.toFixed(2) ?? '0.00',
            startDate:
               data?.startDate instanceof Date
                  ? data.startDate
                  : data?.startDate
                     ? new Date(data.startDate)
                     : startOfToday(),
            endDate:
               data?.endDate instanceof Date
                  ? data.endDate
                  : data?.endDate
                     ? new Date(data.endDate)
                     : null
         })
      } else if (open) {
         reset(defaultValues)
      }
   }, [open, data, reset])

   const selectedRoleIds = watch('roleId') || []
   const selectedRoles = projectRoles.filter((role) =>
      selectedRoleIds.includes(role.id.toString())
   )

   const handleSubmit = async () => {
      const payload = getValues()

      if (payload) {
         onChange?.({
            id: v4(),
            staffId: payload.staffId,
            roleId: payload.roleId,
            workload: parseFloat(payload.workload),
            startDate: payload.startDate,
            endDate: payload.endDate
         })
      }

      onClose?.()
   }

   return (
      <Dialog title="Add a member" open={open} onClose={onClose}>
         <Box>
            <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
               <Grid size={7}>
                  <SectionContainerStyled>
                     <Box sx={{ width: '100%' }}>
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 12, sm: 8 }}>
                              <Controller
                                 name="staffId"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormAutocomplete
                                       error={errors.staffId}
                                       label="Select staff *"
                                       getOptionLabel={(option: StaffType) => {
                                          if (option?.id) {
                                             const fullName = getFullname(
                                                option.account,
                                                'vi-VN'
                                             )
                                             const email =
                                                option.account?.email?.trim()

                                             return `${fullName} - ${email}`
                                          }

                                          return ''
                                       }}
                                       onChange={(value: any) => {
                                          onChange(value?.id)
                                       }}
                                       options={staffs}
                                       placeholder="Enter staff name or email"
                                       value={
                                          staffs.find(
                                             (staff: StaffType) =>
                                                staff.id === value
                                          ) || null
                                       }
                                       disabled={isDisabled}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="workload"
                                 control={control}
                                 render={({
                                    field: { value, onChange },
                                    fieldState: { error }
                                 }) => (
                                    <FormAutocomplete
                                       error={errors.staffId}
                                       label="Workload *"
                                       onChange={(value: any) => {
                                          onChange(value?.value)
                                       }}
                                       options={workloadOptions}
                                       placeholder="Select workload"
                                       value={
                                          workloadOptions.find(
                                             (option: {
                                                label: string
                                                value: string
                                             }) => option.value === value
                                          ) || null
                                       }
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
                              name="roleId"
                              control={control}
                              render={({ field: { value, onChange } }) => {
                                 const checkedValues = Array.isArray(value)
                                    ? value
                                    : []

                                 return (
                                    <Box>
                                       <FormLabel>Select roles *</FormLabel>
                                       <Box style={{ padding: '2px' }}>
                                          <List
                                             sx={{
                                                maxHeight: 200,
                                                overflow: 'auto',
                                                border: '1px solid grey',
                                                borderRadius: '4px'
                                             }}
                                          >
                                             {projectRoles.map((role) => (
                                                <ListItem
                                                   key={role.id}
                                                   sx={{
                                                      padding: '4px 8px',
                                                      display: 'flex',
                                                      alignItems: 'center'
                                                   }}
                                                >
                                                   <Checkbox
                                                      size="small"
                                                      checked={checkedValues.includes(
                                                         String(role.id)
                                                      )}
                                                      onChange={() => {
                                                         const id = String(
                                                            role.id
                                                         )
                                                         if (
                                                            checkedValues.includes(
                                                               id
                                                            )
                                                         ) {
                                                            onChange(
                                                               checkedValues.filter(
                                                                  (val) =>
                                                                     val !== id
                                                               )
                                                            )
                                                         } else {
                                                            onChange([
                                                               ...checkedValues,
                                                               id
                                                            ])
                                                         }
                                                      }}
                                                      sx={{ marginRight: 1 }}
                                                   />
                                                   {role.name}
                                                </ListItem>
                                             ))}
                                          </List>
                                       </Box>
                                    </Box>
                                 )
                              }}
                           />
                           {errors.roleId !== undefined && (
                              <HelpText>
                                 {errors.roleId.message?.toString()}
                              </HelpText>
                           )}
                        </Grid>
                     </Box>
                  </SectionContainerStyled>
                  <SectionContainerStyled>
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
                                 />
                              )}
                           />
                        </Grid>
                     </Grid>
                  </SectionContainerStyled>
               </Grid>
               <Grid size={5}>
                  <SectionContainerStyled>
                     <Box sx={{ width: '100%' }}>
                        <FormLabel>Role description</FormLabel>
                        <Box>
                           {selectedRoles.length === 0 ? (
                              <p>Choose roles to see their descriptions...</p>
                           ) : (
                              selectedRoles.map((role) => (
                                 <Box key={role.id} sx={{ mb: 2 }}>
                                    <strong>{role.name}</strong>
                                    <p style={{ marginTop: '4px' }}>
                                       {role.description ||
                                          'No description available'}
                                    </p>
                                 </Box>
                              ))
                           )}
                        </Box>
                     </Box>
                  </SectionContainerStyled>
               </Grid>
            </Grid>
            <Box
               sx={{
                  borderTop: '1px solid grey',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingBottom: '10px',
                  paddingTop: '20px'
               }}
            >
               <Button title="Submit" onClick={handleSubmit} />
            </Box>
         </Box>
      </Dialog>
   )
}

export default AddEdit
