'use client'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEdit from '../../AddEdit'
import { RoleType } from '@/app/types/role.type'
import { useGetRole } from '@/app/hooks/api/role.hook'

const Page = () => {
   const [roletypes, setRoleTypes] = useState<RoleType | undefined>()

   const params = useParams()
   const { data } = useGetRole(params?.id as string)
   useEffect(() => {
      if (data?.id) {
         setRoleTypes(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {roletypes !== undefined && (
            <>
               <AddEdit data={roletypes} />
            </>
         )}
      </ContainerStyled>
   )
}

export default Page
