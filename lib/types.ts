import type { Prisma } from '@/app/generated/prisma/client'

// 一覧・カードで使う、リレーションを含んだ Resource 型
export type ResourceWithRelations = Prisma.ResourceGetPayload<{
  include: { category: true; type: true; scene: true; status: true; tags: true }
}>

// フィルタの選択肢（マスタ 1 件分）
export type Option = { id: string; name: string }

// 一覧の絞り込み状態。category / type / scene / status は単一選択、tag は複数選択（AND）、
// pinnedOnly は「再読・共有したい」⭐ だけに絞るトグル
export type Filters = {
  keyword: string
  categoryId: string | null
  typeId: string | null
  sceneId: string | null
  statusId: string | null
  pinnedOnly: boolean
  tagIds: string[]
}

export const EMPTY_FILTERS: Filters = {
  keyword: '',
  categoryId: null,
  typeId: null,
  sceneId: null,
  statusId: null,
  pinnedOnly: false,
  tagIds: [],
}
