class Service{
    constructor(repo){
        this.repo=repo
         
    }
    async getAll(query) {
        try{
        return await this.repo.getAll(query);}
        catch(err){
            console.log(err)
            throw Error('error getting list of data')}
    
    }

    async ById(id) {
        try{
        return await this.repo.ById(id);}
        catch(err){
            console.log(err)
            throw Error('error getting the data by id')}
    }

    

    
}
module.exports=Service;