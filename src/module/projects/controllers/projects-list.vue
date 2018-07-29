<template>
    <div class="project-list">
        <transition name="fade" leave-active-class="">
        <div v-show="!preloadFetch" class="project-list__container">
            <h5 class="title project-list__container__title">
                Проекты
                <v-fab-transition>
                    <v-btn small primary fab dark class="blue fab30 ml-1" v-show="!showForm" @click.native.stop="openAddForm" style="margin: auto">
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-fab-transition>
            </h5>
            <div v-if="showForm" class="mt-1">
                <project-form  :record="selectProject" v-on:close_form="closeForm" v-on:save_form="saveForm"></project-form>
            </div>

            <v-layout v-show="!showForm" class="mt-1">
                <transition-group name="list-complete">
                    <v-card v-for="item in items" class="list-complete-item" style="margin:0 10px 10px 0;width: 230px" v-bind:key="item.id">
                        <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="removeAjax == item.id"></v-progress-linear>
                        <v-container fluid grid-list-lg>
                            <div style="position:relative;">

                                <div>
                                    <v-btn outline fab small class="fab30 blue--text" style="margin: 0" @click.native.stop="removeItem(item)">
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                    <v-btn outline fab small class="fab30 blue--text" style="margin: 0" @click.native.stop="openEditForm(item)">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                    <router-link style="font-size: 16px" class="blue--text" :to="'/projects/'+item.id">{{item.title.slice(0, 15)}}</router-link>
                                </div>
                            </div>

                        </v-container>
                            <v-card-media  src="/static/img/default_project.jpg" height="150px"></v-card-media>

                    </v-card>
                </transition-group>
            </v-layout>

            <v-dialog v-model="removeConfirm" width="600">
                <v-card>
                    <v-card-title class="headline">{{confirm.title}}</v-card-title>
                    <v-card-text>{{confirm.contentHtml}}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="green--text darken-1" flat="flat" @click.native="removeConfirm = false">{{confirm.cancel}}</v-btn>
                        <v-btn class="green--text darken-1" flat="flat" @click.native="resultConfirm('ok')">{{confirm.ok}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        </transition>
        <my-preloader :init="preloadFetch" class="text-md-center"></my-preloader>
    </div>

</template>

<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s ease;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0
    }

    .list-complete-item {
        transition: all 0.5s;
        display: inline-block;
        margin-right: 10px;
    }
    .list-complete-enter, .list-complete-leave-to {
        transition: all 0.2s;
        opacity: 0;
        transform: translateY(30px);
    }
    .list-complete-leave-active {
        position: absolute;
    }
</style>

<script>
    import Project from '../models/project.js';
    import ProjectForm from '../components/project-form.vue';

    export default{
        name:  'projects-list',
        components:{ProjectForm},
        data:function()
        {
            return {
                preloadFetch:false,
                removeConfirm:false,
                removeAjax:false,
                confirm: {
                    title: 'Вы уверены, что хотите удалить проект?',
                    contentHtml: 'Все данные проекта будут безвозвратно удалены.',
                    ok: 'Да',
                    cancel: 'Отмена'
                },
                removeId:undefined,
                showForm:false,
                selectProject:undefined
            }
        },
        created:function()
        {
            var _this = this;

            _this.setProjectModel();

            _this.fetchProjects();
        },
        computed:{
            items:function()
            {
                return this.$store.getters['Projects/ProjectsList/getItems'];
            }
        },
        methods: {
            fetchProjects:function()
            {
                var _this = this;
                _this.preloadFetch = true;
                var  promise = this.$store.dispatch('Projects/ProjectsList/All');

                promise.then(
                    function(response)
                    {
                        _this.preloadFetch = false;
                    }
                );

                promise.catch(
                    function(error)
                    {
                        _this.preloadFetch = false;
                        _this.showError(error);
                    }
                );
            },
            resultConfirm(type)
            {
                var _this = this;
                this.removeConfirm = false;

                if (type == 'ok')
                {
                    _this.removeAjax = _this.removeId;
                    var promise = this.$store.dispatch('Projects/ProjectsList/Remove',_this.removeId);

                    promise.then(
                        function(response)
                        {
                            _this.removeAjax = false;
                        }
                    );

                    promise.catch(
                        function(error)
                        {
                            _this.removeAjax = false;
                            _this.showError(error);
                        }
                    );
                }
            },
            setProjectModel:function(project)
            {
                this.selectProject = new Project(project);
            },
            closeForm:function()
            {
                this.showForm = false;
            },
            saveForm:function(response)
            {
                var _this = this;
                _this.showForm = false;
            },
            openAddForm:function()
            {
                this.setProjectModel();
                this.showForm = true;
            },
            openEditForm:function(project)
            {
                this.setProjectModel(project);
                this.showForm = true;
            },
            removeItem:function(item)
            {
                this.removeId = item.id;
                this.removeConfirm = true;
            },
            toggleLeftSidenav()
            {
                this.$refs.leftSidenav.toggle();
            },
            toggleAddProjectSidenav()
            {
                this.$refs.AddProjectSidenav.toggle();
            },
            closeRightSidenav()
            {
                this.$refs.rightSidenav2.close();
            },
            openAddProject(ref)
            {
                console.log('Opened: ' + ref);
            },
            closeAddProject(ref)
            {
                console.log('Closed: ' + ref);
            }
        }
    }
</script>

