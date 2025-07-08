import { PrismaClient } from '@prisma/client'

const projectRoleSeed = [
   { name: 'Sponsor', description: '' },
   { name: 'Project manager', description: '' },
   { name: 'Project team', description: '' },
   { name: 'Business Analyst', description: '' },
   { name: 'Steering committee', description: '' },
   { name: 'Project Coordinator', description: '' },
   { name: 'Stakeholders', description: '' },
   { name: 'PMO Director', description: '' },
   { name: 'Resource management', description: '' },
   { name: 'Project leader', description: '' },
   { name: 'Project Owner', description: '' },
   { name: 'Subject matter expert', description: '' },
   { name: 'Project Management consultant', description: '' },
   { name: 'Team Leader', description: '' },
   { name: 'Project Planner', description: '' },
   { name: 'Project Support', description: '' },
   { name: 'Analyst', description: '' },
   { name: 'Change Control Board', description: '' },
   { name: 'Designer', description: '' },
   { name: 'Functional manager', description: '' },
   { name: 'Risk management', description: '' },
   { name: 'Team members', description: '' },
   { name: 'Change authority', description: '' },
   { name: 'Client', description: '' }
]

const prisma = new PrismaClient()

export const seedProjectRole = async () => {
   await Promise.all(
      projectRoleSeed.map((role) => {
         return prisma.projectRole.upsert({
            where: {
               name: role.name
            },
            create: {
               ...role
            },
            update: {
               ...role
            }
         })
      })
   )
}
