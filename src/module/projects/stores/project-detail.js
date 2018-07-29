/**
 * Created by asd on 13.08.2017.
 */
import DefaultCollection from '../../abstract/models/collection.js';

export default {
    namespaced: true,
    state     : {
        project: {},
        project_users:new DefaultCollection([])
    },
    mutations : {
        setProp: function (state, obj)
        {
            state[obj['key']] = obj['value'];
        }
    },
    actions   : {
        getById: function (context, id)
        {
            var promise = context.dispatch('Projects/ProjectsList/Read',id,{root:true});

            promise.then(
                function(response)
                {
                    let project = response.data.result;
                    context.commit('setProp',{key:'project',value:project});
                }
            ).catch(
                function(error)
                {
                    console.log('getById_error',error);
                }
            );

            return promise;
        },
        GetUsersById: function (context, id)
        {
            let promise = window.Services.getInstance('projects').GetUsersById(id);

            promise.then(
                function(response)
                {
                    let users = new DefaultCollection(response.data.result);
                    context.commit('setProp',{key:'project_users',value:users});
                }
            ).catch(
                function(error)
                {
                    console.log('GetById_Error',error);
                }
            );

            return promise;
        }
    },
    getters:{
        getProjectUsers:function(state)
        {
            return state.project_users.toArray();
        }
    }
};
