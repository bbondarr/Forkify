import axios from 'axios'

export default class Recipe {
    constructor(id) {
        this.recipe_id = id
    }

    async getRecipe() {
        const key = 'random key we get from our API. Not required in this example'
        const proxy = 'some CORS proxy. Also isn\'t required here'
    
        const apiPath = 'https://forkify-api.herokuapp.com/api/get'

        try {
            let res = await axios(`${apiPath}?rId=${this.recipe_id}`)

            this.title = res.data.recipe.title
            this.image_url = res.data.recipe.image_url
            this.source_url = res.data.recipe.source_url
            this.publisher = res.data.recipe.publisher
            this.ingredients = res.data.recipe.ingredients
 
            this.calcTime()
            this.calcServings()
        } catch(error) {
            console.log('======ERROR======\nInvalid recipe ID')
        }
    }

    calcTime() {
        this.time = Math.ceil(this.ingredients.length / 3) * 15 
    }
    calcServings() {
        this.servings = 4
    }

    parseIngredients() {
        const before = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'pounds', 'cups']
        const after = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'pound', 'cup']
        const units = [...after, 'lbs', 'g', 'kg',]
        //console.log('FIRST\n', this.ingredients)
        const ingredientsAfter = this.ingredients.map(ingr => {
            let ingredient = ingr.toLowerCase()

            // 1. Unficate measures
            before.forEach((item, i) => {
                ingredient = ingredient.replace(item, after[i])
            })
            //console.log('SECOND\n', ingredient)
            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')
            //ingredient = ingredient.replace(',', ' ')
            ingredient = ingredient.replace(/[^\w\s\/]|- /g, " ")
                                    .replace(/\s+/g, " ");
            //console.log('THIRD\n', ingredient)
            // 3. Split numbers from measures and ingredients
            let ingrArr = ingredient.split(' ')
            let unitInd = ingrArr.findIndex(str => units.includes(str))

            /* ------------------------------------------------------
             * NOTE: COUNTS LIKE '6 to 8' STILL DON'T PARSE CORRECTLY *
               ------------------------------------------------------ */ 
            if (unitInd > -1) {
                
                // There's a number and a unit
                const arrCount = ingrArr.slice(0, unitInd)                             //slice returns sliced elements

                if (arrCount.length === 1 && !arrCount[0]) {
                    var count = 1

                } else if (arrCount.length === 1) {
                    var count = eval(ingrArr.slice(0, unitInd)[0].split('-')[0])       //splitting in case of '1 - 1/2'
                                                                                       //eval in case of '1/2'                    
                } else {

                    let countT = ingrArr.slice(0, unitInd).join('+').split('-')[0]     //a lot of cases here
     
                    if (countT[countT.length - 1] === '+') {                           //f.e. '1 1/2 - 2' -> 1.5
                        countT = countT.split('')
                        countT.pop()
                        countT = countT.join('')
                    }  

                    var count = eval(countT)
                }

                var ingrObj = {
                    count,
                    unit: ingrArr[unitInd],
                    ingredient: ingrArr.slice(unitInd + 1).join(' ')
                }

            } else if (parseInt((ingrArr[0]), 10) || eval(parseInt(ingrArr[0], 10))) {                //eval in case of '1/2'

                // No unit, but 1st element is a number
                var ingrObj = {
                    count: parseInt(eval(ingrArr[0]), 10) || eval(parseInt(ingrArr[0], 10)),
                    unit: '',
                    ingredient: ingrArr.slice(1).join(' ')
                }

            } else if (unitInd === -1) {
                
                // No numbers
                var ingrObj = {
                    count: 1,
                    unit: '',
                    ingredient
                }

            }  
            return ingrObj
        })

        this.ingredients = ingredientsAfter
        //console.log('LAST\n', this.ingredients)
    }

    updateServings(type) {
        const servingsUpd = ( type === 'dec' ? this.servings - 1 : this.servings + 1 )

        this.ingredients.forEach(ingr => {
            ingr.count *= servingsUpd / this.servings
        })

        this.servings = servingsUpd
    }
}