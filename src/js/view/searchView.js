import { DOMelems, cutRecipeTitle } from './base'

export const getSearchRequest = () => DOMelems.searchField.value

export const clearSearchField = () => DOMelems.searchField.value = ''
export const clearResList = () => {
    DOMelems.resultsList.innerHTML = ''
    DOMelems.pageButtons.innerHTML = ''
}

const renderResult = elem => {
    const elemHtml = `
        <li>
            <a class="results__link results__link--active" href="#${elem.recipe_id}">
                <figure class="results__fig">
                    <img src="${elem.image_url}" alt="${elem.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${cutRecipeTitle(elem.title)}</h4>
                    <p class="results__author">${elem.publisher}</p>
                </div>
            </a>
        </li>
    `
    DOMelems.resultsList.insertAdjacentHTML(`beforeend`, elemHtml)
}

const makeButton = (page, type) => {
    const pageTag = type === `prev` ? page - 1 : page + 1
    return `
        <button class="btn-inline results__btn--${type}"  data-goto="${pageTag}">
            <svg class="search__icon">
                <use href="dist/img/icons.svg#icon-triangle-${type}"></use>
            </svg>
            <span>Page ${pageTag}</span>
        </button>
    `
}

const renderButtons = (numOfRecipes, page, recipesPerPage) => {
    const pages = Math.ceil(numOfRecipes / recipesPerPage)
    let button
    if (page === 1 && pages > 1) {
        button = makeButton(page, 'next')
    } else if (page < pages) {
        button = `
            ${makeButton(page, 'prev')}
            ${makeButton(page, 'next')}
            `
    } else if (page === pages && pages > 1) {
        button = makeButton(page, 'prev')
    } else return
    DOMelems.pageButtons.insertAdjacentHTML(`beforeend`, button)
}

export const renderResList = (searchRes, page = 1, recipesPerPage = 10) => {
    const pageBeginInd = (page - 1) * recipesPerPage
    const pageEndInd = page * recipesPerPage

    searchRes.slice(pageBeginInd, pageEndInd).forEach(renderResult)
    renderButtons(searchRes.length, page, recipesPerPage)
}

export const errorCase = () => {
    DOMelems.resultsList.insertAdjacentHTML('afterbegin', `
    <p class="search__error-msg">Sorry, coudn\'t process your search request. Try something rather like \'pizza\' or \'pierogi\'</p>`)
}

export const highlightResult = id => {
    document.querySelector(`a[href*="#${id}"]`).classList.add('results__link--active')
}