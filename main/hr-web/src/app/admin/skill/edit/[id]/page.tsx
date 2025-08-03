'use client'

import AddEdit from '@/app/admin/skill/AddEdit'
import { useGetSkill } from '@/app/hooks/api'
import { SkillType } from '@/app/types/skill.type'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
   const [skill, setSkill] = useState<SkillType | undefined>()

   const params = useParams()

   const { data } = useGetSkill(params?.id as string)
   useEffect(() => {
      if (data?.id) {
         setSkill(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {skill !== undefined && <AddEdit data={skill} />}
      </ContainerStyled>
   )
}

export default Page
