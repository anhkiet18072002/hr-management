'use client'

import { AbilityContext } from '@/app/contexts/AbilityContext'
import { AbilityAction, AbilitySubject } from '@/app/types/acl.type'
import { createMongoAbility } from '@casl/ability'
import React from 'react'

interface AclGuardProps {
   children: React.ReactNode
}

const AclGuard: React.FC<AclGuardProps> = ({ children }) => {
   const ability = createMongoAbility<[AbilityAction, AbilitySubject]>()

   return (
      <AbilityContext.Provider value={ability}>
         {children}
      </AbilityContext.Provider>
   )
}

export default AclGuard
