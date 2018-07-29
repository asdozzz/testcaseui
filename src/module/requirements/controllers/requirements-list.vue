<template>
    <div>
        <transition name="fade" mode="out-in">
            <v-container grid-list-md text-xs-center v-if="!preloadFetch" style="max-width: 100%">
                <v-layout row warp>
                    <v-flex md3 class="pa-1">
                        <v-card>
                            <v-toolbar :class="laydata.color" dark>
                                <v-toolbar-title>Все требования</v-toolbar-title>
                            </v-toolbar>
                            <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="runRemove"></v-progress-linear>
                            <v-card-text>
                                <div v-if="tree_data.length > 0" :class="{opacity2:runRemove}">
                                    <my-tree
                                            :tree_data="tree_data"
                                            :select_item="selectItem"
                                            v-on:add_node="openCreateForm"
                                            v-on:edit_node="openEditForm"
                                            v-on:remove_node="removeNode"
                                            v-on:sort_node="sortNode"
                                            v-on:select_item="selectEvent">
                                    </my-tree>
                                </div>
                                <div v-else>
                                    <v-btn primary @click.stop="openCreateForm">
                                        <v-icon left>add_circle_outline</v-icon>
                                        Добавить
                                    </v-btn>
                                </div>

                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <transition name="fade" mode="out-in">
                        <v-flex d-flex md9 class="pa-1" v-if="!showForm" key="view">
                            <v-card  v-if="selectItem">
                                <v-toolbar :class="laydata.color" dark>
                                    <v-toolbar-title>{{selectItem.name}}</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div v-html="selectItem.description">
                                    </div>
                                </v-card-text>
                            </v-card>
                            <v-card  v-if="!selectItem">
                                <v-toolbar :class="laydata.color" dark>
                                    <v-toolbar-title>Полезная информация</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    Требования, предъявляемые к тестам

                                    К тестам, как методам точной психодиагностики предъявляется ряд особых требований.

                                    Социокультурная адаптированность теста – соответствие тестовых заданий и оценок особенностям культуры, сложившимся в обществе, где данный тест используется, будучи заимствованным в другой стране.

                                    Простота формулировок и однозначность тестовых заданий – в словесных и иных заданиях теста не должно быть таких моментов, которые могут по-разному восприниматься и пониматься людьми.

                                    Ограниченное время выполнения тестовых заданий – полное время выполнения заданий психодиагностического теста не должно превышать 1,5-2 часов, т. к. сверх этого времени человеку трудно сохранить свою работоспособность на достаточно высоком уровне.

                                    Наличие тестовых норм для данного теста –репрезентативные средние показатели по данному тесту, - т. е. показатели, представляющие большую совокупность людей, с которыми можно сравнивать показатели данного индивида, оценивая уровень его психологического развития.

                                    Норма теста – средний уровень развития большой совокупности людей, похожих на данного испытуемого по ряду социально – демографических характеристик.
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex d-flex md9 class="pa-1" v-else key="form">
                            <div v-if="showCreateForm">
                                <requirement-create-form
                                        :parent="selectItem"
                                        :project_id="id"
                                        v-on:close_form="showCreateForm=false"
                                        v-on:save_form="saveCreateForm"
                                ></requirement-create-form>
                            </div>

                            <div v-if="showEditForm">
                                <requirement-edit-form
                                        :item="selectItem"
                                        :project_id="id"
                                        v-on:close_form="showEditForm=false"
                                        v-on:save_form="saveEditForm"
                                ></requirement-edit-form>
                            </div>
                        </v-flex>
                    </transition>
                </v-layout>
            </v-container>
            <my-preloader v-else :init="preloadFetch"></my-preloader>
        </transition>
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

</template>

<style>

</style>

