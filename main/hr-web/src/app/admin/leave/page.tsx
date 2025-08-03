'use client'

import Button from '@/app/components/button/Button'
import DataGrid, {
   DataGridCell,
   DataGridCellText
} from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import TextField from '@/app/components/input/TextField'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_TIME_FORMAT } from '@/app/constants/date-time.constant'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import {
   useDeleteLeaveAssignment,
   useGetLeaveAssignments
} from '@/app/hooks/api/leave.assignment.hook'
import { useToast } from '@/app/hooks/useToast'
import { LeaveAssignmentType } from '@/app/types/leave.assignment.type'
import { formatDate } from '@/app/utils/date.util'
import { getFullname } from '@/app/utils/name.util'
import { ContainerStyled } from '@/styles/common.styles'
import {
   DeleteOutlined,
   EditOutlined,
   EyeOutlined,
   PlusOutlined,
   SearchOutlined
} from '@ant-design/icons'
import {
   Avatar,
   Box,
   Grid,
   IconButton,
   InputAdornment,
   Tooltip,
   Typography
} from '@mui/material'
import {
   GridActionsCellItem,
   GridCellParams,
   GridColDef,
   GridPaginationModel,
   GridRowParams
} from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

const Page = () => {
   const router = useRouter()
   const toast = useToast()

   const [leaveAssignments, setLeaveAssignments] = useState<
      LeaveAssignmentType[]
   >([])
   const [isDeleting, setIsDeleting] = useState<string | undefined>()

   const queryClient = useQueryClient()
   const { mutate: deleteLeaveAssignment } = useDeleteLeaveAssignment()

   const handleView = () => {}

   const handleEdit = (leaveAssignment: LeaveAssignmentType) => {
      router.push(`${PAGE_ROUTES.ADMIN.LEAVE.EDIT}/${leaveAssignment.id}`)
   }

   const handleDelete = (leaveAssignment: LeaveAssignmentType) => {
      setIsDeleting(leaveAssignment.id)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteLeaveAssignment(isDeleting, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(
                  API_ROUTES.LEAVE_ASSIGNMENT.INDEX
               )

               // Hide confirmation modal
               setIsDeleting(undefined)

               toast.success('Successfully deleted leave assignment')
            },
            onError: async (err: any) => {
               setIsDeleting(undefined)

               toast.error(err)
            }
         })
      }
   }

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }

   const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION)
   const [filters, setFilters] = useState({})

   const { data } = useGetLeaveAssignments({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1
   })

   const columns: GridColDef<LeaveAssignmentType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'info',
            flex: 0.4,
            headerName: 'Staff',
            renderCell: (params: GridCellParams<LeaveAssignmentType>) => {
               const { row } = params
               return (
                  <Box
                     sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        padding: '6px 4px'
                     }}
                  >
                     <Avatar sx={{ fontSize: '14px' }}>
                        {/* {getInitials({ ...row.account })} */}
                     </Avatar>
                     <Box sx={{ flexGrow: 1, marginLeft: '8px' }}>
                        <Typography
                           sx={{
                              color: commonTheme.palette.text.primary,
                              fontSize: '14px',
                              fontWeight: 600
                           }}
                        >
                           {getFullname({
                              firstName: row.staff.firstName,
                              lastName: row.staff.lastName,
                              middleName: row.staff.middleName
                           })}
                        </Typography>
                        <Typography sx={{ color: '#8c8c8c', fontSize: '14px' }}>
                           {row.staff.account?.email || ''}
                        </Typography>
                     </Box>
                  </Box>
               )
            }
         },
         {
            field: 'leave',
            headerName: 'Type',
            renderCell: (params: GridCellParams<LeaveAssignmentType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.type.name}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'duration',
            headerName: 'Duration',
            renderCell: (params: GridCellParams<LeaveAssignmentType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.duration}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'reason',
            flex: 0.6,
            headerName: 'Reason',
            renderCell: (params: GridCellParams<LeaveAssignmentType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.reason}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'startDate',
            minWidth: 180,
            maxWidth: 180,
            headerName: 'Start Date',
            renderCell: (params: GridCellParams<LeaveAssignmentType>) => {
               const { row } = params
               const startDate = row.startDate
                  ? formatDate(row.startDate as string, DEFAULT_TIME_FORMAT)
                  : ''

               return (
                  <Box
                     sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        height: '100%'
                     }}
                  >
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {startDate}
                     </Typography>
                  </Box>
               )
            }
         },
         {
            field: 'endDate',
            minWidth: 180,
            maxWidth: 180,
            headerName: 'End Date',
            renderCell: (params: GridCellParams<LeaveAssignmentType>) => {
               const { row } = params
               const startDate = row.endDate
                  ? formatDate(row.endDate as string, DEFAULT_TIME_FORMAT)
                  : ''

               return (
                  <Box
                     sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        height: '100%'
                     }}
                  >
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {startDate}
                     </Typography>
                  </Box>
               )
            }
         },
         {
            field: 'actions',
            minWidth: 120,
            maxWidth: 120,
            headerName: '',
            type: 'actions',
            getActions: (params: GridRowParams<LeaveAssignmentType>) => {
               const { row } = params

               return [
                  <Tooltip key={'view'} title={'View'}>
                     <GridActionsCellItem
                        icon={<EyeOutlined />}
                        onClick={handleView}
                        label="View"
                     />
                  </Tooltip>,
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
                        onClick={() => handleDelete(row)}
                        label="Delete"
                     />
                  </Tooltip>
               ]
            }
         }
      ],
      [handleView, handleEdit, handleDelete]
   )

   useEffect(() => {
      setLeaveAssignments((data?.data as LeaveAssignmentType[]) || [])
   }, [data])

   return (
      <ContainerStyled>
         {/* Filters */}
         <Grid
            container
            justifyContent={'flex-end'}
            columnSpacing={commonTheme.space?.form?.horizontal}
         >
            <Grid
               size={3}
               sx={{ display: 'flex', alignItems: 'center' }}
               columnGap={commonTheme.space?.form?.horizontal}
            >
               <TextField
                  placeholder="Search by name, email"
                  slotProps={{
                     input: {
                        endAdornment: (
                           <InputAdornment position="end">
                              <IconButton
                                 sx={{
                                    borderRadius: '4px',
                                    height: 32,
                                    width: 32
                                 }}
                                 onClick={() => {}}
                              >
                                 <SearchOutlined style={{ fontSize: '16px' }} />
                              </IconButton>
                           </InputAdornment>
                        )
                     }
                  }}
                  onChange={(
                     event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                     const inputValue = event.currentTarget.value
                     if (inputValue && inputValue?.length >= 2) {
                        setFilters((preValue: any) => {
                           return {
                              ...preValue,
                              search: inputValue
                           }
                        })
                     } else if (inputValue?.length === 0) {
                        setFilters((preValue: any) => {
                           return {
                              ...preValue,
                              search: ''
                           }
                        })
                     }
                  }}
                  sx={{
                     '& .MuiOutlinedInput-root': {
                        marginTop: '0px'
                     }
                  }}
               />

               <Button
                  onClick={() => {
                     router.push(PAGE_ROUTES.ADMIN.LEAVE.ADD)
                  }}
                  startIcon={<PlusOutlined />}
                  size="small"
                  title="Add"
               />
            </Grid>
         </Grid>
         <Box sx={{ marginTop: '20px' }}>
            <DataGrid
               columns={columns}
               getRowHeight={() => 'auto'}
               rows={leaveAssignments}
               rowCount={data?.meta?.total || 0}
               paginationModel={{
                  page: data?.meta?.page ? data?.meta?.page - 1 : 0,
                  pageSize: data?.meta?.pageSize || 10
               }}
               onPaginationModelChange={handlePaginate}
            />
         </Box>

         {/* Is deleting staff */}
         {
            <DeleteConfirmationDialog
               title={'Are you sure you want to delete?'}
               open={isDeleting !== undefined}
               onCancel={() => setIsDeleting(undefined)}
               onConfirm={handleConfirmDelete}
            />
         }
      </ContainerStyled>
   )
}

export default Page
