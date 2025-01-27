import { browser } from '$app/environment'
import type { Project } from '$lib/types'

// async function fetchData() {
//   const res = await fetch('./projects.bin')
//   if (!res.ok || !res.body) throw Error()
//   const ds = new DecompressionStream('gzip')
//   const stream = res.body.pipeThrough(ds)
//   return new Response(stream).json()
// }

async function fetchData() {
  const res = await fetch('./projects.json')
  return res.json()
}

const promise: Promise<Project[]> = browser ? fetchData() : Promise.resolve([])

export default promise
