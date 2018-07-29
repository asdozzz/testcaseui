/**
 * Created by asd on 17.02.2018.
 */
import UniversalService from '../../abstract/services/universal';

export default class RequirementService extends UniversalService {

    Sort(data)
    {
        var _this = this;
        return window.HTTP.post('/api/requirements/sort', {data:data});
    }
}