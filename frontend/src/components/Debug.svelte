<style type="text/scss">
    @import '../style/vars';

    /* renders a little sqare in the lower left corner of the screen */
    /* the color indicates the current break point that is active */
    /* will *not* show up in production */

    div {
        position: fixed;
        width: 0.5rem;
        height: 0.5rem;
        background-color: green;
        left: 0.5rem;
        bottom: 0.5rem;

        @media (min-width: $breakpoint-medium) {
            background-color: yellow;
        }

        @media (min-width: $breakpoint-big) {
            background-color: red;
        }
    }
</style>

{#if import.meta.env.MODE === 'development'}
    <div></div>
{/if}