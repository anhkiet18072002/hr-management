export const getFullname = (
   {
      firstName,
      lastName,
      middleName
   }: { firstName: string; lastName: string; middleName?: string },
   locale: string = 'vi-VN'
) => {
   if (!firstName) {
      return ''
   }

   if (locale === 'vi-VN') {
      return `${lastName}${middleName ? ` ${middleName}` : ''} ${firstName}`
   }

   return `${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}`
}

export const getInitials = (
   { firstName, lastName }: { firstName: string; lastName: string },
   locale: string = 'vi-VN'
) => {
   if (!firstName) {
      return ''
   }

   if (locale === 'vi-VN') {
      if (lastName) {
         return `${lastName.charAt(0)}${firstName.charAt(0)}`
      }
   }

   if (lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`
   }

   return `${firstName.charAt(0)}${firstName.charAt(1)}`
}
