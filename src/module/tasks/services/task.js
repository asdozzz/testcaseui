/**
 * Created by asd on 06.08.2018.
 */
import UniversalService from '../../abstract/services/universal';

export default class TaskService extends UniversalService
{
    GetUsersById(id)
    {
        let _this = this;
        return window.HTTP.get('/api/tasks/'+id+'/users');
    }

    GetChangesById(id)
    {
        let _this = this;
        return window.HTTP.get('/api/tasks/'+id+'/changes');
    }
}