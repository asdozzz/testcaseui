/**
 * Created by asd on 12.02.2018.
 */
import aModel from './model.js';

export default class DefaultCollection
{
    defaults()
    {
        var def = {};
        def.modelName = aModel;

        def.list = [];
        def.models = {};
        def.pk = 'id';

        return def;
    }

    constructor(data, modelName, pk)
    {
        var def = this.defaults();

        for (var key in def)
        {
            this[key] = def[key];
        }

        this.originalData = data;

        if (modelName != undefined)
        {
            this.modelName = modelName;
        }

        if (pk != undefined)
        {
            this.pk = pk;
        }

        this.normalizeData(data);
    }

    getModel(model)
    {
        return new this['modelName'](model);
    }

    normalizeData(data)
    {
        for (var i = 0; i < data.length; i++)
        {
            let id = data[i][this.pk];
            this.list.push(id);
            this.models[id] = this.getModel(data[i]);
        }
    }

    removeByPk(pk)
    {
        var rid = this.list.indexOf(pk);

        if (rid >= 0)
        {
            this.list.splice(rid,1);
            delete this.models[pk];
        }
    }

    Add(data)
    {
        this.originalData.push(data);
        let id = data[this.pk];
        this.list.push(id);
        this.models[id] = this.getModel(data);
    }

    Update(data)
    {
        let id = data[this.pk];
        this.models[id] = this.getModel(data);
    }

    getModelByPk(pk)
    {
        return this.models[pk];
    }

    toArray()
    {
        return this.list.map(id => this.models[id]);
    }

}