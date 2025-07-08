import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'
import { PERMISSIONS } from '../../core/constant'

const prisma = new PrismaClient()

export const seedAccounts = async () => {
   await prisma.account.upsert({
      where: {
         email: 'admin@nexlesoft.com'
      },
      update: {
         email: 'admin@nexlesoft.com',
         password: await hash('Apple123@'),
         firstName: 'Admin',
         lastName: 'Super',
         username: 'superadmin',
         accountRoles: {
            deleteMany: {},
            create: {
               role: {
                  connect: {
                     key: PERMISSIONS.CORE_ADMIN
                  }
               }
            }
         }
      },
      create: {
         email: 'admin@nexlesoft.com',
         password: await hash('Apple123@'),
         firstName: 'Admin',
         lastName: 'Super',
         username: 'superadmin',
         accountRoles: {
            create: {
               role: {
                  connect: {
                     key: PERMISSIONS.CORE_ADMIN
                  }
               }
            }
         }
      }
   })
}
