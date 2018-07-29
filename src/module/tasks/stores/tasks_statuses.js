/**
 * Created by asd on 20.02.2018.
 */

import DatatableStore from '../../abstract/stores/datatable.js';

var TasksStatusesStore = new DatatableStore(
    {
        state:
        {
            essence:'tasks_statuses',
        }
    }
);

var store = TasksStatusesStore.getData();

export default store;