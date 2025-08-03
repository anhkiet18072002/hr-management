import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

export const seedStaffs = async () => {
   const response = await fetch('https://hr.nexlesoft.com/api/v2/pim/employees?limit=100&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC',
      {
         method: 'GET',
         headers: {
            'Cookie': '_ga=GA1.1.889227607.1748422112; _ga_GET4L0WJTS=GS2.1.s1749011304$o18$g0$t1749011304$j60$l0$h0; orangehrm=p42kvadn667lv9ftgqgkanvc32',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         }
      }
   )

   if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
   }

   const responseJson = await response.json();
   const staffSeed = responseJson.data

   const defaultPass = await hash('Apple123@')

   const staffData = staffSeed.map((staff) => {
      let ln = staff.lastName?.trim()
      if (ln.indexOf('(') >= 0 && ln.indexOf(')') >= 0) {
         ln = ln.substring(0, ln.lastIndexOf('(')).trim()
      }

      let fn = staff.firstName.trim()
      let cnt = fn.length
      while (fn.charAt(fn.length - 1) && fn.length > 1 && cnt >= 0) {
         if (/[A-Z0-9]/.test(fn.charAt(fn.length - 1))) {
            fn = fn.substring(0, fn.length - 1)?.trim()
         }

         cnt--
      }

      let un = staff.employeeId?.trim()
      let email = `${un}@nexlesoft.com`

      return {
         firstName: fn,
         lastName: ln.split(' ')[0]?.trim(),
         middleName: ln.substring(ln.indexOf(' '))?.trim(),
         username: un,
         email: email,
         password: defaultPass
      }
   })

   await prisma.account.deleteMany({
      where: {
         email: {
            not: 'admin@nexlesoft.com'
         }
      }
   })

   await prisma.staff.deleteMany({})

   await Promise.all(
      staffData.map((staff) => {
         return prisma.staff.create({
            data: {
               firstName: staff.firstName,
               lastName: staff.lastName,
               middleName: staff.middleName,
               startDate: new Date(
                  Math.floor(Math.random() * 5) + 2015,
                  Math.floor(Math.random() * 12),
                  Math.ceil(Math.random() * 28)
               ),
               account: {
                  connectOrCreate: {
                     create: {
                        ...staff
                     },
                     where: {
                        email: staff.email
                     }
                  }
               }
            }
         })
      })
   )
}
