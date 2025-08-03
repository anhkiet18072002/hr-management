import { commonTheme } from '@/app/configs/theme.config'
import { permissionClient } from '@/app/hooks/api/permission.api'
import { roleClient } from '@/app/hooks/api/role.api'
import { PermissionType } from '@/app/types/permission.type'
import { RolePermissionType } from '@/app/types/role.feature.permission.type'
import { RoleType } from '@/app/types/role.type'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Box, Tooltip, Typography } from '@mui/material'
import {
   DataGrid,
   GridActionsCellItem,
   GridCellParams,
   GridColDef,
   GridRowParams
} from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import AddEditPermission from './SelectRole'
import useLoading from '@/app/hooks/useLoading'

type RolePermissionListProps = {
   data: RolePermissionType[]
   control: any
   permissions: PermissionType[]
   roles: RoleType[]
   roleSet: RoleType[]
   setValue: any
   onRemove?: (index: number) => void
}

const RolePermissionList = ({
   data,
   onRemove,
   control,
   permissions,
   roles,
   setValue
}: RolePermissionListProps) => {

   const [selectRoles, setSelectRoles] = useState<RolePermissionType[]>([])
   const [indexRow, setIndexRow] = useState<any>()
   const [isEditing, setEditing] = useState(false)
   const { setLoading } = useLoading()

   const groupedPermissions = (permissionKeys: string[]): Record<string, string[]> => {
      // Chia permissionKeys thành các nhóm dựa trên prefix
      const grouped = permissionKeys.reduce((acc, key) => {
         const [perFix, action] = key.split('.')
         if (!acc[perFix]) acc[perFix] = new Set()
         acc[perFix].add(action)
         return acc

      }, {} as Record<string, Set<string>>)
      // Chuyển đổi các nhóm thành mảng
      return Object.fromEntries(
         Object.entries(grouped).map(([perFix, actions]) => [
            perFix,
            actions.has('MANAGE') ? ['MANAGE'] : [...actions]
         ])
      )
   }

   useEffect(() => {
      setLoading(true)
      if (!data?.length) {
         setSelectRoles([])
         setLoading(false)
         return
      }
      // Lấy thông tin chi tiết cho từng roleId và permissionId
      const loadDetails = async () => {
         const detailed = await Promise.all(
            data.map(async ({ roleId, permissionId, ...rest }) => {
               const role = await roleClient.findOne(roleId)
               const ids = Array.isArray(permissionId)
                  ? permissionId
                  : permissionId
                     ? [permissionId]
                     : []

               const permissions = await Promise.all(
                  ids.map((id) => permissionClient.findOne(id))
               )
               return {
                  ...rest,
                  roleId,
                  id: roleId,
                  role,
                  permissionKeys: permissions.map((r) => r.key)
               }
            })
         )
         setSelectRoles(detailed)
         setLoading(false)
      }
      loadDetails()
      
   }, [JSON.stringify(data)])

   const handleEdit = (rows?: RolePermissionType) => {
      if (!rows) return
      const index = selectRoles.findIndex((item) => item.roleId === rows.roleId)
      if (index === -1) return
      setIndexRow(index)
      setEditing(true)
   }

   const handleDelete = (rows: RolePermissionType) => {
      if (!rows) return
 
      const index = selectRoles.findIndex((item) => item.roleId === rows.roleId)
      onRemove?.(index)
   }

   const columns: GridColDef<RolePermissionType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'role',
            flex: 0.2,
            headerName: 'Role',
            renderCell: (params: GridCellParams<RolePermissionType>) => {
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
                        {row?.role?.name}
                     </Typography>
                  </Box>
               )
            }
         },
         {
            field: 'permission',
            flex: 0.8,
            headerName: 'Permission',
            renderCell: (
               params: GridCellParams<
                  RolePermissionType & { permissionKeys?: string[] }
               >
            ) => {
               const { row } = params

               const grouped = groupedPermissions(row.permissionKeys || [])

               const rendered = Object.entries(grouped).map(([prefix, actions], index) => (
                  <Box key={index} sx={{ marginBottom: '8px' }}>
                     <Typography component={'div'} sx={{ display: 'block' }}>
                        <strong>{prefix}</strong>: {actions.join(', ')}
                     </Typography>
                  </Box>
               ))

               return (
                  <Box>
                     <div>{rendered}</div>
                  </Box>
               )
            }
         },
         {
            field: 'actions',
            minWidth: 100,
            maxWidth: 100,
            headerName: '',
            type: 'actions',
            getActions: (params: GridRowParams<RolePermissionType>) => {
               const { row } = params

               return [
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
      [handleEdit, handleDelete]
   )

   return (
      <>
         <Box>
            <DataGrid
               columns={columns}
               rows={selectRoles || []}
               getRowHeight={() => 'auto'}
               sx={{
                  '& .MuiDataGrid-cell': {
                     paddingTop: '8px',
                     paddingBottom: '8px'
                  }
               }}
            />
         </Box>
         {isEditing && indexRow !== undefined && selectRoles[indexRow] && (
            <AddEditPermission
               key={selectRoles[indexRow].roleId}
               control={control}
               open={isEditing}
               name={`roleFeaturePermissions[${indexRow}]`}
               permissionSet={permissions}
               roleSet={roles}
               setValue={setValue}
               onClose={() => {
                  setEditing(false)
                  setIndexRow(undefined)
               }}
            />
         )}
      </>
   )
}

export default RolePermissionList