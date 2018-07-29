<template>
    <v-card>
        <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="runAjax"></v-progress-linear>
        <div :class="{opacity2:runAjax}">
            <form v-model="valid" ref="form" lazy-validation>
            <v-toolbar class="blue" dark>
                <v-toolbar-title>
                    <div v-if="!record.id">Добавить проект</div>
                    <div v-if="record.id">Редактировать проект</div>
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>

                    <v-text-field
                            name="title"
                            label="Название"
                            v-validate="'required'"
                            v-model="record.title"
                    ></v-text-field>
                    <v-text-field
                            name="description"
                            label="Описание"
                            v-model="record.description"
                            v-validate="'required'"
                            data-vv-name="description"
                            multi-line></v-text-field>


            </v-card-text>
            <v-card-actions>
                <v-btn @click.native="closeForm()">
                    <v-icon dark left>remove_circle</v-icon>
                    Закрыть
                </v-btn>
                <v-btn absolute right dark class="blue" :disabled="errors.any()" @click="saveForm">
                    Сохранить
                    <v-icon dark right>add_circle</v-icon>
                </v-btn>
            </v-card-actions>
            </form>
        </div>
    </v-card>
</template>

<script>
    export default{
        props:['record'],
        name:  'project-form',
        data:function()
        {
            return {
                runAjax:false,
                valid:true
            };
        },
        methods: {
            closeForm:function ()
            {
                this.$emit('close_form');
            },
            saveForm:function ()
            {
                var _this = this;
                _this.runAjax = true;

                var promise;

                var data = _this.record;

                if (_this.record.id)
                {
                    data['row_id'] = _this.record.id;
                    promise = this.$store.dispatch('Projects/ProjectsList/Update',data);
                }
                else
                {
                    promise = this.$store.dispatch('Projects/ProjectsList/Create',data);
                }

                promise.then(
                    function(response)
                    {
                        _this.runAjax = false;
                        _this.$emit('save_form',response.data);
                    }
                );

                promise.catch(
                    function(error)
                    {
                        _this.runAjax = false;
                        _this.showError(error);
                    }
                );
            }
        }
    }
</script>