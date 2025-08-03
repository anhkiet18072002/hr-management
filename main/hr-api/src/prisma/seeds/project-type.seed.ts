import { PrismaClient } from '@prisma/client'

const projectTypeSeed = [
   {
      name: 'Software development',
      description: ''
   },
   {
      name: 'Infrastructure improvements',
      description: ''
   },
   {
      name: 'Cyber security',
      description: ''
   },
   {
      name: 'Cloud',
      description: ''
   },
   {
      name: 'Data management and analytics',
      description: ''
   },
   {
      name: 'Enterprise resource planning (ERP)',
      description: ''
   },
   {
      name: 'Digital transformation',
      description: ''
   },
   {
      name: 'Legacy systems',
      description: ''
   }
]

const prisma = new PrismaClient()

export const seedProjectType = async () => {
   await Promise.all(
      projectTypeSeed.map((type) => {
         return prisma.projectType.upsert({
            where: {
               name: type.name
            },
            create: {
               ...type
            },
            update: {
               ...type
            }
         })
      })
   )
}
