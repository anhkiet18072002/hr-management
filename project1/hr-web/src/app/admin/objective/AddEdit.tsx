import Button from '@/app/components/button/Button'
import FormInput from '@/app/components/form/FormInput'
import { commonTheme } from '@/app/configs/theme.config'
import { useToast } from '@/app/hooks/useToast'
import { keyResultType, ObjectiveType } from '@/app/types/objective.type'
import {
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'
import { PlusOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { date, object, string } from 'yup'
import dayjs from 'dayjs'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import {
   useAddObjective,
   useEditObjective
} from '@/app/hooks/api/objective.hook'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { v4 } from 'uuid'
import { parseISO } from 'date-fns'
import FormDatePicker from '@/app/components/form/FormDatePicker'
import AddEditKey from './child/AddEdit'
import KeyList from './child/ChildList'
import { StaffType } from '@/app/types'
import { useGetStaffs } from '@/app/hooks/api'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import { getFullname } from '@/app/utils/name.util'
import useLoading from '@/app/hooks/useLoading'

interface AddEditProps {
   data?: ObjectiveType
}

const AddEdit = (props: AddEditProps) => {
   const router = useRouter()
   const toast = useToast()
   const queryClient = useQueryClient()
   const { setLoading } = useLoading()

   const searchParams = useSearchParams()
   const returnUrl =
      searchParams.get('returnUrl') || PAGE_ROUTES.ADMIN.OBJECTIVE.INDEX

   const staffId = searchParams.get('staffId')
   const isDisabled = Boolean(staffId)

   console.log('staffID', staffId)

   const { data } = props

   const { mutate: addObjective } = useAddObjective()
   const { mutate: editObjective } = useEditObjective()

   const [staffs, setStaffs] = useState<StaffType[]>([])

   const { data: staffResponse } = useGetStaffs({
      limit: DEFAULT_PAGINATION.pageUnlimitedSize,
      page: 1
   })

   useEffect(() => {
      setStaffs((staffResponse?.data as StaffType[]) || [])
   }, [staffResponse?.data])

   const [isAddingKey, setIsAddingKey] = useState(false)
   const [keyResults, setKeyResults] = useState<any[]>([])

   const [isEditingKey, setIsEditingKey] = useState<keyResultType | undefined>()
   const [TotalOfValueKey, setTotalOfValueKey] = useState<number>(0)

   useEffect(() => {
      if (!data?.keyResults) return

      setKeyResults(data.keyResults)
      let total = 0
      for (const key of data.keyResults) {
         total += key.value
      }
      setTotalOfValueKey(total)
   }, [data])

   const {
      control,
      handleSubmit,
      watch,
      formState: { errors }
   } = useForm({
      defaultValues: data
         ? {
              staffId: data.staff.id,
              name: data.name,
              description: data.description,
              startDate: data?.startDate
                 ? parseISO(data?.startDate as string)
                 : new Date(),
              endDate: data?.endDate ? parseISO(data?.endDate as string) : null
           }
         : {
              staffId: staffId || '',
              name: '',
              description: '',
              startDate: new Date(),
              endDate: null
           },
      mode: 'onChange',
      resolver: yupResolver(
         object().shape({
            staffId: string().required('Staff is required'),
            name: string().required('Name is required'),
            description: string().optional(),
            startDate: date()
               .typeError('Start Date is invalid')
               .required('Start Date is required'),
            endDate: date()
               .typeError('End date is invalid')
               .optional()
               .nullable()
         })
      )
   })

   const startDate = watch('startDate')
   const endDate = watch('endDate')

   const handleKeyChanged = (
      keyResult: Omit<keyResultType, 'createdAt' | 'updatedAt' | 'objectiveId'>
   ) => {
      let updatedKeys = [...keyResults]

      if (keyResults.some((key) => key.id === keyResult.id)) {
         updatedKeys = keyResults.filter((key) => key.id !== keyResult.id)
         setKeyResults([...updatedKeys, keyResult])

         return
      }

      setKeyResults([...updatedKeys, keyResult])
   }

   console.log('TotalOfValueKey', TotalOfValueKey)

   const onSubmit = async (payload: Record<string, any>) => {
      setLoading(true)
      const existingIds = data?.keyResults?.map((kr) => kr.id) || []

      const fullPayload = {
         ...payload,
         progress: 0,
         keyResults:
            keyResults.length > 0
               ? keyResults.map(
                    (kr) =>
                       existingIds.includes(kr.id)
                          ? kr // đã có -> giữ nguyên id
                          : { ...kr, id: undefined } // mới -> xóa id
                 )
               : undefined
      }
      console.log('payload', fullPayload)
      if (data) {
         editObjective(
            { ...fullPayload, id: data.id },
            {
               onSuccess: async (res) => {
                  await queryClient.invalidateQueries(
                     `${API_ROUTES.OBJECTIVE.INDEX}/${data.id}`
                  )

                  if (res?.id) {
                     toast.success('Successfully updated objective')

                     router.replace(PAGE_ROUTES.ADMIN.OBJECTIVE.INDEX)
                  }
               },
               onError: async (err) => {
                  toast.error('Error while updating objective')
               }
            }
         )
      } else {
         addObjective(fullPayload, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(API_ROUTES.OBJECTIVE.INDEX)

               if (res?.id) {
                  toast.success(
                     `Successfully created a new objective: ${payload.name}`
                  )

                  router.replace(returnUrl)
               }
            },
            onError: async (err) => {
               toast.error('Error while creating objective')
            }
         })
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
               <Grid size={5}>
                  <SectionContainerStyled>
                     <Box sx={{ width: '100%' }}>
                        <Box
                           sx={{
                              borderBottom: '1px solid #c7c7c7',
                              width: '100%'
                           }}
                        >
                           <SectionTitleStyled>Staff</SectionTitleStyled>
                        </Box>
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
                                       sx={{ marginTop: '24px', mb: '24px' }}
                                       disabled={isDisabled}
                                    />
                                 )}
                              />
                           </Grid>
                        </Grid>
                        <Box
                           sx={{
                              borderBottom: '1px solid #c7c7c7',
                              width: '100%'
                           }}
                        >
                           <SectionTitleStyled>Objective</SectionTitleStyled>
                        </Box>
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
                                       label={'Description*'}
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
                                       label={'End Date *'}
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
                  <Grid
                     container
                     columnSpacing={commonTheme.space?.form?.horizontal}
                     size={{ xs: 12, sm: 1 }}
                  >
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
                              Objective Key
                           </SectionTitleStyled>
                           <Button
                              onClick={() => {
                                 setIsAddingKey(true)
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
                           <KeyList
                              data={keyResults}
                              onChange={(updatedAssignments) =>
                                 setKeyResults(updatedAssignments)
                              }
                              onEdit={(keyResult?: keyResultType) => {
                                 setIsEditingKey(keyResult)
                              }}
                           />
                        </Box>
                     </Grid>
                  </Box>
               </Grid>
            </Grid>
         </Box>
         <AddEditKey
            onChange={handleKeyChanged}
            open={isAddingKey || isEditingKey !== undefined}
            onClose={() => {
               setIsAddingKey(false)
               setIsEditingKey(undefined)
            }}
            flagValue={TotalOfValueKey}
            setFlagValue={setTotalOfValueKey}
            data={isEditingKey}
            startDate={startDate}
            endDate={endDate}
         />
      </>
   )
}

export default AddEdit
