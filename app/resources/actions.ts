'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

function parseForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const url = String(formData.get('url') ?? '').trim()
  const categoryId = String(formData.get('categoryId') ?? '').trim()
  const typeId = String(formData.get('typeId') ?? '').trim()
  const topicId = String(formData.get('topicId') ?? '').trim()
  if (!title || !url || !categoryId || !typeId || !topicId) {
    throw new Error('title・url・大カテゴリ・種類・話題は必須です')
  }
  const description = String(formData.get('description') ?? '').trim() || null
  const memo = String(formData.get('memo') ?? '').trim() || null
  const statusId = String(formData.get('statusId') ?? '').trim() || null
  const pinned = formData.get('pinned') != null
  return { title, url, categoryId, typeId, topicId, description, memo, statusId, pinned }
}

export async function createResource(formData: FormData) {
  const data = parseForm(formData)
  await db.resource.create({ data })
  revalidatePath('/')
  redirect('/')
}

export async function updateResource(id: string, formData: FormData) {
  const data = parseForm(formData)
  await db.resource.update({ where: { id }, data })
  revalidatePath('/')
  redirect('/')
}

export async function deleteResource(id: string) {
  await db.resource.delete({ where: { id } })
  revalidatePath('/')
  redirect('/')
}

export async function cycleStatus(id: string) {
  const [resource, statuses] = await Promise.all([
    db.resource.findUnique({ where: { id }, select: { statusId: true } }),
    db.status.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  if (!resource || statuses.length === 0) return
  const currentIndex = statuses.findIndex((s) => s.id === resource.statusId)
  const next = statuses[(currentIndex + 1) % statuses.length]
  await db.resource.update({ where: { id }, data: { statusId: next.id } })
  revalidatePath('/')
}

export async function togglePin(id: string) {
  const resource = await db.resource.findUnique({ where: { id }, select: { pinned: true } })
  if (!resource) return
  await db.resource.update({ where: { id }, data: { pinned: !resource.pinned } })
  revalidatePath('/')
}
