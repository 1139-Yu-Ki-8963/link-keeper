'use client'

import { useMemo, useState } from 'react'
import { EMPTY_FILTERS, type Filters, type Option, type ResourceWithRelations } from '@/lib/types'
import { FilterPanel } from './filter-panel'
import { ResourceCard } from './resource-card'

export function ResourceLibrary({
  resources,
  categories,
  types,
  topics,
  statuses,
}: {
  resources: ResourceWithRelations[]
  categories: Option[]
  types: Option[]
  topics: Option[]
  statuses: Option[]
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  const hasActiveFilters =
    filters.keyword.trim() !== '' ||
    filters.categoryId !== null ||
    filters.topicId !== null ||
    filters.typeId !== null ||
    filters.statusId !== null ||
    filters.pinnedOnly

  const filtered = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase()
    return resources.filter((r) => {
      if (filters.categoryId && r.categoryId !== filters.categoryId) return false
      if (filters.topicId && r.topicId !== filters.topicId) return false
      if (filters.typeId && r.typeId !== filters.typeId) return false
      if (filters.statusId && r.statusId !== filters.statusId) return false
      if (filters.pinnedOnly && !r.pinned) return false
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
        topics={topics}
        statuses={statuses}
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
