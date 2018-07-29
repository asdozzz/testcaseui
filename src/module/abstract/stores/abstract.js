/**
 * Created by asd on 13.02.2018.
 */
'use strict';

var AbstractStore = function(store)
{
    this.namespaced = true;
    this.state = {};
    this.mutations = {
        setProp:function(state, obj)
        {
            state[obj.key] = obj.value;
        }
    };
    this.actions = {};
    this.getters = {};

    this.init(store);
};

AbstractStore.prototype.getData = function()
{
    return {
        namespaced:this.namespaced,
        state:this.state,
        mutations:this.mutations,
        actions:this.actions,
        getters:this.getters
    };
};

AbstractStore.prototype.extend = function(key, data)
{
    for (var k in data)
    {
        this[key][k] = data[k];
    }
};

AbstractStore.prototype.init = function(store)
{
    if (store != undefined)
    {
        if (store.state != undefined)
        {
            this.extend('state',store.state)
        }

        if (store.mutations != undefined)
        {
            this.extend('mutations',store.mutations)
        }

        if (store.actions != undefined)
        {
            this.extend('actions',store.actions)
        }

        if (store.getters != undefined)
        {
            this.extend('getters',store.getters)
        }
    }
};

export default AbstractStore;