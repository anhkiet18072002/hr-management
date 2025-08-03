import Button from '@/app/components/button/Button'
import DataGrid, {
   DataGridCell,
   DataGridCellText
} from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import { commonTheme } from '@/app/configs/theme.config'
import { staffKeyResultClient } from '@/app/hooks/api/staff.keyResult.api'

import useLoading from '@/app/hooks/useLoading'
import {
   keyResultType,
   ObjectiveType,
   StaffKeyResultType
} from '@/app/types/objective.type'

import { formatDate } from '@/app/utils/date.util'
import { toPercentage } from '@/app/utils/string.util'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
   Box,
   Checkbox,
   Grid,
   MenuItem,
   Select,
   TextField,
   Tooltip,
   Typography
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import {
   GridActionsCellItem,
   GridCellParams,
   GridColDef,
   GridRowParams
} from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Dialog from '@/app/components/dialog/Dialog'
import { useToast } from '@/app/hooks/useToast'
import AddEditKey from '../../objective/child/AddEdit'
import {
   useAddKeyResult,
   useDeleteKeyResult
} from '@/app/hooks/api/keyResult.hook'
import { useEditStaffKeyResult } from '@/app/hooks/api/staff.keyResult.hook'
import { keyResultClient } from '@/app/hooks/api/keyResult.api'
import { useRouter } from 'next/navigation'
import { useQueryClient } from 'react-query'
import { API_ROUTES } from '@/app/configs/route.config'
import { ContainerStyled } from '@/styles/common.styles'
import StaffKeyResult from './StaffKeyResult_layout'
import SaveIcon from '@mui/icons-material/Save'
import { v4 } from 'uuid'

type MemberListProps = {
   staffKeyResult: StaffKeyResultType[]
   objective: ObjectiveType
   onChange?: (
      id: string,
      value: number,
      flag: boolean,
      percentOfKeyResult: number
   ) => void
   onAddNewStaffKeyResult?: (staffKeyResult: any[]) => void
   onAddNewKeyResult?: (keyResult: any[]) => void
   isSaveData: (isSaveData: boolean) => void
   staffId: string
   progress: number
}

const StaffKeyResultList = ({
   staffKeyResult,
   objective,
   onChange,
   staffId,
   progress,
   isSaveData,
   onAddNewStaffKeyResult,
   onAddNewKeyResult
}: MemberListProps) => {
   const toast = useToast()
   const queryClient = useQueryClient()

   const [rows, setRows] = useState<StaffKeyResultType[]>([])
   const { mutate: editStaffKeyResult } = useEditStaffKeyResult()
   const [isAddingKey, setIsAddingKey] = useState(false)
   const [isEditingKey, setIsEditingKey] = useState<keyResultType | undefined>()
   const [staffKeyResultId, setStaffKeyResultId] = useState<string>()

   const { mutate: deleteKeyResult } = useDeleteKeyResult()
   const { mutate: AddKeyResult } = useAddKeyResult()
   // const { mutate: editKeyResult } = useEditke

   const { setLoading } = useLoading()
   const [isDeleting, setIsDeleting] = useState<
      StaffKeyResultType | undefined
   >()

   const [TotalOfValueKey, setTotalOfValueKey] = useState<number>(0)

   useEffect(() => {
      if (!objective?.keyResults) return

      let total = 0
      for (const key of objective.keyResults) {
         total += key.value
      }
      setTotalOfValueKey(total)
   }, [objective])

   const handleKeyChanged = async (keyResult: keyResultType) => {
      const { id, ...rest } = keyResult

      const newKeyResult = {
         ...rest,
         objectiveId: objective.id
      }

      const fullKeyResult = {
         ...keyResult,
         objectiveId: objective.id
      }

      const newStaffKeyResult = {
         id: v4(),
         currentValue: 0,
         isComplete: false,
         keyResultId: fullKeyResult.id,
         keyResult: fullKeyResult
      }

      if (objective.keyResults) {
         onAddNewKeyResult?.([...objective.keyResults, newKeyResult])
      }
      onAddNewStaffKeyResult?.([...staffKeyResult, newStaffKeyResult])
   }

   const handleUpdateData = (
      id: string,
      value: number,
      flag: boolean,
      percentOfKeyResult: number
   ) => {
      onChange?.(id, value, flag, percentOfKeyResult)
   }

   const handleSaveData = () => {}

   return (
      <>
         <ContainerStyled>
            <Box>
               <Box
                  sx={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     marginTop: 1,
                     marginBottom: 2
                  }}
               >
                  <Typography sx={{ fontWeight: 500 }}>
                     Progress: {Math.round(progress * 100)}%
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '10px' }}>
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
                     <Button
                        onClick={() => {
                           isSaveData(true)
                        }}
                        startIcon={<SaveIcon style={{ fontSize: '14px' }} />}
                        size="tiny"
                        title="Save"
                     />
                  </Box>
               </Box>

               <Box>
                  {staffKeyResult.map((item, index) => (
                     <Box
                        key={item.id || index}
                        sx={{
                           marginBottom: '40px',
                           border: '1px solid #e0e0e0',
                           borderRadius: '8px',
                           padding: '16px',
                           backgroundColor: '#f5f5f5'
                        }}
                     >
                        <StaffKeyResult
                           data={item}
                           onChange={(id, value, flag, percentOfKeyResult) =>
                              handleUpdateData(
                                 id,
                                 value,
                                 flag,
                                 percentOfKeyResult
                              )
                           }
                        />
                     </Box>
                  ))}
               </Box>
            </Box>
         </ContainerStyled>
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
            startDate={
               objective?.startDate ? new Date(objective.startDate) : undefined
            }
            endDate={objective?.endDate ? new Date(objective.endDate) : null}
         />
      </>
   )
}

export default StaffKeyResultList
