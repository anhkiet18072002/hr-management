'use client'

import AddEdit from '@/app/admin/project-role/AddEdit'
import { useGetProjectRole } from '@/app/hooks/api'
import { ProjectRoleType } from '@/app/types/project.type'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
   const [projectRole, setProjectRole] = useState<ProjectRoleType | undefined>()

   const params = useParams()

   const { data } = useGetProjectRole(params?.id as string)
   useEffect(() => {
      if (data?.id) {
         setProjectRole(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {projectRole !== undefined && <AddEdit data={projectRole} />}
      </ContainerStyled>
   )
}

export default Page
