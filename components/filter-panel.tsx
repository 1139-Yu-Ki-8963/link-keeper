'use client'

import type { Filters, Option } from '@/lib/types'

// iPhone 前提の上部フィルタ。大カテゴリ・実践状況・⭐ を前面に出し、
// 種類・シーン・タグは縦スペース節約のため折りたたみに収める。
export function FilterPanel({
  filters,
  setFilters,
  categories,
  types,
  scenes,
  statuses,
  tags,
  hasActiveFilters,
  onClear,
}: {
  filters: Filters
  setFilters: (next: Filters) => void
  categories: Option[]
  types: Option[]
  scenes: Option[]
  statuses: Option[]
  tags: Option[]
  hasActiveFilters: boolean
  onClear: () => void
}) {
  const toggleCategory = (id: string) =>
    setFilters({ ...filters, categoryId: filters.categoryId === id ? null : id })
  const toggleStatus = (id: string) =>
    setFilters({ ...filters, statusId: filters.statusId === id ? null : id })
  const toggleType = (id: string) =>
    setFilters({ ...filters, typeId: filters.typeId === id ? null : id })
  const toggleScene = (id: string) =>
    setFilters({ ...filters, sceneId: filters.sceneId === id ? null : id })
  const toggleTag = (id: string) =>
    setFilters({
      ...filters,
      tagIds: filters.tagIds.includes(id)
        ? filters.tagIds.filter((t) => t !== id)
        : [...filters.tagIds, id],
    })

  return (
    <div className="space-y-3">
      <div>
        <h3 className="mb-2 text-xs font-semibold text-zinc-500">大カテゴリ</h3>
        <div className="flex gap-2">
          {categories.map((c) => (
            <Chip
              key={c.id}
              big
              active={filters.categoryId === c.id}
              onClick={() => toggleCategory(c.id)}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold text-zinc-500">実践状況</h3>
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => (
            <Chip key={s.id} active={filters.statusId === s.id} onClick={() => toggleStatus(s.id)}>
              {s.name}
            </Chip>
          ))}
          <button
            type="button"
            onClick={() => setFilters({ ...filters, pinnedOnly: !filters.pinnedOnly })}
            className={
              filters.pinnedOnly
                ? 'rounded-full bg-amber-500 px-2.5 py-1 text-xs font-medium text-white'
                : 'rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-xs text-zinc-600 active:border-amber-500'
            }
          >
            <span className="material-symbols-outlined text-sm leading-none">
              {filters.pinnedOnly ? 'star' : 'star_border'}
            </span>{' '}
            再読・共有したい
          </button>
        </div>
      </div>

      <input
        type="search"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        placeholder="タイトル・説明で検索"
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base outline-none focus:border-zinc-900"
      />

      <details className="group rounded-md border border-zinc-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-medium text-zinc-600">
          絞り込み（種類・シーン・タグ）
          <span className="material-symbols-outlined text-base leading-none text-zinc-400 transition-transform group-open:rotate-180">expand_more</span>
        </summary>
        <div className="space-y-4 border-t border-zinc-100 px-3 py-3">
          <FilterGroup title="リソースの種類">
            {types.map((t) => (
              <Chip key={t.id} active={filters.typeId === t.id} onClick={() => toggleType(t.id)}>
                {t.name}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup title="シーンで探す">
            {scenes.map((s) => (
              <Chip key={s.id} active={filters.sceneId === s.id} onClick={() => toggleScene(s.id)}>
                {s.name}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup title="タグ">
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                active={filters.tagIds.includes(tag.id)}
                onClick={() => toggleTag(tag.id)}
              >
                #{tag.name}
              </Chip>
            ))}
          </FilterGroup>
        </div>
      </details>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-zinc-500 underline underline-offset-2 active:text-zinc-900"
        >
          すべてクリア
        </button>
      )}
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold text-zinc-500">{title}</h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({
  active,
  big,
  onClick,
  children,
}: {
  active: boolean
  big?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const size = big ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? `rounded-full bg-zinc-900 font-medium text-white ${size}`
          : `rounded-full border border-zinc-300 bg-white text-zinc-600 active:border-zinc-500 ${size}`
      }
    >
      {children}
    </button>
  )
}
