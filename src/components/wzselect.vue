<template>
    <div class="wzselect" :id="elID" :class="'theme-' + wzsettings.theme">
        <!-- <select class="wzselect-select">
            <option v-for="opt in optionsComp" :key="opt.key" :value="opt.key" :selected="opt.key==modelValue">{{opt.val}}</option>
        </select> -->
        <input class="wzselect-select" :value="modelValue">
        
        <div class="wzselect-wrapper" :style="'display: inline-block; width:' + wzsettings.width + '; min-width:150px; position:relative;'" v-click-away="away">
            <div class="wzselect-inp inp" type="text" @click="toggleOpen">
                <span v-html="valueComp"></span>
            </div>
            <div class="wzselect-options" :class="{
                'open_to_top': openDirection=='top',
                'open_to_left': horizontalOpenDirection=='left',
                'open_to_right': horizontalOpenDirection=='right'
            }" v-if="isOpen" :style="optionsStyle">
                <div v-if="wzsettings.search" class="search">
                    <input type="text" v-model="q" @input="search" placeholder="חיפוש" ref="inp">
                </div>
                <ul>
                    <li v-for="opt in optionsComp" :key="opt.key" :class="{selected: opt.key == modelValue}" v-html="opt.val" @click="val(opt)"></li>
                    <li v-if="optionsComp.length == 0">לא נמצאו תוצאות</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { directive } from "vue3-click-away";
export default {
  directives: {
    ClickAway: directive
  },
  props:["settings", "options", "modelValue"],
  emits: ['update:modelValue', 'change'],
    data(){
        return {
            elID: 'wzselect_' + this.uuid(),
            openDirection: 'bottom',
            openMaxHeight: 300,
            wzsettings: {
                theme: 'dark',
                placeholder: ``,
                label: ``,
                icon: ``,
                width: 'auto',
                search: false,
                url: '' // 'wizzocms/Admins/ac_search'
            },
            q: '',
            m_options: this.options,
            isOpen:false,
            horizontalOpenDirection: 'left'
        };
    },
    mounted(){

        for (let i in this.settings)
        {
            this.wzsettings[i] = this.settings[i];
        }

        /*
        for (let i in this.m_options)
        {
            if (this.m_options[i].key == this.value)
            {
                this.val(this.m_options[i]);
            }
        }*/
    },
    methods:{
        away: function() { 
            this.isOpen = false;
        },
        val(opt){ 
            //this.value = opt;
            this.isOpen = false;
            
            this.$emit('update:modelValue', opt.key);
            this.$emit('change', opt.key);

            this.q='';
        },
        toggleOpen(){
            this.isOpen=!this.isOpen;
            //let parent = this.getScrollParent(this.$el);

            if (this.isOpen)
            {
                if (this.wzsettings.search && !this.is_mobile())
                {
                    setTimeout(() => {
                        this.$refs.inp.focus();
                    }, 50);
                }

                this.calcOptionsSize();

                //parent.addEventListener('scroll', this.calcOptionsSize, true);
            }
            else
            {
                //parent.removeEventListener('scroll', this.calcOptionsSize, true);
            }
        }, 

        calcOptionsSize(){
            let parent = this.getScrollParent(this.$el);

            const parentPos = parent.getBoundingClientRect();
            const childPos  = this.$el.getBoundingClientRect();
            const relativePos = {};

            relativePos.top    = childPos.top - parentPos.top,
            relativePos.right  = childPos.right - parentPos.right,
            relativePos.bottom = childPos.bottom - parentPos.bottom,
            relativePos.left   = childPos.left - parentPos.left;

            const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
             var viewportOffset = this.$el.getBoundingClientRect();
            var top = viewportOffset.top; // relativePos.top;
            // console.log(top)
            if (vh/2 < top) 
            {
                this.openDirection = 'top';
                this.openMaxHeight = (viewportOffset.top < top ? viewportOffset.top : top) - 100;
            }
            else
            {
                this.openDirection = 'bottom';
                this.openMaxHeight = (viewportOffset.top < vh-top ? vh-viewportOffset.top : vh-top) - 100;
            }

            
            this.$nextTick(() => {

                const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                const left = viewportOffset.left;
                const right = vw - viewportOffset.right;
                const dropdownWidth = this.$el.querySelector('.wzselect-options').offsetWidth || 0;

                // If the space on the right is less than the width of the dropdown, open to the left
                if (left > dropdownWidth || right < dropdownWidth) {
                    this.horizontalOpenDirection = 'right';
                } else {
                    this.horizontalOpenDirection = 'left';
                }
            })
            //alert(this.openMaxHeight)
        },

        getScrollParent(node=null) {
            if (node == null) return document.querySelector('body');

            if (node.scrollHeight > node.clientHeight) 
            {
                return node;
            } 
            else 
            {
                return this.getScrollParent(node.parentNode);
            }
        },

        search(){
            if (this.wzsettings.url != '')
            {
                fetch(this.wzsettings.url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ q: this.q})

                    
                }).then(res => res.json())
                .then((res) => {
                    this.m_options = res;
                });
            }

        },
            
        uuid() {
            return Math.random().toString(36).slice(4)
        },
    },
    computed:{
        
        optionsStyle(){ 
            return {
                maxHeight: this.openMaxHeight+ 'px'
            }
        },
        valueComp(){
            let lbl = (this.wzsettings.label != '' ? this.wzsettings.label + ': ' : '');
            let icon = this.wzsettings.icon;

            //if (!this.isNull(this.modelValue))
            //{
                for (let i in this.m_options)
                {
                    if (this.modelValue == this.m_options[i].key) return icon + lbl + (lbl != '' ? '<b>' + this.m_options[i].val + '</b>' : this.m_options[i].val);
                }
            //}   
    
            return icon + lbl + (lbl != '' ? '<b>' + this.wzsettings.placeholder + '</b>' : this.wzsettings.placeholder);
        },
        optionsComp()
        {
            let ret = [];
            
            // console.log(this.m_options)

            let findIn = function(str, q) { 
                if (str == undefined) return false;
                return str.toUpperCase().indexOf(q.toUpperCase()) >= 0; };
            
            for (let i in this.m_options)
            {
                if (!this.search || findIn(this.m_options[i].val,this.q)) ret.push(this.m_options[i]);
            }
            
            return ret;
        }
    },
    watch:{
        options(){
            this.m_options = this.options;
        },
    }
}

