<script lang="ts" generics="Item extends { id: string; coords: LngLatLike }">
  import { onMount } from 'svelte'
  import maplibregl, { type LngLatLike } from 'maplibre-gl'
  import 'maplibre-gl/dist/maplibre-gl.css'
  import { debounce } from '$lib/utils'
  import markerIconUrl from '$lib/assets/marker.png'

  interface Props {
    items: Item[]
    maxItems?: number
    onMarkerSelect?: (item: NoInfer<Item> | null) => void
  }

  let { items, maxItems = 50, onMarkerSelect }: Props = $props()

  let mapContainer: HTMLDivElement
  let map: maplibregl.Map | null = null
  let selectedId = $state('')
  let filtedItems: Item[] = $state([])

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

    const debouncedFilteringItems = debounce(filteringItems, 300)

    map.on('move', debouncedFilteringItems)
    map.on('zoom', debouncedFilteringItems)
    map.on('resize', debouncedFilteringItems)
    map.on('click', (e) => {
      const el = e.originalEvent.target
      if (el instanceof HTMLElement && el.closest('[data-unselect-ignore]')) return
      selectMarker(null)
    })
    map.on('load', () => {
      filteringItems()
    })

    return () => {
      map?.remove()
    }
  })

  function filteringItems() {
    if (!map) return
    const bounds = map.getBounds()
    filtedItems = items.filter((item) => bounds.contains(item.coords)).slice(0, maxItems)
  }

  function addMarker(el: HTMLElement, item: Item) {
    if (!map) return

    const marker = new maplibregl.Marker({ element: el }).setLngLat(item.coords).addTo(map)

    return {
      destroy() {
        marker.remove()
      },
    }
  }

  function selectMarker(item: Item | null) {
    selectedId = item?.id ?? ''
    onMarkerSelect?.(item)
  }
</script>

<div class="container" bind:this={mapContainer}>
  {#each filtedItems as item (item.id)}
    <button
      use:addMarker={item}
      class="marker"
      class:active={item.id === selectedId}
      data-unselect-ignore
      type="button"
      onclick={() => selectMarker(item)}
    >
      <img class="marker-icon" src={markerIconUrl} alt="" />
    </button>
  {/each}
</div>

<style lang="scss">
  .container {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  .marker {
    width: fit-content;

    &.active {
      filter: sepia(0.8) brightness(1.4);
    }
  }

  .marker-icon {
    display: block;
    width: 24px;
  }
</style>
