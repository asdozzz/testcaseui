<template>
    <v-app toolbar>
        <transition name="fade" leave-active-class="">
            <router-view></router-view>
        </transition>
    </v-app>
</template>


<style lang="scss">
    @import "../../../../node_modules/vuetify/dist/vuetify.min.css";
    @import '../../../assets/main.scss';
    @import '../../../assets/ext-animate.scss';
    @import "../../../../node_modules/vue-wysiwyg/dist/vueWysiwyg.css";
</style>

<script>
    export default
    {
        name   : 'layout',
        created: function ()
        {
            console.log('HOME LAYOUT');
        },
        data   : function ()
        {
            return {};
        },
        methods: {}
    }
</script>