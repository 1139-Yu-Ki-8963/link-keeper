import { ResourceLibrary } from '@/components/resource-library'
import { db } from '@/lib/db'

// 個人規模（数百件）のため全件をサーバーで取得し、絞り込みはクライアントに委ねる。
// 「再読・共有したい」⭐ を上に、その中では新しい順で並べる。
export default async function Home() {
  const [resources, categories, types, scenes, statuses, tags] = await Promise.all([
    db.resource.findMany({
      include: { category: true, type: true, scene: true, status: true, tags: true },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.resourceType.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.scene.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.status.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <ResourceLibrary
      resources={resources}
      categories={categories}
      types={types}
      scenes={scenes}
      statuses={statuses}
      tags={tags}
    />
  )
}
