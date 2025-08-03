import FormAutocomplete from '@/app/components/form/FormAutocomplete'
import FormCheckbox from '@/app/components/form/FormCheckbox'
import FormInput from '@/app/components/form/FormInput'
import { commonTheme } from '@/app/configs/theme.config'
import { SkillLevelType, SkillType } from '@/app/types'
import { SkillAssignmentType } from '@/app/types/skill.assignment.type'
import { SectionTitleStyled } from '@/styles/common.styles'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import { GridDeleteIcon } from '@mui/x-data-grid'
import React from 'react'
import { Controller } from 'react-hook-form'

type AddEditSkillProps = {
   control: any
   name: string
   data: Omit<SkillAssignmentType, 'id' | 'createdAt' | 'updatedAt'>
   errors: any
   skillSet: SkillType[]
   skillLevelSet: any[]
   onRemove?: (index: number) => void
}

const AddEditSkill: React.FC<AddEditSkillProps> = (props) => {
   const { control, name, errors, data, skillSet, skillLevelSet, onRemove } =
      props

   return (
      <Box sx={{ marginBottom: '20px' }}>
         <Box
            sx={{
               borderBottom: '1px solid #c7c7c7',
               width: '100%',
               marginBottom: '16px'
            }}
         >
            <SectionTitleStyled
               sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between'
               }}
            >
               <Typography
                  component={'span'}
                  sx={{ fontWeight: '500', fontSize: '14px' }}
               >
                  {data.skill?.name || 'Skill name'}
               </Typography>
               {/* Nút xóa form */}
               <IconButton
                  color="error"
                  onClick={() => {
                     const index = parseInt(name?.replace(/\D+/g, ''))
                     onRemove?.(index)
                  }}
                  sx={{
                     border: '1px solid #c7c7c7',
                     padding: '8px',
                     ':hover': {
                        backgroundColor: '#ffebee'
                     }
                  }}
               >
                  <GridDeleteIcon style={{ fontSize: '1.3rem' }} />
               </IconButton>
            </SectionTitleStyled>
         </Box>
         <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
            <Grid size={{ xs: 12, sm: 4 }}>
               <Controller
                  name={`${name}.skillId`}
                  control={control}
                  render={({
                     field: { value, onChange },
                  }) => (
                     <FormAutocomplete
                        error={errors?.skillId}
                        label="Skill *"
                        getOptionLabel={(option: SkillType) => {
                           if (option?.id) {
                              return `${option.name}`
                           }

                           return ''
                        }}
                        onChange={(value: any) => {
                           onChange(value?.id)
                        }}
                        options={skillSet}
                        placeholder="Select a skill"
                        value={
                           skillSet.find(
                              (skill: SkillType) => skill.id === value
                           ) || null
                        }
                        sx={{ marginTop: '8px' }}
                     />
                  )}
               />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
               <Controller
                  name={`${name}.yearOfExp`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                     <FormInput
                        error={errors?.yearOfExp}
                        label={'Year of Experience *'}
                        type="number"
                        value={value ? value.toString() : ''}
                        onChange={onChange}
                        sx={{ marginTop: '8px' }}
                     />
                  )}
               />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
               <Controller
                  name={`${name}.levelId`}
                  control={control}
                  render={({
                     field: { value, onChange },
                  }) => (
                     <FormAutocomplete
                        error={errors?.levelId}
                        label="Level *"
                        getOptionLabel={(option: SkillType) => {
                           if (option?.id) {
                              return `${option.name}`
                           }

                           return ''
                        }}
                        onChange={(value: any) => {
                           onChange(value?.id)
                        }}
                        options={skillLevelSet}
                        placeholder="Select a level"
                        value={
                           skillLevelSet?.find(
                              (level: SkillLevelType) => level.id === value
                           ) || null
                        }
                        sx={{ marginTop: '8px' }}
                     />
                  )}
               />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
               <Controller
                  name={`${name}.primary`}
                  control={control}
                  render={({
                     field: { value, onChange },
                  }) => (
                     <FormCheckbox
                        label="Primary"
                        value={value}
                        onChange={onChange}
                     />
                  )}
               />
            </Grid>
         </Grid>
      </Box>
   )
}

export default AddEditSkill
