import { DeleteFilled } from '@ant-design/icons'
import {
   Avatar,
   Box,
   DialogActions,
   DialogContent,
   Dialog as MuiDialog,
   DialogProps as MuiDialogProps,
   styled
} from '@mui/material'
import Button from '../button/Button'
import BodyText from '../text/BodyText'
import HeadingText from '../text/HeadingText'

type DeleteConfirmationDialogProps = MuiDialogProps & {
   title?: string
   description?: string
   onCancel?: () => void
   onConfirm?: () => void
}

const MuiDialogStyled = styled(MuiDialog)<DeleteConfirmationDialogProps>({})

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
   title,
   description,
   open,
   onCancel,
   onConfirm,
   ...restProps
}: DeleteConfirmationDialogProps) => {
   return (
      <MuiDialogStyled open={open} {...restProps}>
         <DialogContent sx={{ maxWidth: '440px' }}>
            <Box
               sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '8px'
               }}
            >
               <Avatar
                  sx={{
                     width: '72px',
                     height: '72px',
                     backgroundColor: 'rgb(255, 241, 240)'
                  }}
               >
                  <DeleteFilled
                     style={{ color: '#ff4d4f', fontSize: '28px' }}
                  />
               </Avatar>
            </Box>
            <Box sx={{ marginTop: '20px' }}>
               <HeadingText variant="h4" sx={{ textAlign: 'center' }}>
                  {title || 'Are you sure you want to delete?'}
               </HeadingText>
               <BodyText sx={{ marginTop: '1rem', textAlign: 'center' }}>
                  {description ||
                     'By deleting, all associated data will also be deleted.'}
               </BodyText>
            </Box>
         </DialogContent>
         <DialogActions>
            <Box
               sx={{ padding: '20px', display: 'flex', width: '100%', gap: 2 }}
            >
               <Button
                  size="small"
                  title="Cancel"
                  sx={{ width: '100%' }}
                  color={'secondary'}
                  onClick={onCancel}
               />
               <Button
                  size="small"
                  title="Delete"
                  sx={{ width: '100%' }}
                  color={'error'}
                  onClick={onConfirm}
               />
            </Box>
         </DialogActions>
      </MuiDialogStyled>
   )
}

export default DeleteConfirmationDialog
