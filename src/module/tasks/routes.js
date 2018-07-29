/**
 * Created by asd on 08.02.2018.
 */
import Tasks from './controllers/tasks';
import TasksList from './controllers/tasks-list';
import TaskEdit from './controllers/task-edit';

export default {
    path: 'tasks',
    component:Tasks,
    children:[
        {
            path: 'edit/:task_id',
            name: 'task.edit',
            props: true,
            component:TaskEdit,
        },
        {
            path: '/',
            component:TasksList,
            props: true,
        }
    ]

}
