import { OrgTypes } from '../Types/dataTypes'

type Items = {
  text?: string
  value?: string
  header?: string
}

type Select = {
  items: string[] | Items[]
  label: string
  data: 'curr' | 'org' | 'orgType'
  value: string[]
}

const orgTypes = Object.keys(OrgTypes)

const baseTypes = orgTypes.map((v: string) => {
  const nV = v as keyof typeof OrgTypes
  return { text: OrgTypes[nV], value: v }
})

export { Items, Select, orgTypes, baseTypes }
