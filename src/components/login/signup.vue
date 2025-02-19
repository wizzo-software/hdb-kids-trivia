<template>
    
    <form class="login_form" @submit.prevent="signup()" >

        <ul>
        <li>
            <label>שם מלא *</label>
            <input v-model="signupForm.display_name" name="first_name" required>
        </li>

        <li>
            <label>אי-מייל *</label>
            <input v-model="signupForm.username" name="first_name" required>
        </li>

        <li>
            <label>סיסמה *</label>
            <input type="password" v-model="signupForm.password" name="first_name" required>
        </li>

        <!-- <li>
            <label>
            <input type="checkbox" v-model="accept_terms" required>אני מאשר/ת שקראתי את <a @click="alert(get_word('terms_content'))" class="u">התקנון</a>
            </label>
        </li> -->

        </ul>

        <div style="margin-bottom:15px; text-align:center;"><input type="submit" value="הרשמה" class="btn"></div>
        <div class="bottom_links"><a @click="$emit('page', 'login')">יש לי חשבון, אני רוצה להתחבר</a></div>
        
    </form>
    
</template>


<script>
export default {
    data(){
        return {
            accept_terms: false,
                
            signupForm: { 
                display_name: '',
                username: '',
                password: '',
            },
        }
    },
    
    methods:{
            
        signup(){
            this.$emit('loading', true);

            // if (!this.accept_terms) return false;

            this.api({ 'action': 'signup', data: this.signupForm}, (data) => {
                
                if (this.isNull(data) || this.isNull(data.data))
                {
                    this.$emit('loading', false);
                    //alert('Wrong details. Please try again.');
                }
                else if (data.data == 'no_invitation')
                {
                    this.alert('אין הזמנה עם כתובת המייל שהזנת.');
                    this.$emit('loading', false);
                }
                else
                {
                    this.set_user_token(data.data.token);
                    if (this.isApp) this.afterLogin();
                    //  document.location = document.location.href;
                    this.$bus.$emit('reload', '/');
                }
                
            });
        },
    }
}
</script>