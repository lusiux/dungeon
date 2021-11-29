<script lang="ts">
	import appMeta from "../stores/AppMeta";
</script>

{#if $appMeta.loading}
    <div>loading...</div>
{/if}

{#if $appMeta.error !== undefined} 
    <div class="error">{$appMeta.error}</div>
{/if}

<style lang="scss">
    div {
        margin-top: 1rem;
        text-align: center;

        &.error {
            color: red;
        }
    }
</style>