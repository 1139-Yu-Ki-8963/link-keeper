import Link from 'next/link'
import { cycleStatus, togglePin } from '@/app/resources/actions'
import type { ResourceWithRelations } from '@/lib/types'

export function ResourceCard({ resource }: { resource: ResourceWithRelations }) {
  const statusName = resource.status?.name ?? '未読'

  return (
    <article className="py-4">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded-full border border-zinc-900 px-2 py-0.5 font-semibold text-zinc-900">
          {resource.category.name}
        </span>
        <span className="rounded-full bg-zinc-900 px-2 py-0.5 font-medium text-white">
          {resource.type.name}
        </span>
        <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-zinc-500">
          {resource.topic.name}
        </span>
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${resource.title}（別タブで開く）`}
        className="block py-0.5 active:opacity-70"
      >
        <h2 className="text-base font-semibold leading-snug text-blue-700 underline decoration-blue-300 decoration-1 underline-offset-4">
          {resource.title}
          <span aria-hidden className="material-symbols-outlined ml-1 text-sm text-blue-500">
            open_in_new
          </span>
        </h2>
      </a>

      {resource.description && (
        <p className="mt-1 text-sm leading-relaxed text-zinc-600">{resource.description}</p>
      )}

      {resource.memo && (
        <p className="mt-1.5 text-sm leading-relaxed text-amber-700">
          <span className="material-symbols-outlined mr-0.5 text-sm">lightbulb</span>
          一言メモ：{resource.memo}
        </p>
      )}

      <span className="mt-1 block truncate text-[11px] text-zinc-400">{resource.url}</span>

      <div className="mt-3 flex items-center gap-2">
        <form action={cycleStatus.bind(null, resource.id)}>
          <button
            type="submit"
            className={
              statusName === '実践済み'
                ? 'rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white active:opacity-80'
                : statusName === '後で挑戦'
                  ? 'rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 active:opacity-80'
                  : 'rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-500 active:opacity-80'
            }
          >
            {statusName}{' '}
            <span className="material-symbols-outlined text-sm leading-none">sync_alt</span>
          </button>
        </form>

        <form action={togglePin.bind(null, resource.id)}>
          <button
            type="submit"
            aria-label="再読・共有したい"
            className={`rounded-full border px-3 py-1.5 text-xs active:opacity-70 ${
              resource.pinned
                ? 'border-amber-400 bg-amber-50 text-amber-600'
                : 'border-zinc-300 bg-white text-zinc-400'
            }`}
          >
            <span className="material-symbols-outlined text-sm leading-none">
              {resource.pinned ? 'star' : 'star_border'}
            </span>{' '}
            再読
          </button>
        </form>

        <Link
          href={`/resources/${resource.id}/edit`}
          className="ml-auto rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-500 active:bg-zinc-100"
        >
          編集
        </Link>
      </div>
    </article>
  )
}
