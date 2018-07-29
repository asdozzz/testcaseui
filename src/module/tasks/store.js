/**
 * Created by asd on 08.02.2018.
 */
import TasksListStore from './stores/tasks';
import TasksStatusesStore from './stores/tasks_statuses';
import TasksPrioritiesStore from './stores/tasks_priorities';
import TasksTrackersStore from './stores/tasks_trackers';

export default {
    namespaced: true,
    state: {    },
    modules:
    {
        TasksList:TasksListStore,
        TasksStatuses:TasksStatusesStore,
        TasksPriorities:TasksPrioritiesStore,
        TasksTrackers:TasksTrackersStore,
    }
};