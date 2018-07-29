/**
 * Created by asd on 10.02.2018.
 */
import DatatableStore from '../../abstract/stores/datatable.js';

var TasksListStore = new DatatableStore(
    {
        state:
        {
            essence:'tasks',
            datatable:{
                search: '',
                items:[],
                totalItems: 0,
                loading: true,
                pages:1,
                pagination: {
                    sortBy: 'id',
                    page: 1,
                    rowsPerPage: 8,
                    descending: true,
                    totalItems: 0
                },
            }
        }
    }
);

var store = TasksListStore.getData();

export default store;