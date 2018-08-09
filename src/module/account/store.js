/**
 * Created by asd on 25.10.2017.
 */
import axios from 'axios';
require('../../env.js');

export default {
    namespaced: true,
    state: {
        account:{},
        exparation:0,
        user:{},
        init:false,
    },
    mutations: {
        setProp:function(state, obj)
        {
            state[obj.key] = obj.value;
        },
        Init:function(state)
        {
            state.init = true;

            var accountString = window.localStorage.getItem('accountObj');
            var tokenExpires = window.localStorage.getItem('tokenExpires');

            if (accountString != undefined && tokenExpires != undefined)
            {
                if (parseInt(Date.now()) > parseInt(tokenExpires))
                {
                    window.localStorage.removeItem('accountObj');
                    window.localStorage.removeItem('tokenExpires');
                }
                else
                {
                    state.account = JSON.parse(accountString);
                    state.exparation = parseInt(tokenExpires);
                }
            }

            window.HTTP = axios.create({
                baseURL: window.ENV['BASE_URL'],
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer '+state.account.access_token
                }
            });
        },
        SET_USER:function(state, user)
        {
            state.user = user;
        },
        LOGOUT:function(state)
        {
            window.localStorage.removeItem('accountObj');
            window.localStorage.removeItem('tokenExpires');
        }
    },
    actions:
    {
        getToken:function(context, form)
        {
            var _this = this;

            let postData  = {
                'grant_type': 'password',
                'client_id': window.ENV['API_CLIENT_ID'],
                'client_secret': window.ENV['API_CLIENT_SECRET'],
                'username': form.login,
                'password': form.password,
                'scope': '',
            };

            return Axios.post('/oauth/token', postData).then((response) => {
                //context.state.account = response.data;
                let data = response.data;

                window.localStorage.setItem('accountObj',JSON.stringify(response.data));
                var tokenExpires = parseInt(data.expires_in)*1000+parseInt(Date.now());
                console.log('tokenExpires',tokenExpires);
                window.localStorage.setItem('tokenExpires',tokenExpires);
                context.commit('Init');
            });
        },
        getUser:function(context)
        {
            return window.HTTP.get('/api/user').then((response) => {
                console.log('user',response);
                context.commit('SET_USER',response.data);
            });
        },
        Logout:function(context)
        {
            context.commit('LOGOUT');
        }
    },
    getters: {
        Current:function(state)
        {
            if (Date.now() > state.exparation)
            {
                window.localStorage.removeItem('accountObj');
                window.localStorage.removeItem('tokenExpires');
                state.account = {};
                state.exparation = 0;
            }

            return state.account;
        }
    }
};