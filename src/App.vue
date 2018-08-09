<template>
    <div id="app">
        <v-navigation-drawer fixed app light v-model="laydata.drawer" disable-route-watcher>
            <v-toolbar flat class="transparent">
                <v-list class="pa-0" v-if="!runAjaxUser">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="https://randomuser.me/api/portraits/men/85.jpg" />
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{user.email}}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
                <v-flex sm-12 class="text-sm-center">
                    <v-progress-circular v-if="runAjaxUser" indeterminate class="primary--text"></v-progress-circular>
                </v-flex>

            </v-toolbar>

            <v-list dense class="pt-0" v-if="laydata.sidebar">
                <v-divider></v-divider>
                <v-list-tile v-for="item in laydata.sidebar.items" :key="item.route" :to="item.route">
                    <v-list-tile-action>
                        <v-icon>{{item.icon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.label"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

            </v-list>
        </v-navigation-drawer>
        <v-toolbar v-bind:class="laydata.color" dark fixed app>
            <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{laydata.title}}</v-toolbar-title>

            <my-breadcrumbs v-if="laydata.breadcrumbs && false" :items="laydata.breadcrumbs"></my-breadcrumbs>
        </v-toolbar>
        <main>
            <v-content>
                <my-snackbars></my-snackbars>
                <v-container fluid fill-height>
                    <router-view></router-view>
                </v-container>
            </v-content>
        </main>
    </div>
</template>


<script>
    import axios from 'axios'

    export default {
        name   : 'app',
        data () {
            return {
                runAjaxUser:false
            }
        },
        computed:
        {
            laydata:function()
            {
                return this.$store.state.Layout;
            },
            user:function()
            {
                return this.$store.state.Account.user;
            },
            route:function()
            {
                return this.$store.state.route;
            }
        },
        created:function()
        {
            var _this = this;
            _this.runAjaxUser = true;
            _this.$store.commit('Layout/setDefault');

            var promise = _this.$store.dispatch('Account/getUser');

            promise.then(
                function(response)
                {
                    _this.runAjaxUser = false;
                }
            );

            promise.catch(
                function(error)
                {
                    _this.runAjaxUser = false;
                    _this.showError(error);
                }
            );

        },
        methods: {
            toggleDrawer:function()
            {
                this.$store.commit('Layout/toggleDrawer');
            },
            toggleLeftSidenav()
            {
                this.$refs.leftSidenav.toggle();
            },
            closeLeftSidenav()
            {
                this.$refs.leftSidenav.close();
            },
            open(ref)
            {
                console.log('Opened: ' + ref);
            },
            close(ref)
            {
                console.log('Closed: ' + ref);
            }
        }
    }
</script>

<style>
    .content-wrapper {
        padding: 20px;
    }
</style>
