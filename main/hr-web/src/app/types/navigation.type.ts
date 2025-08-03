export type NavigationType = {
   icon?: string
   kind?: 'header' | undefined
   route?: string
   segment?: string
   title: string
}

export type NavigationGroupType = NavigationType & {
   children?: NavigationType[]
}
