import { ResourceForm } from '@/components/resource-form'
import { db } from '@/lib/db'
import { createResource } from '../actions'

export default async function NewResourcePage() {
  const [categories, types, topics, statuses] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.resourceType.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.topic.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.status.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold">リンクを追加</h1>
      <ResourceForm
        action={createResource}
        categories={categories}
        types={types}
        topics={topics}
        statuses={statuses}
      />
    </div>
  )
}
