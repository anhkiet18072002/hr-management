'use client'

import Button from '@/app/components/button/Button'
import DataGrid from '@/app/components/datagrid/DataGrid'
import DeleteConfirmationDialog from '@/app/components/dialog/DeleteConfirmationDialog'
import SearchTextField from '@/app/components/input/SearchTextField'
import { API_ROUTES, PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useDeleteSkill, useGetSkills } from '@/app/hooks/api'
import { SkillType } from '@/app/types'
import { ContainerStyled } from '@/styles/common.styles'
import {
   DeleteOutlined,
   EditOutlined,
   EyeOutlined,
   PlusOutlined
} from '@ant-design/icons'
import {
   Box,
   Grid,
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
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

const Page = () => {
   const router = useRouter()
   const queryClient = useQueryClient()

   const [skills, setSkills] = useState<SkillType[]>([])
   const [isDeleting, setIsDeleting] = useState<SkillType | undefined>()

   const { mutate: deleteSkill } = useDeleteSkill()

   const handleView = () => { }

   const handleEdit = (skill: SkillType) => {
      router.push(`${PAGE_ROUTES.ADMIN.SKILL.EDIT}/${skill.id}`)
   }

   const handleDelete = (skill: SkillType) => {
      setIsDeleting(skill)
   }

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }

   const handleConfirmDelete = () => {
      if (isDeleting) {
         deleteSkill(isDeleting?.id, {
            onSuccess: async (res) => {
               await queryClient.invalidateQueries(API_ROUTES.SKILL.INDEX)

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

   const { data } = useGetSkills({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1,
      sort: 'name|asc'
   })

   useEffect(() => {
      setSkills((data?.data as SkillType[]) || [])
   }, [data])

   const columns: GridColDef<SkillType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'name',
            flex: 0.2,
            headerName: 'Name',
            renderCell: (params: GridCellParams<SkillType>) => {
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
            renderCell: (params: GridCellParams<SkillType>) => {
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
            getActions: (params: GridRowParams<SkillType>) => {
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
                     router.push(PAGE_ROUTES.ADMIN.SKILL.ADD)
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
               rows={skills}
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
