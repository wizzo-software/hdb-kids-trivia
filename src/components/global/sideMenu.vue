<template>
  
    <div id="side_menu">
        <router-link to="/login" v-if="!get_me()" @click="toggleLogin(); close()" class="login_btn btn dark"> {{ get_word('login_signup') }}</router-link>
        <div v-else class="user_area">
            <div class="name">היי {{get_me().display_name}}</div>
            <div class="options">
                <router-link to="/settings" @click="close()"><i class="fas fa-cog"></i> החשבון שלי</router-link>
                <a @click="close(); logout()"><i class="fas fa-sign-out-alt"></i> יציאה</a>
            </div>

        </div>
                
        <ul id="menu">
            <li v-for="(item,i) in sideMenu" :key="i" >
            
            <router-link :to="item.link" :class="{active: $route.path == item.link, menu_link: true}" @click="close()">
                <span v-html="item.icon" />
                <label v-text="item.name"></label>
            </router-link>

            <Transition name="slide-down">
                <div class="submenu" v-if="!isNull(item.submenu) && item.isSubmenuOpen">
                    <ul>
                        <li v-for="(subitem,si) in item.submenu" :key="si">
                            <router-link :to="subitem.link" v-text="subitem.name" :class="{active: $route.path == subitem.link }" @click="close()"></router-link>
                        </li>
                    </ul>
                </div>
            </Transition>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['sideMenu', 'modelValue'],
    emits: ['update:modelValue'],

    methods: {
        close(){
            this.$emit('update:modelValue', false);
        },
    }

}
</script>

<style lang="scss">
.menu_open #side_menu { transform:translateX(0vw); background: var(--color2); color: #fff; text-align: left; overflow-y: auto; }
.menu_open #side_menu a { color: #fff; }
</style>