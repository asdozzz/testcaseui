/**
 * Created by asd on 12.10.2017.
 */
export  default {
    namespaced: true,
    state:
    {
        default:{
            color:'blue',
            title:'Testcase',
            sidebar:{
                items:[
                    {icon:'home',route:'/', label:'Главная'},
                    {icon:'settings',route:'/projects', label:'Проекты'},
                    {icon:'view_list',route:'/tasks', label:'Задачи'},
                    {icon:'account_circle',route:'/users',label:'Пользователи'}
                ]
            },
            breadcrumbs:[
                {
                    'link':'/',
                    'name':'Главная'
                }
            ]
        },
        drawer:false,
        color:'blue',
        title:'Testcase',
        sidebar:{
            items:[]
        },
        breadcrumbs:[]
    },
    mutations:{
        setProp:function(state, obj)
        {
            state[obj.key] = obj.value;
        },
        getProp:function(state, key)
        {
            return state[key];
        },
        setDefault:function(state)
        {
            for (var key in state.default)
            {
                state[key] = state.default[key];
            }

        },
        setBreadcrumbs:function(state, obj)
        {
            state.breadcrumbs = [];

            for (var i = 0; i < state.default.breadcrumbs.length; i++)
            {
                state.breadcrumbs.push(state.default.breadcrumbs[i]);
            }

            for (var i = 0; i < obj.arr.length; i++)
            {
                state.breadcrumbs.push(obj.arr[i]);
            }
        },
        addBreadcrumb:function(state, obj)
        {
            state.breadcrumbs.push(obj);
        },
        toggleDrawer:function(state)
        {
            state.drawer = !state.drawer;
        }
    }
};