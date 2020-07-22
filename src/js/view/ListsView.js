import { DOMelems, cutRecipeTitle } from './base'

export const renderShoppingList = list => {
    for (const item of list.items) {
        const elemHtml = `
            <li class="shopping__item" id="${item[0]}">
                <div class="shopping__count">
                    <input type="number" value="${item[1].count}" step="${item[1].count / 5}" class="shopping__count-input">
                    <p>${item[1].unit}</p>
                </div>
                <p class="shopping__description">${item[1].ingr}</p>
                <button class="shopping__delete btn-tiny">
                    <svg>
                        <use href="dist/img/icons.svg#icon-circle-with-cross"></use>
                    </svg>
                </button>
            </li>
            `
        DOMelems.shoppingList.insertAdjacentHTML('afterbegin', elemHtml)
    }
}

export const renderDeleteButton = () => {
    const btnHtml = `
            <span>Clear shopping list</span>
            <svg class="search__icon">
            <use href="dist/img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        `
    DOMelems.shoppingDeleteBtn.insertAdjacentHTML('afterbegin', btnHtml)
    DOMelems.shoppingDeleteBtn.style.visibility = 'visible'
}

export const clearShoppingList = () => {
    DOMelems.shoppingList.innerHTML = ''
    DOMelems.shoppingDeleteBtn.innerHTML = ''
    if (DOMelems.shoppingDeleteBtn) {
        DOMelems.shoppingDeleteBtn.style.visibility = 'hidden'
    }
}


export const renderLikesList = list => {
    for (const item of list.items) {
        const elemHtml = `
            <li>
                <a class="likes__link" href="#${item.recipe_id}">
                    <figure class="likes__fig">
                        <img src="${item.image_url}" alt="Test">
                    </figure>
                    <div class="likes__data">
                        <h4 class="likes__name">${cutRecipeTitle(item.title)}</h4>
                        <p class="likes__author">${item.publisher}</p>
                    </div>
                </a>
            </li>
            `
        DOMelems.likesList.insertAdjacentHTML('afterbegin', elemHtml)
    }
}

export const clearLikesList = () => {
    DOMelems.likesList.innerHTML = ''
}

export const toggleLikeBtn = isLiked => {
    const btnState = isLiked ? '' : '-outlined'
    document.querySelector('.recipe__love use').setAttribute('href', `dist/img/icons.svg#icon-heart${btnState}`)
}

export const toggleLikesIcon = numOfLikes => {
    DOMelems.likesIcon.style.visibility = numOfLikes > 0 ? 'visible' : 'hidden'
}
