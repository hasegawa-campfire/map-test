<script lang="ts">
  import { onMount } from 'svelte'
  import maplibregl from 'maplibre-gl'
  import 'maplibre-gl/dist/maplibre-gl.css'
  import { debounce } from '$lib/utils'
  import type { Project as Item } from '$lib/types'

  interface Props {
    itemsPromise: Promise<Item[]>
    maxItems?: number
    onMarkerSelect?: (item: Item | null) => void
  }

  let { itemsPromise, maxItems = 50, onMarkerSelect }: Props = $props()

  let mapContainer: HTMLDivElement
  let items: Item[] = []
  let map: maplibregl.Map | null = null
  const markers: Record<string, maplibregl.Marker> = {}
  let selectedId = ''

  function onMarkerClick(item: Item) {
    markers[selectedId]?.removeClassName('active')
    if (item.id === selectedId) {
      selectedId = ''
    } else {
      selectedId = item.id
    }
    markers[selectedId]?.addClassName('active')
    onMarkerSelect?.(selectedId ? item : null)
  }

  const updateMarkers = debounce(() => {
    if (!map) return
    const bounds = map.getBounds()
    const visibleItems: Item[] = []
    const invisibleItems: Item[] = []

    for (const item of items) {
      if (visibleItems.length < maxItems && bounds.contains(item.coords)) {
        visibleItems.push(item)
      } else {
        invisibleItems.push(item)
      }
    }

    for (const item of invisibleItems) {
      const marker = markers[item.id]
      if (marker) {
        marker.remove()
        delete markers[item.id]
      }
    }

    for (const item of visibleItems) {
      if (!markers[item.id]) {
        const marker = new maplibregl.Marker({ color: '#ff4f45' }).setLngLat(item.coords).addTo(map)
        marker.getElement().addEventListener('click', () => {
          onMarkerClick?.(item)
        })
        marker.addClassName('project-marker')
        markers[item.id] = marker
      }
    }
  }, 200)

  onMount(() => {
    map = new maplibregl.Map({
      container: mapContainer,
      style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json',
      center: { lng: 139.7024, lat: 35.6598 },
      zoom: 10,
    })

    map.addControl(
      new maplibregl.NavigationControl({
        showZoom: true,
        showCompass: false,
      }),
      'bottom-right',
    )

    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      'bottom-right',
    )

    map.on('moveend', updateMarkers)
    map.on('zoomend', updateMarkers)

    itemsPromise.then((v) => {
      items = v
      updateMarkers()
    })

    return () => {
      for (const marker of Object.values(markers)) marker.remove()
      map?.remove()
    }
  })
</script>

<svelte:window on:resize={updateMarkers} />

<div class="container" bind:this={mapContainer}></div>

<style lang="scss">
  .container {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  :global(.project-marker) {
    cursor: pointer;
  }

  :global(.project-marker.active [fill='#ff4f45']) {
    fill: #ffc23d !important;
  }
</style>
