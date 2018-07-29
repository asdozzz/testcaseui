<template>
    <li :item_id="itemModel.id">
        <div :class="{bold: isFolder,active:activeItem}" style="position: relative">
            <span v-if="isFolder" @click="toggle" class="left">
                <v-icon>{{itemModel.open?'keyboard_arrow_down':'keyboard_arrow_right'}}</v-icon>
            </span>

            <div @click="selectItem(itemModel)"  v-if="!activeItem">
                <v-icon v-if="isFolder" class="amber--text">folder</v-icon>
                <v-icon v-if="!isFolder" class="blue--text text--darken-2">description</v-icon>
                <span>
                    {{itemModel.name}}
                </span>

            </div>

            <div v-if="activeItem">
                <v-icon v-if="isFolder" class="amber--text">folder</v-icon>
                <v-icon v-if="!isFolder" class="blue--text text--darken-2">description</v-icon>
                <span>{{itemModel.name}}</span>
                <v-icon class="blue--text text--darken-2" @click.stop="editNode()">edit</v-icon>
                <v-icon class="blue--text text--darken-2" @click.stop="addNode()">add</v-icon>
                <v-icon class="blue--text text--darken-2" @click.stop="removeNode()">delete</v-icon>
            </div>
        </div>

            <ul v-show="itemModel.open" v-if="isFolder">
                <draggable :list="itemModel.children" :options="{group:'nodes'}" @end="onEnd" :parentId="itemModel.id">
                <my-tree-item
                        v-on:select="selectItem"
                        v-on:add_node="addNode"
                        v-on:sort_node="sortNode"
                        v-on:edit_node="editNode"
                        v-on:remove_node="removeNode"
                        v-for="(node,i) in itemModel.children"
                        :level="level+1"
                        :tree_data="treeData"
                        :select_item="select_item"
                        :model="node"
                        :key="node.id">
                </my-tree-item>
                </draggable>
            </ul>
    </li>

</template>

<style>
    .gu-mirror {
        position: absolute;
        pointer-events: none;
        transition: all 0s !important;
    }
</style>

<script>
    import draggable from 'vuedraggable';

    export default
    {
        name   : 'my-tree-item',
        components:{draggable},
        props: {
            model: Object,
            select_item:undefined,
            tree_data:Array,
            level:Number
        },
        created:function()
        {

        },
        data: function ()
        {
            return{
                itemModel:this.model,
                treeData:this.tree_data
            }
        },
        watch:{
            tree_data:function(newVal)
            {
                console.log('treeData_'+this.level,newVal);
                this.treeData = newVal;
            },
            model:function(newVal)
            {
                this.itemModel = newVal;
            }
        },
        computed:
        {
            activeItem:function()
            {
                return this.select_item && this.itemModel.id==this.select_item.id;
            },
            isFolder: function ()
            {
                return this.itemModel.children && this.itemModel.children.length;
            }
        },
        methods:
        {
            onEnd: function(evt)
            {
                var _this = this;

                var obj = {
                    'from':{
                        parent_id:evt.from.getAttribute('parentId'),
                        item_id:evt.item.getAttribute('item_id'),
                        index:evt.oldIndex
                    },
                    'to':{
                        parent_id:evt.to.getAttribute('parentId'),
                        item_id:evt.item.getAttribute('item_id'),
                        index:evt.newIndex
                    }
                };
                console.log('sort_node', obj);
                _this.$emit('sort_node', obj);
            },
            toggle: function ()
            {
                var _this = this;
                if (_this.isFolder)
                {
                    _this.itemModel.open = !_this.itemModel.open
                }

                _this.$emit('menu_toggle', _this.itemModel);
            },
            selectItem:function(model)
            {
                var _this = this;
                _this.$emit('select', model);
            },
            menu_toggle:function(model)
            {
                var _this = this;
                _this.$emit('menu_toggle', model);
            },
            addNode:function()
            {
                var _this = this;
                _this.$emit('add_node');
            },
            sortNode:function(obj)
            {
                var _this = this;
                _this.$emit('sort_node',obj);
            },
            editNode:function()
            {
                var _this = this;
                _this.$emit('edit_node');
            },
            removeNode:function()
            {
                var _this = this;
                _this.$emit('remove_node');
            }
        }
    }
</script>