<script>
    import RequirementCreateForm from '../components/requirement-create-form.vue';
    import RequirementEditForm from '../components/requirement-edit-form.vue';

    function compare(a, b)
    {
        if (parseInt(a.priority) < parseInt(b.priority))
        {
            return -1;
        }

        if (parseInt(a.priority) > parseInt(b.priority))
        {
            return 1;
        }

        return 0;
    }

    export default
    {
        name   : 'requirements-list',
        props:['id'],
        components:{RequirementCreateForm,RequirementEditForm},
        created: function ()
        {
            var _this = this;

            _this.setLayoutSettings();

            _this.fetchRequirements();
        },
        computed:{
            tree_data:function()
            {
                var _this = this;
                var arr  = _this.generateFormatData();

                return arr;
            },
            project:function()
            {
                return this.$store.state.Projects.ProjectDetail.project;
            },
            route:function()
            {
                return this.$store.state.route;
            },
            laydata:function()
            {
                return this.$store.state.Layout;
            },
            showForm:function()
            {
                return this.showCreateForm || this.showEditForm;
            }
        },
        data: function ()
        {
            return {
                preloadFetch:false,
                original_data:[],
                selectItem:undefined,
                showCreateForm:false,
                showEditForm:false,
                runRemove:false,
                ess:'',
                removeConfirm:false,
                confirm: {
                    title: 'Вы уверены, что хотите удалить требование?',
                    contentHtml: 'Все данные будут безвозвратно удалены.',
                    ok: 'Удалить',
                    cancel: 'Отмена'
                },
            };
        },
        methods: {
            list_to_tree:function()
            {
                var list = this.original_data;
                var map = {}, node, roots = [], i;

                for (i = 0; i < list.length; i += 1)
                {
                    map[list[i].id] = i;

                    this.$set(list[i],'children',[]);

                    if (!list[i].hasOwnProperty('open'))
                    {
                        this.$set(list[i],'open',false);
                    }
                }



                for (i = 0; i < list.length; i += 1)
                {
                    node = list[i];

                    if (node == undefined) continue;

                    if (node.parent_id)
                    {
                        if (map[node.parent_id] == undefined) continue;

                        if (typeof list[map[node.parent_id]].children == undefined)
                        {
                            this.$set(list[map[node.parent_id]],'children',[]);
                        }
                        // if you have dangling branches check that map[node.parent_id] exists
                        list[map[node.parent_id]].children.push(node);
                        list[map[node.parent_id]].children.sort(compare);
                    }
                    else
                    {
                        node.parent_id = 0;
                        roots.push(node);
                    }
                }

                return roots;
            },
            generateFormatData:function()
            {
                var _this = this;

                return _this.list_to_tree();
            },
            fetchRequirements:function()
            {
                var _this = this;
                _this.preloadFetch = true;
                var request = _this.$store.dispatch('Requirements/RequirementsList/Datatable', _this.id);

                request.then(
                    function(response)
                    {
                        _this.preloadFetch = false;

                        var opens = {};
                        if (_this.original_data.length > 0)
                        {
                            for (var i = 0; i < _this.original_data.length; i++)
                            {
                                opens[_this.original_data[i]['id']] = _this.original_data[i]['open'];
                            }
                        }

                        _this.original_data = response.data.data;

                        if (_this.original_data.length > 0)
                        {
                            for (var i = 0; i < _this.original_data.length; i++)
                            {
                                if (opens.hasOwnProperty(_this.original_data[i]['id']))
                                {
                                    _this.$set(_this.original_data[i],'open',opens[_this.original_data[i]['id']]);
                                }
                            }
                        }
                    }
                );

                request.catch(
                    function(error)
                    {
                        _this.preloadFetch = false;
                        _this.showError(error);
                    }
                );
            },
            setLayoutSettings:function()
            {
                var _this = this;
                _this.$store.commit('Layout/addBreadcrumb',{
                    'link':_this.route.path,
                    'name':'Требования'
                });
            },
            selectEvent:function(node)
            {
                this.selectItem = node;
            },
            removeNode:function()
            {
                var _this = this;
                _this.removeConfirm = true;
            },
            resultConfirm(type)
            {
                var _this = this;
                if (type == 'ok')
                {
                    _this.runRemove = true;
                    var promise = _this.$store.dispatch('Requirements/RequirementsList/Remove', _this.selectItem.id);

                    promise.then(
                        function(response)
                        {
                            _this.runRemove = false;

                            var rid;
                            for (var i = 0; i < _this.original_data.length; i++)
                            {
                                if (String(_this.original_data[i]['id']) == String(_this.selectItem.id))
                                {
                                    rid = i;
                                    break;
                                }
                            }

                            if (rid != undefined)
                            {
                                _this.selectItem = undefined;
                                _this.original_data.splice(rid,1);
                            }

                            _this.removeConfirm = false;
                        }
                    );

                    promise.catch(
                            function(error)
                            {
                                _this.runRemove = false;
                                _this.showError(error);
                            }
                    );
                }
            },
            openCreateForm:function()
            {
                var _this = this;
                _this.showEditForm = false;
                _this.showCreateForm = true;
            },
            openEditForm:function()
            {
                var _this = this;
                _this.showEditForm = false;
                _this.showCreateForm = false;
                _this.showEditForm = true;
            },
            saveCreateForm:function(node)
            {
                var _this = this;

                _this.showCreateForm = false;
                _this.original_data.push(node);
                _this.selectItem = node;

                for (var i = 0; i < _this.original_data.length; i++)
                {
                    if (_this.original_data[i]['id'] == node.parent_id)
                    {
                        _this.original_data[i].open = true;
                    }
                }
            },
            saveEditForm:function(node)
            {
                var _this = this;

                for (var i = 0; i < _this.original_data.length; i++)
                {
                    if (_this.original_data[i]['id'] == node.id)
                    {
                        for (var key in node)
                        {
                            _this.original_data[i][key] = node[key];
                        }
                    }
                }
                _this.showEditForm = false;
            },
            sortNodeNative:function(arr)
            {
                var _this = this;

                var promise = _this.$store.dispatch('Requirements/RequirementsList/Sort', arr);

                promise.then(
                    function(response)
                    {
                        //_this.fetchRequirements();
                    }
                );

                promise.catch(
                    function(error)
                    {
                        _this.showError(error);
                        _this.fetchRequirements();
                    }
                );
            },
            sortNode:function(obj)
            {
                var _this = this;
                console.log('obj',obj);
                var new_data = _this.sortTree(_this.original_data,obj);

                _this.$set(_this,'original_data',new_data);

                let sended_records = [];
                for (var i = 0; i < _this.original_data.length; i++)
                {
                    if (_this.original_data[i]['parent_id']+'' == obj.to.parent_id+'')
                    {
                        sended_records.push(_this.original_data[i]);
                    }
                }

                _this.sortNodeNative(sended_records);
            },
            sortTree:function(original_data,obj)
            {
                var _this = this;

                var adjacents = [];

                var isset_current = false;

                for (var i = 0; i < original_data.length; i++)
                {
                    if (original_data[i]['parent_id']+'' == obj.to.parent_id+'')
                    {
                        if (original_data[i]['id']+'' == obj.to.item_id+'')
                        {
                            isset_current = true;
                        }

                        adjacents.push(original_data[i]);
                    }
                }

                adjacents.sort(compare);

                var pr = 0;

                var prev_index = obj.to.index;

                if (obj.from.index > obj.to.index || parseInt(obj.from.parent_id) != parseInt(obj.to.parent_id))
                {
                    if (obj.to.index >= adjacents.length)
                    {
                        pr = obj.to.index;
                    }
                    else
                    {
                        pr = parseInt(adjacents[prev_index]['priority']);
                    }

                    if (pr < 0)
                    {
                        pr = 0;
                    }

                    var pr_minus = pr;

                    for (var i = 0; i < adjacents.length; i++)
                    {
                        if (adjacents[i]['id'] == obj.to.item_id)
                        {
                            adjacents[i]['priority'] = pr;
                        }
                        else if (i >= obj.to.index )
                        {
                            pr_minus++;
                            adjacents[i]['priority'] = pr_minus;
                        }
                    }
                }
                else
                {
                    if (obj.to.index >= adjacents.length)
                    {
                        pr = obj.to.index;
                    }
                    else
                    {
                        pr = parseInt(adjacents[prev_index]['priority'])+1;
                    }

                    var pr_plus = pr;

                    for (var i = 0; i < adjacents.length; i++)
                    {
                        if (adjacents[i]['id'] == obj.to.item_id)
                        {
                            adjacents[i]['priority'] = pr;
                        }
                        else if (i > obj.to.index )
                        {
                            pr_plus++;
                            adjacents[i]['priority'] = pr_plus;
                        }
                        else if (i < obj.to.index )
                        {
                            adjacents[i]['priority'] = pr - (obj.to.index - i);
                        }
                    }
                }

                for (var i = 0; i < original_data.length; i++)
                {
                    if (original_data[i]['id']+'' == obj.to.item_id+'')
                    {
                        original_data[i]['parent_id'] = obj.to.parent_id;
                        original_data[i]['priority'] = pr;
                    }

                    for (var j = 0; j < adjacents.length; j++)
                    {
                        if (original_data[i]['id']+'' == adjacents[j]['id']+'')
                        {
                            original_data[i]['priority'] = adjacents[j]['priority'];
                        }
                    }
                }

                return original_data;
            }
        }
    }
</script>