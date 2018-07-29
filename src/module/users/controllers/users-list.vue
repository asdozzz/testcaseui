<template>
    <div>
        <transition name="fade" leave-active-class="">
            <div v-show="!preloadFetch">
                <h5 title style="line-height: none">
                    Пользователи
                    <v-fab-transition>
                        <v-btn small primary fab dark class="blue--text fab30" v-show="!showForm" @click.native.stop="openAddForm" style="margin: auto">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </h5>

                <v-card v-if="showForm">
                    <v-card-title>
                        <div v-if="!selectUser.id">Добавить пользователя</div>
                        <div v-if="selectUser.id">Редактировать пользователя</div>
                    </v-card-title>
                    <v-card-text>
                        <user-form :record="selectUser" v-on:close_form="closeForm" v-on:save_form="saveForm"></user-form>
                    </v-card-text>
                </v-card>
                <v-container fluid grid-list-md>
                    <v-layout row wrap v-show="!showForm">
                            <v-card style="min-width: 200px" class="list-complete-item" v-for="item in items" v-bind:key="item.id">
                                <v-card-text>
                                    <div>

                                    </div>
                                    <v-layout row wrap>
                                        <v-flex d-flex style="width:60px">
                                            <v-avatar class="blue">
                                                <v-icon dark>account_circle</v-icon>
                                            </v-avatar>
                                        </v-flex>
                                        <v-flex d-flex>
                                            <v-layout column>
                                                <v-flex d-flex tag="h1" class="headline" full-width>
                                                    {{item.name}}
                                                </v-flex>
                                                <v-flex d-flex>
                                                    {{item.email}}
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                        <!--<v-flex xs12 sm4 md4>
                                            <v-layout column>
                                                <v-flex >
                                                    <v-btn outline fab small class="fab30 blue&#45;&#45;text" @click.native.stop="removeItem(item)">
                                                        <v-icon>delete</v-icon>
                                                    </v-btn>
                                                </v-flex>
                                                <v-flex >
                                                    <v-btn outline fab small class="fab30 blue&#45;&#45;text" @click.native.stop="openEditForm(item)">
                                                        <v-icon>edit</v-icon>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>-->
                                    </v-layout>

                                </v-card-text>

                                <!-- <v-card-actions>
                                     <v-btn outline fab small class="fab30 blue&#45;&#45;text" @click.native.stop="removeItem(item)">
                                         <v-icon>delete</v-icon>
                                     </v-btn>
                                     <v-btn outline fab small class="fab30 blue&#45;&#45;text" @click.native.stop="openEditForm(item)">
                                         <v-icon>edit</v-icon>
                                     </v-btn>
                                 </v-card-actions>-->
                            </v-card>
                </v-layout>
                </v-container>

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
        <my-preloader :init="preloadFetch"></my-preloader>
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
        transition: all 1s;
        display: inline-block;
        margin-right: 10px;
    }
    .list-complete-enter, .list-complete-leave-to
        /* .list-complete-leave-active до версии 2.1.8 */ {
        opacity: 0;
        transform: translateY(30px);
    }
    .list-complete-leave-active {
        position: absolute;
    }
</style>

<script>
    import UserForm from '../components/user-form.vue';

    export default{
        name:  'users-list',
        components:{UserForm},
        data:function()
        {
            return {
                preloadFetch:false,
                items:[],
                removeConfirm:false,
                confirm: {
                    title: 'Вы уверены, что хотите удалить пользователя?',
                    contentHtml: 'Все данные пользователя будут безвозвратно удалены.',
                    ok: 'Да',
                    cancel: 'Отмена'
                },
                removeId:undefined,
                showForm:false,
                selectUser:undefined
            }
        },
        created:function()
        {
            var _this = this;

            _this.setUserModel();

            _this.$store.commit('Layout/setDefault');

            _this.fetchUsers();

            var text = 'Непредвиденная ошибка, пжста обратитесь в службу техподдержки';

            setTimeout(function(){_this.showError(text)},2000);

        },

        methods: {
            fetchUsers:function()
            {
                var _this = this;
                _this.preloadFetch = true;
                var  promise = this.$store.dispatch('Users/initUsers');

                promise.then(
                    function(response)
                    {
                        _this.preloadFetch = false;
                        _this.items = response;
                    }
                );
            },
            resultConfirm(type)
            {
                this.removeConfirm = false;

                if (type == 'ok')
                {
                    this.$store.dispatch('Users/Remove',this.removeId);
                }
            },
            setUserModel:function(user)
            {
                this.selectUser = {
                    id:'',
                    title:'',
                    description:''
                };

                if (user != undefined)
                {
                    for (var key in user)
                    {
                        this.selectUser[key] = user[key];
                    }
                }
            },
            closeForm:function()
            {
                console.log('asd2');
                this.showForm = false;
            },
            saveForm:function()
            {
                this.showForm = false;
            },
            openAddForm:function()
            {
                this.setUserModel();
                this.showForm = true;
            },
            openEditForm:function(user)
            {
                this.setUserModel(user);
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
            toggleAddUserSidenav()
            {
                this.$refs.AddUserSidenav.toggle();
            },
            closeRightSidenav()
            {
                this.$refs.rightSidenav2.close();
            },
            openAddUser(ref)
            {
                console.log('Opened: ' + ref);
            },
            closeAddUser(ref)
            {
                console.log('Closed: ' + ref);
            }
        }
    }
</script>

