'use client'

import Button from '@/app/components/button/Button'
import DataGrid from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import SearchTextField from '@/app/components/input/SearchTextField'
import TextField from '@/app/components/input/TextField'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useDeleteFeature, useGetFeatures } from '@/app/hooks/api/feature.hook'
import useLoading from '@/app/hooks/useLoading'
import { useToast } from '@/app/hooks/useToast'
import { FeatureType } from '@/app/types/feature.type'
import { ContainerStyled } from '@/styles/common.styles'
import {
   DeleteOutlined,
   EditOutlined,
   EyeOutlined,
   PlusOutlined,
   SearchOutlined
} from '@ant-design/icons'
import {
   Box,
   Grid as Grid,
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
   const { setLoading } = useLoading()

   const [features, setFeatures] = useState<FeatureType[]>([])
   const [isDeleting, setIsDeleting] = useState<FeatureType | undefined>()

   const queryClient = useQueryClient()
   const { mutate: deleteFeature } = useDeleteFeature()

   const handleEdit = (featureType: FeatureType) => {
      router.push(`${PAGE_ROUTES.ADMIN.FEATURE.EDIT}/${featureType.id}`)
   }

   const handleView = () => { }
   const handleDelete = (feature: FeatureType) => {
      setIsDeleting(feature)
   }
   const handleConfirmDelete = () => {
      if (isDeleting) {
         setLoading(true)
         deleteFeature(isDeleting.id, {
            onSuccess: async () => {
               await queryClient.invalidateQueries(API_ROUTES.FEATURE.INDEX)
               setLoading(false)

               toast.success(`Successfully deleted feature: ${isDeleting.name}`)
            },
            onError: async (error: any) => {
               setLoading(false)
               toast.error(`${error?.response?.data?.message || 'Error while deleting feature'}`)
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
   const [filters, setFilters] = useState({
   })

   const { data } = useGetFeatures({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1,
   })

   const columns: GridColDef<FeatureType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'name',
            flex: 0.4,
            headerName: 'Name',
            renderCell: (params: GridCellParams<FeatureType>) => {
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
            flex: 0.8,
            headerName: 'Description',
            renderCell: (params: GridCellParams<FeatureType>) => {
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
                           display: '-webkit-box',
                           fontSize: '14px',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           WebkitBoxOrient: 'vertical',
                           WebkitLineClamp: 2,
                           whiteSpace: 'wrap',
                           wordWrap: 'break-word'
                        }}
                     >
                        {row?.description}
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
            getActions: (params: GridRowParams<FeatureType>) => {
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

   useEffect(() => {
      setFeatures((data?.data as FeatureType[]) || [])
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
                  router.push(PAGE_ROUTES.ADMIN.FEATURE.ADD)
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
               rows={features}
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
                  },
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
