
// Classe pour valider les pizzas
class PizzaValidator {
  static validateAgainstRecipe(pizza, recipeName) {
    const recipe = PIZZA_RECIPES[recipeName];
    if (!recipe) {
      return {
        isValid: false,
        errors: ["Recette inconnue"],
        warnings: []
      };
    }

    const errors = [];
    const warnings = [];
    const stats = pizza.getStats();

    // Validation de la base
    if (pizza.base.type !== recipe.base) {
      errors.push(`Base incorrecte : ${pizza.base || 'aucune'} au lieu de ${recipe.base}`);
    }

    // Validation de la cuisson
    if (!pizza.isCooked) {
      errors.push("La pizza doit être cuite");
    }

    // Validation des ingrédients
    recipe.ingredients.forEach(reqIngredient => {
      const actualCount = stats.ingredientCounts[reqIngredient.name] || 0;
      const targetCount = reqIngredient.quantity;
      const maxDeviation = recipe.maxDeviation * targetCount;
      
      if (Math.abs(actualCount - targetCount) > maxDeviation) {
        errors.push(
          `Quantité incorrecte de ${reqIngredient.name}: ${actualCount} au lieu de ${targetCount} (±${Math.floor(maxDeviation)})`
        );
      } else if (actualCount !== targetCount) {
        warnings.push(
          `Quantité non optimale de ${reqIngredient.name}: ${actualCount} au lieu de ${targetCount}`
        );
      }
    });

    // Vérification des ingrédients non autorisés
    for (const [ingName, count] of Object.entries(stats.ingredientCounts)) {
      if (!recipe.ingredients.find(i => i.name === ingName)) {
        errors.push(`Ingrédient non autorisé: ${ingName}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      stats
    };
  }

  // Validation générale d'une pizza (sans recette spécifique)
  static validateGeneral(pizza) {
    const errors = [];
    const warnings = [];
    
    if (!pizza.base) {
      errors.push("Aucune base sélectionnée");
    }

    if (pizza.ingredients.length === 0) {
      errors.push("Aucun ingrédient sur la pizza");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}