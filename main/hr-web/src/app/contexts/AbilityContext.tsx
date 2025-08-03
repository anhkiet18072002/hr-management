'use client'

import { AnyAbility } from '@casl/ability'
import { createContextualCan } from '@casl/react'
import { createContext } from 'react'

const AbilityContext = createContext<AnyAbility>(undefined!)

const Can = createContextualCan(AbilityContext.Consumer)

export { AbilityContext, Can }
