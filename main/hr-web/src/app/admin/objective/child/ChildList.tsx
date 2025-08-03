import DataGrid, {
   DataGridCell,
   DataGridCellText
} from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import { commonTheme } from '@/app/configs/theme.config'
import { keyResultType } from '@/app/types/objective.type'

import { formatDate } from '@/app/utils/date.util'
import { toPercentage } from '@/app/utils/string.util'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Box, Tooltip, Typography } from '@mui/material'
import {
   GridActionsCellItem,
   GridCellParams,
   GridColDef,
   GridRowParams
} from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'

type KeyListProps = {
   data: keyResultType[]
   onChange?: (keyResult: keyResultType[]) => void
   onEdit?: (keyResult?: keyResultType) => void
}

const KeyList = ({ data, onChange, onEdit }: KeyListProps) => {
   const [isDeleting, setIsDeleting] = useState<keyResultType | undefined>()

   const [rows, setRows] = useState<keyResultType[]>([])

   useEffect(() => {
      const processAssignments = async () => {
         if (!data || data.length === 0) {
            setRows([]) // 👈 reset lại dữ liệu nếu không có gì
            return
         }

         setRows(data)
      }

      processAssignments()
   }, [data])

   const handleEdit = (keyResult?: keyResultType) => {
      onEdit?.(keyResult)
   }

   const handleDelete = useCallback(
      (keyResult: keyResultType) => {
         setRows((prevRows) => {
            const updatedData = prevRows.filter(
               (item) => item.id !== keyResult.id
            )

            // Gọi setKeyResults ở component cha một cách an toàn
            setTimeout(() => {
               onChange?.(updatedData)
            }, 0)

            return updatedData
         })
      },
      [onChange]
   )

   const columns: GridColDef<keyResultType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'name',
            flex: 0.4,
            headerName: 'Name',
            renderCell: (params: GridCellParams<keyResultType>) => {
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

         // {
         //    field: 'type',
         //    flex: 0.2,
         //    headerName: 'Type',
         //    renderCell: (params: GridCellParams<keyResultType>) => {
         //       const { row } = params

         //       return (
         //          <DataGridCell>
         //             <DataGridCellText>{row.type}</DataGridCellText>
         //          </DataGridCell>
         //       )
         //    }
         // },

         {
            field: 'target',
            flex: 0.4,
            headerName: 'Target',
            renderCell: (params: GridCellParams<keyResultType>) => {
               const { row } = params
               if (row.type === 'NUMBER') {
                  return (
                     <DataGridCell>
                        <DataGridCellText>
                           {row.numberData?.target}
                        </DataGridCellText>
                     </DataGridCell>
                  )
               }
               if (row.type === 'PERCENT') {
                  if (!row.percentData) return null
                  return (
                     <DataGridCell>
                        <DataGridCellText>
                           {toPercentage(row.percentData.targetPercent)}
                        </DataGridCellText>
                     </DataGridCell>
                  )
               } else {
                  return (
                     <DataGridCell>
                        <DataGridCellText>
                           {'Complete Key Result'}
                        </DataGridCellText>
                     </DataGridCell>
                  )
               }
            }
         },

         {
            field: 'value',
            flex: 0.2,
            headerName: 'Value',
            renderCell: (params: GridCellParams<keyResultType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {toPercentage(row.value)}
                     </DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'deadline',
            minWidth: 100,
            maxWidth: 100,
            headerName: 'Deadline',
            renderCell: (params: GridCellParams<keyResultType>) => {
               const { row } = params

               const deadlineStr =
                  typeof row.deadline === 'string'
                     ? row.deadline
                     : row.deadline?.toISOString?.() || ''

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {deadlineStr ? formatDate(deadlineStr) : ''}
                     </DataGridCellText>
                  </DataGridCell>
               )
            }
         },

         {
            field: 'actions',
            minWidth: 70,
            maxWidth: 70,
            headerName: '',
            type: 'actions',
            getActions: (params: GridRowParams<keyResultType>) => {
               const { row } = params

               return [
                  <Tooltip key={'edit'} title={'Edit'}>
                     <GridActionsCellItem
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(row)}
                        label="Edit"
                     />
                  </Tooltip>,
                  <Tooltip key={'delete'} title={'Delete'}>
                     <GridActionsCellItem
                        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                        onClick={(e) => {
                           e.preventDefault()

                           handleDelete(row)
                        }}
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
      <Box>
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
      </Box>
   )
}

export default KeyList
