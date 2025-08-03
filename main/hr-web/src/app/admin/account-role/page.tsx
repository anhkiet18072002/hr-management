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
import { useDeleteAccountRole, useGetAccountRoles } from '@/app/hooks/api/account.role.hook'
import useLoading from '@/app/hooks/useLoading'
import { useToast } from '@/app/hooks/useToast'
import { AccountRoleType } from '@/app/types/account-role'
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

    const [accountRoles, setAccountRoles] = useState<AccountRoleType[]>([])
    const [isDeleting, setIsDeleting] = useState<AccountRoleType | undefined>()

    const queryClient = useQueryClient()
    const { mutate: deleteAccountRole } = useDeleteAccountRole()

    const handleEdit = (accountroletype: AccountRoleType) => {
        router.push(`${PAGE_ROUTES.ADMIN.ACCOUNT_ROLE.EDIT}/${accountroletype.id}`)
    }

    const handleView = () => { }
    const handleDelete = (accountrole: AccountRoleType) => {
        setIsDeleting(accountrole)
    }

    const handleConfirmDelete = () => {
        if (isDeleting) {
            setLoading(true)

            deleteAccountRole(isDeleting.id, {
                onSuccess: async () => {
                    await queryClient.invalidateQueries(API_ROUTES.ACCOUNT_ROLE.INDEX)
                    setLoading(false)
                    toast.success(`Successfully deleted account role: ${isDeleting.account.email}`)
                },
                onError: async (err: any) => {
                    setLoading(false)

                    toast.error(`${err?.response?.data?.message || 'Error while deleting account role'}`)
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

    const { data } = useGetAccountRoles({
        ...filters,
        limit: paginationModel.pageSize,
        page: paginationModel.page + 1
    })

    const columns: GridColDef<AccountRoleType>[] = useMemo(
        () => [
            {
                field: 'accountId',
                flex: 0.5,
                headerName: 'Account',
                renderCell: (params: GridCellParams<AccountRoleType>) => {
                    const { row } = params

                    return (
                        <DataGridCell>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <DataGridCellText>{row.account.username}</DataGridCellText>
                                <DataGridCellText>{row.account.email}</DataGridCellText>    
                            </div>
                        </DataGridCell>
                    )
                }
            },
            {
                field: 'roleId',
                flex: 0.5,
                headerName: 'Role',
                renderCell: (params: GridCellParams<AccountRoleType>) => {
                    const { row } = params

                    return (
                        <DataGridCell>
                            <DataGridCellText>{row.role.name}</DataGridCellText>
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
                getActions: (params: GridRowParams<AccountRoleType>) => {
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
        setAccountRoles((data?.data as AccountRoleType[]) || [])
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
                    placeholder="Search by account, role"
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
                        router.push(PAGE_ROUTES.ADMIN.ACCOUNT_ROLE.ADD)
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
                    rows={accountRoles}
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
