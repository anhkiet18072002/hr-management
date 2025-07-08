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
import { useDeleteProjectRole, useGetProjectRoles } from '@/app/hooks/api'
import { useToast } from '@/app/hooks/useToast'
import { ProjectRoleType } from '@/app/types/project.type'
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
   const [isDeleting, setIsDeleting] = useState<ProjectRoleType | undefined>()
   const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION)

   const queryClient = useQueryClient()
   const { mutate: deleteProjectRole } = useDeleteProjectRole()

   const [projectRoles, setProjectRoles] = useState<ProjectRoleType[]>([])

   const { data } = useGetProjectRoles({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1
   })

   useEffect(() => {
      setProjectRoles((data?.data as ProjectRoleType[]) || [])
   }, [data])

   const handleView = (project: ProjectRoleType) => { }

   const handleEdit = (projectType: ProjectRoleType) => {
      router.push(`${PAGE_ROUTES.ADMIN.PROJECT.ROLE.EDIT}/${projectType.id}`)
   }

   const handleDelete = (project: ProjectRoleType) => {
      setIsDeleting(project)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteProjectRole(isDeleting.id, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(
                  API_ROUTES.PROJECT_ROLE.INDEX
               )

               toast.success(
                  `Successfully delete project role: ${isDeleting.name}`
               )

               setIsDeleting(undefined)
            },
            onError: async (err) => {
               toast.error(
                  `Error while deleting project role: ${isDeleting.name}`
               )

               setIsDeleting(undefined)
            }
         })
      }
   }

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }

   const columns: GridColDef<ProjectRoleType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'name',
            flex: 0.3,
            headerName: 'Name',
            renderCell: (params: GridCellParams<ProjectRoleType>) => {
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
            renderCell: (params: GridCellParams<ProjectRoleType>) => {
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
            getActions: (params: GridRowParams<ProjectRoleType>) => {
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
         <Grid
            sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'flex-end'
            }}
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
                  router.push(PAGE_ROUTES.ADMIN.PROJECT.ROLE.ADD)
               }}
               startIcon={<PlusOutlined />}
               size="small"
               title="Add"
            />
         </Grid>
         <Box sx={{ marginTop: '20px', width: '100%', overflow: 'auto' }}>
            <DataGrid
               columns={columns}
               rows={projectRoles || []}
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
