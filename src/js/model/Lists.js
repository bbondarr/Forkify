import uniqid from 'uniqid'

export class ShoppingList {
    constructor() {
        this.items = new Map()
    }

    addItem(count, unit, ingr) {
        const id = uniqid()
        this.items.set(id, {count, unit, ingr})
    }
    removeItem(id) {
        this.items.delete(id)
    }
    updateCount(id, newCount) {
        const itemUpd = this.items.get(id)
        itemUpd.count = newCount
        this.items.set(id, itemUpd)
    }

    fillList(ingredients) {
        this.items.clear()
        ingredients.forEach(ingr => this.addItem(ingr.count, ingr.unit, ingr.ingredient))
    }
}

export class LikesList {
    constructor() {
        this.items = []
    }

    addItem(recipe) {
        this.items.push(recipe)
        this.persistLikes()
    }
    removeItem(id) {
        const i = this.items.findIndex(item => item.recipe_id === id)
        this.items.splice(i, 1)
        this.persistLikes()
    }
    isLiked(id) {
        return Boolean(this.items.find(item => item.recipe_id === id))
    }
    numOfLikes() {
        return this.items.length
    }

    // Allows to persist data through reloadings of page and browser restarts
    // (but JSON cannot stringify ES6 Map so I had to use Array)
    persistLikes() {
        localStorage.setItem('likes', JSON.stringify(this.items))
    }
    getLikes() {
        const savedItems = JSON.parse(localStorage.getItem('likes'))
        if (savedItems) this.items = savedItems
        return savedItems != null
    }
}