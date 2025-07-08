import {
   styled,
   Typography as MuiTypography,
   TypographyProps as MuiTypographyProps
} from '@mui/material'

type BodyTextProps = MuiTypographyProps & {}

const BodyTextStyled = styled(MuiTypography)<MuiTypographyProps>(
   ({ }) => ({
      fontSize: '14px',
      fontWeight: 600
   })
)

const BodyText: React.FC<BodyTextProps> = ({ children, ...restProps }: BodyTextProps) => {
   return <BodyTextStyled {...restProps}>{children}</BodyTextStyled>
}

export default BodyText
