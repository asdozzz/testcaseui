/**
 * Created by asd on 11.12.2017.
 */
import Vue from 'vue';
import Vuex from 'vuex'
import Vuetify from 'vuetify';

import router from './router';
import store from './store';
import mdMixin from './mixin/my';
import Toasted from 'vue-toasted';
import ru from 'vee-validate/dist/locale/ru';
import VeeValidate, { Validator } from 'vee-validate';
import axios from 'axios'
import VueAxios from 'vue-axios'
import wysiwyg from "vue-wysiwyg";
import { Vue2Dragula } from 'vue2-dragula'

Vue.use(wysiwyg, {}); // config is optional. more below
Vue.use(Vuetify);
Vue.use(VueAxios, axios);

Vue.use(Vue2Dragula);

window.Axios = axios.create({
    baseURL: window.ENV['BASE_URL'],
});

const config = {
    locale: 'ru'
};

Validator.addLocale(ru);

const dictionary = {
    ru: {
        messages:{
            required: () => 'Поле обязательно для заполнения'
        }
    }
};

Validator.updateDictionary(dictionary);

Vue.use(VeeValidate, config);
Vue.use(Toasted);

import MyTree from './components/my/tree/tree.vue';
import MyBreadcrumbs from './components/my/breadcrumbs/breadcrumbs.vue';
import MySnackbars from './components/my/snackbars/snackbars.vue';
import MyPreload from './components/my/extend/my-preloader.vue';
Vue.component('my-tree', MyTree);
Vue.component('my-breadcrumbs', MyBreadcrumbs);
Vue.component('my-snackbars', MySnackbars);
Vue.component('my-preloader', MyPreload);

import { sync } from 'vuex-router-sync';

const unsync = sync(store, router);