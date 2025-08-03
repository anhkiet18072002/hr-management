import { commonTheme } from '@/app/configs/theme.config'
import { PermissionType } from '@/app/types/permission.type'
import {
   Box,
   Button,
   Checkbox,
   Grid,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'

type AddEditPermissionProps = {
   control: any
   errors: any
   permissionSet: PermissionType[]
}

const AddPermission: React.FC<AddEditPermissionProps> = (props) => {
   const { control, errors, permissionSet } = props
   const [permissionList, setPermissionList] = useState<PermissionType[]>([])

   useEffect(() => {
      if (permissionSet) {
         const filteredPermission = permissionSet.filter(
            (permission) => !permission.key.startsWith('CORE')
         )
         setPermissionList(filteredPermission)
      }
   }, [permissionSet])

   const actions = [
      { label: 'Full Access', key: 'MANAGE' },
      { label: 'Read', key: 'READ' },
      { label: 'Create', key: 'CREATE' },
      { label: 'Update', key: 'UPDATE' },
      { label: 'Delete', key: 'DELETE' }
   ]
   const groupPermissions = (permissions: PermissionType[]) => {
      const grouped: Record<
         string,
         Record<string, PermissionType | undefined>
      > = {}

      permissions.forEach((permission) => {
         const [itemKey, actionKeyRaw] = permission.key.split('.')
         const actionKey =
            actionKeyRaw === 'manage' ? 'fullAccess' : actionKeyRaw

         if (!grouped[itemKey]) {
            grouped[itemKey] = {}
         }

         // Lưu id thay vì key
         grouped[itemKey][actionKey] = permission
      })

      return grouped
   }

   return (
      <Box sx={{ width: '100%' }}>
         <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
            <Controller
               name="roleFeaturePermissions"
               control={control}
               render={({ field: { value = [], onChange } }) => {
                  const grouped = groupPermissions(permissionList)

                  const handleToggle = (
                     perm: PermissionType,
                     permsOfItem: Record<string, PermissionType | undefined>
                  ) => {
                     const isFullAccess = perm.key.includes('.MANAGE')

                     if (isFullAccess) {
                        const idsToToggle: string[] = Object.values(
                           permsOfItem
                        ).flatMap((p) => (p?.id ? [p.id] : []))

                        const allChecked = idsToToggle.every((id) =>
                           value.some((v: any) => v.permissionId === id)
                        )

                        const newIds = allChecked
                           ? value.filter(
                                (v: any) =>
                                   v && !idsToToggle.includes(v.permissionId)
                             )
                           : [
                                ...value,
                                ...idsToToggle
                                   .filter(
                                      (id) =>
                                         !value.some(
                                            (v: any) => v.permissionId === id
                                         )
                                   )
                                   .map((id) => ({ permissionId: id }))
                             ]

                        onChange(newIds)
                     } else {
                        const id = perm.id
                        let newIds = value.some(
                           (v: any) => v.permissionId === id
                        )
                           ? value.filter((v: any) => v.permissionId !== id)
                           : [...value, { permissionId: id }]

                        const managePerm = Object.values(permsOfItem).find(
                           (p) => p?.key.includes('.MANAGE')
                        )
                        const otherPerms = Object.values(permsOfItem)
                           .filter((p) => p?.key && !p.key.includes('.MANAGE'))
                           .flatMap((p) => (p?.id ? [p.id] : []))

                        const allOtherChecked = otherPerms.every((id) =>
                           newIds.some((v: any) => v.permissionId === id)
                        )

                        if (managePerm?.id) {
                           if (
                              allOtherChecked &&
                              !newIds.some(
                                 (v: any) => v.permissionId === managePerm.id
                              )
                           ) {
                              newIds = [
                                 ...newIds,
                                 { permissionId: managePerm.id }
                              ]
                           }
                           if (
                              !allOtherChecked &&
                              newIds.some(
                                 (v: any) => v.permissionId === managePerm.id
                              )
                           ) {
                              newIds = newIds.filter(
                                 (v: any) => v.permissionId !== managePerm.id
                              )
                           }
                        }

                        onChange(newIds)
                     }
                  }

                  // ✅ Hàm tick hết
                  const handleSelectAll = () => {
                     const allIds: string[] = []
                     Object.values(grouped).forEach((permsOfItem) => {
                        Object.values(permsOfItem).forEach((p) => {
                           if (p?.id) allIds.push(p.id)
                        })
                     })
                     const uniqueIds = Array.from(new Set(allIds))
                     const mapped = uniqueIds.map((id) => ({
                        permissionId: id
                     }))
                     onChange(mapped)
                  }

                  const handleClearAll = () => {
                     onChange([])
                  }

                  return (
                     <>
                        <Table>
                           <TableHead>
                              <TableRow>
                                 <TableCell>
                                    <b>Configuration Item</b>
                                 </TableCell>
                                 {actions.map(({ label }) => (
                                    <TableCell key={label}>
                                       <b>{label}</b>
                                    </TableCell>
                                 ))}
                              </TableRow>
                           </TableHead>

                           <TableBody>
                              {Object.entries(grouped).map(
                                 ([itemKey, perms]) => (
                                    <TableRow key={itemKey}>
                                       <TableCell>{itemKey}</TableCell>
                                       {actions.map(({ key }) => {
                                          const perm = perms[key]
                                          return (
                                             <TableCell key={key}>
                                                {perm ? (
                                                   <Checkbox
                                                      checked={value.some(
                                                         (v: any) =>
                                                            v.permissionId ===
                                                            perm.id
                                                      )}
                                                      onChange={() =>
                                                         handleToggle(
                                                            perm,
                                                            perms
                                                         )
                                                      }
                                                   />
                                                ) : (
                                                   <Typography
                                                      sx={{
                                                         opacity: 0.5
                                                      }}
                                                   >
                                                      ✕
                                                   </Typography>
                                                )}
                                             </TableCell>
                                          )
                                       })}
                                    </TableRow>
                                 )
                              )}
                           </TableBody>
                        </Table>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                           <Box
                              sx={{
                                 display: 'flex',
                                 gap: 2,
                                 mb: 2,
                                 marginTop: '20px'
                              }}
                           >
                              <Button
                                 variant="contained"
                                 onClick={handleSelectAll}
                              >
                                 Select All
                              </Button>
                              <Button
                                 variant="outlined"
                                 color="error"
                                 onClick={handleClearAll}
                              >
                                 Deselect all
                              </Button>
                           </Box>
                        </Box>
                     </>
                  )
               }}
            />
         </Grid>
      </Box>
   )
}

export default AddPermission
