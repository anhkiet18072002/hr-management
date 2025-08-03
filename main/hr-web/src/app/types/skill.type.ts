import { BaseEntityType } from './common.type'
import { SkillThumbnailType } from './thumbnail.type'

export type SkillType = BaseEntityType & {
   name: string
   description?: string
   thumbnail?: SkillThumbnailType
}

export type SkillLevelType = BaseEntityType & {
   name: string
   description?: string
}
