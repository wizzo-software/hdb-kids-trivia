<template>
  
    <header>
        <div id="logo">
        <router-link to="/" @click="show_side_menu=false">
            <img src="@/assets/logo.png" alt="logo" />
        </router-link>
        </div>
    </header>
    
</template>

<script>
export default {

}
</script>

<style lang="scss">

header { position: sticky;top: 0;left: 0;width: 100%; height: var(--header-height); background: #fff; z-index: 90; box-shadow: 0 2px 40px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: space-between; padding: 0 25px;
  #logo { position: absolute; left: 50%; top:50%; transform: translateX(-50%) translateY(-50%);
    img { height: 22px; }
  }
}

.menu_open header { opacity: 0.3; }
</style>