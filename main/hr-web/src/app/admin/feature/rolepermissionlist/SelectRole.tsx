import Button from '@/app/components/button/Button'
import Dialog from '@/app/components/dialog/Dialog'
import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import { commonTheme } from '@/app/configs/theme.config'
import { useEditRole } from '@/app/hooks/api/role.hook'
import { PermissionType } from '@/app/types/permission.type'
import { RoleType } from '@/app/types/role.type'
import { ContainerStyled } from '@/styles/common.styles'
import { useEffect, useState } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import {
   Box,
   Checkbox,
   Grid,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Typography
} from '@mui/material'
type AddEditPermissionProps = {
   control: any
   open: boolean
   onClose?: () => void
   name: string
   permissionSet: PermissionType[]
   onRemove?: (index: number) => void
   roleSet: RoleType[]
   setValue?: any
}

const actions = [
   { label: 'Full Access', key: 'MANAGE' },
   { label: 'Read', key: 'READ' },
   { label: 'Create', key: 'CREATE' },
   { label: 'Update', key: 'UPDATE' },
   { label: 'Delete', key: 'DELETE' }
]

const groupPermissions = (permissions: PermissionType[]) => {
   const grouped: Record<string, Record<string, PermissionType | undefined>> = {}
   permissions.forEach((p) => {
      if (p.key.includes('CORE')) return
      const [itemKey, actionRaw] = p.key.split('.')
      const actionKey = actionRaw === 'manage' ? 'fullAccess' : actionRaw
      grouped[itemKey] ??= {}
      grouped[itemKey][actionKey] = p
   })
   return grouped
}

const AddEditPermission: React.FC<AddEditPermissionProps> = ({
   control, name, permissionSet, onRemove, open, onClose, roleSet, setValue
}) => {
   const { mutate: editRole } = useEditRole()
   const [initialPermission, setInitialPermission] = useState<string[]>([]);

   const watchedRoleId = useWatch({
      control,
      name: `${name}.roleId`
   })
   const watchedPermissionId = useWatch({
      control,
      name: `${name}.permissionId`
   })
   const index = parseInt(name?.replace(/\D+/g, ''))

   const handleSubmit = () => {
      const roleFeaturePermissions = watchedPermissionId.map((id: any) => ({ permissionId: id }))
      // console.log("roleFeaturePermissions", roleFeaturePermissions)
      //console.log("watchedRoleId", watchedRoleId)
      if (watchedRoleId) {
         editRole({ id: watchedRoleId, roleFeaturePermissions })

      }
      onClose?.()
   }

   const handleSelectAll = (onChange: (val: string[]) => void) => {
      const allIds = Array.from(new Set(
         Object.values(groupPermissions(permissionSet)).flatMap((perms) =>
            Object.values(perms).flatMap((p) => (p?.id ? [p.id] : []))
         )
      ))
      onChange(allIds)
   }

   const handleClearAll = (onChange: (val: string[]) => void) => {
      onChange([])
   }

   useEffect(() => {
      if (open) {
         setInitialPermission(watchedPermissionId || []);
      }
   }, [open]);

   const renderPermissionsTable = (value: string[], onChange: (val: string[]) => void) => {
      const handleToggle = (perm: PermissionType, permsOfItem: Record<string, PermissionType | undefined>) => {
         const id = perm.id
         if (!id) return
         let newValue = [...value]

         const isFullAccess = perm.key.includes('.MANAGE')
         const managePerm = Object.values(permsOfItem).find(p => p?.key.includes('.MANAGE'))

         if (isFullAccess) {
            const ids = Object.values(permsOfItem).flatMap(p => (p?.id ? [p.id] : []))
            const allChecked = ids.every(id => value.includes(id))
            newValue = allChecked ? value.filter(
               v => !ids.includes(v)) : [...value, ...ids.filter(id => !value.includes(id))]
         } else {
            const isChecked = value.includes(id)
            newValue = isChecked ? value.filter(v => v !== id) : [...value, id]

            const others = Object.values(permsOfItem).filter(
               p => p && !p.key.includes('.MANAGE')).flatMap(p => (p?.id ? [p.id] : []))
            const allOthersChecked = others.every(id => newValue.includes(id))

            if (managePerm?.id) {
               if (allOthersChecked && !newValue.includes(managePerm.id))
                  newValue.push(managePerm.id)
               if (!allOthersChecked && newValue.includes(managePerm.id))
                  newValue = newValue.filter(v => v !== managePerm.id)
            }
         }
         onChange(newValue)
      }

      return (
         <>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell><b>Configuration Item</b></TableCell>
                     {actions.map(({ label }) => (
                        <TableCell key={label}><b>{label}</b></TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {Object.entries(groupPermissions(permissionSet)).map(([itemKey, perms]) => (
                     <TableRow key={itemKey}>
                        <TableCell>{itemKey}</TableCell>
                        {actions.map(({ key }) => {
                           const perm = perms[key]
                           return (
                              <TableCell key={key}>
                                 {perm ? (
                                    <Checkbox
                                       checked={value.includes(perm.id)}
                                       onChange={() => handleToggle(perm, perms)}
                                    />
                                 ) : (
                                    <Typography sx={{ opacity: 0.5 }}>✕</Typography>
                                 )}
                              </TableCell>
                           )
                        })}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
               <Button
                  title="Select All" variant="contained"
                  onClick={() => handleSelectAll(onChange)}
               />
               <Button
                  title="Deselect All"
                  variant="outlined"
                  color="error"
                  onClick={() => handleClearAll(onChange)}
               />
            </Box>
         </>
      )
   }

   return (
      <ContainerStyled>
         <Dialog title="Select Role" open={open} onClose={onClose}>
            <Box>
               <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
                  <Box width={{ xs: '20%', sm: '4' }}>
                     <Controller
                        name={`${name}.roleId`}
                        control={control}
                        render={({ field: { value } }) => (
                           <FormAutocomplete
                              label="Role"
                              getOptionLabel={(option) => option?.name ?? ''}
                              options={roleSet}
                              value={roleSet.find((role) => role.id === value) || null}
                              disabled
                           />
                        )}
                     />
                  </Box>
               </Grid>
               <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
                  <Controller
                     name={`${name}.permissionId`}
                     control={control}
                     render={({ field: { value = [], onChange } }) =>
                        renderPermissionsTable(value, onChange)
                     }
                  />
               </Grid>

               <Box
                  sx={{
                     borderTop: '1px solid grey',
                     display: 'flex',
                     justifyContent: 'flex-end',
                     pt: 2, pb: 1, gap: 1
                  }}
               >
                  <Button title="Cancel" onClick={() => {
                     if (setValue) setValue(`${name}.permissionId`, initialPermission); // Reset lại permission
                     onClose?.();
                     onRemove?.(index)
                  }} />
                  <Button title="Submit" onClick={handleSubmit} />
               </Box>
            </Box>
         </Dialog>
      </ContainerStyled>
   )
}

export default AddEditPermission
