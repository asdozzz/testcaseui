/**
 * Created by asd on 13.02.2018.
 */
'use strict';

import DefaultCollection from '../../abstract/models/collection.js';
import AbstractStore from '../../abstract/stores/abstract.js';

function DatatableStore(store)
{
    AbstractStore.apply(this, arguments);

    this.state = {
        essence:'essence',
        collection: new DefaultCollection([]),
        datatable:{
            search: '',
            items:[],
            totalItems: 0,
            loading: true,
            pages:1,
            pagination: {
                sortBy: 'id',
                page: 1,
                rowsPerPage: 5,
                descending: true,
                totalItems: 0
            },
        }
    };

    this.mutations =  {
        setProp: function (state, obj)
        {
            state[obj.key] = obj.value;
        },
        setAll:function(state,data)
        {
            state.collection = new DefaultCollection(data);
        },
        setDatatable:function(state,obj)
        {
            state.collection = new DefaultCollection(obj.data);
            state.datatable.totalItems = parseInt(obj.recordsTotal);
            state.datatable.pages = Math.ceil(state.datatable.totalItems/state.datatable.pagination.rowsPerPage);
        },
        Remove:function(state,id)
        {
            state.collection.removeByPk(id);
            state.datatable.totalItems--;
        },
        Create:function(state,data)
        {
            state.collection.Add(data);
            state.datatable.totalItems++;
        },
        Update:function(state,data)
        {
            state.collection.Update(data);
        }
    };

    this.actions = {
        Datatable:function(context)
        {
            var _this = this;

            var data = {
                'start':(context.state.datatable.pagination.page-1)*context.state.datatable.pagination.rowsPerPage,
                'length':context.state.datatable.pagination.rowsPerPage,
                'orderBy':context.state.datatable.pagination.sortBy,
                'orderByDirection':context.state.datatable.pagination.descending?'desc':'asc'
            };

            let promise =  window.Services.getInstance(context.state.essence).Datatable(data);

            promise.then(
                function(response)
                {
                    context.commit('setDatatable',response.data.result);
                }
            );

            return promise;

        },
        All:function(context)
        {
            var _this = this;

            var data = {
                'orderBy':context.state.datatable.pagination.sortBy,
                'orderByDirection':context.state.datatable.pagination.descending?'desc':'asc'
            };

            let promise =  window.Services.getInstance(context.state.essence).All(data);

            promise.then(
                function(response)
                {
                    context.commit('setAll',response.data.result);
                }
            );

            return promise;

        },
        Read  : function (context, id)
        {
            var _this = this;

            return  window.Services.getInstance(context.state.essence).Read(id);
        },
        Remove: function (context, id)
        {
            var _this = this;
            let promise = window.Services.getInstance(context.state.essence).Remove(id);

            promise.then(
                function(response)
                {
                    context.commit('Remove',id);
                }
            );

            return promise;
        },
        Create: function (context, data)
        {
            var _this = this;
            let promise = window.Services.getInstance(context.state.essence).Create(data);

            promise.then(
                function(response)
                {
                    context.commit('Create',response.data.result);
                }
            );

            return promise;
        },
        Update: function (context, data)
        {
            var _this = this;
            let promise = window.Services.getInstance(context.state.essence).Update(data);

            promise.then(
                function(response)
                {
                    context.commit('Update',response.data.result);
                }
            );

            return promise;
        }
    };

    this.getters = {
        Datatable:function(state)
        {
            var data = state.datatable;
            data.items = state.collection.toArray();

            return data;
        },
        getItems:function(state)
        {
            return state.collection.toArray();
        },
        getCollection:function(state)
        {
            return state.collection;
        }
    };

    this.init(store);
}

DatatableStore.prototype = Object.create(AbstractStore.prototype);

// Желательно и constructor сохранить
DatatableStore.prototype.constructor = DatatableStore;

export default DatatableStore;