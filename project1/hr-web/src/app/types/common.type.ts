export type BaseApiQueryType = {
   limit?: number
   page?: number
   sort?: string
   search?: string
   key?: string
}

export type BaseEntityType = {
   id: string
   createdAt: string
   updatedAt: string
}

export type BaseMetaType = {
   page: number
   pageSize: number
   total: number
}

export type BaseApiResponseType = {
   data: BaseEntityType | BaseEntityType[]
   meta: BaseMetaType
}
