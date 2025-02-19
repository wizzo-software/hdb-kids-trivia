<template>
    <footer class="footer">
        <nav class="footer-menu">
            
            <router-link to="/" :class="{active: $route.path == '/'}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M12,14a3,3,0,0,0-3,3v7.026h6V17A3,3,0,0,0,12,14Z"/><path d="M13.338.833a2,2,0,0,0-2.676,0L0,10.429v10.4a3.2,3.2,0,0,0,3.2,3.2H7V17a5,5,0,0,1,10,0v7.026h3.8a3.2,3.2,0,0,0,3.2-3.2v-10.4Z"/></svg>
                <span>ראשי</span>
            </router-link>
            <router-link to="/page2" :class="{active: $route.path == '/page2'}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M19,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H5A5.006,5.006,0,0,0,0,9V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V9A5.006,5.006,0,0,0,19,4ZM11,2h2a3,3,0,0,1,2.816,2H8.184A3,3,0,0,1,11,2ZM5,6H19a3,3,0,0,1,3,3v3H2V9A3,3,0,0,1,5,6ZM19,22H5a3,3,0,0,1-3-3V14h9v1a1,1,0,0,0,2,0V14h9v5A3,3,0,0,1,19,22Z"/></svg>
                <span>PAGE2</span>
                <label class="notification">1</label>
            </router-link>
            <router-link to="/updates" :class="{active: $route.path == '/updates'}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="m21,0h-13c-1.654,0-3,1.346-3,3v3H0v14.5c0,1.93,1.57,3.5,3.5,3.5h17c1.93,0,3.5-1.57,3.5-3.5V3c0-1.654-1.346-3-3-3ZM5,20.5c0,.827-.673,1.5-1.5,1.5s-1.5-.673-1.5-1.5v-12.5h3v12.5Zm17,0c0,.827-.673,1.5-1.5,1.5H6.662c.216-.455.338-.963.338-1.5V3c0-.551.449-1,1-1h13c.551,0,1,.449,1,1v17.5Zm-7-14.5h5v2h-5v-2Zm-6,4h11v2h-11v-2Zm0,4h11v2h-11v-2Zm0,4h11v2h-11v-2Zm4-10h-4v-4h4v4Z"/>
                </svg>
                <span>עדכונים</span>
            </router-link>
            <router-link to="/personal" :class="{active: $route.path == '/personal'}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z"/><path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z"/></svg>

                <span>אזור אישי</span>
            </router-link>
        </nav>
    </footer>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>

.footer { position: fixed; bottom: 0; width: 100%; background: #fff; color: #fff; border-top: 1px solid #e7e7e7; z-index: 99;
    
    .footer-menu { display: flex; height: 60px;
        a { color: #333; text-decoration: none; position: relative; display: flex; flex-direction: column; align-items: center; flex:1; height: 100%; justify-content: center;

            &.active { color: var(--color); 
                &::after { content: ''; display: block; width: 100%; height: 2px; background: var(--color); position: absolute; top:-1px; left:0px; }
            
                svg { fill: var(--color); }
            }
            svg { fill: #333; width: 24px; height: 24px; margin-bottom: 5px; }
            span { display: block; font-size: 12px; }
            .notification { position: absolute; top: 0; left: 50%; transform: translateX(-50%); margin-left: -20px; background: var(--red); color: #fff; border-radius: 50%; padding: 2px 5px; font-size: 10px; }
        }
    }
}
</style>