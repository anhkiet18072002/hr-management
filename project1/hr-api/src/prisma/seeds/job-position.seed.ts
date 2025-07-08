import { PrismaClient } from '@prisma/client'

const jobPosition = [
   {
      title: 'Business Analyst',
      shortTitle: 'BA',
      description: null,
      note: null
   },
   {
      title: 'Board of Director',
      shortTitle: 'BOD',
      description: null,
      note: null
   },
   {
      title: 'Designer',
      shortTitle: 'UI/UX',
      description: null,
      note: null
   },
   {
      title: 'Developer',
      shortTitle: 'Dev',
      description: null,
      note: null
   },
   {
      title: 'Development Operations',
      shortTitle: 'DepOps',
      description: null,
      note: null
   },
   {
      title: 'Human Resource Administrator',
      shortTitle: 'HR Admin',
      description: null,
      note: null
   },
   {
      title: 'Information Technology System',
      shortTitle: 'IT',
      description: null,
      note: null
   },
   {
      title: 'Project Manager',
      shortTitle: 'PM',
      description: null,
      note: null
   },
   {
      title: 'Sales Executive',
      shortTitle: 'SE',
      description: null,
      note: null
   },
   {
      title: 'Technical Architect',
      shortTitle: 'TA',
      description: null,
      note: null
   },
   {
      title: 'Quality Control',
      shortTitle: 'QC',
      description: null,
      note: null
   },
   {
      title: 'Quality Assurance',
      shortTitle: 'QA',
      description: null,
      note: null
   }
]

const prisma = new PrismaClient()

export const seedJobPosition = async () => {
   // Delete all job positions
   await prisma.jobPosition.deleteMany({})

   await Promise.all(
      jobPosition.map((position) => {
         return prisma.jobPosition.upsert({
            where: {
               name: position.title
            },
            create: {
               name: position.title,
               shortName: position.shortTitle,
               description: position.description
            },
            update: {
               shortName: position.shortTitle,
               description: position.description
            }
         })
      })
   )
}
