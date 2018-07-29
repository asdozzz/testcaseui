<template>
    <v-layout row wrap>
        <v-flex xs12>
            <transition name="fade" leave-active-class="">
                <router-view></router-view>
            </transition>
        </v-flex>
        <v-flex xs12>
            <v-bottom-nav absolute app :value="true" :active.sync="tab" class="transparent mt-2">
                <v-btn flat class="blue--text" v-for="(item,i) in items" :key="i" @click="$router.push(item.route)">
                    <span>{{item.label}}</span>
                    <v-icon>{{item.icon}}</v-icon>
                </v-btn>
            </v-bottom-nav>
        </v-flex>
    </v-layout>
</template>

<style>

</style>

<script>
    export default
    {
        name   : 'project-layout',
        props:['id'],
        data:function()
        {
            var _this = this;
            var items = [
                {icon:'dashboard',route:'/projects/'+_this.id, label:'Статистика'},
                {icon:'assignment',route:'/projects/'+_this.id+'/requirements', label:'Требования'},
                {icon:'reorder',route:'/projects/'+_this.id+'/tests', label:'Тесты'},
                {icon:'assignment_turned_in',route:'/projects/'+_this.id+'/runs', label:'Прогоны'},
                {icon:'account_circle',route:'/projects/'+_this.id+'/users', label:'Пользователи'},
                {icon:'settings',route:'/projects/'+_this.id+'/settings', label:'Настройки'},
            ];

            return {
                tab:0,
                items:items
            }
        },
        created: function ()
        {
            var _this = this;

            this.setTab(_this.$route);

            var promise = _this.$store.dispatch('Projects/ProjectDetail/getById',_this.id);

            promise.then(
                function(response)
                {
                    console.log('response',response);
                }
            ).catch(
                function(error)
                {
                    console.log('eror',error);
                }
            );
        },
        watch:{
            $route:function(newVal)
            {
                this.setTab(newVal);

                return newVal;
            }
        },
        computed:{

            project:function()
            {
                return this.$store.state.Projects.ProjectDetail.project;
            },
            route:function()
            {
                return this.$store.state.route;
            }
        },
        methods: {
            setTab:function(newVal)
            {
                for (var i = 0; i < this.items.length; i++)
                {
                    if (this.items[i]['route'] == newVal.fullPath)
                    {
                        this.tab = i;
                    }
                }
            }
        }
    }
</script>