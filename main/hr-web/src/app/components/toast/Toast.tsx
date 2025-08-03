import { ToastType } from '@/app/contexts/ToastContext'
import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Toast = ({ toast }: { toast: ToastType }) => {
   const [open, setOpen] = useState(toast.open)

   const handleClose = (
      event: React.SyntheticEvent<any> | Event,
      reason?: SnackbarCloseReason
   ) => {
      event?.preventDefault()

      if (reason === 'clickaway') {
         return
      }

      setOpen(false)
   }

   useEffect(() => {
      setOpen(toast.open)
   }, [toast])

   return (
      <Snackbar
         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
         autoHideDuration={5000}
         onClose={handleClose}
         open={open}
      >
         <Alert
            severity={toast.severity}
            sx={{ width: '100%' }}
            onClose={handleClose}
         >
            {toast.message}
         </Alert>
      </Snackbar>
   )
}

export default Toast
