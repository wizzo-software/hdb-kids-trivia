<template>
    <component v-if="currentComponent" :is="currentComponent"></component>
</template>
  
<script>
import { computed, shallowRef } from 'vue';
import { useRoute } from 'vue-router';

export default {
    props: ['slide'],
    setup() {
        const route = useRoute();
        const target = computed(() => route.meta.target);
        return { target };
    },
    data(){
        return {
            currentComponent: shallowRef(false)
        }
    },
    mounted(){
        this.loadComponent();
    },
    methods: {
        loadComponent(){
            const route = this.$route;
            if (route.meta.target === this.slide) {
                this.currentComponent = route.matched[0].components.default;
            }

        }
    },
    watch: {
        // watch  route change
        '$route'(){
            this.loadComponent();
        }
    }
};
</script>