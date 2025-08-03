'use client'

import AddEdit from '@/app/admin/job-level/AddEdit'
import { useGetJobLevel } from '@/app/hooks/api/job.level.hook'
import { JobLevelType } from '@/app/types/job.types'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
   const [jobLevel, setJobLevel] = useState<JobLevelType | undefined>()

   const params = useParams()

   const { data } = useGetJobLevel(params?.id as string)
   useEffect(() => {
      if (data?.id) {
         setJobLevel(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {jobLevel !== undefined && <AddEdit data={jobLevel} />}
      </ContainerStyled>
   )
}

export default Page
