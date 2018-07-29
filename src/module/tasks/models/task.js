/**
 * Created by asd on 12.02.2018.
 */
import aModel from '../../abstract/models/model.js';

export default class Task extends aModel
{
    defaults(){
        return {
            id:   null,
            project_id:null,
            status:null,
            user_id:null,
            executor:null,
            tracker:null,
            priority:null,
            subject: '',
            description: ''
        }
    }
}