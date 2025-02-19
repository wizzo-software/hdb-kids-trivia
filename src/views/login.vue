<template>

  <div id="login_page_wrap">
    <div id="right_side">
      <div id="login_page">
        <div id="form_wrapper" md-theme="default-dark">
            
          <!-- <a id="logo" :style="bg($store.state.platform.logo_parsed)"></a> -->
          <div id="logo" :class="{show: loaded}"></div>

          <div v-if="is_loading">
            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
          </div>
          <div v-show="!is_loading">
            <div>
              <Login v-if="show_page=='login'" @page="show_page = $event" @loading="is_loading = $event" />
              <Forgot v-if="show_page=='forgot'" @page="show_page = $event" @loading="is_loading = $event" />
            </div>
          
          </div>
        </div>

    
      </div>
    </div>
    
    <div id="bg" :style="{ backgroundImage: `url(${randonBg})` }"></div>
</div>
</template>

<script>
import Login from '@/components/login/login.vue'
import Forgot from '@/components/login/forgot.vue'

export default {
  components: { Forgot, Login },
  data(){
      return {

        token: '',
        is_loading: false,
        loaded: false,

        randonBg: '',
        
        show_page: 'login',
      }
  },
  mounted(){

    this.randonBg = this.selectRandomBackground();
    this.$nextTick(() => {
      this.loaded = true;

      let input = document.querySelector('input');
      if (input) input.focus();
    })

  },
  methods:{
    selectRandomBackground() {
      const images = [
        require('@/assets/login_1.webp'), // Make sure to properly import or require your images
        require('@/assets/login_2.webp'),
        require('@/assets/login_3.webp'),
        require('@/assets/login_4.webp'),
      ];
      const randomIndex = Math.floor(Math.random() * images.length); // Select a random index
      return images[randomIndex]; // Set the random image as the background
    },

  }
}
</script>

<style lang="scss" scoped>
:deep(.login_form) {
  ul { 
    li { display: block; margin-bottom: 15px;
      label { display: block; font-size: 17px; padding-right: 15px;}
      input:not([type=checkbox]) { width:100%; height: 50px; background: #eee; color:#333; border:none; border-radius: 50px; padding: 0 25px; font-size: 20px; }
      span { display: block; text-align: left; font-size: 15px; padding-left: 15px;}
    }
  }
  
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active  {
      -webkit-box-shadow: 0 0 0 30px #eee inset !important;
  }
  
  .border_title { color: #A2A2A2; font: 23px sans-serif;  margin-top: 30px; text-align: center; position: relative; z-index: 1; margin: 15px 0px;    
    span { background: #fff; padding: 0 15px; }
    &::before { border-top: 2px solid #dfdfdf; content: ""; margin: 0 auto; position: absolute; top: 50%; left: 0; right: 0; bottom: 0; width: 95%; z-index: -1; }
  }

  .bottom_links { text-align:center; display:flex; justify-content: space-between; gap:var(--gap);
    @media (min-width: 600px) { 
      a, .btn { flex:1; }
    }
    @media (max-width: 600px) { flex-direction: column; }
    a { text-decoration: underline;  }
    .btn {  height:48px;}
  }
}

#login_page_wrap { min-height: 100vh; background: #fff; width:100%;
  @media (min-width: 600px) { display: flex; }
  #bg { height:100vh; background: url(@/assets/login_1.webp) center center no-repeat; background-size: cover;  width:30vw; position:sticky; top:0;
    @media (max-width: 600px) { display:none; }
  }
  #right_side { flex:1; display: flex; align-items: center; justify-content: center; min-height: 100vh;
    #login_page { width:400px; max-width:80%;  } 
  }
}
#logo { display: block; margin: 0 auto; margin-bottom: 25px; transition: all 0.6s ease; 
  @media (min-width: 600px) { height: 70px;  }
  @media (max-width: 600px) { max-width:70%; }
  &:not(.show) { opacity: 0; transform: translateY(25px);}
  &.show { opacity: 1; }
}
</style>