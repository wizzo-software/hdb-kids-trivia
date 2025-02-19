<template>
    
    <form class="login_form" @submit.prevent="login" >
        <template v-if="platforms.length == 0">

            <ul>
                <li>
                    <label>אי-מייל / מספר נייד</label>
                    <input v-model="loginForm.username" name="username" required>
                    <span class="md-helper-text">הזן כתובת מייל או טלפון נייד</span>
                </li>

                <li>
                    <label>סיסמה</label>
                    <input type="password" name="password" v-model="loginForm.password" required>
                    <span class="md-helper-text"><a class="u" @click="$emit('page', 'forgot')">שכחת סיסמה?</a></span>
                </li>
            </ul>
        

            <div class="bottom_links">                    
                <input type="submit" value="כניסה" class="btn">
                <a class="g_btn" @click="login_g">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
                    <span>התחבר באמצעות Google</span>
                </a>
            </div>

            <div style="text-align:center; padding-top:25px;" v-if="$store.state.platform">
                <!-- <a class="u" @click="$emit('page', 'signup')">אין לי חשבון, אני רוצה להירשם</a> -->
            </div>

        </template>
        
    </form>
</template>

<script>
export default {

    data(){
        return { 
            platforms: [],
        
            accept_terms: false,
                
            loginForm: { 
                username: '',
                password: '',
            },
        }
    },
    
    methods:{
        login(){
            this.$emit('loading', true);

            this.api({ action: 'login', data: this.loginForm}, (data) => {
                
                this.$emit('loading', false);
                switch (data.data.status)
                {
                    case true: { 
                        this.set_user_token(data.data.token);
                        
                        if (this.isApp) this.afterLogin();
                        this.$bus.$emit('reload', '/');
                        break;
                    }

                    case false: {
                        this.alert(data.data.error);
                        break;
                    }
                }

            });

        },

        login_g(){
            if (this.isApp)
            {
                window.plugins.googleplus.isAvailable((avail) => {
                if(avail){
                        window.plugins.googleplus.login(
                            {
                                'webClientId': '704652981997-74ugcljrvp3ddg0e1970u4ifao66gdcn.apps.googleusercontent.com',
                                'offline': false
                            },
                            (obj) => {
                            this.api({ action: 'google', data: obj}, (data) =>{
                                if(data.data && !this.isNull(data.data))
                                {
                                    this.set_user_token(data.data);
                                    if (this.isApp) this.afterLogin();
                                    this.$bus.$emit('reload', '/');
                                }
                            });
                            },
                            () => {
                                this.alert("ההתחברות נכשלה נא לנסות באמצעי אחר");
                            }
                        );
                    }
                });
            }
            else
            {
                document.location = window.api_url + 'google_login?platform_id=' + this.$store.state.platform.id;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.fb_btn, .g_btn { text-align: center; height: 48px; line-height: 48px; border-radius: 24px; text-decoration:none !important; white-space:nowrap; display: inline-block; font-size: 16px; padding: 0 15px; padding-left: 41px; }
.fb_btn { background: #30487b /*url(../images/f_ico.png)*/ 10px center no-repeat; }
.g_btn {  border:1px solid #f14338; display: flex; align-items: center; justify-content: center; gap: 10px;
  svg { height: 24px; width: 24px; }
}


.platforms_list { list-style: none; border:1px solid #eee; border-radius: 6px; overflow: hidden; margin-bottom: 15px;
  li { display: block; padding:8px 15px; cursor: pointer; margin: 0px;
    &:hover { background: #eee; }
    &.active { background: var(--color); color:#fff; font-weight: bold;}
  }
}
</style>