/**
 * Created by asd on 26.10.2017.
 */
import User from './models/user.js';

export default {
    namespaced: true,
    state: {
        users:[
            new User({
                id:1,
                name:'Emulate',
                email:'emulate@mail.comaaaaaaaaaaa'
            }),
            new User({
                id:2,
                name:'Emulate2',
                email:'emulate@mail.com2'
            }),
            new User({
                id:3,
                name:'Emulate3aaaaaaaaaaaaaa',
                email:'emulate@mail.com3'
            }),
            new User({
                id:4,
                name:'Emulate4',
                email:'emulate@mail.com4'
            })
        ]
    },
    mutations: {
        setProp:function(state, obj)
        {
            state[obj.key] = obj.value;
        },
        remove:function(state,id)
        {
            var rid;
            for (var i = 0; i < state.users.length; i++)
            {
                if (String(state.users[i]['id']) == String(id))
                {
                    rid = i;
                    break;
                }
            }

            if (rid != undefined)
            {
                state.users.splice(rid,1);
            }
        },
        update:function(state,data)
        {
            for (var i = 0; i < state.users.length; i++)
            {
                if (String(state.users[i]['id']) == String(data.id))
                {
                    state.users[i] = data;
                }
            }

            return data;
        },
        create:function(state,data)
        {
            console.log('create',data);
            data.id= Math.floor(Date.now() / 1000);
            state.users.push(data);

            return data;
        }
    },
    actions: {
        initUsers:function(context)
        {
            return window.HTTP.get('/api/users').then((response) => {
                context.state.users = response.data;
            });

            var _this = this;
            return new Promise(
                function(resolve,reject)
                {
                    setTimeout(
                        function()
                        {
                            resolve(context.state.users);
                        },
                        2000
                    );

                }
            );

        },
        Remove:function(context, id)
        {
            var _this = this;
            return new Promise(
                function(resolve,reject)
                {
                    context.commit('remove',id);

                    resolve({'success':1});
                }
            );
        },
        Create:function(context, data)
        {

            var _this = this;
            return new Promise(
                function(resolve,reject)
                {
                    var new_data;
                    if (data.id)
                    {
                        new_data = context.commit('update',data);
                    }
                    else
                    {
                        new_data = context.commit('create',data);
                    }


                    resolve({'data':new_data});
                }
            );
        }
    },
    getters: {  }
};