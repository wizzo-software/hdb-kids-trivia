import { createRouter, createWebHistory, createWebHashHistory  } from 'vue-router'

import Home from '../views/home.vue'

import Page2 from '../views/page2.vue'

import NotFound from "../views/NotFound.vue";


const routes = [
  { path: '/', name:'home', component: Home, alias: ['/index.html'], meta: { target: 1 } },
  { path: '/index.html', redirect: '/' },

  { path: '/page2', name:'page2', component: Page2, meta: { target: 2 } },

	{ path: "/:catchAll(.*)", name: "404",component: NotFound,props: { footer: true, header: true, footerArticles: true }, meta: { target: 1 }},

	// { path: "/:catchAll(.*)", redirect: '/'}, // For IOS
];

// For SlideView
export const maxTarget = Math.max(...routes.map(route => typeof route.meta?.target === 'number' ? route.meta?.target : 0));

function isNull(str)
{
  if (str === true || str === false || str === 0) return false;
  
  return (str == '' || str == null || str == undefined);
}

function isApp(){ 
  //return true;
  return (!isNull(window.cordova) && window.cordova != false); // true
}

const historyMode = isApp() ? createWebHashHistory() : createWebHistory(process.env.BASE_URL);

const router = createRouter({
  history: historyMode,
  routes
})

export default router
