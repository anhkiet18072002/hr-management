import {
   Box,
   BoxProps,
   Dialog as MuiDialog,
   DialogProps as MuiDialogProps,
   styled,
   Typography
} from '@mui/material'
import React from 'react'

const ContainerStyle = styled(Box)<BoxProps>({
   display: 'flex',
   flexDirection: 'column',
   height: '100%',
   width: '100%'
})

const MuiDialogStyled = styled(MuiDialog, {
   // Ngăn MUI warning vì ta custom prop width, minHeight
   shouldForwardProp: (prop) => !['width', 'minHeight'].includes(prop as string)
})<DialogProps>(({ width = 640, minHeight = 360 }) => ({
   '& .MuiPaper-root': {
      width: typeof width === 'number' ? `${width}px` : width,
      minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
      maxWidth: 'none'
   }
}))

type DialogProps = MuiDialogProps & {
   children: React.ReactNode
   open: boolean
   title?: string
   width?: number | string
   minHeight?: number | string
}

const Dialog: React.FC<DialogProps> = ({
   children,
   open,
   onClose,
   title,
   width,
   minHeight,
   ...rest
}) => {
   return (
      <MuiDialogStyled
         open={open}
         onClose={(event, reason) => {
            // Ngăn đóng khi click backdrop
            if (reason === 'backdropClick') return
            onClose?.(event, reason)
         }}
         fullWidth
         maxWidth={false}
         width={width}
         minHeight={minHeight}
         {...rest}
      >
         <ContainerStyle>
            {/* Header */}
            <Box
               sx={{
                  borderBottom: '1px solid #ccc',
                  padding: '20px 20px 10px'
               }}
            >
               <Typography component={'h3'} sx={{ fontWeight: 600 }}>
                  {title || 'Dialog'}
               </Typography>
            </Box>

            {/* Body */}
            <Box sx={{ width: '100%', padding: '16px 20px', flexGrow: 1 }}>
               {children}
            </Box>
         </ContainerStyle>
      </MuiDialogStyled>
   )
}

export default Dialog
