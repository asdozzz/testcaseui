/**
 * Created by asd on 20.06.2017.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import AccountStore from "@/module/account/store";
import ProjectsStore from "@/module/projects/store";
import UsersStore from "@/module/users/store";
import PlansStore from "@/module/plans/store";
import LayoutStore from "@/module/layout/store";
import SnackbarStore from "@/module/snackbar/store";
import RequirementsStore from "@/module/requirements/store";
import TasksStore from "@/module/tasks/store";
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {    },
    modules:
    {
        Account:AccountStore,
        Snackbar:SnackbarStore,
        Layout:LayoutStore,
        Users:UsersStore,
        Projects:ProjectsStore,
        Plans:PlansStore,
        Requirements:RequirementsStore,
        Tasks:TasksStore,
    }
});

export default store;