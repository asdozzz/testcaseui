/**
 * Created by asd on 26.10.2017.
 */
import aModel from '../../abstract/models/model.js';

export default class Role extends aModel
{
    defaults(){
        return {
            id:   null,
            name: '',
            slug: '',
            group: '',
        }
    }
}