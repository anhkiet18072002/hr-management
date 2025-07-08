'use client'

import Button from '@/app/components/button/Button'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import FormDatePicker from '@/app/components/form/FormDatePicker'
import FormInput from '@/app/components/form/FormInput'
import FormTimePicker from '@/app/components/form/FormTimePicker'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useGetStaffs } from '@/app/hooks/api'
import {
   useAddLeaveAssignment,
   useEditLeaveAssignment
} from '@/app/hooks/api/leave.assignment.hook'
import { useGetLeaves } from '@/app/hooks/api/leave.hook'
import { useToast } from '@/app/hooks/useToast'
import { LeaveAssignmentType } from '@/app/types/leave.assignment.type'
import { LeaveType } from '@/app/types/leave.type'
import { StaffType } from '@/app/types/staff.type'
import { getFullname } from '@/app/utils/name.util'
import { SectionTitleStyled } from '@/styles/common.styles'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, BoxProps, Grid, styled } from '@mui/material'
import { parseISO, startOfDay } from 'date-fns'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { date, number, object, string } from 'yup'

const SectionContainerStyled = styled(Box)<BoxProps>({
   width: '100%',
   marginBottom: '40px'
})

interface AddEditProps {
   data?: LeaveAssignmentType
}

const AddEdit = (props: AddEditProps) => {
   const { data } = props
   const isDisabled = Boolean(data)

   const router = useRouter()
   const toast = useToast()
   const queryClient = useQueryClient()

   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])

   const [staffs, setStaffs] = useState<StaffType[]>([])

   const { mutate: addLeaveAssignment } = useAddLeaveAssignment()
   const { mutate: editLeaveAssignment } = useEditLeaveAssignment()

   const { data: staffResponse } = useGetStaffs({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: 1
   })

   const { data: leaveResponse } = useGetLeaves({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: 1
   })

   useEffect(() => {
      setStaffs((staffResponse?.data as StaffType[]) || [])
      setLeaveTypes((leaveResponse?.data as LeaveType[]) || [])
   }, [staffResponse?.data, leaveResponse?.data])

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
            date: data?.startDate
               ? parseISO(data.startDate as string)
               : new Date(),
            duration: data?.duration ? Number(data.duration) : 0,
            reason: data?.reason,
            staffId: data?.staff ? data.staff.id : '',
            time: data?.startDate
               ? parseISO(data.startDate as string)
               : new Date(),
            typeId: data?.type?.id
         }
         : {
            date: new Date(),
            duration: 0,
            reason: '',
            staffId: '',
            time: new Date(new Date().setHours(8, 30)),
            typeId: ''
         },
      mode: 'onChange',
      resolver: yupResolver(
         object({
            staffId: string().required('Staff name is required'),
            date: date()
               .typeError('Date is invalid')
               .required('Date is required'),
            time: date()
               .typeError('Time is invalid')
               .required('Time is required'),
            typeId: string().required('Leave type is required'),
            duration: number()
               .transform((value, originalValue) =>
                  originalValue === '' ? undefined : value
               )
               .required('Duration is required')
               .min(0.125, 'Duration must be greater than or equal 0.125')
               .max(40, 'Duration must be less than or equal 40'),
            reason: string().optional()
         })
      )
   })

   const onSubmit = (payload: Record<string, any>) => {
      const date = startOfDay(payload.date as Date)
      const time = payload.time as Date

      let startDate = new Date(date.setHours(time.getHours()))
      startDate = new Date(startDate.setMinutes(time.getMinutes()))

      if (data) {
         editLeaveAssignment(
            {
               ...payload,
               id: data.id,
               startDate,
               time: undefined,
               date: undefined
            },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.LEAVE_ASSIGNMENT.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     toast.success(`Successfully updated leave assignment`)

                     router.replace(PAGE_ROUTES.ADMIN.LEAVE.INDEX)
                  }
               },
               onError: async (err: any) => {
                  toast.error(err)
               }
            }
         )
      } else {
         addLeaveAssignment(
            { ...payload, startDate, time: undefined, date: undefined },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     API_ROUTES.LEAVE_ASSIGNMENT.INDEX
                  )

                  if (res?.id) {
                     toast.success(`Successfully added leave assignment`)

                     router.replace(PAGE_ROUTES.ADMIN.LEAVE.INDEX)
                  }
               },
               onError: async (err: any) => {
                  toast.error(err)
               }
            }
         )
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
                           <Grid size={{ xs: 12, sm: 7 }}>
                              <Controller
                                 name="staffId"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormAutocomplete
                                       error={errors.staffId}
                                       label="Staff"
                                       getOptionLabel={(option: StaffType) => {
                                          if (option?.id) {
                                             return `${getFullname(
                                                option.account,
                                                'vi-VN'
                                             )
                                                .replace(/\s+/g, ' ')
                                                .trim()} - ${option.account?.email || ''}`
                                          }

                                          return ''
                                       }}
                                       onChange={(value: any) => {
                                          onChange(value?.id)
                                       }}
                                       options={staffs}
                                       placeholder="Select staff"
                                       value={
                                          staffs.find(
                                             (staff: StaffType) =>
                                                staff.id === value
                                          ) || null
                                       }
                                       sx={{ marginTop: '24px' }}
                                       disabled={isDisabled}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 5 }}>
                              <Controller
                                 name="typeId"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormAutocomplete
                                       error={errors.typeId}
                                       label="Type *"
                                       getOptionLabel={(option: LeaveType) => {
                                          if (option?.id) {
                                             return `${option.name}`
                                          }

                                          return ''
                                       }}
                                       onChange={(value: any) => {
                                          onChange(value?.id)
                                       }}
                                       options={leaveTypes}
                                       placeholder="Select leave type"
                                       value={
                                          leaveTypes.find(
                                             (leave: LeaveType) =>
                                                leave.id === value
                                          ) || null
                                       }
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12 }}>
                              <Controller
                                 name="reason"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.reason}
                                       label={'Reason (optional)'}
                                       multiline
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
                                 name="date"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormDatePicker
                                       error={errors.date}
                                       label={'Date *'}
                                       value={value ? dayjs(value) : null}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="time"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormTimePicker
                                       error={errors.time}
                                       label={'Time *'}
                                       value={value ? dayjs(value) : null}
                                       onChange={onChange}
                                       sx={{ marginTop: '24px' }}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid size={{ xs: 12, sm: 4 }}>
                              <Controller
                                 name="duration"
                                 control={control}
                                 render={({ field: { value, onChange } }) => (
                                    <FormInput
                                       error={errors.duration}
                                       label={'Duration (hour) *'}
                                       type="number"
                                       value={value ? value.toString() : ''}
                                       onChange={onChange}
                                       placeholder="Enter duration"
                                       sx={{
                                          marginTop: '24px',
                                          '& input[type=number]': {
                                             MozAppearance: 'textfield'
                                          },
                                          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                                          {
                                             WebkitAppearance: 'none',
                                             margin: 0
                                          }
                                       }}
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
