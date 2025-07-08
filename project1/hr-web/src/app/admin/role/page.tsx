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
import { useDeleteRole, useGetRoles } from '@/app/hooks/api/role.hook'
import useLoading from '@/app/hooks/useLoading'
import { useToast } from '@/app/hooks/useToast'
import { RoleType } from '@/app/types/role.type'
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
   const { setLoading } = useLoading()

   const [roles, setRoles] = useState<RoleType[]>([])
   const [isDeleting, setIsDeleting] = useState<RoleType | undefined>()

   const queryClient = useQueryClient()
   const { mutate: deleteRole } = useDeleteRole()

   const handleEdit = (roletype: RoleType) => {
      router.push(`${PAGE_ROUTES.ADMIN.ROLE.EDIT}/${roletype.id}`)
   }

   const handleView = () => { }
   const handleDelete = (role: RoleType) => {
      setIsDeleting(role)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         setLoading(true)

         deleteRole(isDeleting.id, {
            onSuccess: async () => {
               await queryClient.invalidateQueries(API_ROUTES.ROLE.INDEX)
               setLoading(false)

               toast.success(`Successfully deleted role: ${isDeleting.name}`)
            },
            onError: async (err: any) => {
               setLoading(false)

               toast.error(`${err?.response?.data?.message || 'Error while deleting role'}`)
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

   const { data } = useGetRoles({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1
   })

   const columns: GridColDef<RoleType>[] = useMemo(
      () => [
         {
            field: 'name',
            flex: 0.5,
            headerName: 'Name',
            renderCell: (params: GridCellParams<RoleType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.name}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'key',
            flex: 0.5,
            headerName: 'Key',
            renderCell: (params: GridCellParams<RoleType>) => {
               const { row } = params

               return (
                  <DataGridCell>
                     <DataGridCellText>{row.key}</DataGridCellText>
                  </DataGridCell>
               )
            }
         },
         {
            field: 'description',
            flex: 1,
            headerName: 'Description',
            renderCell: (params: GridCellParams<RoleType>) => {
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
            headerName: '',
            type: 'actions',
            minWidth: 120,
            maxWidth: 120,
            getActions: (params: GridRowParams<RoleType>) => {
               const row = params.row
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
      [handleEdit, handleDelete, handleView]
   )

   useEffect(() => {
      setRoles((data?.data as RoleType[]) || [])
   }, [data])

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
               placeholder="Search by name, key, description"
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
                  router.push(PAGE_ROUTES.ADMIN.ROLE.ADD)
               }}
               startIcon={<PlusOutlined />}
               size="small"
               title="Add"
            />
         </Grid>
         <Box sx={{ marginTop: '20px', width: '100%', overflow: 'auto' }}>
            <DataGrid
               columns={columns}
               filterMode={'server'}
               paginationMode={'server'}
               rows={roles}
               rowHeight={64}
               rowCount={data?.meta?.total || 0}
               paginationModel={{
                  page: data?.meta?.page ? data?.meta?.page - 1 : 0,
                  pageSize: data?.meta?.pageSize || 10
               }}
               onPaginationModelChange={handlePaginate}
               sx={{
                  '& .MuiDataGrid-virtualScroller': {
                     overflow: 'visible'
                  }
               }}
            />
         </Box>
         <DeleteConfirmationDialog
            title={'Are you sure you want to delete?'}
            open={isDeleting !== undefined}
            onCancel={() => setIsDeleting(undefined)}
            onConfirm={handleConfirmDelete}
         />
      </ContainerStyled>
   )
}

export default Page
