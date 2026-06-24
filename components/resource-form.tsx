import Link from 'next/link'
import type { Option, ResourceWithRelations } from '@/lib/types'

// 追加・編集で共用するフォーム。action に Server Action を受け取る。
// resource が渡れば編集モード（既定値を埋める）、無ければ新規モード。
export function ResourceForm({
  action,
  categories,
  types,
  topics,
  statuses,
  resource,
}: {
  action: (formData: FormData) => void
  categories: Option[]
  types: Option[]
  topics: Option[]
  statuses: Option[]
  resource?: ResourceWithRelations
}) {
  return (
    <form action={action} className="space-y-5">
      <Field label="タイトル" required>
        <input name="title" required defaultValue={resource?.title ?? ''} className={inputClass} />
      </Field>

      <Field label="URL" required>
        <input
          name="url"
          type="url"
          required
          defaultValue={resource?.url ?? ''}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>

      <Field label="説明">
        <textarea
          name="description"
          rows={3}
          defaultValue={resource?.description ?? ''}
          className={inputClass}
        />
      </Field>

      <Field
        label={
          <>
            <span className="material-symbols-outlined mr-0.5 text-sm">lightbulb</span>
            一言メモ（登録時に感じたポイント）
          </>
        }
      >
        <textarea
          name="memo"
          rows={2}
          defaultValue={resource?.memo ?? ''}
          placeholder="例：インラインコメントの行ズレを防ぐ手法が参考になった"
          className={inputClass}
        />
      </Field>

      <Field label="大カテゴリ（1年後も使えるか）" required>
        <select
          name="categoryId"
          required
          defaultValue={resource?.categoryId ?? ''}
          className={inputClass}
        >
          <option value="" disabled>
            選択してください
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="種類" required>
          <select
            name="typeId"
            required
            defaultValue={resource?.typeId ?? ''}
            className={inputClass}
          >
            <option value="" disabled>
              選択してください
            </option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="話題" required>
          <select
            name="topicId"
            required
            defaultValue={resource?.topicId ?? ''}
            className={inputClass}
          >
            <option value="" disabled>
              選択してください
            </option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="実践状況">
        <select name="statusId" defaultValue={resource?.statusId ?? ''} className={inputClass}>
          <option value="">未読（未設定）</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="pinned"
          defaultChecked={resource?.pinned ?? false}
          className="accent-amber-500"
        />
        <span className="material-symbols-outlined text-sm leading-none">star</span>{' '}
        再読・共有したい（いつでも引っ張り出せるように印を付ける）
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white active:bg-zinc-700"
        >
          {resource ? '更新する' : '追加する'}
        </button>
        <Link href="/" className="text-sm text-zinc-500 active:text-zinc-900">
          キャンセル
        </Link>
      </div>
    </form>
  )
}

const inputClass =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base outline-none focus:border-zinc-900'

function Field({
  label,
  required,
  children,
}: {
  label: React.ReactNode
  required?: boolean
  children: React.ReactNode
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: 入力要素は children として label 内に配置される
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-zinc-500">
        {label}
        {required && <span className="ml-1 text-zinc-900">*</span>}
      </span>
      {children}
    </label>
  )
}
