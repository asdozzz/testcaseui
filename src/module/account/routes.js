/**
 * Created by asd on 25.10.2017.
 */
import Layout from './controllers/layout';
import Login from './controllers/login';

export default {
    path: '/account',
    component:Layout,
    meta:{noNeedAuth:true},
    children:[
        {
            path: 'login',
            component:Login,
            meta:{noNeedAuth:true},
            name:'login'
        }
    ]
}