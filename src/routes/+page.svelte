<script lang="ts">
  import Map from '$lib/components/Map.svelte'
  import Drawer from '$lib/components/Drawer.svelte'
  import projectsPromise from '$lib/projects.svelte'
  import type { Project } from '$lib/types'

  let selectedProject: Project | null = $state(null)

  function onMarkerSelect(project: Project | null) {
    selectedProject = project
  }
</script>

<div class="container">
  <header>地図から探す</header>
  <div class="map">
    <Map itemsPromise={projectsPromise} {onMarkerSelect} />
    <Drawer project={selectedProject} />
  </div>
</div>

<style lang="scss">
  .container {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
  }

  header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0 0 6px #0002;
  }

  .map {
    position: relative;
    z-index: 0;
    overflow: hidden;
  }
</style>
