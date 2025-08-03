import { PrismaClient } from '@prisma/client'

const skillLevelSeed = [
   {
      name: 'Beginner (Entry-Level)',
      ordinal: 1,
      description:
         'Basic understanding of IT concepts and tools. Includes general computer operations and fundamental software skills.'
   },
   {
      name: 'Intermediate (Junior-Level / Associate)',
      ordinal: 2,
      description:
         'Hands-on experience, often working under supervision or as part of a team. Includes basic networking, server setup, and introductory programming skills.'
   },
   {
      name: 'Advanced (Mid-Level / Specialist)',
      ordinal: 3,
      description:
         'Specialized expertise in specific IT areas with the ability to work independently. Includes advanced networking, server administration, cloud management, and troubleshooting.'
   },
   {
      name: 'Expert (Senior-Level / Lead)',
      ordinal: 4,
      description:
         'Deep technical expertise with a leadership or architectural role. Includes designing and implementing complex IT solutions, managing large-scale infrastructures, and leading teams.'
   },
   {
      name: 'Master (Subject Matter Expert / Architect)',
      ordinal: 5,
      description:
         'Authority in the field, providing consulting and thought leadership. Includes innovation and strategic vision, expertise in multiple domains, and managing large, complex IT projects.'
   }
]

const prisma = new PrismaClient()

export const seedSkillLevel = async () => {
   await prisma.skillLevel.deleteMany()

   await Promise.all(
      skillLevelSeed.map((level) => {
         return prisma.skillLevel.upsert({
            where: {
               name: level.name
            },
            create: {
               name: level.name,
               description: level.description,
               ordinal: level.ordinal
            },
            update: {
               description: level.description,
               ordinal: level.ordinal
            }
         })
      })
   )
}
