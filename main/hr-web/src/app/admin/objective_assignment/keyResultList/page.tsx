'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ObjectiveType, StaffKeyResultType } from '@/app/types/objective.type'
import {
   staffClient,
   useEditStaff,
   useEditStaffKeyResults
} from '@/app/hooks/api'
import { Box, Grid, Typography } from '@mui/material'
import { commonTheme } from '@/app/configs/theme.config'
import {
   ContainerStyled,
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'
import {
   GridActionsCellItem,
   GridCellParams,
   GridColDef,
   GridRowParams
} from '@mui/x-data-grid'
import DataGrid, {
   DataGridCell,
   DataGridCellText
} from '@/app/components/datagrid/DataGrid'
import { toPercentage } from '@/app/utils/string.util'
import { formatDate } from '@/app/utils/date.util'
import StaffKeyResultList from '../list/StaffKeyResult'
import { objectiveClient } from '@/app/hooks/api/objective.api'
import useLoading from '@/app/hooks/useLoading'
import { useEditObjective } from '@/app/hooks/api/objective.hook'
import { useToast } from '@/app/hooks/useToast'
import { useQueryClient } from 'react-query'
import Button from '@/app/components/button/Button'
import { ArrowLeftOutlined } from '@ant-design/icons'

const Page = () => {
   const searchParams = useSearchParams()
   const router = useRouter()
   const toast = useToast()
   const queryClient = useQueryClient()
   const { setLoading } = useLoading()
   const { mutate: editObjective } = useEditObjective()
   const { mutate: editStaffKeyResult } = useEditStaffKeyResults()

   const staffId = searchParams.get('staffId') || ''
   const objectiveId = searchParams.get('objectiveId') || ''
   const returnUrl =
      searchParams.get('returnUrl') || '/admin/objective_assignment'

   const [objective, setObjective] = useState<ObjectiveType>()
   const [progress, setProgress] = useState<number>(0)
   const [isSaveData, setIsSaveData] = useState<boolean>(false)

   useEffect(() => {
      const fetchObjectiveAndStaff = async () => {
         const resObjective = await objectiveClient.findOne(objectiveId)
         setObjective(resObjective)

         if (!staffId) return

         const resStaff = await staffClient.findOne(staffId)
         const filtered = resStaff.staffKeyResults?.filter(
            (kr) => kr.keyResult.objectiveId === resObjective.id
         )
         setStaffKeyResults(filtered || [])
      }

      fetchObjectiveAndStaff()
   }, []) // chỉ chạy 1 lần duy nhất

   const [staffKeyResults, setStaffKeyResults] = useState<StaffKeyResultType[]>(
      []
   )

   const columns: GridColDef<ObjectiveType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'name',
            flex: 0.2,
            headerName: 'Name',
            renderCell: (params: GridCellParams<ObjectiveType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <Box sx={{ flexGrow: 1 }}>
                        <Typography
                           sx={{
                              color: commonTheme.palette.text.primary,
                              fontSize: '14px',
                              fontWeight: 600
                           }}
                        >
                           {row.name}
                        </Typography>
                     </Box>
                  </DataGridCell>
               )
            }
         },

         {
            field: 'description',
            flex: 0.5,
            headerName: 'Description',
            renderCell: (params: GridCellParams<ObjectiveType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {row.description || ''}
                     </DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'progress',
            flex: 0.2,
            headerName: 'Progress',
            renderCell: (params: GridCellParams<ObjectiveType>) => {
               const { row } = params
               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {toPercentage(row.progress)}
                     </DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'startDate',
            flex: 0.1,
            headerName: 'Start Date',
            renderCell: (params: GridCellParams<ObjectiveType>) => {
               const { row } = params
               const startDate = row.startDate
                  ? formatDate(row.startDate as string)
                  : ''

               return (
                  <DataGridCell>
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {startDate}
                     </Typography>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'endDate',
            flex: 0.1,
            headerName: 'End Date',
            renderCell: (params: GridCellParams<ObjectiveType>) => {
               const { row } = params
               const endDate = row.endDate
                  ? formatDate(row.endDate as string)
                  : ''

               return (
                  <DataGridCell>
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {endDate}
                     </Typography>
                  </DataGridCell>
               )
            }
         }
      ],
      []
   )

   const handleUpdateStaffKeyResult = async (
      id: string,
      value: number,
      flag: boolean,
      percentOfKeyResult: number
   ) => {
      setStaffKeyResults((prev) =>
         prev.map((item) =>
            item.id === id
               ? {
                    ...item,
                    currentValue: value,
                    isComplete: flag,
                    keyResult: {
                       ...item.keyResult, // giữ các thuộc tính khác
                       percent: percentOfKeyResult // cập nhật percent
                    }
                 }
               : item
         )
      )
   }

   console.log('staffKeyResults', staffKeyResults)

   useEffect(() => {
      if (!staffKeyResults && !objective) return
      const total = staffKeyResults.reduce(
         (sum, item) => sum + (item.keyResult.percent || 0),
         0
      )
      console.log('Tổng percent:', total)
      setProgress(total)
   }, [staffKeyResults])

   const handleSaveData = async (setIsSaveData: boolean) => {
      setLoading(true)
      if (!objective) return
      const keyResults = objective.keyResults

      editObjective(
         { progress, keyResults, staffId, id: objectiveId },
         {
            onError: async (err) => {
               toast.error('Error while updating objective')
            }
         }
      )

      editStaffKeyResult(
         { id: staffId, staffKeyResults, objectiveId: objectiveId },
         {
            onSuccess: async (res) => {
               toast.success(`Successfully save data`)
               const newObjective = await objectiveClient.findOne(objectiveId)
               setObjective(newObjective)
            },
            onError: async (err) => {
               toast.error('Error while updating staff')
            }
         }
      )

      setLoading(false)
   }

   const isLoading = !objective

   return (
      <Box>
         {isLoading ? (
            <Typography>Loading objective...</Typography>
         ) : (
            <>
               <Button
                  onClick={() => {
                     router.replace(returnUrl)
                  }}
                  startIcon={<ArrowLeftOutlined style={{ fontSize: '14px' }} />}
                  size="tiny"
                  title="Back"
               />
               <Box sx={{ width: '100%' }}>
                  <SectionTitleStyled>Objective</SectionTitleStyled>
               </Box>

               <DataGrid
                  columns={columns}
                  rows={[objective]}
                  getRowHeight={() => 'auto'}
                  sx={{
                     '& .MuiDataGrid-cell': {
                        paddingTop: '8px',
                        paddingBottom: '8px'
                     }
                  }}
               />

               <Box sx={{ width: '100%', mt: '40px' }}>
                  <SectionTitleStyled>List of Key Result</SectionTitleStyled>
               </Box>

               <StaffKeyResultList
                  staffKeyResult={staffKeyResults}
                  objective={objective}
                  staffId={staffId}
                  onChange={(id, value, flag, percentOfKeyResult) => {
                     handleUpdateStaffKeyResult(
                        id,
                        value,
                        flag,
                        percentOfKeyResult
                     )
                  }}
                  progress={progress}
                  onAddNewStaffKeyResult={(updateStaffKeyResult) =>
                     setStaffKeyResults(updateStaffKeyResult)
                  }
                  onAddNewKeyResult={(updateKeyResult) => {
                     setObjective((prev) => {
                        if (!prev) return prev
                        return {
                           ...prev,
                           keyResults: updateKeyResult
                        }
                     })
                  }}
                  isSaveData={(setIsSaveData) => {
                     handleSaveData(setIsSaveData)
                  }}
               />
            </>
         )}
      </Box>
   )
}

export default Page
