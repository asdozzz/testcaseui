require('@/env.js');
require('@/loader.js');
import Vue from 'vue';
import store from '@/store';
import router from '@/router/index';
import RequirementsList from '@/module/requirements/controllers/requirements-list';

describe('requirements-list.vue', () => {

    const Constructor = Vue.extend(RequirementsList);


    var Model = function(parent_id,number,id)
    {
        return {
            description:"asdasd",
            id:id,
            level:0,
            name:number,
            parent_id:0,
            priority:0,
            project_id:parent_id,
            row_id:id,
            user_id:1,
        };
    };


    var getOriginData = function()
    {
        var i = 2;
        return [
            Model(0,1,i++),
            Model(3,10,i++),
            Model(10,11,i++),
            Model(10,12,i++),
            Model(10,13,i++),
            Model(3,20,i++),
            Model(20,21,i++),
            Model(20,22,i++),
            Model(20,23,i++),
        ];
    }


    var searchItem = function(data,id)
    {
        for (var i = 0; i < data.length; i++)
        {
            if (data[i]['id']+'' == id+'')
            {
                return data[i];
            }
        }

        return false;
    };


    const RequirementsListComponent = new Constructor({
        propsData: {
            id: 1
        },
        store,
        router
    }).$mount();

    it(`Test 1`, () => {

        let obj1 = {
            from:{
                index:1,
                item_id:"6",
                parent_id:"10",
            } ,
            to:{
                index:1,
                item_id:"6",
                parent_id:"20",
            }
        };

        var origin_data = getOriginData();
        var new_data = RequirementsListComponent.sortTree(origin_data,obj1);
        var item = searchItem(new_data,obj1.to.item_id);
        assert.equal(item.priority+'','1');
    });

    it(`Test 2`, () => {

        let obj1 = {
            from:{
                index:1,
                item_id:"6",
                parent_id:"10",
            } ,
            to:{
                index:0,
                item_id:"6",
                parent_id:"20",
            }
        };

        var origin_data = getOriginData();
        var new_data = RequirementsListComponent.sortTree(origin_data,obj1);
        var item = searchItem(new_data,obj1.to.item_id);
        assert.equal(item.priority+'','0');
    });

    it(`Test 3`, () => {

        let obj1 = {
            from:{
                index:0,
                item_id:"5",
                parent_id:"10",
            } ,
            to:{
                index:2,
                item_id:"5",
                parent_id:"20",
            }
        };

        let obj2 = {
            from:{
                index:0,
                item_id:"6",
                parent_id:"10",
            } ,
            to:{
                index:3,
                item_id:"6",
                parent_id:"20",
            }
        };

        let obj3 = {
            from:{
                index:0,
                item_id:"7",
                parent_id:"10",
            } ,
            to:{
                index:5,
                item_id:"7",
                parent_id:"20",
            }
        };

        var origin_data = getOriginData();
        var new_data = RequirementsListComponent.sortTree(origin_data,obj1);
        new_data = RequirementsListComponent.sortTree(new_data,obj2);
        new_data = RequirementsListComponent.sortTree(new_data,obj3);
        var item6 = searchItem(new_data,6);
        var item7 = searchItem(new_data,7);
        var item8 = searchItem(new_data,8);
        assert.equal(item6.priority+'',1);
        assert.equal(item7.priority+'',2);
        assert.equal(item8.priority+'',4);
    });
});