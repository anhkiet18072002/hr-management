'use client'

import { useGetLeaveAssignment } from '@/app/hooks/api/leave.assignment.hook'
import { LeaveAssignmentType } from '@/app/types/leave.assignment.type'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEdit from '../../AddEdit'

const Page = () => {
   const [leaveAssignments, setLeaveAssignments] = useState<
      LeaveAssignmentType | undefined
   >()

   const params = useParams()
   const { data } = useGetLeaveAssignment(params?.id as string)
   useEffect(() => {
      if (data?.id) {
         setLeaveAssignments(data)
      }
   }, [data])

   return (
      <ContainerStyled>
         {leaveAssignments !== undefined && <AddEdit data={leaveAssignments} />}
      </ContainerStyled>
   )
}

export default Page
