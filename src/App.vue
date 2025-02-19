<template>
  <div id="page-wrap" :class="'rtl ' + (show_side_menu ? 'menu_open' : '')" dir="rtl">

    <LoginPage v-if="show_login" />

    <main id="page" v-if="!show_login && loaded"> 

      <div id="menu_hamburger" v-on:click="show_side_menu=!show_side_menu">
        <div id="nav-icon3"><span></span><span></span><span></span><span></span></div>
      </div>

      <SideMenu v-model="show_side_menu" :menu="sideMenu" />

      <HeaderMbl class="show_in_mobile" />
      <!-- <Header class="show_in_desktop" :class="header_class" :menu="menuComp" /> -->
      <div id="content">

        <WzRouterView />

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

import HeaderMbl from './components/global/headerMbl.vue'
// import Header from './components/global/header.vue'
import LoginPage from './views/login.vue'
import Footer from './components/global/footer.vue'


import WzRouterView from './components/slideViews/wzrouterView.vue'

import SideMenu from './components/global/sideMenu.vue'

export default {
  name: 'app',
  components: { LoginPage, WzRouterView, Footer, SideMenu, HeaderMbl },
  data(){
    return {
      loaded: false,
      menu: [],
      sideMenu: [],
      banner:null,
      header_class: '',
      show_side_menu: false,
      show_login:false,
    }
  },
  mounted() {

    window.appVue = this;

    this.$bus.$on("reload", (openURL) => {

      this.loaded = false;
      this.show_login = false;

			if (this.$route.path !== "/") this.$router.push(openURL);
      
      this.reload();
		});

    
    let getVars = {};
      let uri = window.location.href.split('?');
      if(uri.length == 2) {
        let vars = uri[1].split('&');
        
        let tmp = '';
        vars.forEach(function(v) {
          tmp = v.split('=');
          if(tmp.length == 2)
            getVars[tmp[0]] = tmp[1];
        });
        // do 
      }

      if(!this.isNull(getVars.token))
      {
        this.set_user_token(getVars.token);

        this.$bus.$emit("reload", '/');
        this.$router.push('/');
      }


    this.reload();

  },
  methods:{
    reload(){
      
    // categories
    this.api({ action: 'general'}, (data) => {

      this.sideMenu = !this.isNull(data.data.side_menu) ? data.data.side_menu.map(row => { row.isSubmenuOpen = false; return row;}) : [];
      this.$store.words = data.data.words;
      this.$store.user = data.data.user;
      this.$store.user_token = data.data.token;

      if (this.isNull(data.data.user) || data.data.user === false)
      {
        localStorage.removeItem('user_token');
        this.show_login=true;
      }
      else if (!this.isNull(data.data.user) && data.data.user.user_accepted == '0')
      {
        this.show_login=true;
      }

      this.loaded = true;
      });
    },
  }
}
</script>