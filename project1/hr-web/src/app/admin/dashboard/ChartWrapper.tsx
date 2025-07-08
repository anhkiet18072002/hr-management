import { Box } from "@mui/material"
import React from "react"

type ChartWrapperProps = {
   children: React.ReactNode
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ children }) => {
   return (
      <Box>
         {children}
      </Box>
   )
}

export default ChartWrapper