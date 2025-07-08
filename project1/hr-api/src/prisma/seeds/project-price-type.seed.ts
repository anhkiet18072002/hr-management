import { PrismaClient } from '@prisma/client'

const projectPriceTypeSeed = [
   {
      name: 'Direct',
      description:
         'Direct costs are those directly linked to doing the work of the project. For example, this could include hiring specialised contractors, buying software licences or commissioning your new building.'
   },
   {
      name: 'Indirect',
      description:
         'These costs are not specifically linked to your project but are the cost of doing business overall. Examples are heating, lighting, office space rental (unless your project gets its own offices hired specially), stocking the communal coffee machine and so on.'
   },
   {
      name: 'Fixed',
      description:
         'Fixed costs are everything that is a one-off charge. These fees are not linked to how long your project goes on for. So if you need to pay for one-time advertising to secure a specialist software engineer, or you are paying for a day of Agile consultancy to help you start the project up the best way, those are fixed costs.'
   },
   {
      name: 'Variable',
      description:
         "These are the opposite of fixed costs - charges that change with the length of your project. It's more expensive to pay staff salaries over a 12 month project than a 6 month one. Machine hire over 8 weeks is more than for 3 weeks. You get the picture."
   },
   {
      name: 'Sunk',
      description:
         "A sunk cost refers to any cost that has already been incurred and cannot be recovered. In other words, it's money spent that you cannot get back, regardless of any future outcomes."
   },
   {
      name: 'N/A',
      description: 'Not applicable / Not available'
   }
]

const prisma = new PrismaClient()

export const seedProjectPriceType = async () => {
   await Promise.all(
      projectPriceTypeSeed.map((type) => {
         return prisma.projectPriceType.upsert({
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
