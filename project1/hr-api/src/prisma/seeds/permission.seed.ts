import { PrismaClient } from '@prisma/client'
import { PERMISSIONS } from '../../core/constant'
import { object2dot } from '../../util/object.util'
import { ActionEnum } from '../../core/enum'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const seedPermissions = async () => {
   const prisma = new PrismaClient()

   const modules: string[] = []

   await fetch('http://localhost:3001/api/routes', {
      headers: {
         'Content-Type': 'application/json'
      }
   })
      .then((res) => res.json())
      .then((data) => {
         const routes: { path: string; method: string }[] = data
         routes?.map((route) => {
            const entity: string = route.path
               ?.toUpperCase()
               ?.split('/')[0]
               ?.replaceAll('-', '_')
            if (!modules.includes(entity) && entity !== 'API') {
               modules.push(entity)
            }
         })
      })
      .catch((err) => {
         console.log('Unable to fetch API routes', err)
      })

   const actions = Object.values(ActionEnum)

   const permissionsObj: Record<string, any> = {}
   for (const module of modules) {
      permissionsObj[module] = {}
      for (const action of actions) {
         permissionsObj[module][action?.toUpperCase()] =
            `${module}.${action.toUpperCase()}`
      }
   }

   // Add core permissions
   permissionsObj['CORE_ADMIN'] = 'CORE.ADMIN'
   permissionsObj['CORE_BASIC'] = 'CORE.BASIC'

   // Find permission constant file
   const constantFilePath = join(
      __dirname,
      './../../core/constant',
      'base.constant.ts'
   )
   if (!existsSync(constantFilePath)) {
      // Create a new file if it doesn't exist
      await writeFile(constantFilePath, '')
   }

   let constantContent: string = await readFile(constantFilePath, {
      encoding: 'utf-8'
   })

   const startOfBlock = constantContent.indexOf('export const PERMISSIONS')
   if (startOfBlock >= 0) {
      let permissionBlock = constantContent.substring(
         startOfBlock + 'export const'?.length
      )
      const endOfBlock = permissionBlock.indexOf('export const ')
      permissionBlock = permissionBlock.substring(0, endOfBlock)
      permissionBlock = 'export const' + permissionBlock
      permissionBlock = permissionBlock.trim()

      constantContent = constantContent.replace(
         permissionBlock,
         'export const PERMISSIONS = ' + JSON.stringify(permissionsObj)
      )
   } else {
      constantContent =
         constantContent +
         '\n\n' +
         'export const PERMISSIONS = ' +
         JSON.stringify(permissionsObj)
   }

   await writeFile(constantFilePath, constantContent)

   const permissions = object2dot(PERMISSIONS)

   await Promise.all(
      permissions?.map((permission) => {
         return prisma.permission.upsert({
            where: {
               key: permission
            },
            update: {
               key: permission
            },
            create: {
               key: permission
            }
         })
      })
   )
}
