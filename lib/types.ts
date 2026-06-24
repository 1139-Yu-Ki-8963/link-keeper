import type { Prisma } from '@/app/generated/prisma/client'

export type ResourceWithRelations = Prisma.ResourceGetPayload<{
  include: { category: true; type: true; topic: true; status: true }
}>

export type Option = { id: string; name: string }

export type Filters = {
  keyword: string
  categoryId: string | null
  topicId: string | null
  typeId: string | null
  statusId: string | null
  pinnedOnly: boolean
}

export const EMPTY_FILTERS: Filters = {
  keyword: '',
  categoryId: null,
  topicId: null,
  typeId: null,
  statusId: null,
  pinnedOnly: false,
}
