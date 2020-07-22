// Global app controller
import Search from './model/Search'
import Recipe from './model/Recipe'
import { ShoppingList, LikesList } from './model/Lists'

import * as searchView from './view/searchView'
import * as recipeView from './view/recipeView'
import * as ListsView from './view/ListsView'

import { DOMelems, renderLoader, clearLoader } from './view/base'

/** Global state of the app
     * Search object
     * current recipe object
     * shopping list object
     * liked recipes object
 */
let state = {}




/*
**** SEARCH CONTROLLER
*/ 
async function controlSearch() {

    // 1. get query from view
    const query = searchView.getSearchRequest()

    if (query) {
        try {
            // 2. add new Search object to state
            state.search = new Search(query)
            
            // 3. prepare UI for the results
            searchView.clearSearchField()
            searchView.clearResList()
            renderLoader(DOMelems.results)

            // 4. process the search
            await state.search.getRecipe()

            // 5. render results on UI
            clearLoader()
            searchView.renderResList(state.search.resRecipes)

        } catch(error) {
            searchView.clearResList()
            searchView.errorCase()
        }
    }
}

DOMelems.search.addEventListener('submit', (event) => {
    event.preventDefault()
    controlSearch()
})

DOMelems.search.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault()
        controlSearch()
    }
})

DOMelems.pageButtons.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline')
    if (btn) {
        const pageToGo = +btn.dataset.goto
        searchView.clearResList()
        searchView.renderResList(state.search.resRecipes, pageToGo)
    }
})




// /*
// **** RECIPE CONTROLLER
// */ 
async function controlRecipe() {

    // 1. Get recipe ID from page hash
    const id = window.location.hash.replace('#', '')
    //searchView.highlightResult(id)

    if (id) {

        // 2. Create Recipe Pt. 1 
        state.currentRecipe = new Recipe(id)
        try {

            // 2. Prepare UI for the recipe
            recipeView.clearRecipe()
            renderLoader(DOMelems.recipe)
            
            // 3. Create Recipe Pt. 2 
            await state.currentRecipe.getRecipe()
            state.currentRecipe.parseIngredients()

            // 4. Render recipe
            clearLoader()
            recipeView.renderRecipe(state.currentRecipe, 
                                    state.likes.isLiked(state.currentRecipe.recipe_id))
        } catch(error) {
            console.log(`Sorry for inconvenience! Couldn\'t process the recipe.
            You can check recipe\'s official page: ${state.currentRecipe.source_url}`)
            //console.error(error)
        }
    }
}

window.addEventListener('hashchange', controlRecipe)
window.addEventListener('load', controlRecipe)

// Servings count controller
DOMelems.recipe.addEventListener('click', event => {

    //'+' and '-' servings buttons handling
    if (event.target.closest('.btn-inc')) {       
        state.currentRecipe.updateServings('inc')
        recipeView.updateServingsAndIngredients(state.currentRecipe)   

        // Alongside the ingredients update, I update the shopping list
        if (state.list) {
            state.list.fillList(state.currentRecipe.ingredients)
            ListsView.clearShoppingList()
            ListsView.renderShoppingList(state.list)
            ListsView.renderDeleteButton()
        } 

    } else if (event.target.closest('.btn-dec')) {
        if (state.currentRecipe.servings > 1) {
            state.currentRecipe.updateServings('dec')
            recipeView.updateServingsAndIngredients(state.currentRecipe)  

            if (state.list) {
                state.list.fillList(state.currentRecipe.ingredients)
                ListsView.clearShoppingList()
                ListsView.renderShoppingList(state.list)
                ListsView.renderDeleteButton()
            } 
        }
    } 

    /**** OTHER WAY OF IMPLEMENTATION ****
     
    if (event.target.matches('.btn-inc, .btn-inc *')) {       //'*' in btn stands for 'any child'
        ...  */
})




// /*
// **** SHOPPING LIST CONTROLLER
// */ 
DOMelems.recipe.addEventListener('click', event => {
    if (event.target.closest('.list__btn')) {

        // 1. Create and fill new list
        state.list = new ShoppingList()
        state.list.fillList(state.currentRecipe.ingredients)
    
        // 2. Prepare UI and render the list
        ListsView.clearShoppingList()
        ListsView.renderDeleteButton()
        ListsView.renderShoppingList(state.list)
    } 
})

// Remove only item or update it's count
DOMelems.shoppingList.addEventListener('click', event => {
    if (event.target.closest('.shopping__delete')) {

        // 1. Remove item from list
        const id = event.target.closest('.shopping__item').id
        state.list.removeItem(id)

        // 2. Update UI
        ListsView.clearShoppingList()
        ListsView.renderShoppingList(state.list)

    } else if (event.target.closest('.shopping__count-input')) {

        const id = event.target.closest('.shopping__item').id
        const inputVal = event.target.closest('.shopping__count-input').value

        state.list.updateCount(id, inputVal)
    }
})

// Remove all the list
DOMelems.shoppingDeleteBtn.addEventListener('click', () => {
    state.list = {}
    ListsView.clearShoppingList()
})




// /*
// **** LIKES CONTROLLER
// */ 
state.likes = new LikesList()
// Get likes data from local storage
state.likes.getLikes()
// Render likes list
ListsView.toggleLikesIcon(state.likes.numOfLikes())
ListsView.renderLikesList(state.likes)

DOMelems.recipe.addEventListener('click', event => {
    if (event.target.closest('.recipe__love')) {

        let isLiked = state.likes.isLiked(state.currentRecipe.recipe_id)

        if (isLiked) {
            state.likes.removeItem(state.currentRecipe.recipe_id)
            ListsView.toggleLikeBtn(false)
        } else {
            state.likes.addItem(state.currentRecipe)
            ListsView.toggleLikeBtn(true)
        }
        ListsView.clearLikesList()
        ListsView.renderLikesList(state.likes)
        ListsView.toggleLikesIcon(state.likes.numOfLikes())
    } 
})

/*  NOT FINISHED
DOMelems.likesIcon.addEventListener('click', () => {
    searchView.clearResList()
    searchView.renderResList(state.likes.items)
})
*/



// Just a small controller that transfers visitors to the main page
document.querySelector('.header__logo').addEventListener('click', () => {
    searchView.clearResList()
    recipeView.clearRecipe()
    window.location.href = window.location.origin
})