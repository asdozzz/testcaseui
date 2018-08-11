<template>
    <transition name="fade" mode="out-in">
        <div v-if="initData">
            <v-card>
                <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="runSaveTask"></v-progress-linear>
                <div :class="{opacity2:runSaveTask}">
                    <v-toolbar :class="laydata.color" dark>
                        <v-toolbar-title>Редактирование задачи #{{task.id}}</v-toolbar-title>
                    </v-toolbar>
                    <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="runAjax"></v-progress-linear>
                    <v-card-text class="pb-0">
                            <v-layout row wrap>
                                <v-flex lg3 md4 xs6 class="pa1">
                                    <v-select
                                            :items="projects"
                                            v-model="task.project_id"
                                            label="Проект"
                                            item-text="title"
                                            item-value="id"
                                            persistent-hint
                                            required
                                    ></v-select>
                                </v-flex>
                                <v-flex lg3 md4 xs6 class="pa1">
                                    <v-select
                                            :items="statuses"
                                            v-model="task.status"
                                            label="Статус"
                                            item-text="name"
                                            item-value="id"
                                            persistent-hint
                                            required
                                    ></v-select>
                                </v-flex>
                                <v-flex lg3 md4 xs6 class="pa1">
                                    <v-select
                                            :items="trackers"
                                            v-model="task.tracker"
                                            label="Трекер"
                                            item-text="name"
                                            item-value="id"
                                            persistent-hint
                                            required
                                    ></v-select>
                                </v-flex>
                                <v-flex lg3 md4 xs6 class="pa1">
                                    <v-combobox
                                            v-model="task.users.QA"
                                            :items="project_QA"
                                            label="Тестировщики"
                                            item-text="name"
                                            item-value="id"
                                            multiple
                                            persistent-hint
                                            small-chips
                                            required
                                    ></v-combobox>
                                </v-flex>

                                <v-flex lg3 md4 xs6 class="pa1">
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
                                </v-flex>
                                <v-flex lg3 md4 xs6 class="pa1">
                                    <v-select
                                            :items="priorities"
                                            v-model="task.priority"
                                            label="Приоритет"
                                            item-text="name"
                                            item-value="id"
                                            persistent-hint
                                            required
                                    ></v-select>
                                </v-flex>
                                <v-flex lg3 md4 xs6 class="pa1">
                                    <v-combobox
                                            v-model="task.users.executor"
                                            :items="project_developers"
                                            label="Исполнители"
                                            item-text="name"
                                            item-value="id"
                                            multiple
                                            persistent-hint
                                            small-chips
                                            required
                                    ></v-combobox>
                                </v-flex>
                                <v-flex lg3 md4 xs6 class="pa1">
                                    <v-combobox
                                            v-model="task.users.observer"
                                            :items="project_users"
                                            label="Наблюдатели"
                                            item-text="name"
                                            item-value="id"
                                            multiple
                                            persistent-hint
                                            small-chips
                                            required
                                    ></v-combobox>
                                </v-flex>
                                <v-flex md12 class="pa-1">
                                    <v-textarea outline
                                                v-model="task.description"
                                                label="Описание задачи"
                                                :error-messages="errors.collect('description')"
                                                :counter="5000"
                                                v-validate="'required|max:5000'"
                                                data-vv-name="description"
                                                data-vv-as="Описание задачи"
                                                required
                                    ></v-textarea>
                                </v-flex>
                            </v-layout>
                    </v-card-text>
                    <v-divider class="mt-0 mb-0"></v-divider>
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

            <task-changes v-show="initData" :task_id="task_id"></task-changes>

        </div>

        <my-preloader v-if="!initData" :init="!initData" style="width:100%;" calss="text-md-center"></my-preloader>
    </transition>
</template>

<style>

</style>

<script>
    import Task from '../models/task';
    import TaskChanges from '../components/task-changes';

    export default
    {
        name   : 'task-edit',
        components:{TaskChanges},
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
            //var reqTaskUsers = _this.$store.dispatch('Tasks/TasksList/GetUsersById',this.task_id);

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
            project_developers:function ()
            {
                return this.project_users.filter(function (item)
                {
                    return item['role'] == 'developer';
                })
            },
            project_QA:function ()
            {
                return this.project_users.filter(function (item)
                {
                    return item['role'] == 'QA';
                })
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
            }
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