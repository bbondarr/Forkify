import axios from 'axios'

export default class Search {
    constructor(query) {
        this.query = query
    }
    async getRecipe(query) {
        const key = 'random key we get from our API. Not required in this example'
        const proxy = 'some CORS proxy. Also isn\'t required here'
    
        const apiPath = 'https://forkify-api.herokuapp.com/api/search'
        
        try {
            const result = await axios(`${apiPath}?q=${this.query}`)
            // if proxy and key are needed:
            // const result = await axios(`${proxy + apiPath}?key=${key}&q=${this.query}`)

            this.resRecipes = result.data.recipes
        } catch (error) {
            console.log('=======ERROR=======\nInvalid search query')
        }
    }
}