import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { FileStorageType } from '@/app/types'

export const fileStorageClient = {
   upload: (payload: FormData) => {
      return HttpClient.post<FileStorageType>(
         `${API_ROUTES.FILE_STORAGE.UPLOAD}`,
         payload,
         {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
         }
      )
   }
   // get: (data: { context: string; id: string; extension: string }) => {
   //    return HttpClient.get<Blob>(
   //       `${API_ROUTES.FILE_STORAGE.INDEX}/${data.context}/${data.id}.${data.extension}`,
   //       {
   //          responseType: 'blob'
   //       }
   //    )
   // }
}
