import { commonTheme } from '@/app/configs/theme.config'
import { useEditStaffKeyResult } from '@/app/hooks/api/staff.keyResult.hook'
import { StaffKeyResultType } from '@/app/types/objective.type'
import { toPercentage } from '@/app/utils/string.util'
import {
   Box,
   Checkbox,
   Grid,
   MenuItem,
   Select,
   TextField,
   Typography
} from '@mui/material'

type StaffKeyResultProp = {
   data: StaffKeyResultType
   onChange?: (
      id: string,
      newValue: number,
      flag: boolean,
      percentOfKeyResult: number
   ) => void
}

const StaffKeyResult = ({ data, onChange }: StaffKeyResultProp) => {
   const { mutate: editStaffKeyResult } = useEditStaffKeyResult()

   const handleCurrentValue = async (
      row: StaffKeyResultType,
      value: number
   ) => {
      let flag = false
      let percent = 0
      if (row.keyResult.type === 'NUMBER') {
         if (!row.keyResult.numberData) return
         if (value === row.keyResult.numberData?.target) {
            flag = true
         }
         percent = value / row.keyResult.numberData.target
      } else if (row.keyResult.type === 'PERCENT') {
         if (!row.keyResult.percentData) return
         if (value === row.keyResult.percentData?.targetPercent) {
            flag = true
         }
         percent = value / row.keyResult.percentData?.targetPercent
      } else {
         if (value === 1) {
            flag = true
         }
         percent = value === 1 ? 1 : 0
      }

      const percentOfKeyResult = percent * row.keyResult.value
      onChange?.(row.id, value, flag, percentOfKeyResult)

      // editStaffKeyResult(
      //    { id: row.id, currentValue: value },
      //    {
      //       onSuccess: (updatedRow) => {
      //          onChange?.(updatedRow)
      //          // setLoading(true)
      //       }
      //    }
      // )
   }

   const renderCurrentValue = () => {
      if (data.keyResult.type === 'BOOLEAN') {
         return (
            <Box
               sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
               }}
            >
               <Checkbox
                  size="small"
                  checked={data.currentValue === 1}
                  onChange={(e) => {
                     const value = e.target.checked ? 1 : 0
                     handleCurrentValue(data, value)
                  }}
               />
            </Box>
         )
      }

      if (data.keyResult.type === 'PERCENT') {
         if (!data.keyResult.percentData) return null
         const lengthOfSelect =
            data.keyResult.percentData.targetPercent * 10 + 1
         const percentOption = Array.from(
            { length: lengthOfSelect },
            (_, i) => {
               const decimal = Number((i * 0.1).toFixed(2))
               return {
                  label: `${(decimal * 100).toFixed(0)}%`,
                  value: decimal
               }
            }
         )

         return (
            <Select
               size="small"
               value={data.currentValue} // controlled
               onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value !== data.currentValue) {
                     handleCurrentValue(data, value)
                  }
               }}
               fullWidth
            >
               {percentOption.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                     {p.label}
                  </MenuItem>
               ))}
            </Select>
         )
      }

      // NUMBER
      return (
         <TextField
            type="number"
            size="small"
            inputRef={(input) => {
               // Nếu bạn cần focus hay xử lý nâng cao, có thể dùng ref
            }}
            defaultValue={data.currentValue}
            onBlur={(e) => {
               const value = Number(e.target.value)
               handleCurrentValue(data, value)
            }}
            onKeyDown={(e) => {
               if (e.key === 'Enter') {
                  const value = Number((e.target as HTMLInputElement).value)
                  handleCurrentValue(data, value)
               }
            }}
            fullWidth
            sx={{
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
   }

   return (
      <Box>
         <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
            <Grid size={12}>
               <Box sx={{ width: '100%' }}>
                  <Grid
                     container
                     columnSpacing={commonTheme.space?.form?.horizontal}
                  >
                     <Grid size={{ xs: 12 }}>
                        <TextField
                           type="text"
                           size="medium"
                           defaultValue={data.keyResult.name}
                           fullWidth
                           label="Name"
                           multiline
                           minRows={3} // ✅ số dòng mặc định
                           InputProps={{
                              readOnly: true,
                              style: {
                                 fontWeight: 400,
                                 color: '#000',
                                 fontSize: 16
                              }
                           }}
                           InputLabelProps={{
                              style: {
                                 fontSize: 16
                              }
                           }}
                        />
                     </Grid>
                  </Grid>
                  <Grid
                     container
                     columnSpacing={commonTheme.space?.form?.horizontal}
                     sx={{ mt: '20px' }}
                  >
                     <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                           type="number"
                           size="small"
                           defaultValue={data.keyResult.value}
                           fullWidth
                           label="ratio"
                           InputProps={{
                              readOnly: true,
                              style: {
                                 fontWeight: 400,
                                 color: '#000' // hoặc 'inherit'
                              }
                           }}
                        />
                     </Grid>

                     <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                           type="text"
                           size="small"
                           fullWidth
                           label="Target"
                           value={
                              data.keyResult.type === 'NUMBER'
                                 ? (data.keyResult.numberData?.target ?? '')
                                 : data.keyResult.type === 'PERCENT'
                                   ? toPercentage(
                                        data.keyResult.percentData
                                           ?.targetPercent ?? 0
                                     )
                                   : 'Complete Key Result'
                           }
                           InputProps={{
                              readOnly: true,
                              style: {
                                 fontWeight: 400,
                                 color: '#000' // hoặc 'inherit'
                              }
                           }}
                        />
                     </Grid>

                     <Grid size={{ xs: 12, sm: 3 }}>
                        {renderCurrentValue()}
                     </Grid>

                     <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                           type="text"
                           size="small"
                           fullWidth
                           label="Status"
                           value={data.isComplete ? 'Done' : 'Active'}
                           InputProps={{
                              readOnly: true,
                              style: {
                                 fontWeight: 600,
                                 color: data.isComplete ? 'green' : 'red',
                                 backgroundColor: data.isComplete
                                    ? '#d0f0c0'
                                    : '#ffd6d6',
                                 borderRadius: 4
                              }
                           }}
                        />
                     </Grid>
                  </Grid>
               </Box>
            </Grid>
         </Grid>
      </Box>
   )
}

export default StaffKeyResult
