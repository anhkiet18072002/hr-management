import { diskStorage } from 'multer'
import * as path from 'path'
import * as fs from 'fs'
import * as multer from 'multer'
import { Request } from 'express'

function createSlug(str: string): string {
   return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/\s+/g, '_')
      .replace(/[^\w\-.]/g, '')
}

export const storage = (context: string) => {
   return multer.diskStorage({
      destination: (req, file, callback) => {
         const uploadPath = context ? `./uploads/${context}` : './uploads/file'
         fs.mkdirSync(uploadPath, { recursive: true })
         callback(null, uploadPath)
      },
      filename: (req: Request, file, callback) => {
         const uploadPath = context ? `./uploads/${context}` : './uploads/file'
         const extension = path.extname(file.originalname)
         const nameWithoutExt = path.basename(file.originalname, extension)
         const sanitizedFileName = createSlug(nameWithoutExt)
         const id = req.params.id // Lấy ID từ request params
         const finalFileName = id
            ? `${id}${extension}`
            : `${Date.now()}${extension}`

         // 🔹 Kiểm tra và xóa file cũ trước khi lưu file mới (Sử dụng fs.readdirSync để đồng bộ)
         if (id) {
            try {
               const files = fs.readdirSync(uploadPath)
               for (const file of files) {
                  if (file.startsWith(`${id}-`)) {
                     const oldFilePath = path.join(uploadPath, file)
                     fs.unlinkSync(oldFilePath) // Xóa file ngay lập tức
                     console.log(`🗑️ Đã xóa file cũ: ${file}`)
                  }
               }
            } catch (err) {
               console.error('❌ Lỗi khi đọc thư mục:', err)
            }
         }

         callback(null, finalFileName)
      }
   })
}
