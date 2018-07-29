/**
 * Created by asd on 25.06.2017.
 */
import Project from '../models/project.js';
import DatatableStore from '../../abstract/stores/datatable.js';

var ProjectListStore = new DatatableStore(
    {
        state:
        {
            essence:'projects',
        }
    }
);

var store = ProjectListStore.getData();

export default store;