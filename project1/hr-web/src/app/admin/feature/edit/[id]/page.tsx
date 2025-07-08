'use client'
import { ContainerStyled } from '@/styles/common.styles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FeatureType } from '@/app/types/feature.type'
import { useGetFeature } from '@/app/hooks/api/feature.hook'
import AddEdit from '../../AddEdit'


const Page = () => {
   const [featureTypes, setFeatureTypes] = useState<
   FeatureType | undefined
   >()

   const params = useParams()
   const { data } = useGetFeature(params?.id as string)
   useEffect(() => {
      if (data?.id) {
        setFeatureTypes(data)
      }
   }, [data])

   return (
      <ContainerStyled>
      {featureTypes !== undefined && (
         <>
            <AddEdit data={featureTypes} />
         </>
      )}
   </ContainerStyled>
   )
}

export default Page
