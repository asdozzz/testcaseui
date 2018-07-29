/**
 * Created by asd on 17.02.2018.
 */
export default class UniversalService
{
    constructor(name)
    {
        this.essence = name;
    }

    All(data)
    {
        var _this = this;

        return window.HTTP.post('/api/'+this.essence+'/all',data);
    }

    Datatable(data)
    {
        var _this = this;

        return window.HTTP.get('/api/'+this.essence,{params:data});
    }

    Read(id)
    {
        var _this = this;

        return window.HTTP.get('/api/'+this.essence+'/' + id);
    }

    Remove(id)
    {
        var _this = this;

        return window.HTTP.delete('/api/'+this.essence+'/' + id);
    }

    Create(data)
    {
        var _this = this;

        return window.HTTP.post('/api/'+this.essence+'', {data: data});
    }

    Update(data)
    {
        var _this = this;

        return window.HTTP.put('/api/'+this.essence+'/' + data.id, {data: data});
    }
}