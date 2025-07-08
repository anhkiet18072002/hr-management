'use client'

import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEdit from '../../AddEdit'
import { useGetJobPosition } from '@/app/hooks/api/job.position.hook'
import { JobPositionType } from '@/app/types/job.types'

const Page = () => {
   const [JobPosition, setJobPosition] = useState<JobPositionType | undefined>()

   const params = useParams()

   const { data } = useGetJobPosition(params?.id as string)
   useEffect(() => {
      if (data?.id) {
         setJobPosition(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {JobPosition !== undefined && <AddEdit data={JobPosition} />}
      </ContainerStyled>
   )
}

export default Page
