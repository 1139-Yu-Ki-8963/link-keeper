'use client'

import { useMemo, useState } from 'react'
import { EMPTY_FILTERS, type Filters, type Option, type ResourceWithRelations } from '@/lib/types'
import { FilterPanel } from './filter-panel'
import { ResourceCard } from './resource-card'

// 全件をサーバーから受け取り、クライアント側で AND 絞り込みする一覧の中核。
// iPhone 前提のため、フィルタは上部・本文は縦 1 カラムの読み物リストにする。
export function ResourceLibrary({
  resources,
  categories,
  types,
  scenes,
  statuses,
  tags,
}: {
  resources: ResourceWithRelations[]
  categories: Option[]
  types: Option[]
  scenes: Option[]
  statuses: Option[]
  tags: Option[]
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  const hasActiveFilters =
    filters.keyword.trim() !== '' ||
    filters.categoryId !== null ||
    filters.typeId !== null ||
    filters.sceneId !== null ||
    filters.statusId !== null ||
    filters.pinnedOnly ||
    filters.tagIds.length > 0

  const filtered = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase()
    return resources.filter((r) => {
      if (filters.categoryId && r.categoryId !== filters.categoryId) return false
      if (filters.typeId && r.typeId !== filters.typeId) return false
      if (filters.sceneId && r.sceneId !== filters.sceneId) return false
      if (filters.statusId && r.statusId !== filters.statusId) return false
      if (filters.pinnedOnly && !r.pinned) return false
      if (filters.tagIds.length > 0) {
        const tagIds = new Set(r.tags.map((t) => t.id))
        if (!filters.tagIds.every((id) => tagIds.has(id))) return false
      }
      if (keyword) {
        const haystack = `${r.title} ${r.description ?? ''}`.toLowerCase()
        if (!haystack.includes(keyword)) return false
      }
      return true
    })
  }, [resources, filters])

  return (
    <div className="space-y-5">
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        types={types}
        scenes={scenes}
        statuses={statuses}
        tags={tags}
        hasActiveFilters={hasActiveFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <section>
        <p className="mb-1 text-sm text-zinc-500">
          検索結果: <span className="font-semibold text-zinc-900">{filtered.length}</span> 件
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-400">
            {resources.length === 0
              ? 'まだリンクがありません。上の「＋ 追加」から登録してください。'
              : '条件に合うリンクが見つかりません。'}
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 border-t border-zinc-200">
            {filtered.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
