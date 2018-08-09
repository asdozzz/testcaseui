/**
 * Created by asd on 08.08.2018.
 */
import aModel from '../../abstract/models/model.js';

export default class TaskUsers extends aModel
{
    defaults(){
        return {
            'author':[],
            'executor':[],
            'QA':[],
            'observer':[]
        }
    }
}