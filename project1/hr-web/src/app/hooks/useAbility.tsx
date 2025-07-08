import { AbilityContext } from '@/app/contexts/AbilityContext'
import { useContext } from 'react'

export const useAuth = () => {
   return useContext(AbilityContext)
}
