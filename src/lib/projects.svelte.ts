import { browser } from '$app/environment'
import type { Project } from '$lib/types'

async function fetchBin() {
  const res = await fetch('./projects.bin')
  if (!res.ok || !res.body) throw Error()
  const ds = new DecompressionStream('gzip')
  const stream = res.body.pipeThrough(ds)
  return new Response(stream).json()
}

const promise: Promise<Project[]> = browser ? fetchBin() : Promise.resolve([])

export default promise
