'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

// FormData から Resource の入力値を取り出す。title / url / 大カテゴリ / 種類 は必須。
function parseForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const url = String(formData.get('url') ?? '').trim()
  const categoryId = String(formData.get('categoryId') ?? '').trim()
  const typeId = String(formData.get('typeId') ?? '').trim()
  if (!title || !url || !categoryId || !typeId) {
    throw new Error('title・url・大カテゴリ・種類は必須です')
  }
  const description = String(formData.get('description') ?? '').trim() || null
  const memo = String(formData.get('memo') ?? '').trim() || null
  const sceneId = String(formData.get('sceneId') ?? '').trim() || null
  const statusId = String(formData.get('statusId') ?? '').trim() || null
  const pinned = formData.get('pinned') != null
  const tagIds = formData.getAll('tagIds').map(String)
  return { title, url, categoryId, typeId, description, memo, sceneId, statusId, pinned, tagIds }
}

export async function createResource(formData: FormData) {
  const { tagIds, ...data } = parseForm(formData)
  await db.resource.create({
    data: { ...data, tags: { connect: tagIds.map((id) => ({ id })) } },
  })
  revalidatePath('/')
  redirect('/')
}

export async function updateResource(id: string, formData: FormData) {
  const { tagIds, ...data } = parseForm(formData)
  await db.resource.update({
    where: { id },
    data: { ...data, tags: { set: tagIds.map((tid) => ({ id: tid })) } },
  })
  revalidatePath('/')
  redirect('/')
}

export async function deleteResource(id: string) {
  await db.resource.delete({ where: { id } })
  revalidatePath('/')
  redirect('/')
}

// 実践状況をワンタップで循環させる（未読 → 後で挑戦 → 実践済み → 未読）。
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

// 「再読・共有したい」⭐ フラグをトグルする。
export async function togglePin(id: string) {
  const resource = await db.resource.findUnique({ where: { id }, select: { pinned: true } })
  if (!resource) return
  await db.resource.update({ where: { id }, data: { pinned: !resource.pinned } })
  revalidatePath('/')
}
