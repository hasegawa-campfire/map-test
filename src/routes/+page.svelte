<script lang="ts">
  import { onMount } from 'svelte'
  import maplibregl from 'maplibre-gl'
  import 'maplibre-gl/dist/maplibre-gl.css'

  let mapElement: HTMLDivElement
  let map: maplibregl.Map
  let address: string
  let name: string

  onMount(async () => {
    map = new maplibregl.Map({
      container: mapElement,
      style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json',
      center: { lng: 139.7024, lat: 35.6598 },
      zoom: 16,
      interactive: true,
    })
  })

  async function addMarker() {
    const params = new URLSearchParams({ addr: address, charset: 'UTF8', geosys: 'world' })
    const res = await fetch(`https://geocode.csis.u-tokyo.ac.jp/cgi-bin/simple_geocode.cgi?${params}`)
    const xml = await res.text()

    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'application/xml')
    const coords = {
      lng: Number(doc.querySelector('longitude')?.textContent ?? 0),
      lat: Number(doc.querySelector('latitude')?.textContent ?? 0),
    }

    const popup = new maplibregl.Popup({ closeButton: false }).setText(name)
    new maplibregl.Marker().setLngLat(coords).setPopup(popup).addTo(map)
    map.jumpTo({ center: coords })

    name = address = ''
  }
</script>

<div class="map" bind:this={mapElement}></div>

<form on:submit|preventDefault={addMarker}>
  <label>名前: <input type="text" bind:value={name} required /></label>
  <label>住所: <input type="text" bind:value={address} required /></label>
  <button type="submit">マーカーを追加</button>
</form>

<style>
  .map {
    height: 600px;
  }

  label {
    display: block;
  }
</style>
