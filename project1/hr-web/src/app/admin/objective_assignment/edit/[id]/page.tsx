'use client'

import { useGetStaff } from '@/app/hooks/api'
import { StaffType } from '@/app/types/staff.type'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEdit from '../../AddEdit'

const Page = () => {
   const [staff, setStaff] = useState<StaffType | undefined>()

   const params = useParams()

   const { data } = useGetStaff(params?.id as string)
   useEffect(() => {
      if (data?.account?.id) {
         setStaff(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {staff !== undefined && <AddEdit data={staff} />}
      </ContainerStyled>
   )
}

export default Page
