import { ResourceLibrary } from '@/components/resource-library'
import { db } from '@/lib/db'

export default async function Home() {
  const [resources, categories, types, topics, statuses] = await Promise.all([
    db.resource.findMany({
      include: { category: true, type: true, topic: true, status: true },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.resourceType.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.topic.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.status.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <ResourceLibrary
      resources={resources}
      categories={categories}
      types={types}
      topics={topics}
      statuses={statuses}
    />
  )
}
