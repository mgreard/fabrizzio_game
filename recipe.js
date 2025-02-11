class RecipeCard {
  constructor(recipeElement) {
    this.recipeElement = recipeElement;
  }

  populateRecipe(recipe) {
    // Sélectionner les éléments
    const content = this.recipeElement.querySelector('.recipe-content');
    
    // Titre
    content.querySelector('.recipe-title').textContent = recipe.name;
    
    // Base
    content.querySelector('.recipe-base h3').textContent = `Base: ${recipe.base}`;
    
    // Ingrédients
    const ingredientsList = content.querySelector('.ingredients-wrapper');
    ingredientsList.innerHTML = "";
    
    // Ajouter les nouveaux ingrédients
    recipe.ingredients.forEach(ingredient => {
      const ingredientItem = document.createElement('div');
      ingredientItem.className = 'ingredient-item';
      ingredientItem.innerHTML = `
        <span>${this.formatIngredientName(ingredient.name)}</span>
        <span>${ingredient.quantity}</span>
      `;
      ingredientsList.appendChild(ingredientItem);
    });
    
    this.removePrices();
  }
  
  removePrices(){
    const content = this.recipeElement.querySelector('.prices');
    content.innerHTML = "";
  }
  
  populatePrices(price, tip) {
    const content = this.recipeElement.querySelector('.prices');
    content.innerHTML = "";
    const pizzaItem = document.createElement('div');
    pizzaItem.className = 'price-pizza';
    pizzaItem.innerHTML = "+" + price + "$";
    const tipItem = document.createElement('div');
    tipItem.className = 'price-tip';
    tipItem.innerHTML = "+" + tip.toFixed(2) + "$";
    content.appendChild(pizzaItem)
    content.appendChild(tipItem)
  }
  
  hide(){
    this.recipeElement.classList.remove("show")
  }
  show(){
    this.recipeElement.classList.add("show")
  }

  // Méthode utilitaire pour formater les noms d'ingrédients
  formatIngredientName(name) {
    const translations = {
      'mushroom': 'Champignons',
      'pepper': 'Piments',
      'olive': 'Olives',
      'onion': 'Oignons',
      'goat': 'Chevres',
      'basilic': 'Basilic',
      'tomato': 'Tomates',
      'mozza': 'Mozza',
      'egg': 'Oeufs',
      'ham': 'Jambons',
    };
    return translations[name] || name;
  }
}