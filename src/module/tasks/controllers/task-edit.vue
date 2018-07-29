<template>
    <transition name="fade" mode="out-in">
        <v-container grid-list-md text-xs-center v-if="initData" style="max-width: 100%">
            <v-layout row warp>
                <v-flex md6 class="pa-1">
                    <v-card>
                        <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="runSaveTask"></v-progress-linear>
                        <div :class="{opacity2:runSaveTask}">
                            <v-toolbar :class="laydata.color" dark>
                                <v-toolbar-title>Редактирование задачи #{{task.id}}</v-toolbar-title>
                            </v-toolbar>
                            <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="runAjax"></v-progress-linear>
                            <v-card-text>
                                <v-select
                                        :items="projects"
                                        v-model="task.project_id"
                                        label="Проект"
                                        item-text="title"
                                        item-value="id"
                                        return-object
                                        persistent-hint
                                        required
                                ></v-select>

                                <v-text-field
                                        v-model="task.subject"
                                        label="Тема задачи"
                                        :error-messages="errors.collect('subject')"
                                        :counter="100"
                                        v-validate="'required|max:100'"
                                        data-vv-name="subject"
                                        data-vv-as="Тема задачи"
                                        required
                                ></v-text-field>

                                <v-text-field
                                        v-model="task.description"
                                        label="Описание задачи"
                                        :error-messages="errors.collect('description')"
                                        :counter="5000"
                                        v-validate="'required|max:5000'"
                                        data-vv-name="description"
                                        data-vv-as="Описание задачи"
                                        textarea
                                        required
                                ></v-text-field>

                                <v-select
                                        :items="priorities"
                                        v-model="task.priority"
                                        label="Приоритет"
                                        item-text="name"
                                        item-value="id"
                                        return-object
                                        persistent-hint
                                        required
                                ></v-select>

                                <v-select
                                        :items="trackers"
                                        v-model="task.tracker"
                                        label="Трекер"
                                        item-text="name"
                                        item-value="id"
                                        persistent-hint
                                        required
                                ></v-select>

                                <v-select
                                        :items="statuses"
                                        v-model="task.status"
                                        label="Статус"
                                        item-text="name"
                                        item-value="id"
                                        persistent-hint
                                        required
                                ></v-select>

                                <v-select
                                        :items="project_users"
                                        v-model="task.executor"
                                        label="Исполнитель"
                                        item-text="name"
                                        item-value="id"
                                        persistent-hint
                                        required
                                ></v-select>

                            </v-card-text>
                            <v-divider class="mt-5"></v-divider>
                            <v-card-actions>
                                <v-btn flat @click.native="goBack()">
                                    Назад
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat :disabled="errors.any() || runSaveTask" @click="saveForm">
                                    Сохранить
                                </v-btn>
                            </v-card-actions>
                        </div>
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
    import Task from '../models/task';

    export default
    {
        name   : 'task-edit',
        props: {
            task_id: {
                type    : Number|String,
                required: true
            }
        },
        created: function ()
        {
            var _this = this;
            var reqProjects = _this.$store.dispatch('Projects/ProjectsList/All');
            var reqStatuses = _this.$store.dispatch('Tasks/TasksStatuses/All');
            var reqPriorities = _this.$store.dispatch('Tasks/TasksPriorities/All');
            var reqTrackers = _this.$store.dispatch('Tasks/TasksTrackers/All');

            Promise.all([reqProjects,reqStatuses,reqPriorities,reqTrackers]).then(value => {
                _this.readTask();
            });

        },
        data   : function ()
        {
            return {
                initData:false,
                runAjax:false,
                task:new Task(),
                runAjaxUsers:false,
                runSaveTask:false
            };
        },
        watch:
        {
            'task.project_id': function(newVal,oldVal)
            {
                var _this = this;
                console.log('newVal',newVal);
                if (newVal.id)
                {
                    _this.fetchProjectUser(newVal.id);
                }

            }
        },
        computed:{
            project_users:function()
            {
                return this.$store.getters['Projects/ProjectDetail/getProjectUsers'];
            },
            projects:function()
            {
                return this.$store.getters['Projects/ProjectsList/getItems'];
            },
            statuses:function()
            {
                return this.$store.getters['Tasks/TasksStatuses/getItems'];
            },
            priorities:function()
            {
                return this.$store.getters['Tasks/TasksPriorities/getItems'];
            },
            trackers:function()
            {
                return this.$store.getters['Tasks/TasksTrackers/getItems'];
            },
        },
        methods: {
            readTask:function()
            {
                var _this = this;
                var promise = _this.$store.dispatch('Tasks/TasksList/Read',this.task_id);

                promise.then(
                    function(response)
                    {
                        _this.initData = true;
                        _this.task = new Task(response.data.result);

                        _this.fetchProjectUser(_this.task.project_id);
                    }
                );

                promise.catch(
                    function(error)
                    {
                        _this.initData = true;
                        _this.showError(error);
                    }
                );
            },
            fetchProjectUser:function(project_id)
            {
                var _this = this;

                _this.runAjaxUsers = true;

                var promise = _this.$store.dispatch('Projects/ProjectDetail/GetUsersById',project_id);

                promise.then(
                    function(response)
                    {
                        _this.runAjaxUsers = false;
                    }
                );

                promise.catch(
                    function(error)
                    {
                        _this.runAjaxUsers = false;
                        _this.showError(error);
                    }
                );
            },
            goBack:function ()
            {
                this.$router.back();
            },
            saveForm:function()
            {
                var _this = this;

                _this.runSaveTask = true;
                var promise = _this.$store.dispatch('Tasks/TasksList/Update',_this.task);

                promise.then(
                    function(response)
                    {
                        _this.runSaveTask = false;
                        //_this.$router.back();
                        _this.showInfo('Изменения успешно сохранены');
                    }
                );

                promise.catch(
                    function(error)
                    {
                        _this.runSaveTask = false;
                        _this.showError(error);
                    }
                );
            }
        }
    }
</script>