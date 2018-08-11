<template>
    <div>
        <v-card v-if="initData" class="mt-3" v-for="(item, index) in task_changes" :key="index">
            <v-card-title class="pb-1">
                Обновил <span class="primary--text">&nbsp; {{ item.user.name }}</span> <span class="grey--text">&emsp;{{ item.created_at }}</span>
            </v-card-title>
            <v-card-text class="pt-0">
                <ul>
                    <template v-for="(param,i) in item.params" >
                        <li  :key="i" avatar ripple @click="" style="height:auto">
                            <div>
                                <span>Параметр <b>{{param.param_name}}</b> изменился:</span>
                                <span v-if="param.old_value_text"><i class="grey--text">{{ param.old_value_text}}</i> ==></span> <i class="grey--text">{{ param.new_value_text}}</i>
                            </div>
                        </li>
                    </template>
                </ul>
                <div class="mt-2" v-html="item.comment"></div>
            </v-card-text>
        </v-card>
        <v-card>
            <my-preloader :init="!initData" style="width:100%;" calss="text-md-center"></my-preloader>
        </v-card>
    </div>
</template>

<style>

</style>

<script>
    export default
    {
        name   : 'task-changes',
        props: {
            task_id: {
                type    : Number|String,
                required: true
            }
        },
        created: function ()
        {
            console.log('task-changes');
            this.readTaskChanges();
        },
        mounted () {
            console.log('breakpoint',this.$vuetify.breakpoint)
        },
        data   : function ()
        {
            return {
                initData:false
            };
        },
        computed:
        {
            task_changes:function ()
            {
                return this.$store.getters['Tasks/TasksList/getTaskChanges'];
            }
        },
        methods: {
            readTaskChanges:function ()
            {
                var _this = this;
                var promise = _this.$store.dispatch('Tasks/TasksList/GetChangesById',this.task_id);

                promise.then(function (response)
                {
                    _this.initData = true;
                });
            },
        }
    }
</script>