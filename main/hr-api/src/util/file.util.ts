import { createReadStream } from 'fs'

export const readBytes = async (
   path: string,
   length: number
): Promise<Buffer> => {
   return new Promise((resolve, reject) => {
      if (!path) {
         reject(new Error('File path is required'))
         return
      }

      if (length <= 0) {
         reject(new Error('Length must be greater than 0'))
         return
      }

      const stream = createReadStream(path, { start: 0, end: length - 1 })
      const chunks: Buffer[] = []

      stream.on('data', (chunk) => {
         chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
   })
}
