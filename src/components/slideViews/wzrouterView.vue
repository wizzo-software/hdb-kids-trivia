<template>
    <div id="slides_wrapper_container">
        <div :style="'--slide:' + currSlide" id="slides_wrapper">
            
            <div v-for="slide in maxSlides" :key="slide" class="page_slide scrollable_slide">
                <PageSlide v-if="currSlide >= slide" :slide="slide" />
            </div>
        </div>
    </div>
</template>

<script>

import PageSlide from '@/components/slideViews/slide.vue'
import { maxTarget } from '@/router'

export default {
    components: {
        PageSlide
    },
    data() {
        return {
            maxSlides: maxTarget,
            lastNumericSlide: 1
        };
    },
    mounted() {
    },
    computed: {
        currSlide() {
            const route = this.$route;
            
            if (route && route.meta && route.meta.target > 0) {
                return route.meta.target;
            }

            return this.lastNumericSlide; // Default to first slide
        }
    },
    watch: {
        '$route'() {
            const route = this.$route;
            if (route && route.meta && route.meta.target > 0) {
                this.lastNumericSlide = route.meta.target;
            }

        }
    }
}
</script>
<style lang="scss">
:root {
    @media (min-width: 801px) {
        --page-width: 1200px;
    }
    @media (max-width: 800px) {
        --page-width: 100vw;
    }
}
</style>

<style lang="scss">

.scrollable_slide { overflow-y: auto; scroll-behavior: smooth;  -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; height: calc( 100vh - var(--header-height) - var(--footer-height)); }

#slides_wrapper_container { width: var(--page-width); overflow: hidden;}
#slides_wrapper { display: flex; transition: transform 0.3s ease; transform: translateX(calc((var(--slide) - 1) * var(--page-width))); height: calc( 100vh - var(--header-height) - var(--footer-height)); 

    > .page_slide { width: var(--page-width); flex-shrink: 0; position: relative; transform: translate(0px, 0px);
        -webkit-min-device-pixel-ratio:0;
        @media (min-width: 801px) { padding-block: 20px; }
        @media (max-width: 800px) {  }
    
        &::-webkit-scrollbar { display: none; }
    }
}

</style>