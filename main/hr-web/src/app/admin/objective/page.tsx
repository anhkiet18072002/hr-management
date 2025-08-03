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
import { staffClient } from '@/app/hooks/api'
import {
   useDeleteObjective,
   useGetObjectives
} from '@/app/hooks/api/objective.hook'
import { StaffType } from '@/app/types'
import { ObjectiveType } from '@/app/types/objective.type'
import { getFullname, getInitials } from '@/app/utils/name.util'
import { ContainerStyled } from '@/styles/common.styles'
import {
   DeleteOutlined,
   EditOutlined,
   EyeOutlined,
   PlusOutlined
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
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'
import { formatDate } from '@/app/utils/date.util'

const Page = () => {
   const router = useRouter()
   const queryClient = useQueryClient()

   const [objectives, setObjectives] = useState<ObjectiveType[]>([])
   const [isDeleting, setIsDeleting] = useState<ObjectiveType | undefined>()

   const { mutate: deleteObjective } = useDeleteObjective()

   const handleView = () => {}

   const handleEdit = (objective: ObjectiveType) => {
      router.push(`${PAGE_ROUTES.ADMIN.OBJECTIVE.EDIT}/${objective.id}`)
   }

   const handleDelete = (objective: ObjectiveType) => {
      setIsDeleting(objective)
   }

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteObjective(isDeleting?.id, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(API_ROUTES.OBJECTIVE.INDEX)

               // Hide confirmation modal
               setIsDeleting(undefined)
            },
            onError: async (err) => {
               setIsDeleting(undefined)

               // Show toast
            }
         })
      }
   }

   const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION)

   const [filters, setFilters] = useState({})

   const { data } = useGetObjectives({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1,
      sort: 'name|asc'
   })

   useEffect(() => {
      setObjectives((data?.data as ObjectiveType[]) || [])
   }, [data])

   const columns: GridColDef<ObjectiveType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'info',
            flex: 0.3,
            headerName: 'Staff',
            renderCell: (params: GridCellParams<ObjectiveType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <Avatar sx={{ fontSize: '14px' }}>
                        {getInitials({ ...row.staff.account })}
                     </Avatar>
                     <Box sx={{ flexGrow: 1, marginLeft: '8px' }}>
                        <Typography
                           sx={{
                              color: commonTheme.palette.text.primary,
                              fontSize: '14px',
                              fontWeight: 600
                           }}
                        >
                           {getFullname({ ...row.staff.account })}
                        </Typography>
                        <Typography sx={{ color: '#8c8c8c', fontSize: '14px' }}>
                           {row.staff.account?.email || ''}
                        </Typography>
                     </Box>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'objective',
            flex: 0.2,
            headerName: 'Objective',
            renderCell: (params: GridCellParams<ObjectiveType>) => {
               const { row } = params

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
                        {row?.name}
                     </Typography>
                  </Box>
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
            field: 'startDate',
            minWidth: 140,
            maxWidth: 140,
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
            minWidth: 140,
            maxWidth: 140,
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
            minWidth: 120,
            maxWidth: 120,
            headerName: '',
            type: 'actions',
            getActions: (params: GridRowParams<ObjectiveType>) => {
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
                        icon={<EditOutlined style={{ color: '#1890ff' }} />}
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
               <SearchTextField
                  placeholder="Search by name, description"
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
               <Button
                  onClick={() => {
                     router.push(PAGE_ROUTES.ADMIN.OBJECTIVE.ADD)
                  }}
                  startIcon={<PlusOutlined />}
                  size="small"
                  title="Add"
               />
            </Grid>
         </Grid>

         {/* Skill list */}
         <Box sx={{ marginTop: '20px' }}>
            <DataGrid
               columns={columns}
               rows={objectives}
               rowHeight={64}
               rowCount={data?.meta?.total || 0}
               paginationModel={{
                  page: data?.meta?.page ? data?.meta?.page - 1 : 0,
                  pageSize: data?.meta?.pageSize || 10
               }}
               onPaginationModelChange={handlePaginate}
            />
         </Box>

         {/* Is deleting skill */}
         {
            <DeleteConfirmationDialog
               title={'Are you sure you want to delete?'}
               description={`By deleting ${isDeleting?.name}, all associated data will also be deleted.`}
               open={isDeleting !== undefined}
               onCancel={() => setIsDeleting(undefined)}
               onConfirm={handleConfirmDelete}
            />
         }
      </ContainerStyled>
   )
}

export default Page
