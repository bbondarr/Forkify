import { DOMelems } from './base'

import { Fraction } from 'fractional'

export const renderRecipe = (recipe, isLiked) => {
    const recipeHtml = `
        <figure class="recipe__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="dist/img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="dist/img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-dec">
                        <svg>
                            <use href="dist/img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-inc">
                        <svg>
                            <use href="dist/img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>

            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="dist/img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${renderIngredients(recipe.ingredients)}
            </ul>

            <button class="btn-small recipe__btn list__btn">
                <svg class="search__icon">
                    <use href="dist/img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.source_url}">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="dist/img/icons.svg#icon-triangle-next"></use>
                </svg>

            </a>
        </div>
    `
    DOMelems.recipe.insertAdjacentHTML('afterbegin', recipeHtml)
}

const renderIngredients = ingredients => {
    let ingrHtml = ``
    ingredients.forEach(ingr => {
        ingrHtml += `
            <li class="recipe__item">
                <svg class="recipe__icon">
                    <use href="dist/img/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__count">${renderCount(ingr.count)}</div>
                <div class="recipe__ingredient">
                    <span class="recipe__unit">${ingr.unit}</span>
                        ${ingr.ingredient}
                </div>
            </li>
        `
    })
    return ingrHtml
}

const renderCount = count => {
    if (count) {
        const [int, dec] = count.toString().split('.')

        if (!dec) {
            return int
        }
        count = count.toFixed(2)
        if (!+int) {
            const fr = new Fraction(count)
            return `${fr.numerator}/${fr.denominator}`
        }
        if (int && dec) {
            const fr = new Fraction(count - int)
            return `${int} ${fr.numerator}/${fr.denominator}`
        }
    }   return '?'
}

export const clearRecipe = () => {
    DOMelems.recipe.innerHTML = ''
}

export const updateServingsAndIngredients = recipe => {
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings
    
    const countsUpd = Array.from(document.querySelectorAll('.recipe__count'))
    countsUpd.forEach((count, i) => {
        count.textContent = renderCount(recipe.ingredients[i].count)
    })
}