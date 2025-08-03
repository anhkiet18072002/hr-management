import { PrismaClient } from '@prisma/client'
import {
   seedAccounts,
   seedJobPosition,
   seedPermissions,
   seedProjectPriceType,
   seedProjectRole,
   seedProjectType,
   seedRoles,
   seedSkill,
   seedSkillLevel,
   seedStaffs
} from './seeds'

const prisma = new PrismaClient()

const main = async () => {
   // Seed permissions
   // await seedPermissions()
   // Seed roles
   // await seedRoles()
   // Seed admin account
   // await seedAccounts()
   // Seed project price types
   // await seedProjectType()
   // Seed project price types
   // await seedProjectPriceType()
   // Seed project roles
   // await seedProjectRole()
   // Seed leave types
   // await Promise.all(
   //    leaveTypeSeed.map((type: { name: string; description: string }) => {
   //       return prisma.leaveType.create({
   //          data: { ...type }
   //       })
   //    })
   // )
   // Seed staffs
   // await seedStaffs()
   // Seed staffs
   // await seedJobPosition()
   // Seed skills
   // await seedSkill()
   // Seed skill levels
   // await seedSkillLevel()
}

main()
   .then(async () => {
      await prisma.$disconnect()
   })
   .catch(async (error) => {
      console.error(error)

      await prisma.$disconnect()

      process.exit(1)
   })
