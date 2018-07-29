/**
 * Created by asd on 25.06.2017.
 */
import DatatableStore from '../../abstract/stores/datatable.js';

var RequirementsListStore = new DatatableStore(
    {
        state:
        {
            essence:'requirements',
        },
        actions:
        {
            Sort:function(context, data)
            {
                var _this = this;

                return window.Services.getInstance(context.state.essence).Sort(data);
            }
        }
    }
);

var store = RequirementsListStore.getData();

export default store;
