import Dialog from '@/app/components/dialog/Dialog'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import FormDatePicker from '@/app/components/form/FormDatePicker'
import FormInput from '@/app/components/form/FormInput'
import { commonTheme } from '@/app/configs/theme.config'
import { Box, Grid } from '@mui/material'
import React, { use, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Button from '@/app/components/button/Button'
import { startOfToday } from 'date-fns'
import { yupResolver } from '@hookform/resolvers/yup'
import { date, mixed, number, object, string } from 'yup'
import { v4 } from 'uuid'
import { KeyResultEnum, keyResultType } from '@/app/types/objective.type'
import { toSentenceCase } from '@/app/utils/string.util'
import FormRadioGroup from '@/app/components/form/FormRatioButton'
import dayjs from 'dayjs'

const defaultValues = {
   name: '',
   type: KeyResultEnum.NUMBER,
   deadline: new Date(),
   value: 0,
   numberData: {
      target: 0
   },
   percentData: {
      targetPercent: 0
   }
}

const numberDataSchema = object().shape({
   target: number().required('Target is required')
})

const percentDataSchema = object().shape({
   targetPercent: number()
      .required('Target Percent is required')
      .min(0, 'Must be >= 0')
      .max(1, 'Must be <= 1')
})

const AddEditKey = ({
   open,
   onClose,
   onChange,
   data,
   flagValue,
   setFlagValue,
   startDate,
   endDate
}: {
   open: boolean
   flagValue: number
   setFlagValue?: (newValue: number) => void
   data?: keyResultType | null
   onClose?: () => void
   onChange?: (keyResult: keyResultType) => void
   startDate?: Date
   endDate?: Date | null
}) => {
   const {
      control,
      getValues,
      reset,
      watch,
      setError,
      clearErrors,
      formState: { errors }
   } = useForm({
      defaultValues: defaultValues,
      mode: 'onChange',
      resolver: yupResolver(
         object({
            name: string().required('Name of Key Result is required'),

            type: string()
               .oneOf(Object.values(KeyResultEnum), 'Invalid status')
               .required('Status is required'),
            deadline: date()
               .typeError('Start date is invalid')
               .required('Start date is required'),
            value: number()
               .required('value of key is required')
               .typeError('value must be a number'),
            numberData: numberDataSchema.optional(),
            percentData: percentDataSchema.optional()
         })
      )
   })

   const localFlagRef = useRef(0)

   useEffect(() => {
      if (!open) return

      if (data) {
         localFlagRef.current = flagValue - data.value
         reset({
            name: data.name,
            type: data.type,
            value: data.value,
            deadline:
               data.deadline instanceof Date
                  ? data.deadline
                  : data.deadline
                    ? new Date(data.deadline)
                    : startDate,
            numberData: data.numberData,
            percentData: data.percentData
         })
      } else {
         reset({ ...defaultValues, deadline: startDate })
         localFlagRef.current = flagValue
      }

      console.log('Flag before submit:', localFlagRef.current.toFixed(2))
   }, [open, data, flagValue, reset])

   const typeOptions = Object.values(KeyResultEnum).map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(), // Tùy biến hiển thị
      value: key
   }))

   const percentOption = Array.from({ length: 11 }, (_, i) => {
      const decimal = Number((i * 0.1).toFixed(2))
      return {
         label: `${(decimal * 100).toFixed(0)}%`,
         value: decimal
      }
   })

   const TypeValueWatch = watch('type') || ''

   const handleSubmit = async () => {
      const payload = getValues()

      const nextTotal =
         Math.round((localFlagRef.current + payload.value) * 100) / 100

      console.log('Flag after add:', nextTotal.toFixed(2))

      if (nextTotal > 1) {
         setError('value', {
            type: 'manual',
            message: 'Total value must not exceed 1'
         })
         return
      }

      clearErrors('value')
      localFlagRef.current = nextTotal // Cập nhật lại flag
      setFlagValue?.(nextTotal)

      const baseData = {
         id: data?.id || v4(),
         name: payload.name,
         type: payload.type,
         value: payload.value,
         deadline: payload.deadline
      }

      let finalData: any = { ...baseData }

      if (payload.type === 'NUMBER') {
         finalData.numberData = {
            target: payload.numberData?.target ?? 0
         }
      } else if (payload.type === 'PERCENT') {
         finalData.percentData = {
            targetPercent: payload.percentData?.targetPercent ?? 0
         }
      }

      onChange?.(finalData)
      onClose?.()
   }

   return (
      <Dialog title="Add a Objective key" open={open} onClose={onClose}>
         <Box sx={{ width: '100%' }}>
            <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
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
            <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
               <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                     name="type"
                     control={control}
                     render={({ field }) => (
                        <FormRadioGroup
                           label="Type"
                           value={field.value}
                           onChange={field.onChange}
                           options={typeOptions}
                           error={errors.type}
                           row={false}
                           sx={{ marginTop: '24px' }}
                        />
                     )}
                  />
               </Grid>
               {TypeValueWatch === 'NUMBER' && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                     <Controller
                        name="numberData.target"
                        control={control}
                        render={({
                           field: { value, onChange },
                           fieldState: { error }
                        }) => {
                           return (
                              <FormInput
                                 label="Target *"
                                 type="number"
                                 value={value ? value.toString() : ''}
                                 onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                 ) => {
                                    const newValue = e.target.value
                                    onChange(
                                       newValue === ''
                                          ? undefined
                                          : Number(newValue)
                                    )
                                 }}
                                 error={error}
                                 placeholder="Enter target"
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
                           )
                        }}
                     />
                  </Grid>
               )}
               {TypeValueWatch === 'PERCENT' && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                     <Controller
                        name="percentData"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                           <FormAutocomplete
                              error={errors?.percentData?.targetPercent}
                              label="Target Percent *"
                              onChange={(
                                 selected: {
                                    label: string
                                    value: number
                                 } | null
                              ) => {
                                 onChange({
                                    ...value,
                                    targetPercent: selected
                                       ? selected.value
                                       : undefined
                                 })
                              }}
                              options={percentOption}
                              placeholder="Select target percent"
                              value={
                                 percentOption.find(
                                    (option) =>
                                       Number(option.value.toFixed(2)) ===
                                       Number(
                                          value?.targetPercent?.toFixed?.(2)
                                       )
                                 ) || null
                              }
                              sx={{ marginTop: '22px' }}
                           />
                        )}
                     />
                  </Grid>
               )}
            </Grid>
            <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
               <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                     name="deadline"
                     control={control}
                     render={({ field: { value, onChange } }) => (
                        <FormDatePicker
                           error={errors.deadline}
                           label={'Deadline *'}
                           value={value ? dayjs(value) : null}
                           onChange={onChange}
                           minDate={dayjs(startDate)}
                           maxDate={dayjs(endDate) || undefined}
                           sx={{ marginTop: '24px' }}
                        />
                     )}
                  />
               </Grid>
               <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                     name="value"
                     control={control}
                     render={({
                        field: { value, onChange },
                        fieldState: { error }
                     }) => (
                        <FormAutocomplete
                           error={errors?.value}
                           label="Ratio *"
                           onChange={(value: any) => {
                              onChange(value?.value)
                           }}
                           options={percentOption}
                           placeholder="Select status"
                           value={
                              percentOption.find(
                                 (option: { label: string; value: number }) =>
                                    Number(option.value.toFixed(2)) ===
                                    Number(value?.toFixed?.(2))
                              ) || null
                           }
                           sx={{ marginTop: '22px' }}
                        />
                     )}
                  />
               </Grid>
            </Grid>
         </Box>
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'flex-end',
               paddingBottom: '10px',
               paddingTop: '20px'
            }}
         >
            <Box
               sx={{
                  display: 'flex',
                  gap: 1
               }}
            >
               <Button
                  title="Close"
                  onClick={() => {
                     onClose?.()
                  }}
               />
               <Button title="Submit" onClick={handleSubmit} />
            </Box>
         </Box>
      </Dialog>
   )
}

export default AddEditKey
