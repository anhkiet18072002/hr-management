import {
   styled,
   Typography as MuiTypography,
   TypographyProps as MuiTypographyProps
} from '@mui/material'

type HeadingTextProps = MuiTypographyProps & {}

const HeadingTextStyled = styled(MuiTypography)<MuiTypographyProps>(
   ({ variant }) => ({
      fontSize: variant === 'h4' ? '20px' : '14px',
      fontWeight: 600
   })
)

const HeadingText: React.FC<HeadingTextProps> = ({
   children,
   ...restProps
}: HeadingTextProps) => {
   return <HeadingTextStyled {...restProps}>{children}</HeadingTextStyled>
}

export default HeadingText
