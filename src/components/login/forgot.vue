<template>
    
    <form class="login_form" @submit.prevent="forgot()" v-if="step == 1">

        <ul>
            <li>
                <label>אי-מייל *</label>
                <input v-model="forgotForm.email" name="email" required>
            </li>
        </ul>

        <div style="margin-bottom:15px; text-align:center;"><input type="submit" value="שחזור סיסמא" class="btn"></div>
        <div class="bottom_links"><a @click="$emit('page', 'login')">יש לי חשבון, אני רוצה להתחבר</a></div>

    </form>
    
    <form class="login_form" @submit.prevent="forgot2()" v-if="step == 2">
        <p class="gap_bottom">ברגעים אלה נשלח אליך מייל עם קוד לשחזור הסיסמה.<br />אנא הזן את הקוד כאן:</p>
        <ul>
        <li>
            <label>קוד *</label>
            <input v-model="forgotForm.code" required>
        </li>
        </ul>


        <div style="margin-bottom:15px; text-align:center;"><input type="submit" value="המשך" class="btn"></div>
        <div class="bottom_links"><a @click="$emit('page', 'login')">יש לי חשבון, אני רוצה להתחבר</a></div>

    </form>
    
    <form class="login_form" @submit.prevent="forgot3()" v-if="step == 3">
        <p class="gap_bottom">יופי! כעת נשאר רק לבחור את הסיסמה החדשה שלך.</p>
        <ul>
        <li>
            <label>סיסמא חדשה *</label>
            <input v-model="forgotForm.password" type="password" required>
        </li>
        </ul>


        <div style="margin-bottom:15px; text-align:center;"><input type="submit" value="שינוי סיסמה" class="btn"></div>
        <div class="bottom_links"><a @click="$emit('page', 'login')">יש לי חשבון, אני רוצה להתחבר</a></div>

    </form>

</template>

<script>
export default {
    data(){
        return {
            step: 1,
            forgotForm: {
                email: '',
                code: '',
                password: ''
            }
        }
    },
    methods:{
            
        forgot(){
            this.$emit('loading', true);

            this.api({ 'action': 'forgot_password', data: this.forgotForm}, (data) => {
                
                this.$emit('loading', false);

                if (data.data === true)
                {
                this.step = 2;
                }
                else
                {
                this.alert('משתמש לא נמצא');
                }
                
            });

        },    

        forgot2(){
            this.$emit('loading', true);

            this.api({ 'action': 'forgot_password2', data: this.forgotForm}, (data) => {
                
                this.$emit('loading', false);

                if (data.data === true)
                {
                    this.step = 3;
                }
                else
                {
                    this.alert('קוד לא תקין');
                }
                
            });

        },  

        forgot3(){
            this.$emit('loading', true);

            this.api({ 'action': 'forgot_password3', data: this.forgotForm}, (data) => {
                
                this.$emit('loading', false);

                if (data.data === true)
                {
                    alert('הסיסמה עודכנה בהצלחה.');
                    // this.username = this.forgotForm.email;
                    // this.password = this.forgotForm.password;
                    this.$emit('page', 'login');
                }
                else
                {
                    this.alert('קוד לא תקין');
                }
                
            });

        },  

    }
}
</script>