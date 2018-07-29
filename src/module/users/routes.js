/**
 * Created by asd on 26.10.2017.
 */
import Layout from './controllers/layout';
import UsersList from './controllers/users-list';

export default {
    path: 'users',
    component:Layout,
    children:[
        {
            path: '/',
            component:UsersList
        }
    ]
}