</script>

<style lang="scss" scoped>
.wzselect{ display: inline; 

    &.theme-light {
        --wz-input-bg: #fff;
        --wz-text-color: #303756;
        --wz-bg-color: #fff;
        --wz-input-height: 36px;
    }
    &.theme-dark {
        --wz-input-bg: var(--loading-color);
        --wz-text-color: #303756;
        --wz-bg-color: #fff;
        --wz-input-height: 36px;
    }
    &.theme-transparent {
        --wz-input-bg: var(--loading-color);
        --wz-text-color: #303756;
        --wz-bg-color: #fff;
        --wz-input-height: 36px;
    }

    color: var(--wz-text-color);
    .wzselect-select { display: none !important; }
    .wzselect-inp { cursor: pointer; background: var(--wz-input-bg); padding: 0 15px; border-radius: 8px; white-space: nowrap; min-height: var(--wz-input-height); position: relative; display: flex; justify-content: space-between; align-items: center; line-height: normal !important; 
        span { display: flex; gap:6px; align-items: center; overflow: hidden; width: 100%;}
        &::after { content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"/></svg>'); width:8px; height: 8px; display: block; font-size: 10px; margin-right: 6px; }

    }
    
    .wzselect-options { position: absolute; min-width: 100%; background: var(--wz-bg-color); box-shadow: 0px 4px 10px rgba(53, 78, 104, 0.1); border-radius: 8px; z-index: 999999999999; overflow-y: auto; 
        &.open_to_left { left: 0px; }
        &.open_to_right { right: 0px; }


        ul { list-style: none; display: block; padding: 5px;
            li { min-height: 40px; display: flex; align-items: center; gap:6px; border-radius: 5px; padding: 0 10px; white-space: nowrap; font-size: 15px; cursor: pointer;
                &:hover { background: #eee; color:#333 }
                &.selected { /*background: #eee; color:#333*/ font-weight: bold; }
            }
        }

        &:not(.open_to_top) {  top: calc(100% + 5px); }
        &.open_to_top { bottom: calc(100% + 5px); }
    }

    .search { background: #eee; position: sticky; top: 0px;
        input { width:100%; border:none; height: 30px; padding: 0 10px; font-size: 15px; background: none;}
    }

    &.theme-dark .wzselect-inp {     border: 1px solid #9e9e9e; }
    &.theme-transparent .wzselect-inp { padding: 0px; }

}
</style>