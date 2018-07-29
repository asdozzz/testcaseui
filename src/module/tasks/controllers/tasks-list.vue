<template>
    <transition name="fade" mode="out-in">
        <v-container grid-list-md text-xs-center v-if="initData" style="max-width: 100%">
            <v-layout row warp>
                <v-flex md3 class="pa-1" v-if="showFilter">
                    <v-card>
                        <v-toolbar :class="laydata.color" dark>
                            <v-toolbar-title>Фильтры</v-toolbar-title>
                        </v-toolbar>
                        <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="preloadFetch"></v-progress-linear>
                        <v-card-text>


                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex d-flex md12 class="pa-1">
                        <v-card>
                            <v-toolbar :class="laydata.color" dark>
                                <v-toolbar-title>
                                    Задачи
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn style="width: 40px;min-width: 40px" color="black" @click="datacomponent = 'table'" :class="[datacomponent =='table'?'grey darken-2':'','mr-0']">
                                    <v-icon>menu</v-icon>
                                </v-btn>
                                <v-btn style="width: 40px;min-width: 40px" color="black" @click="datacomponent = 'iterator'" :class="[datacomponent =='iterator'?'grey darken-2':'','ml-0']">
                                    <v-icon>apps</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="preloadFetch"></v-progress-linear>
                            <v-card-text :class="{opacity2:preloadFetch}">
                                <v-data-table
                                        v-if="datacomponent=='table'"
                                        v-bind:headers="headers"
                                        v-bind:items="datatable.items"
                                        v-bind:search="datatable.search"
                                        v-bind:pagination.sync="datatable.pagination"
                                        v-bind:total-items="datatable.totalItems"
                                        v-bind:must-sort="true"
                                        :rows-per-page-items = "rowPerPageItems"
                                        v-on:update:pagination="updatePagination($event)">
                                    <template slot="items" slot-scope="props">
                                        <td>{{ props.item.id }}</td>
                                        <td>{{ props.item.subject }}</td>
                                        <td>{{ getProjectById(props.item.project_id ,'title') }}</td>
                                        <td>{{ getStatusById(props.item.status ,'name') }}</td>
                                        <td>
                                            <v-btn icon @click="editItem(props.item.id)">
                                                <v-icon color="teal">edit</v-icon>
                                            </v-btn>
                                            <v-btn icon @click="deleteItem(props.item.id)">
                                                <v-icon color="pink">delete</v-icon>
                                            </v-btn>
                                        </td>
                                    </template>
                                    <template slot="no-data">
                                        <v-alert :value="true" color="error" icon="warning">
                                            Sorry, nothing to display here :(
                                        </v-alert>
                                    </template>
                                </v-data-table>
                                <v-data-iterator v-if="datacomponent=='iterator'"
                                        content-tag="v-layout"
                                        row wrap
                                        :items="datatable.items"
                                        :rows-per-page-items = "rowPerPageItems"
                                        :total-items="datatable.totalItems"
                                        :pagination.sync="datatable.pagination"
                                        v-on:update:pagination="updatePagination($event)">
                                    <v-flex
                                            slot="item"
                                            slot-scope="props"
                                            xs12
                                            sm6
                                            md4
                                            lg3>
                                        <v-card>
                                            <v-card-title><h4>#{{ props.item.id }} {{ props.item.subject }}</h4></v-card-title>
                                            <v-divider></v-divider>
                                            <div>
                                                Проект:{{ getProjectById(props.item.project_id ,'title')  }}
                                                <br>
                                                Статус:{{ getStatusById(props.item.status ,'name') }}
                                            </div>
                                        </v-card>
                                    </v-flex>
                                </v-data-iterator>
                            </v-card-text>
                        </v-card>

                    </v-flex>
            </v-layout>
        </v-container>
        <my-preloader v-if="!initData" :init="!initData" style="width:100%;" calss="text-md-center"></my-preloader>
    </transition>
</template>

<style>

</style>

<script>
    export default
    {
        name   : 'tasks-list',
        props:['id'],
        created: function ()
        {
            var _this = this;

            var reqProjects = _this.$store.dispatch('Projects/ProjectsList/All');
            var reqStatuses = _this.$store.dispatch('Tasks/TasksStatuses/All');

            Promise.all([reqProjects,reqStatuses]).then(value => {
                console.log('Promise.all',value);
                _this.fetchTasks();
            });
        },
        data   : function ()
        {
            return {
                showFilter:false,
                datacomponent:'table',
                pagination:{},
                initData:false,
                preloadFetch:false,
                rowPerPageItems:[8,12,16,20,{"text":"All","value":0}],
                headers: [
                    { align: 'center',text: '#', value: 'id',width:'100px' },
                    { align: 'center',text: 'Тема', value: 'subject' },
                    { align: 'center',text: 'Проект', value: 'project_id' },
                    { align: 'center',text: 'Статус', value: 'status' },
                    { align: 'center',text: 'Действия', value: 'name', sortable: false }
                ],
            };
        },
        computed:{
            project:function()
            {
                return this.$store.state.Projects.ProjectDetail.project;
            },
            datatable:function()
            {
                return this.$store.getters['Tasks/TasksList/Datatable'];
            },
            projects:function()
            {
                return this.$store.getters['Projects/ProjectsList/getItems'];
            },
            statuses:function()
            {
                return this.$store.getters['Tasks/TasksStatuses/getItems'];
            },

        },
        methods: {
            getProjectById:function(id, prop)
            {
                var collection =  this.$store.getters['Projects/ProjectsList/getCollection'];

                var item = collection.getModelByPk(id);
                console.log('item',item);
                return item[prop];
            },
            getStatusById:function(id, prop)
            {
                var collection =  this.$store.getters['Tasks/TasksStatuses/getCollection'];

                var item = collection.getModelByPk(id);
                console.log('item',item);
                return item[prop];
            },
            updatePagination:function(paginator)
            {
                console.log('paginator',paginator);
                var _this = this;
                _this.fetchTasks();
            },
            fetchTasks:function()
            {
                var _this = this;
                _this.preloadFetch = true;
                var promise = _this.$store.dispatch('Tasks/TasksList/Datatable');

                promise.then(
                    function(response)
                    {
                        _this.initData = true;
                        _this.preloadFetch = false;
                    }
                );

                promise.catch(
                    function(error)
                    {
                        _this.initData = true;
                        _this.preloadFetch = false;
                        _this.showError(error);
                    }
                );
            },
            editItem:function(task_id)
            {
                console.log('asd',this.$router);
                this.$router.push({ name: 'task.edit', params: { id: this.id ,task_id:task_id }});
            },
            removeItem:function(id)
            {

            }
        }
    }
</script>