'use client'

import AddEdit from '@/app/admin/skill-level/AddEdit'
import { useGetSkillLevel } from '@/app/hooks/api/skill.level.hook'
import { SkillLevelType } from '@/app/types/skill.type'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
   const [skillLevel, setSkillLevel] = useState<SkillLevelType | undefined>()

   const params = useParams()

   const { data } = useGetSkillLevel(params?.id as string)
   useEffect(() => {
      if (data?.id) {
         setSkillLevel(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {skillLevel !== undefined && <AddEdit data={skillLevel} />}
      </ContainerStyled>
   )
}

export default Page
