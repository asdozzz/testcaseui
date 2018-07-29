/**
 * Created by asd on 23.07.2017.
 */
import Vue from 'vue';

var mdMixin = {
    computed:{
        route:function()
        {
            return this.$store.state.route;
        },
        laydata:function()
        {
            return this.$store.state.Layout;
        },
    },
    methods:
    {
        showError(error)
        {
            var text = 'Произошла непредвиденная ошибка, пожалуйста обратитесь в службу техподдержки';

            if (typeof error == 'object' && error.response)
            {
                if (error.response.status === 401)
                {
                    this.$store.dispatch('Account/Logout');
                    return location.reload();
                }

                if (error.response.hasOwnProperty('data'))
                {
                    if (typeof error.response.data == 'object' && error.response.data.hasOwnProperty('message'))
                    {
                        text = error.response.data.message;
                    }
                    else
                    {
                        text = error.response.data;
                    }
                }

                if (error.response.hasOwnProperty('message'))
                {
                    text = error.response.message;
                }
            }

            this.$toasted.show(text,{
                containerClass:'my-toast-container',
                type : 'info',
                position: "top-right",
                icon : 'error_outline',
                action : {
                    text : 'Закрыть',
                    onClick : function(e, toastObject)
                    {
                        toastObject.goAway(0);
                    }
                }
            });
            //this.$store.dispatch('Snackbar/addError',text);
        },
        showInfo(text)
        {
            this.$toasted.show(text,{
                containerClass:'my-toast-container',
                type : 'info',
                position: "top-right",
                icon : 'error_outline'
            });
            //this.$store.dispatch('Snackbar/addInfo',text);
        },
    }
};

Vue.mixin(mdMixin);