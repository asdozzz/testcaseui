/**
 * Created by asd on 10.09.2017.
 */
import Layout from './controllers/layout';
import Home from './controllers/home';
import ProjectsRoutes from '@/module/projects/routes.js';
import TasksRoutes from '@/module/tasks/routes.js';
import UsersRoutes from '@/module/users/routes.js';

import App from '@/App';

export default {
    path: '/',
    redirect: '/projects',
    component:App,
    name:'home',
    children:[
        ProjectsRoutes,
        TasksRoutes,
        UsersRoutes
    ]
}