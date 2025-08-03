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
import {
   useDeleteJobLevel,
   useGetJobLevels
} from '@/app/hooks/api/job.level.hook'
import { useToast } from '@/app/hooks/useToast'
import { JobLevelType } from '@/app/types/job.types'
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

   const [filters, setFilters] = useState({})
   const [isDeleting, setIsDeleting] = useState<JobLevelType | undefined>()

   const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION)

   const queryClient = useQueryClient()
   const { mutate: deleteJobLevel } = useDeleteJobLevel()

   const [jobLevels, setJobLevels] = useState<JobLevelType[]>([])

   const { data } = useGetJobLevels({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1,
      sort: 'name|asc'
   })

   useEffect(() => {
      setJobLevels((data?.data as JobLevelType[]) || [])
   }, [data])

   const handleView = (jobLevel: JobLevelType) => {}

   const handleEdit = (jobLevel: JobLevelType) => {
      router.push(`${PAGE_ROUTES.ADMIN.JOB_LEVEL.EDIT}/${jobLevel.id}`)
   }

   const handleDelete = (jobLevel: JobLevelType) => {
      setIsDeleting(jobLevel)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteJobLevel(isDeleting.id, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(
                  `${API_ROUTES.JOB_LEVEL.INDEX}`
               )

               toast.success(
                  `Successfully delete job level: ${isDeleting.name}`
               )

               setIsDeleting(undefined)
            },
            onError: async (err) => {
               toast.error(`Error while deleting job level: ${isDeleting.name}`)

               setIsDeleting(undefined)
            }
         })
      }
   }

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }

   const columns: GridColDef<JobLevelType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'name',
            flex: 0.3,
            headerName: 'Name',
            renderCell: (params: GridCellParams<JobLevelType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.name}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'description',
            flex: 0.7,
            headerName: 'Description',
            renderCell: (params: GridCellParams<JobLevelType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.description}</DataGridCellText>
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
            getActions: (params: GridRowParams<JobLevelType>) => {
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
         <Box>
            <Grid
               container
               justifyContent="flex-end"
               columnSpacing={commonTheme.space?.form?.horizontal}
            >
               {/* Các button và search nằm bên phải */}
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
                        router.push(PAGE_ROUTES.ADMIN.JOB_LEVEL.ADD)
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
               rows={jobLevels || []}
               rowHeight={64}
               rowCount={data?.meta?.total || 0}
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
