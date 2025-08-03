export const toSentenceCase = (text: string) => {
   if (!text || text?.length < 1) {
      return text
   }

   return `${text.charAt(0).toUpperCase()}${text.substring(1).toLowerCase()}`
}

export const toTitleCase = (text: string) => {
   if (!text || text?.length < 1) {
      return text
   }

   return text
      .split(' ')
      ?.map(
         (word: string) =>
            `${word.charAt(0).toUpperCase()}${word.substring(1).toLowerCase()}`
      )
      .join(' ')
}

export const toPercentage = (value: number) => {
   if (value === undefined || value === null) {
      return '0%'
   }

   return `${(Math.round(value * 100) / 100) * 100}%`
}
