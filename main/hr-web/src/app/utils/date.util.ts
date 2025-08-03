import { DEFAULT_DATE_FORMAT } from '@/app/constants/date-time.constant'
import { format, parseISO } from 'date-fns'

export const formatDate = (date: string, formatStr?: string) => {
   return format(parseISO(date), formatStr || DEFAULT_DATE_FORMAT)
}
