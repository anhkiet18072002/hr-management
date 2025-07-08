import Button from '@/app/components/button/Button'
import { PAGE_ROUTES } from '@/app/configs/route.config'
import { commonTheme } from '@/app/configs/theme.config'

import { StaffType } from '@/app/types'

import {
   SectionContainerStyled,
   SectionTitleStyled
} from '@/styles/common.styles'

import { Box, Grid, TextField } from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getFullname } from '@/app/utils/name.util'
import { staffClient } from '@/app/hooks/api'
import ObjectiveList from './list/Objective'
import useLoading from '@/app/hooks/useLoading'
import { ObjectiveType, StaffKeyResultType } from '@/app/types/objective.type'
import { PlusOutlined } from '@ant-design/icons'

interface AddEditProps {
   data?: StaffType
}

const AddEdit = (props: AddEditProps) => {
   const { data } = props
   const isDisabled = Boolean(data)

   const pathname = usePathname()
   const searchParams = useSearchParams()
   const router = useRouter()

   const { setLoading } = useLoading()

   const [objectives, setObjectives] = useState<ObjectiveType[]>([])
   const [staffKeyResults, setStaffKeyResults] = useState<StaffKeyResultType[]>(
      []
   )
   const [filteredKeyResults, setFilteredKeyResults] = useState<
      StaffKeyResultType[]
   >([])

   const [selectedObjectiveId, setSelectedObjectiveId] = useState<
      string | null
   >(null)

   const [objectiveEdit, setObjectiveEdit] = useState<ObjectiveType>()

   const [flag, setFlag] = useState<boolean>(false)

   const [isOpen, setIsOpen] = useState<boolean>(false)

   useEffect(() => {
      if (!data) return

      setObjectives((data.objectives as ObjectiveType[]) || [])
      setStaffKeyResults((data.staffKeyResults as StaffKeyResultType[]) || [])
   }, [data])

   useEffect(() => {
      if (!selectedObjectiveId || staffKeyResults.length === 0) return

      const relatedKeyResults = staffKeyResults.filter(
         (kr) => kr.keyResult.objectiveId === selectedObjectiveId
      )
      setFilteredKeyResults(relatedKeyResults)
   }, [staffKeyResults, selectedObjectiveId])

   const handleEditObjective = (objective: ObjectiveType) => {
      const staffId = data?.id || ''
      const returnUrl = `${pathname}?${searchParams.toString()}`
      router.push(
         `${PAGE_ROUTES.ADMIN.OBJECTIVE_ASSIGNMENT.KEY_LIST}?returnUrl=${encodeURIComponent(returnUrl)}&staffId=${staffId}&objectiveId=${objective.id}`
      )

      // setSelectedObjectiveId(objective.id)
      // setIsOpen(true)
      // setObjectiveEdit(objective)
   }

   const handleAddNewObjective = () => {
      const returnUrl = `${pathname}?${searchParams.toString()}`
      const staffId = data?.id || ''
      router.push(
         `${PAGE_ROUTES.ADMIN.OBJECTIVE.ADD}?returnUrl=${encodeURIComponent(returnUrl)}&staffId=${staffId}`
      )
   }

   useEffect(() => {
      const fetchObjectives = async () => {
         if (!flag || !data) return

         try {
            // setLoading(true)
            const res = await staffClient.findOne(data.id)
            const updatedObjectives = res.objectives || []
            setObjectives(updatedObjectives)

            const objective = updatedObjectives.find(
               (objective) => objective.id === selectedObjectiveId
            )
            if (objective) {
               setObjectiveEdit(objective)
            }
         } catch (error) {
            console.error('Failed to fetch objective child:', error)
            setObjectives([])
         } finally {
            setLoading(false)
         }

         setFlag(false)
      }

      fetchObjectives()
   }, [data, flag])

   return (
      <>
         <Box
            component={'form'}
            noValidate
            autoComplete="off"
            onInvalid={console.log}
         >
            <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
               <Grid size={12}>
                  <SectionContainerStyled>
                     <Box sx={{ width: '100%' }}>
                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 12, sm: 7 }}>
                              <TextField
                                 label="Staff"
                                 value={
                                    data
                                       ? `${getFullname(data.account, 'vi-VN')
                                            .replace(/\s+/g, ' ')
                                            .trim()} - ${data.account?.email || ''}`
                                       : ''
                                 }
                                 fullWidth
                                 InputProps={{
                                    readOnly: true
                                 }}
                                 variant="outlined"
                                 size="small"
                                 sx={{ marginTop: '24px' }}
                              />
                           </Grid>
                        </Grid>
                        <Box
                           sx={{
                              borderBottom: '1px solid #c7c7c7',
                              width: '100%',
                              mt: '40px'
                           }}
                        >
                           <SectionTitleStyled>
                              List of Objective
                           </SectionTitleStyled>
                        </Box>
                        <Box
                           sx={{
                              display: 'flex',
                              flexGrow: 1,
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              mt: '20px'
                           }}
                           columnGap={commonTheme.space?.form?.horizontal}
                        >
                           <Button
                              size="small"
                              title="Add"
                              onClick={handleAddNewObjective}
                              startIcon={<PlusOutlined />}
                           />
                        </Box>

                        <Grid
                           container
                           columnSpacing={commonTheme.space?.form?.horizontal}
                        >
                           <Grid size={{ xs: 12 }}>
                              <Box
                                 sx={{
                                    paddingTop: '20px',
                                    width: '100%'
                                 }}
                              >
                                 <ObjectiveList
                                    data={objectives}
                                    onChange={(updatedAssignments) =>
                                       setObjectives(updatedAssignments)
                                    }
                                    onEdit={handleEditObjective}
                                 />
                              </Box>
                           </Grid>
                        </Grid>
                     </Box>
                  </SectionContainerStyled>
               </Grid>
            </Grid>
         </Box>
         {/* {objectiveEdit && data && (
            <KeyList
               data={filteredKeyResults}
               objective={objectiveEdit}
               setFlag={setFlag}
               open={isOpen}
               onClose={() => setIsOpen(false)}
               onChange={(updatedAssignments) =>
                  setStaffKeyResults(updatedAssignments)
               }
               staffId={data.id}
            />
         )} */}
      </>
   )
}

export default AddEdit
