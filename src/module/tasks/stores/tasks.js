/**
 * Created by asd on 10.02.2018.
 */
import DatatableStore from '../../abstract/stores/datatable.js';
import DefaultCollection from '../../abstract/models/collection.js';
import TaskModel from '../models/task.js';
import TaskUsersModel from '../models/task_users.js';

var TasksListStore = new DatatableStore(
    {
        state:
        {
            essence:'tasks',
            datatable:{
                search: '',
                items:[],
                totalItems: 0,
                loading: true,
                pages:1,
                pagination: {
                    sortBy: 'id',
                    page: 1,
                    rowsPerPage: 8,
                    descending: true,
                    totalItems: 0
                },
            },
            task_users:new DefaultCollection([]),
            task_changes:new DefaultCollection([])
        },
        actions:
        {
            GetUsersById:function(context, id)
            {
                var _this = this;

                let promise = window.Services.getInstance(context.state.essence).GetUsersById(id);

                promise.then(
                    function(response)
                    {
                        let users = new DefaultCollection(response.data.result);
                        context.commit('setProp',{key:'task_users',value:users});
                    }
                ).catch(
                    function(error)
                    {
                        console.log('GetById_Error',error);
                    }
                );

                return promise;
            },
            GetChangesById:function(context, id)
            {
                var _this = this;

                let promise = window.Services.getInstance(context.state.essence).GetChangesById(id);

                promise.then(
                    function(response)
                    {
                        let changes = new DefaultCollection(response.data.result);
                        context.commit('setProp',{key:'task_changes',value:changes});
                    }
                ).catch(
                    function(error)
                    {
                        console.log('GetChangesById_Error',error);
                    }
                );

                return promise;
            }
        },
        getters:{
            getTaskUsers:function(state)
            {
                return state.task_users.toArray();
            },
            getTaskChanges:function(state)
            {
                return state.task_changes.toArray();
            },
            getUsersGroupRoles:function(state)
            {
                let users = state.task_users.originalData;

                let result = new TaskUsersModel();

                for (var i = 0; i < users.length; i++)
                {
                    result[users[i]['role']].push(users[i]);
                }

                return result;
            }
        }
    }
);

var store = TasksListStore.getData();

export default store;