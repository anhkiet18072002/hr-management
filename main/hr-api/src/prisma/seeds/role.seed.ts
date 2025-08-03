import { PrismaClient } from '@prisma/client'
import { PERMISSIONS, ROLES } from '../../core/constant'

export const seedRoles = async () => {
   const prisma = new PrismaClient()

   await prisma.role.upsert({
      where: {
         key: ROLES.CORE_ADMIN
      },
      create: {
         name: 'Administrator',
         key: ROLES.CORE_ADMIN
      },
      update: {
         key: ROLES.CORE_ADMIN,
         name: 'Administrator'
      }
   })

   await prisma.role.upsert({
      where: {
         key: ROLES.CORE_BASIC
      },
      update: {
         name: 'Basic user'
      },
      create: {
         key: ROLES.CORE_BASIC,
         name: 'Basic user'
      }
   })
}
