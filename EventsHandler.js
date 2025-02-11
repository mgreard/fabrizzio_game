function mousePressed() {
 if(os.isVisible){
    os.mousePressed();
  } else {
    if (customer.isPointInside(mouseX, mouseY) && customer.order.recipeId === "hawaienne") {
      customer.setState("dying");
    } else if (securityWindow.isVisible) {
      securityWindow.mousePressed(mouseX, mouseY);
    } else {
      if (cookingGauge.isActive) {
        cookingGauge.handleCookingClick();
      }
      pizza && pizza.handleMousePressed(mouseX, mouseY);
    }
  }
}

function mouseDragged() {
  if(os.isVisible){
    os.mouseDragged();
  } else {
    pizza && pizza.handleMouseDragged(mouseX, mouseY);
    securityWindow.mouseDragged(mouseX, mouseY);
  }
}

function mouseReleased() {
 if(os.isVisible){
    os.mouseReleased();
  } else {
    securityWindow.mouseReleased();
  }
}

function initEvents() {
  
  document.getElementById("main-loading").classList.add("hide");

  document.querySelector(".pizza_wrapper").addEventListener("click", () => {
    document.getElementById("newspaper").classList.remove("show")
  })
  
  document.querySelectorAll(".sauce_list li img").forEach(sauceItem => {
    sauceItem.addEventListener("click", () => {
      const sauceType = sauceItem.classList.contains("tomato") ? "tomato" : "cream";
      pizza.setBase(sauceType);
      updateUISelection(".sauce_list li img", sauceItem);
    });
  });

  document.querySelectorAll(".ingredients_list li img").forEach(ingredientItem => {
    ingredientItem.addEventListener("click", () => {
      const ingredientType = Object.keys(INGREDIENTS_CONFIG).find(type =>
        ingredientItem.classList.contains(type)
      );
      if (ingredientType) {
        pizza.selectTool(ingredientType);
        updateUISelection(".ingredients_list li img", ingredientItem);
      }
    });
  });

  document.querySelectorAll(".recipe_list li").forEach(recipeItem => {
    recipeItem.addEventListener("click", () => {
      const recipeName = recipeItem.dataset.recipe;
      handleRecipeSelection(recipeName);
      updateUISelection(".recipe_list li", recipeItem);
    });
  });
  
  // Bouton de cuisson
  const cookButton = document.getElementById("cook_btn");
  if (cookButton) {
    cookButton.addEventListener("click", () => {
      pizza && pizza.cook();
    });
  }
  
  const cookViewButton = document.getElementById("cook_view_btn");
  cookViewButton.addEventListener("click", () => {
    showCookView();
    securityWindow.close();
  });
  
  const computerViewButton = document.getElementById("computer_view_btn");
  computerViewButton.addEventListener("click", () => {
    showComputerView();
  });
}

function updateUISelection(selector, selectedItem) {
  document.querySelectorAll(selector).forEach(el => 
    el.classList.remove("selected")
  );
  selectedItem.classList.add("selected");
}