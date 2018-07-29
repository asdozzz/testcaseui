/**
 * Created by asd on 17.02.2018.
 */
import UniversalService from './module/abstract/services/universal';
import ProjectService from './module/projects/services/project';
import RequirementService from './module/requirements/services/requirement';

class Services
{
    constructor(map)
    {
        this.map = map;
    }

    getInstance(name)
    {
       if (map[name] != undefined)
       {
           return new map[name](name);
       }
       else
       {
           return new map['universal'](name)
       }
    }
}

const map = {
    'requirements':RequirementService,
    'projects':ProjectService,
    'universal':UniversalService
};

window.Services = new Services(map);