<script lang="ts">
  import { slide } from 'svelte/transition'
  import type { Project } from '$lib/types'

  let { project = null }: { project: Project | null } = $props()

  function toDigit(num: number) {
    return num.toLocaleString('en-US')
  }
</script>

{#if project}
  <a
    class="container"
    href="https://camp-fire.jp/projects/{project.id}/view"
    target="_blank"
    transition:slide={{ duration: 300 }}
  >
    <div class="sub-container">
      <img class="visual" src={project.imageUrl} alt="" />
      <div class="rate">
        <div class="rate-bar" style:width="{project.rate * 100}%"></div>
      </div>
    </div>
    <div class="sub-container">
      <div class="name">{project.name}</div>
      <div class="category">{project.category}</div>
      <div class="amount">
        {toDigit(project.amount)}<span class="unit">円</span>
      </div>
      <div class="attrs">
        <div class="attr">
          <span class="label">支援</span>{toDigit(project.backers)}人
        </div>
        <div class="attr">
          {#if project.left > 0}
            <span class="label">残り</span>{toDigit(project.left)}日
          {:else}
            終了
          {/if}
        </div>
      </div>
    </div>
  </a>
{/if}

<style lang="scss">
  .container {
    position: absolute;
    inset: auto 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    width: 400px;
    max-width: 100%;
    padding: 16px;
    margin: 0 auto;
    font: inherit;
    color: inherit;
    text-decoration: inherit;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 0 6px #0002;
    transition: transform 0.2s ease-out;
  }

  .sub-container {
    position: relative;
    min-width: 0;
  }

  .visual {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
  }

  .rate {
    position: relative;
    height: 8px;
    overflow: hidden;
    background-color: #e4e4e4;
    border-radius: 0 0 8px 8px;
  }

  .rate-bar {
    max-width: 100%;
    height: 100%;
    background-image: linear-gradient(270deg, #ff4f45, #ff4f45 17.48%, #fa643c 49.56%, #fb8943 69.79%, #ffc13e);
  }

  .name {
    display: -webkit-box;
    height: 3lh;
    overflow: hidden;
    font-size: 15px;
    font-weight: bold;
    line-height: 1.25;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .category {
    width: fit-content;
    max-width: 100%;
    padding: 3px 8px;
    padding-bottom: 4px;
    margin-top: 6px;
    overflow: hidden;
    font-size: 12px;
    line-height: 1;
    color: #666;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: #f6f8fa;
    border-bottom: 1px solid #f3f3f3;
    border-radius: 32px;
  }

  .amount {
    margin-top: 6px;
    font-size: 15px;
    font-weight: bold;
    text-align: right;

    .unit {
      margin-left: 2px;
      font-size: 12px;
      font-weight: normal;
    }
  }

  .attrs {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }

  .attr {
    font-size: 12px;

    .label {
      margin-right: 2px;
      color: #999;
    }
  }
</style>
