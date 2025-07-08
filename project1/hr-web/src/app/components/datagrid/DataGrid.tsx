'use client'

import { commonTheme } from '@/app/configs/theme.config'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import {
   Box as MuiBox,
   BoxProps,
   styled,
   TypographyProps,
   Typography as MuiTypography
} from '@mui/material'
import {
   DataGrid as MuiDataGrid,
   DataGridProps as MuiDataGridProps
} from '@mui/x-data-grid'
import React from 'react'

const MuiDataGridStyled = styled(MuiDataGrid)<DataGridProps>({
   backgroundColor: 'white',
   border: '1px solid #f0f0f0',
   width: '100%'
})

const MuiBoxStyled = styled(MuiBox)<BoxProps>({
   alignItems: 'center',
   display: 'flex',
   width: '100%',
   height: '100%',
   padding: '6px 4px',
   whiteSpace: 'initial'
})

const MuiTypographyStyled = styled(MuiTypography)<TypographyProps>(
   ({ }) => ({
      color: commonTheme.palette.text.primary,
      fontSize: '14px'
   })
)

type DataGridProps = MuiDataGridProps & {}

const DataGrid: React.FC<DataGridProps> = (props) => {
   const { filterMode, paginationMode, sortingMode, rowCount } = props

   return (
      <>
         <MuiDataGridStyled
            {...props}
            disableColumnMenu
            disableRowSelectionOnClick
            filterMode={filterMode || 'server'}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationMode={paginationMode || 'server'}
            rowCount={rowCount || 0}
            sortingMode={sortingMode || 'server'}
            initialState={{
               pagination: {
                  paginationModel: { ...DEFAULT_PAGINATION }
               }
            }}
         />
      </>
   )
}

const DataGridCell: React.FC<BoxProps> = ({ children }) => {
   return <MuiBoxStyled>{children}</MuiBoxStyled>
}

const DataGridCellText: React.FC<TypographyProps> = ({ children }) => {
   return <MuiTypographyStyled>{children}</MuiTypographyStyled>
}

export { DataGridCell, DataGridCellText }
export default DataGrid
