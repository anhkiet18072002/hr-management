import Button from '@/app/components/button/Button'
import DataGrid, {
   DataGridCell,
   DataGridCellText
} from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import { API_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { useDeleteObjective } from '@/app/hooks/api/objective.hook'
import { useToast } from '@/app/hooks/useToast'
import { ObjectiveType } from '@/app/types/objective.type'

import { formatDate } from '@/app/utils/date.util'
import { toPercentage } from '@/app/utils/string.util'
import { ContainerStyled } from '@/styles/common.styles'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Box, Tooltip, Typography } from '@mui/material'
import {
   GridActionsCellItem,
   GridCellParams,
   GridColDef,
   GridRowParams
} from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

type MemberListProps = {
   data: ObjectiveType[]
   onChange?: (objective: ObjectiveType[]) => void
   onEdit?: (objective: ObjectiveType) => void
}

const ObjectiveList = ({ data, onChange, onEdit }: MemberListProps) => {
   const [rows, setRows] = useState<ObjectiveType[]>([])
   const [isDeleting, setIsDeleting] = useState<ObjectiveType | undefined>()
   const queryClient = useQueryClient()
   const { mutate: deleteObjective } = useDeleteObjective()
   const toast = useToast()

   useEffect(() => {
      const processAssignments = async () => {
         if (!data || data.length === 0) {
            setRows([]) // 👈 reset lại dữ liệu nếu không có gì
            return
         }
         setRows(data)
      }

      processAssignments()
   }, [JSON.stringify(data)])

   const handleEdit = (objective: ObjectiveType) => {
      onEdit?.(objective)
   }

   const handleDelete = (objective: ObjectiveType) => {
      setIsDeleting(objective)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteObjective(isDeleting.id, {
            onSuccess: async () => {
               // Cập nhật local state
               setRows((prevRows) => {
                  const updatedRows = prevRows.filter(
                     (item) => item.id !== isDeleting.id
                  )

                  // Nếu muốn cập nhật về cha:
                  setTimeout(() => {
                     onChange?.(updatedRows)
                  }, 0)

                  return updatedRows
               })

               // Đóng dialog
               setIsDeleting(undefined)

               // Thông báo thành công
               toast.success(
                  `Successfully deleted objective: ${isDeleting.name}`
               )
            },
            onError: async () => {
               setIsDeleting(undefined)
               toast.error(`Failed to delete objective: ${isDeleting.name}`)
            }
         })
      }
   }

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
            minWidth: 100,
            maxWidth: 100,
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
            minWidth: 100,
            maxWidth: 100,
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
         },
         {
            field: 'actions',
            minWidth: 60,
            maxWidth: 60,
            headerName: '',
            type: 'actions',
            getActions: (params: GridRowParams<ObjectiveType>) => {
               const { row } = params

               return [
                  <Tooltip key={'edit'} title={'Edit'}>
                     <GridActionsCellItem
                        icon={<EyeOutlined />}
                        onClick={() => handleEdit(row)}
                        label="Edit"
                     />
                  </Tooltip>,
                  <Tooltip key={'delete'} title={'Delete'}>
                     <GridActionsCellItem
                        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                        onClick={() => handleDelete(row)}
                        label="Delete"
                     />
                  </Tooltip>
               ]
            }
         }
      ],
      []
   )

   return (
      <>
         <Box>
            <DataGrid
               columns={columns}
               rows={rows.map((row, index) => ({ ...row, _index: index }))}
               getRowHeight={() => 'auto'}
               sx={{
                  '& .MuiDataGrid-cell': {
                     paddingTop: '8px',
                     paddingBottom: '8px'
                  }
               }}
            />
         </Box>
         {isDeleting !== undefined && (
            <DeleteConfirmationDialog
               title={'Are you sure you want to delete?'}
               description={`By deleting ${isDeleting?.name || ''}, all associated data will also be deleted.`}
               open={isDeleting !== undefined}
               onCancel={() => setIsDeleting(undefined)}
               onConfirm={handleConfirmDelete}
            />
         )}
      </>
   )
}

export default ObjectiveList
