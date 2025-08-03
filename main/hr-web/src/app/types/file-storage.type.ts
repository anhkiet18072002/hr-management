import { BaseEntityType } from '@/app/types/common.type'

export type FileStorageType = BaseEntityType & {
   path: string
   size: number
   extension: string
   name: string
   context: string
}
