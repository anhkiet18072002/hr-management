'use client'

import Button from '@/app/components/button/Button'
import DataGrid, {
   DataGridCell,
   DataGridCellText
} from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import SearchTextField from '@/app/components/input/SearchTextField'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useDeleteStaff, useGetStaffs } from '@/app/hooks/api'
import { useToast } from '@/app/hooks/useToast'
import { StaffType } from '@/app/types/staff.type'
import { formatDate } from '@/app/utils/date.util'
import { getFullname, getInitials } from '@/app/utils/name.util'
import { ContainerStyled } from '@/styles/common.styles'
import {
   DeleteOutlined,
   DownloadOutlined,
   EditOutlined,
   EyeOutlined,
   PlusOutlined,
   UploadOutlined
} from '@ant-design/icons'
import { Avatar, Box, Grid, Tooltip, Typography } from '@mui/material'
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

   const [staffs, setStaffs] = useState<StaffType[]>([])
   const [isDeleting, setIsDeleting] = useState<StaffType | undefined>()

   const queryClient = useQueryClient()
   const { mutate: deleteStaff } = useDeleteStaff()

   // const handleView = (staff: StaffType) => {}

   const handleEdit = (staff: StaffType) => {
      router.push(`${PAGE_ROUTES.ADMIN.OBJECTIVE_ASSIGNMENT.EDIT}/${staff.id}`)
   }

   // const handleDelete = (staff: StaffType) => {
   //    setIsDeleting(staff)
   // }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteStaff(isDeleting?.id, {
            onSuccess: async () => {
               await queryClient.invalidateQueries(API_ROUTES.STAFF.INDEX)

               // Show toast
               toast.success('Delete staff successfully')
            },
            onError: async () => {
               // Show toast
               toast.error('Error while deleting staff')
            }
         })
      }

      setIsDeleting(undefined)
   }

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }

   const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION)
   const [filters, setFilters] = useState({})

   const { data } = useGetStaffs({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1,
      key: 'objectives'
   })

   const columns: GridColDef<StaffType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'info',
            flex: 0.3,
            headerName: 'Staff',
            renderCell: (params: GridCellParams<StaffType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <Avatar sx={{ fontSize: '14px' }}>
                        {getInitials({ ...row.account })}
                     </Avatar>
                     <Box sx={{ flexGrow: 1, marginLeft: '8px' }}>
                        <Typography
                           sx={{
                              color: commonTheme.palette.text.primary,
                              fontSize: '14px',
                              fontWeight: 600
                           }}
                        >
                           {getFullname({ ...row.account })}
                        </Typography>
                        <Typography sx={{ color: '#8c8c8c', fontSize: '14px' }}>
                           {row.account?.email || ''}
                        </Typography>
                     </Box>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'username',
            flex: 0.2,
            headerName: 'Username',
            renderCell: (params: GridCellParams<StaffType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {row?.account?.username}
                     </Typography>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'Objective',
            flex: 0.5,
            headerName: 'Objective',
            renderCell: (params: GridCellParams<StaffType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {row.objectives!.map((obj, index) => (
                           <Typography
                              key={index}
                              component="span"
                              display="block"
                           >
                              {obj.name}
                           </Typography>
                        ))}
                     </DataGridCellText>
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
            getActions: (params: GridRowParams<StaffType>) => {
               const { row } = params

               return [
                  // <Tooltip key={'view'} title={'View'}>
                  //    <GridActionsCellItem
                  //       icon={<EyeOutlined />}
                  //       onClick={() => handleView(row)}
                  //       label="View"
                  //    />
                  // </Tooltip>
                  <Tooltip key={'edit'} title={'Edit'}>
                     <GridActionsCellItem
                        icon={<EditOutlined style={{ color: '#1890ff' }} />}
                        onClick={() => handleEdit(row)}
                        label="Edit"
                     />
                  </Tooltip>
                  // <Tooltip key={'delete'} title={'Delete'}>
                  //    <GridActionsCellItem
                  //       icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                  //       onClick={(e) => {
                  //          e.preventDefault()

                  //          handleDelete(row)
                  //       }}
                  //       label="Delete"
                  //    />
                  // </Tooltip>
               ]
            }
         }
      ],
      []
   )

   useEffect(() => {
      setStaffs((data?.data as StaffType[]) || [])
   }, [data])

   return (
      <ContainerStyled>
         {/* Filters */}
         <Box>
            <Grid
               container
               justifyContent="flex-end"
               columnSpacing={commonTheme.space?.form?.horizontal}
            >
               <Box
                  sx={{
                     display: 'flex',

                     alignItems: 'center'
                  }}
                  columnGap={commonTheme.space?.form?.horizontal}
               >
                  <SearchTextField
                     placeholder="Search by name, email"
                     onChange={(value: string | undefined) => {
                        if (value && value?.length >= 2) {
                           setFilters((preValue: any) => {
                              return {
                                 ...preValue,
                                 search: value
                              }
                           })
                        } else if (value?.length === 0) {
                           setFilters((preValue: any) => {
                              return {
                                 ...preValue,
                                 search: ''
                              }
                           })
                        }
                     }}
                  />
               </Box>
            </Grid>
         </Box>
         <Box sx={{ marginTop: '20px' }}>
            <DataGrid
               columns={columns}
               rows={staffs}
               getRowHeight={() => 'auto'}
               rowCount={data?.meta?.total || 0}
               paginationModel={{
                  page: data?.meta?.page ? data?.meta?.page - 1 : 0,
                  pageSize: data?.meta?.pageSize || 10
               }}
               onPaginationModelChange={handlePaginate}
            />
         </Box>

         {/* Is deleting staff */}
         {isDeleting !== undefined && (
            <DeleteConfirmationDialog
               title={'Are you sure you want to delete?'}
               description={`By deleting ${getFullname({ ...isDeleting?.account })}, all associated data will also be deleted.`}
               open={isDeleting !== undefined}
               onCancel={() => setIsDeleting(undefined)}
               onConfirm={handleConfirmDelete}
            />
         )}
      </ContainerStyled>
   )
}

export default Page
