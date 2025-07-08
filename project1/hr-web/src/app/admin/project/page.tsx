'use client'

import Button from '@/app/components/button/Button'
import Chip from '@/app/components/chip/Chip'
import DataGrid, {
   DataGridCell,
   DataGridCellText
} from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import SearchTextField from '@/app/components/input/SearchTextField'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useDeleteProject } from '@/app/hooks/api'
import { useGetProjects } from '@/app/hooks/api/project.hook'
import { useToast } from '@/app/hooks/useToast'
import {
   ProjectPriorityEnum,
   ProjectStatusEnum,
   ProjectType
} from '@/app/types/project.type'
import { formatDate } from '@/app/utils/date.util'
import { ContainerStyled } from '@/styles/common.styles'
import {
   DeleteOutlined,
   EditOutlined,
   EyeOutlined,
   PlusOutlined
} from '@ant-design/icons'
import { Box, Grid, Tooltip } from '@mui/material'
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

const Page = () => {
   const router = useRouter()
   const toast = useToast()

   const [projects, setProjects] = useState<ProjectType[]>([])
   const [isDeleting, setIsDeleting] = useState<ProjectType | undefined>()

   const queryClient = useQueryClient()
   const { mutate: deleteProject } = useDeleteProject()

   const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION)

   const [filters, setFilters] = useState({})

   const { data } = useGetProjects({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1
   })

   useEffect(() => {
      setProjects((data?.data as ProjectType[]) || [])
   }, [data])

   const handleView = (project: ProjectType) => {}

   const handleEdit = (projectType: ProjectType) => {
      router.push(`${PAGE_ROUTES.ADMIN.PROJECT.EDIT}/${projectType.id}`)
   }

   const handleDelete = (project: ProjectType) => {
      setIsDeleting(project)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteProject(isDeleting.id, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(API_ROUTES.PROJECT.INDEX)

               // Hide confirmation modal
               setIsDeleting(undefined)

               // Show successful toast
               toast.success(`Successfully deleted project: ${isDeleting.name}`)
            },
            onError: async (err) => {
               setIsDeleting(undefined)

               // Show toast
               toast.error(`Failed to delete project: ${isDeleting.name}`)
            }
         })
      }
   }

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }

   const columns: GridColDef<ProjectType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'name',
            flex: 0.6,
            headerName: 'Name',
            renderCell: (params: GridCellParams<ProjectType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.name}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'priority',
            headerName: 'Priority',
            renderCell: (params: GridCellParams<ProjectType>) => {
               const { row } = params

               const color =
                  row.priority === ProjectPriorityEnum.HIGH
                     ? 'error'
                     : row.priority === ProjectPriorityEnum.MEDIUM
                       ? 'warning'
                       : row.priority === ProjectPriorityEnum.LOW
                         ? 'primary'
                         : undefined

               return (
                  <DataGridCell>
                     <Chip label={row.priority} color={color} />
                  </DataGridCell>
               )
            }
         },
         {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            renderCell: (params: GridCellParams<ProjectType>) => {
               const { row } = params

               const color =
                  row.status === ProjectStatusEnum.COMPLETED
                     ? 'success'
                     : row.status === ProjectStatusEnum.PENDING
                       ? 'warning'
                       : row.status === ProjectStatusEnum.ACTIVE
                         ? 'primary'
                         : undefined

               return (
                  <DataGridCell>
                     <Chip label={row.status} color={color} />
                  </DataGridCell>
               )
            }
         },
         {
            field: 'type',
            flex: 0.4,
            headerName: 'Type',
            renderCell: (params: GridCellParams<ProjectType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.type?.name || ''}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'price',
            headerName: 'Price Type',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridCellParams<ProjectType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>
                        {row.priceType?.name || ''}
                     </DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'startDate',
            minWidth: 120,
            maxWidth: 120,
            headerName: 'Start Date',
            renderCell: (params: GridCellParams<ProjectType>) => {
               const { row } = params

               const startDate = row.startDate
                  ? formatDate(row.startDate as string)
                  : ''

               return (
                  <DataGridCell>
                     <DataGridCellText>{startDate}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'endDate',
            minWidth: 120,
            maxWidth: 120,
            headerName: 'End Date',
            renderCell: (params: GridCellParams<ProjectType>) => {
               const { row } = params

               const endDate = row.endDate
                  ? formatDate(row.endDate as string)
                  : ''

               return (
                  <DataGridCell>
                     <DataGridCellText>{endDate}</DataGridCellText>
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
            align: 'center',
            headerAlign: 'center',
            getActions: (params: GridRowParams<ProjectType>) => {
               const { row } = params

               return [
                  <Tooltip key={'view'} title={'View'}>
                     <GridActionsCellItem
                        icon={<EyeOutlined />}
                        onClick={() => handleView(row)}
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
      []
   )

   return (
      <ContainerStyled>
         {/* Filters */}
         <Box>
            <Grid
               container
               justifyContent="flex-end"
               columnSpacing={commonTheme.space?.form?.horizontal}
            >
               <Grid
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
                        router.push(PAGE_ROUTES.ADMIN.PROJECT.ADD)
                     }}
                     startIcon={<PlusOutlined />}
                     size="small"
                     title="Add"
                  />
               </Grid>
            </Grid>
         </Box>
         <Box sx={{ marginTop: '20px', width: '100%', overflow: 'auto' }}>
            <DataGrid
               columns={columns}
               rows={projects || []}
               rowHeight={64}
               paginationModel={{
                  page: data?.meta?.page ? data?.meta?.page - 1 : 0,
                  pageSize: data?.meta?.pageSize || 10
               }}
               onPaginationModelChange={handlePaginate}
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
      </ContainerStyled>
   )
}

export default Page
