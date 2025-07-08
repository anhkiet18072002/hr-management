import {
   Chip as MuiChip,
   ChipProps as MuiChipProps,
   styled
} from '@mui/material'

const ChipStyled = styled(MuiChip)<MuiChipProps>({})

type ChipProps = MuiChipProps & {}

const Chip: React.FC<ChipProps> = ({ label, color }: ChipProps) => {
   return <ChipStyled label={label} color={color} variant="outlined" />
}

export default Chip
