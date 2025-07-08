import {
   STRONG_EMAIL_REGEX,
   STRONG_PASSWORD_REGEX
} from '@/app/constants/regex.constant'
import { ISchema, string } from 'yup'

export const getCommonSchema = (
   type: 'name' | 'email' | 'password',
   required?: boolean
): ISchema<any, any, any, any> => {
   if (type === 'password') {
      return string()
         .matches(
            STRONG_PASSWORD_REGEX,
            'Password must be contain at least 8 characters with 1 lowercase, 1 uppercase letter, 1 number, 1 special character (e.g., @$%*?&)'
         )
         .max(50, 'Password must be less than 50 characters')
         .when('isRequired', () => {
            if (!required) {
               return string().nullable().optional()
            }

            return string().required('Password is required')
         })
         .required('Password is required')
   }

   if (type === 'email') {
      return string()
         .email('Email is invalid')
         .matches(STRONG_EMAIL_REGEX, 'Email is invalid')
         .max(50, 'Email must be less than 50 characters')
         .required('Email is required')
   }

   return string().optional()
}
