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
        name   : 'tasks',
        created: function ()
        {
            console.log('tasks');
        },
        data   : function ()
        {
            return {};
        },
        methods: {}
    }
</script>