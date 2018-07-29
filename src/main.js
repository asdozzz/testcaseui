// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('./env.js');
require('./loader.js');

import Vue from 'vue';
import router from './router';
import store from './store';
import service from './service';
import HomeLayout from './module/home/controllers/layout';

new Vue({
    el: '#app',
    store,
    router,
    template: '<HomeLayout/>',
    components: {
        HomeLayout
    }
})

