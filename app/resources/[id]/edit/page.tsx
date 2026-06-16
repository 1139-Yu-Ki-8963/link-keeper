import { notFound } from 'next/navigation'
import { ResourceForm } from '@/components/resource-form'
import { db } from '@/lib/db'
import { deleteResource, updateResource } from '../../actions'

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [resource, categories, types, scenes, statuses, tags] = await Promise.all([
    db.resource.findUnique({
      where: { id },
      include: { category: true, type: true, scene: true, status: true, tags: true },
    }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.resourceType.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.scene.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.status.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!resource) notFound()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold">リンクを編集</h1>
      <ResourceForm
        action={updateResource.bind(null, resource.id)}
        categories={categories}
        types={types}
        scenes={scenes}
        statuses={statuses}
        tags={tags}
        resource={resource}
      />

      <form
        action={deleteResource.bind(null, resource.id)}
        className="mt-10 border-t border-zinc-200 pt-6"
      >
        <button type="submit" className="text-sm text-red-600 active:underline">
          このリンクを削除する
        </button>
      </form>
    </div>
  )
}
