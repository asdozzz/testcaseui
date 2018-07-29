import Vue from 'vue'
import Router from 'vue-router'

import HomeRoutes from '@/module/home/routes.js';
import AccountRoutes from '@/module/account/routes.js';
import store from '../store';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        AccountRoutes,
        HomeRoutes
    ]
});


store.commit('Account/Init');

router.beforeEach((to, from, next) => {

    var account = store.getters['Account/Current'];

    if (!to.meta.hasOwnProperty('noNeedAuth') && !account.access_token)
    {
        next({name:'login'});
    }
    else
    {

    }

    next();
})


export default router;
