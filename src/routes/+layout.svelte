<script lang="ts">
  import 'modern-normalize/modern-normalize.css'
  import '$lib/assets/reset.scss'

  let { children } = $props()
</script>

<div class="container">
  {@render children()}
</div>

<style lang="scss">
  .container {
    position: relative;
    max-width: 1280px;
    margin: 0 auto;
  }
</style>
