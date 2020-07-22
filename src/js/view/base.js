export const DOMelems = {
    resultsList: document.querySelector(`.results__list`),
    results: document.querySelector(`.results`),
    likesList: document.querySelector(`.likes__list`),
    searchField: document.querySelector(`.search__field`),
    search: document.querySelector(`.search`),
    pageButtons: document.querySelector(`.results__pages`),
    recipeLink: document.querySelector(`.results__link`),
    recipe: document.querySelector(`.recipe`),
    shoppingList: document.querySelector(`.shopping__list`),
    likesList: document.querySelector(`.likes__list`),
    likesBtn: document.querySelector(`.header__likes`),
    likesIcon: document.querySelector(`.likes__field`),
    shoppingDeleteBtn: document.querySelector('.shopping__delete-all')
}

export const renderLoader = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="dist/img/icons.svg#icon-cw"></use>
            </svg>
        </div>
        `
    parent.insertAdjacentHTML(`afterbegin`, loader)
}

export const clearLoader = () => {
    const loader = document.querySelector(`.loader`)
    loader.parentElement.removeChild(loader)
}

export const cutRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const splitTitle = title.split(' ')
        let shortenedTitle = ''
        for (const word of splitTitle) {
            if (`${shortenedTitle} ${word}`.length > limit) {
                return `${shortenedTitle} ${word}...`
            } 
            shortenedTitle = `${shortenedTitle} ${word}`
        }
    } return title
}