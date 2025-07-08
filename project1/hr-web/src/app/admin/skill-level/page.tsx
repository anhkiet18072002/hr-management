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
   useDeleteSkillLevel,
   useGetSkillLevels
} from '@/app/hooks/api/skill.level.hook'
import { useToast } from '@/app/hooks/useToast'
import { SkillLevelType } from '@/app/types/skill.type'
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
   const [isDeleting, setIsDeleting] = useState<SkillLevelType | undefined>()
   const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION)

   const queryClient = useQueryClient()
   const { mutate: deleteSkillLevel } = useDeleteSkillLevel()

   const [SkillLevels, setSkillLevels] = useState<SkillLevelType[]>([])

   const { data } = useGetSkillLevels({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1
   })

   useEffect(() => {
      setSkillLevels((data?.data as SkillLevelType[]) || [])
   }, [data])

   const handleView = (skillLevel: SkillLevelType) => { }

   const handleEdit = (skillLevel: SkillLevelType) => {
      router.push(`${PAGE_ROUTES.ADMIN.SKILL_LEVEL.EDIT}/${skillLevel.id}`)
   }

   const handleDelete = (skillLevel: SkillLevelType) => {
      setIsDeleting(skillLevel)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteSkillLevel(isDeleting.id, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(
                  `${API_ROUTES.SKILL_LEVEL.INDEX}`
               )

               toast.success(
                  `Successfully delete skill level: ${isDeleting.name}`
               )

               setIsDeleting(undefined)
            },
            onError: async () => {
               toast.error(
                  `Error while deleting skill level: ${isDeleting.name}`
               )

               setIsDeleting(undefined)
            }
         })
      }
   }

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }

   const columns: GridColDef<SkillLevelType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'name',
            flex: 0.3,
            headerName: 'Name',
            renderCell: (params: GridCellParams<SkillLevelType>) => {
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
            renderCell: (params: GridCellParams<SkillLevelType>) => {
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
            getActions: (params: GridRowParams<SkillLevelType>) => {
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
                        router.push(PAGE_ROUTES.ADMIN.SKILL_LEVEL.ADD)
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
               rows={SkillLevels || []}
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
