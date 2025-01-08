<script lang="ts">
  import 'modern-normalize/modern-normalize.css'

  let { children } = $props()
</script>

<div class="container">
  {@render children()}
</div>

<style lang="scss">
  :global(body) {
    font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
    line-height: 1;
    color: #444;
    touch-action: manipulation;
    cursor: default;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .container {
    position: relative;
    max-width: 1280px;
    margin: 0 auto;
  }
</style>
