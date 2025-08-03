import AddEdit from '@/app/admin/project/member/AddEdit'
import DataGrid, {
   DataGridCell,
   DataGridCellText
} from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import { commonTheme } from '@/app/configs/theme.config'
import { projectRoleClient, staffClient } from '@/app/hooks/api'
import { ProjectAssignmentType } from '@/app/types/project.type'
import { formatDate } from '@/app/utils/date.util'
import { getFullname } from '@/app/utils/name.util'
import { toPercentage } from '@/app/utils/string.util'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Box, Tooltip, Typography } from '@mui/material'
import {
   GridActionsCellItem,
   GridCellParams,
   GridColDef,
   GridRowParams
} from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'

type MemberListProps = {
   data: ProjectAssignmentType[]
   onChange?: (projectAssignments: ProjectAssignmentType[]) => void
   onEdit?: (projectAssignment?: ProjectAssignmentType) => void
}

const MemberList = ({ data, onChange, onEdit }: MemberListProps) => {
   const [isDeleting, setIsDeleting] = useState<
      ProjectAssignmentType | undefined
   >()

   const [rows, setRows] = useState<ProjectAssignmentType[]>([])

   const columns: GridColDef<ProjectAssignmentType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'member',
            flex: 0.4,
            headerName: 'Member',
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
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
                           {getFullname({
                              firstName: row.staff?.account.firstName || '',
                              lastName: row.staff?.account.lastName || '',
                              middleName: row.staff?.account.middleName
                           })}
                        </Typography>
                        <Typography sx={{ color: '#8c8c8c', fontSize: '14px' }}>
                           {row.staff?.account.email || ''}
                        </Typography>
                     </Box>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'role',
            flex: 0.6,
            headerName: 'Role',
            renderCell: (
               params: GridCellParams<
                  ProjectAssignmentType & { roleNames?: string[] }
               >
            ) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {row?.roleNames?.join(', ')}
                     </DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'workload',
            headerName: 'Workload',
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {toPercentage(row?.workload)}
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
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
               const { row } = params

               const startDateStr =
                  typeof row.startDate === 'string'
                     ? row.startDate
                     : row.startDate?.toISOString?.() || ''

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {startDateStr ? formatDate(startDateStr) : ''}
                     </DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'endDate',
            minWidth: 100,
            maxWidth: 100,
            headerName: 'End Date',
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
               const { row } = params

               const endDateStr =
                  typeof row.endDate === 'string'
                     ? row.endDate
                     : row.endDate?.toISOString?.() || ''

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {endDateStr ? formatDate(endDateStr) : ''}
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
            getActions: (params: GridRowParams<ProjectAssignmentType>) => {
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

   useEffect(() => {
      const processAssignments = async () => {
         if (!data || data.length === 0) return

         const enrichedData = await Promise.all(
            data.map(async (item) => {
               // Lấy thông tin staff đầy đủ
               const staff = await staffClient.findOne(item.staffId)

               // Lấy thông tin các role từ roleId[]
               const roleIds = Array.isArray(item.roleId)
                  ? item.roleId
                  : [item.roleId] // biến thành mảng nếu là string đơn

               const roles = await Promise.all(
                  roleIds.map((id: string) => projectRoleClient.findOne(id))
               )

               return {
                  ...item,
                  staff: staff,
                  roleNames: roles.map((r) => r.name)
               }
            })
         )

         setRows(enrichedData)
      }

      processAssignments()
   }, [data])

   const handleEdit = (projectAssignment?: ProjectAssignmentType) => {
      onEdit?.(projectAssignment)
   }

   const handleDelete = (projectAssignment: ProjectAssignmentType) => {
      setIsDeleting(projectAssignment)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         const updatedData = JSON.parse(JSON.stringify(rows)).filter(
            (projectAssignment: ProjectAssignmentType) =>
               projectAssignment.staff?.id !== isDeleting.staff?.id
         )

         setIsDeleting(undefined)

         // Update the parent component
         onChange?.(updatedData)
      }
   }

   return (
      <Box>
         <Box>
            <DataGrid
               columns={columns}
               rows={rows || []}
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
               description={`By deleting${isDeleting?.staff && ` ${getFullname({ ...isDeleting?.staff })}`}, all associated data will also be deleted.`}
               open={isDeleting !== undefined}
               onCancel={() => setIsDeleting(undefined)}
               onConfirm={handleConfirmDelete}
            />
         )}
      </Box>
   )
}

export default MemberList
