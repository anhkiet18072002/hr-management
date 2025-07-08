import { useMutation } from 'react-query'
import { fileStorageClient } from './file.storage.api'

const useUpload = () => {
   return useMutation(fileStorageClient.upload)
}

export { useUpload }
