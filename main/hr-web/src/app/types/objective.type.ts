import { number, string } from 'yup'
import { BaseEntityType } from './common.type'
import { StaffType } from './staff.type'
import { SkillThumbnailType } from './thumbnail.type'

export type ObjectiveType = BaseEntityType & {
   name: string
   description: string
   startDate: Date | string
   endDate: Date | string
   staffId: string
   staff: StaffType
   progress: number
   keyResults?: keyResultType[]
}

export enum KeyResultEnum {
   NUMBER = 'NUMBER',
   PERCENT = 'PERCENT',
   BOOLEAN = 'BOOLEAN'
}

type NumberDataType = {
   target: number
}

type PercentDataType = {
   targetPercent: number
}

export type keyResultType = BaseEntityType & {
   name: string
   type: KeyResultEnum
   deadline: Date | string
   value: number
   percent?: number
   numberData?: NumberDataType
   percentData?: PercentDataType
   objectiveId?: string
   objective?: ObjectiveType
}

export type StaffKeyResultType = BaseEntityType & {
   keyResult: keyResultType
   keyResultId: string
   staff: StaffType
   staffId: string
   isComplete: boolean
   currentValue: number
}
