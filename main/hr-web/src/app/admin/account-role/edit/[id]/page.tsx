'use client'

import { useGetAccountRole } from '@/app/hooks/api/account.role.hook'
import { AccountRoleType } from '@/app/types/account-role'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEdit from '../../AddEdit'

const Page = () => {
    
    const [accountRole, setAccountRole] = useState<AccountRoleType | undefined>()
    const params = useParams()

    const { data } = useGetAccountRole(params?.id as string)
    useEffect(() => {
        if (data?.id) {
            setAccountRole(data)
        }
    }, [data])

    return (
        <ContainerStyled>
            {accountRole !== undefined && <AddEdit data={accountRole} />}
        </ContainerStyled>
    )
}

export default Page
