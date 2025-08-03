import { Injectable, RequestMethod } from '@nestjs/common'
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants'
import { DiscoveryService, Reflector } from '@nestjs/core'

@Injectable()
export class AppService {
   constructor(
      private readonly discoveryService: DiscoveryService,
      private readonly reflector: Reflector
   ) {}

   async findAll() {
      const routes = []

      const controllers = this.discoveryService.getControllers()

      controllers.forEach((wrappper) => {
         const { instance } = wrappper
         if (instance) {
            const controllerPath = this.reflector.get<string>(
               PATH_METADATA,
               instance.constructor
            )

            const methods = Object.getOwnPropertyNames(
               Object.getPrototypeOf(instance)
            )

            methods.forEach((methodName) => {
               const methodHandler = instance[methodName]
               const methodPath = this.reflector.get<string>(
                  PATH_METADATA,
                  methodHandler
               )
               const requestMethod = this.reflector.get<RequestMethod>(
                  METHOD_METADATA,
                  methodHandler
               )
               const baseUri = `${controllerPath}  `
               const method = RequestMethod[requestMethod]
               if (method) {
                  routes.push({
                     path:
                        methodPath == '/'
                           ? baseUri?.replace(/\s*/g, '')
                           : `${baseUri}/${methodPath}`?.replace(/\s*/g, ''),
                     method: method
                  })
               }
            })
         }
      })

      return routes
   }
}
