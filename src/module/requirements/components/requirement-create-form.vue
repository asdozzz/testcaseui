<template>
<v-card>
    <v-toolbar :class="laydata.color" dark>
        <v-toolbar-title>Добавление требования</v-toolbar-title>
    </v-toolbar>

    <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="runAjaxSave"></v-progress-linear>
    <v-card-text>
        <v-form ref="form" lazy-validation v-model="valid" :class="{opacity2:runAjaxSave}">
            <v-text-field
                    name="name"
                    label="Название"
                    :rules="nameRules"
                    v-model="requirement.name"
            ></v-text-field>
            <wysiwyg v-model="requirement.description" />
            <v-card-actions class="pa1">
                <v-btn class="elevation-0" @click.native="closeForm()">
                    <v-icon dark left>remove_circle</v-icon>
                    Закрыть
                </v-btn>
                <v-btn absolute right class="blue elevation-0" dark
                       :loading="runAjaxSave"
                       :disabled="errors.any()"
                       @click.native="saveForm">
                    Сохранить
                    <v-icon dark right>add_circle</v-icon>
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card-text>

</v-card>
</template>

<style>

</style>

<script>
    import Requirement from '../models/requirement';

    export default
    {
        name   : 'requirement-create-form',
        props:['parent','project_id'],
        data  : function ()
        {
            return {
                parent_id:undefined,
                loader: null,
                runAjaxSave:false,
                requirement:this.getRecord(this.parent),
                valid: false,
                nameRules: [
                    (v) => !!v || 'Название обязательно для заполнения'
                ],
            }
        },
        computed:{
            laydata:function()
            {
                return this.$store.state.Layout;
            },
        },
        watch:{
            parent:function(newVal)
            {
                this.requirement = this.getRecord(newVal);
            }
        },
        methods: {
            getRecord:function(newVal)
            {
                var parent_id = newVal?newVal.id:null;
                var level = newVal?newVal.level+1:0;

                console.log('newVal',newVal);
                return new Requirement(
                    {
                        parent_id:parent_id,
                        project_id:this.project_id,
                        level:level
                    }
                );
            },
            closeForm:function ()
            {
                this.$emit('close_form');
            },
            saveForm:function ()
            {
                var _this = this;

                if (this.$refs.form.validate())
                {
                    _this.runAjaxSave = true;

                    var promise = _this.$store.dispatch('Requirements/RequirementsList/Create',_this.requirement);

                    promise.then(
                        function(response)
                        {
                            _this.runAjaxSave = false;
                            _this.$emit('save_form',response.data.result);
                        }
                    );

                    promise.catch(
                        function(error)
                        {
                            _this.runAjaxSave = false;
                            _this.showError(error);
                        }
                    );

                }
            }
        }
    }
</script>