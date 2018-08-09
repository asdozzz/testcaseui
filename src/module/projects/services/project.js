/**
 * Created by asd on 17.02.2018.
 */
import UniversalService from '../../abstract/services/universal';

export default class ProjectService extends UniversalService
{
    GetUsersById(id)
    {
        var _this = this;
        return window.HTTP.get('/api/projects/'+id+'/users');
    }
}