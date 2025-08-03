'use client'

import { useGetObjective } from '@/app/hooks/api/objective.hook'
import { ObjectiveType } from '@/app/types/objective.type'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEdit from '../../AddEdit'

const Page = () => {
   const [objective, setObjective] = useState<ObjectiveType | undefined>()

   const params = useParams()

   const { data } = useGetObjective(params?.id as string)
   useEffect(() => {
      if (data?.id) {
         setObjective(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {objective !== undefined && <AddEdit data={objective} />}
      </ContainerStyled>
   )
}

export default Page
