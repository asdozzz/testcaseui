import DatatableStore from '../../abstract/stores/datatable.js';

var CStore = new DatatableStore(
    {
        state: {
            essence: 'tasks_trackers',
        }
    }
);

var store = CStore.getData();

export default store;