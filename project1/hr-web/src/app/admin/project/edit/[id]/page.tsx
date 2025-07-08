'use client'

import { useGetProject } from '@/app/hooks/api'
import { ProjectType } from '@/app/types/project.type'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEdit from '../../AddEdit'

const Page = () => {
   const [project, setProject] = useState<ProjectType | undefined>()

   const params = useParams()

   const { data } = useGetProject(params?.id as string)

   useEffect(() => {
      if (data?.id) {
         setProject(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {project !== undefined && <AddEdit data={project} />}
      </ContainerStyled>
   )
}

export default Page
