<template>
    <Teleport to="#page-wrap">
        <div id="popup_wrapper" v-if="modelValue">
            <div id="popup_layout" :class="{ active: isShow}" @click="allowClose !== false ? close() : false"></div>
        
            <div id="popup_content" :class="{ box: true, active: isShow}" >
                
                <a id="close" @click="close" v-if="allowClose !== false"><i class="fas fa-times"></i></a>

                <h1 class="popup_title"><slot name="title" /></h1>
                <div id="popup_content_scroll"><slot name="content" /></div>
                <div id="popup_action"><slot name="actions"></slot></div>
            </div>
        </div>
    </Teleport>
</template>
    
<script>
export default {
    props: ["modelValue", "values", "allowClose"],
    emits: ['update:modelValue'],

    data() {
        return {
            isShow: false,
            isClose:false
        }
    },
    mounted(){
        this.$nextTick(()=>{
            if (this.modelValue) this.open();
        });
    },
    methods:{    
        close(){
            this.isClose = true;
            this.$emit('close')
        },

        open(){
            document.body.classList.add('modal-open');

            this.isClose=false
            this.$nextTick(() => { 
                this.isShow = true;
            })
        }

    },
    watch:{
        modelValue(){
            
            if (!this.modelValue) this.isClose=true;
            else
            {
                this.open();
            }
        },
        isClose(){
            if (this.isClose)
            {
                document.body.classList.remove('modal-open');
                this.isShow = false;
                setTimeout(()=>{
                    // this.$emit('close');
                    //this.isActive=false;
                    this.$emit('update:modelValue', false);
                    this.isClose=false;
                },200);
            }
        }
    }
}
</script>
<style>
body.modal-open { height: 100vh; overflow-y: hidden; }
</style>
<style lang="scss" scoped>
#popup_wrapper { position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1050;}
#close { position: absolute; right: 0px; top: 0px; width:40px; height: 40px; display: flex; justify-content: center; align-items: center;}
#popup_layout { background: rgba(0, 0, 0, 0.2);position: fixed;inset: 0; 
    
    animation-duration: 0.2s; transition: transform 0.1s cubic-bezier(0.465, 0.183, 0.153, 0.946), opacity 0.1s cubic-bezier(0.465, 0.183, 0.153, 0.946); will-change: opacity;
    &:not(.active) { visibility: hidden; pointer-events: none; opacity: 0; }
    &.active { z-index: 999999999999999998; opacity: 1; }
}
#popup_content { position: absolute; display: flex; justify-content: space-between; flex-direction: column; min-height: calc(100vh - 150px); padding-bottom: 0px; top:50%;  z-index: 999999999999999999; 
    padding: 0px 25px; padding-bottom: 25px;
    border-top: 8px solid var(--color);
    max-width: 920px;
    background-color: #fff;
    left: 50%; /* overflow: hidden;*/ border-radius: 10px;max-width: 800px;width: 95%;
    animation-duration: 0.2s; transform: translate(-50%, -50%) scale(1.15); transition: transform 0.1s cubic-bezier(0.465, 0.183, 0.153, 0.946), opacity 0.1s cubic-bezier(0.465, 0.183, 0.153, 0.946); will-change: transform, opacity;
    opacity:0;

    
    &.active{transform: translate(-50%, -50%) scale(1); opacity: 1; transition: transform 0.3s cubic-bezier(0.465, 0.183, 0.153, 0.946), opacity 0.3s cubic-bezier(0.465, 0.183, 0.153, 0.946); }

    .popup_title { text-align: center; font-weight: 700; color: #000; font-size: 26px; margin-bottom: 20px; padding: 24px 24px 0;}

    #popup_content_scroll { max-height: calc(100vh - 160px); overflow-y: auto; flex: 100%; }
}

#popup_action { text-align: center; padding-top: 20px;}
</style>