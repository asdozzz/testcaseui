<template>
    <transition name="fade" leave-active-class="">
        <router-view></router-view>
    </transition>
</template>

<style>

</style>

<script>
    export default
    {
        name   : 'layout',
        created: function ()
        {
            console.log('layout');
        },
        data   : function ()
        {
            return {};
        },
        methods: {}
    }
</script>