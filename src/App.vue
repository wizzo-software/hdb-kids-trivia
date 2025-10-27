<template>
  <div id="page-wrap" :class="'rtl'" dir="rtl">
      <main id="page" v-if="!show_login && loaded"> 
      <div id="content">
        <router-view v-slot="{ Component }" @loaded="is_show_loader=false;" @show_loader="is_show_loader=true;" @movefooterdown="lowerFoot" @movefooter="moveFoot">
            <component :is="Component" :key="$route.path" />
        </router-view>
      </div>
    </main>

    <Footer />   

    <div id="loading_animation" v-if="!loaded">
      <div id="spinner_ajax"></div>
    </div>
  </div>
  <Share />
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      loaded: false,
      all_time_leaders: [],
      monthly_leaders: [],
    }
  },
  mounted() {
    window.appVue = this;
    this.reload();
  },
  methods:{
    reload(){
      
      this.loaded = true;
    },
  }
}
</script>