<template>

  <div v-if="loaded">
      <div style="text-align:center; padding-top:100px;">
    <div style="margin-bottom:15px">לצערנו התוכן המבוקש לא נמצא באפליקציה.</div>
    <!-- <div style="margin-bottom:15px">לפתיחת האתר בחר בדפדפן כרום</div>
      <div><a class="btn" :href="url" target="_blank">פתח את האתר</a></div> -->
  </div>
  </div>
  
  </template>
  
  <script>
  
  export default {
    components: {  },
    data() {
      return {
        loaded: true
      };
    },
   mounted(){
      this.$emit('show_loader');
      //window.location.href = this.url;
       this.$emit('loaded');
    },
    methods: {
    },
    created() {
        //var url = 'https://www.nadlancenter.co.il' + this.$route.fullPath;
  
    }
  }
  </script>