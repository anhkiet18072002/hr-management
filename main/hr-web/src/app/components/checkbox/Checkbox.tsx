import {
   Checkbox as MuiCheckbox,
   CheckboxProps as MuiCheckboxProps,
   styled
} from '@mui/material'
import React from 'react'

type CheckboxProps = MuiCheckboxProps & {}

const MuiCheckboxStyled = styled(MuiCheckbox)<MuiCheckboxProps>({})

const Checkbox: React.FC<CheckboxProps> = (props) => {
   return <MuiCheckboxStyled {...props} />
}

export default Checkbox
