<template>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12">
                        <v-progress-linear class="my-progress-linear" v-bind:indeterminate="true" v-show="runAjax"></v-progress-linear>
                        <div :class="{opacity2:runAjax}">
                            <v-toolbar class="blue" dark>
                                <v-toolbar-title>Vika 0.1</v-toolbar-title>
                            </v-toolbar>

                            <v-card-text>
                                <v-form ref="form" lazy-validation v-model="valid">
                                    <v-text-field
                                            prepend-icon="person"
                                            name="login"
                                            label="Логин"
                                            :rules="loginRules"
                                            v-model="form.login"
                                            :counter="25"
                                    ></v-text-field>
                                    <v-text-field
                                            prepend-icon="lock"
                                            name="password"
                                            label="Пароль"
                                            :rules="passwordRules"
                                            v-model="form.password"
                                            :append-icon="e1 ? 'visibility' : 'visibility_off'"
                                            :append-icon-cb="() => (e1 = !e1)"
                                            :type="e1 ? 'password' : 'text'"
                                            :counter="25"
                                    ></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                        @click.native="saveForm"
                                        class="blue" dark
                                        :loading="runAjax">Войти</v-btn>
                            </v-card-actions>
                        </div>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
</template>

<style>

</style>

<script>
    export default
    {
        name   : 'login',
        created: function ()
        {

        },
        data  : function ()
        {
            return {
                loader: null,
                e1:true,
                runAjax:false,
                form:{
                    login:'leo@gmail.com',
                    password:'asd243815'
                },
                valid: false,
                loginRules: [
                    (v) => !!v || 'Название обязательно для заполнения'
                ],
                passwordRules: [
                    (v) => !!v || 'Пароль обязательно для заполнения'
                ],
            }
        },
        methods: {
            saveForm:function ()
            {
                var _this = this;

                if (_this.$refs.form.validate())
                {
                    _this.runAjax = true;
                    var promise = this.$store.dispatch('Account/getToken', _this.form);

                    promise.then(
                        function(response)
                        {
                            _this.runAjax = false;
                            _this.$router.push({name:'home'});
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
    }
</script>