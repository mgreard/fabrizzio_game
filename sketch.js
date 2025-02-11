// Configuration globale
const CANVAS_WIDTH = 884;
let customerManager;
let CUSTOMER_SECTION_HEIGHT = 348.5;
let PIZZA_SECTION_HEIGHT = 371.28;
const CANVAS_HEIGHT = 719.78 ;

// Assets globaux
let assets = {
  bases: {
    raw: {
      dough: null,
      tomato: null,
      cream: null
    },
    cooked: {
      tomato: null,
      cream: null
    }
  },
  ingredients: {},
  pelle: null,
  box: null,
  fire: null,
  grotti: null,
  bg_desk: null,
  bg_customer: null,
  customers: {},
  cursor_fire: null
};

// Instance de jeu
let pizza = null;

// État de l'interface
let gameUI = {
  selectedRecipe: null,
  recipeProgress: null
};

let recipeCard;
let shellGame;
let cookingGauge;
let grottiView = false;


// Préchargement des assets
function preload() {
  assets.pelle = loadImage('assets/images/pelle.png');
  assets.box = loadImage('assets/images/pizza_box.png');
  assets.fire = createVideo('assets/images/fire.mp4');
  assets.fire.size(278, 152);
  assets.fire.volume(0);
  assets.fire.loop();
  assets.fire.hide(); 
  assets.grotti = createVideo('assets/grotti.mp4');
  assets.grotti.size(832 , 640);
  assets.grotti.volume(0);
  assets.grotti.hide();   
  assets.grotti.onended(() => {
    document.querySelector("body").classList.remove("grotti");
    grottiView = false;
    assets.grotti.stop()
  })
  assets.cursor_fire = loadImage('assets/images/cursor_fire.png');
  
  // Chargement des bases de pizza
  assets.bases.raw.dough = loadImage('assets/images/dough.png');
  assets.bases.raw.tomato = loadImage('assets/images/dough_tomato2_raw.png');
  assets.bases.raw.cream = loadImage('assets/images/dough_cream_raw.png');
  
  // Chargement des bases cuites
  assets.bases.cooked.tomato = loadImage('assets/images/dough_tomato2_cooked.png');
  assets.bases.cooked.cream = loadImage('assets/images/dough_cream_cooked.png');
  
  // Chargement des ingrédients
  for (let [ingredient, config] of Object.entries(INGREDIENTS_CONFIG)) {
    let assetsIngredients = {
      raw: config.variations.map(filename => loadImage(`assets/images/${filename}`)),
      cooked: null
    };
    if (config.variations_cooked) {
      assetsIngredients.cooked = config.variations_cooked.map(filename => 
        loadImage(`assets/images/${filename}`)
      );
    }
    assets.ingredients[ingredient] = assetsIngredients;
  }
  
  assets.bg_customer = loadImage('assets/images/bg_customer.png');
  assets.customers[0] = loadImage('assets/images/customer1.png');
  assets.customers[1] = loadImage('assets/images/customer2.png');
  assets.bg_desk = loadImage('assets/images/bg_desk.png');
}

// Initialisation
function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('canvas-container');
  
  
  // Initialisation du gestionnaire de clients
  customerManager = new CustomerManager(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  recipeCard = new RecipeCard(document.querySelector('.recipe-card'));
  cookingGauge = new CookingGauge(48, CANVAS_HEIGHT/2 + 70, 190, 16);
  
  setupUI();
  
  document.getElementById("main-loading").classList.add("hide");
  
  shellGame = new ShellGame();
  
  document.querySelector(".pizza_wrapper").addEventListener("click", () => {
    document.getElementById("newspaper").classList.remove("show")
  })
  
}

// Configuration de l'interface
function setupUI() {
  // Interface des sauces
  document.querySelectorAll(".sauce_list li img").forEach((sauceItem) => {
    sauceItem.addEventListener("click", () => {
      const sauceType = sauceItem.classList.contains("tomato") ? "tomato" : "cream";
      handleSauceSelection(sauceType);
      updateUISelection(".sauce_list li img", sauceItem);
    });
  });

  // Interface des ingrédients
  document.querySelectorAll(".ingredients_list li img").forEach((ingredientItem) => {
    ingredientItem.addEventListener("click", () => {
      const ingredientType = Object.keys(INGREDIENTS_CONFIG).find(type => 
        ingredientItem.classList.contains(type)
      );
      if (ingredientType) {
        handleIngredientSelection(ingredientType);
        updateUISelection(".ingredients_list li img", ingredientItem);
      }
    });
  });

  // Interface des recettes
  document.querySelectorAll(".recipe_list li").forEach((recipeItem) => {
    recipeItem.addEventListener("click", () => {
      const recipeName = recipeItem.dataset.recipe;
      handleRecipeSelection(recipeName);
      updateUISelection(".recipe_list li", recipeItem);
    });
  });

  // Boutons de contrôle
  setupControlButtons();
}

function setupControlButtons() {
  // Bouton de cuisson
  const cookButton = document.getElementById("cook_btn");
  if (cookButton) {
    cookButton.addEventListener("click", () => {
      pizza && pizza.cook();
    });
  }

  // Bouton annuler
  const undoButton = document.getElementById("undo_btn");
  if (undoButton) {
    undoButton.addEventListener("click", () => {
      pizza.removeLastIngredient();
    });
  }

  // Bouton reset
  const resetButton = document.getElementById("reset_btn");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      resetPizza();
    });
  }
  
  const cookViewButton = document.getElementById("cook_view_btn");
  cookViewButton.addEventListener("click", () => {
    showCookView();
  });
  
  const computerViewButton = document.getElementById("computer_view_btn");
  computerViewButton.addEventListener("click", () => {
    showShellView();
  });
}

// Boucle principale de dessin
function draw() {
  background("#1f3452");
  
  image(assets.bg_desk, 0, CUSTOMER_SECTION_HEIGHT, CANVAS_WIDTH, PIZZA_SECTION_HEIGHT);
  
  // Dessin de la pizza
  if(pizza){
    pizza.updateAnimation();
    pizza.draw();
  }
  
  
  drawFire()
  if(grottiView){
    drawGrotti()
  }
  
  image(assets.bg_customer, 0, 0, CANVAS_WIDTH, CUSTOMER_SECTION_HEIGHT);
  
  // Mise à jour et dessin du client
  customerManager.update();
  customerManager.draw();
  
  // Dessin de l'aperçu de l'ingrédient sélectionné
  if(pizza){
    pizza.drawIngredientPreview(mouseX, mouseY);
  }
  
  
  
  fill(0);
  rect(0, CUSTOMER_SECTION_HEIGHT - 4, CANVAS_WIDTH, 8)
  
  // Dessiner la jauge de cuisson si active
  if (cookingGauge.isVisible) {
    cookingGauge.update();
    cookingGauge.draw();
  }
  
}

function drawFire() {
  let imgFire = assets.fire.get();
  image(imgFire, 0, CUSTOMER_SECTION_HEIGHT + 2); 
}

function drawGrotti() {
  document.querySelector("body").classList.add("grotti")
  let imgGrotti = assets.grotti.get();
  image(imgGrotti, 0, CANVAS_HEIGHT - PIZZA_SECTION_HEIGHT - 100, CANVAS_WIDTH);

}


// Gestionnaires d'événements souris
function mousePressed() {
  if (cookingGauge && cookingGauge.isActive) {
    const satisfactionMultiplier = cookingGauge.handleCookingClick();
    // Tu peux utiliser ce multiplicateur pour ajuster la satisfaction du client
    return;
  }
  pizza && pizza.handleMousePressed(mouseX, mouseY);
}

function mouseDragged() {
  pizza && pizza.handleMouseDragged(mouseX, mouseY);
}

// Gestionnaires d'actions
function handleSauceSelection(sauceType) {
  pizza.setBase(sauceType);
}

function handleIngredientSelection(ingredientType) {
  pizza.selectTool(ingredientType);
}


function updateUISelection(selector, selectedItem) {
  document.querySelectorAll(selector).forEach(el => 
    el.classList.remove("selected")
  );
  selectedItem.classList.add("selected");
}

function updateRecipeUI(recipeName) {
  const recipe = PIZZA_RECIPES[recipeName];
  if (!recipe) return;

  // Mise à jour de l'affichage de la recette
  const recipeDisplay = document.getElementById('recipe-display');
  if (recipeDisplay) {
    recipeDisplay.innerHTML = `
      <h3>${recipe.name}</h3>
      <p>${recipe.description}</p>
      <ul>
        ${recipe.ingredients.map(ing => 
          `<li>${ing.quantity}x ${ing.name}</li>`
        ).join('')}
      </ul>
    `;
  }
}

// Gestion de la sauvegarde
function savePizza() {
  const saveData = {
    pizza: pizza.serialize(),
    selectedRecipe: gameUI.selectedRecipe
  };
  localStorage.setItem('savedPizzaGame', JSON.stringify(saveData));
}

function loadPizza() {
  const savedData = localStorage.getItem('savedPizzaGame');
  if (savedData) {
    const data = JSON.parse(savedData);
    pizza = Pizza.deserialize(data.pizza, assets, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (data.selectedRecipe) {
      handleRecipeSelection(data.selectedRecipe);
    }
  }
}

function resetPizza() {
  pizza = new Pizza(assets, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function showShellView(){
    document.querySelector(".pizza_builder").classList.remove("cook_view")
    document.querySelector(".pizza_builder").classList.add("computer_view")
}

function showCookView(){
  document.querySelector(".pizza_builder").classList.remove("computer_view")
  document.querySelector(".pizza_builder").classList.add("cook_view")
}


//News Paper Timer
let lastMouseActivity = Date.now();
let checkTimer;
let isActive = true;
const INACTIVITY_DELAY = 15000; // 20 secondes
const CHECK_INTERVAL = 1000; // Vérification toutes les secondes

function updateLastActivity() {
    lastMouseActivity = Date.now();
    document.getElementById("newspaper").classList.remove("show");
    isActive = true;
}

function checkInactivity() {
    const currentTime = Date.now();
    const inactiveTime = currentTime - lastMouseActivity;
    
    if (isActive && inactiveTime >= INACTIVITY_DELAY) {
        isActive = false;
        const newsSystem = new NewsSystem();
        const news = newsSystem.generateNews();
        document.getElementById("newspaper-text").innerHTML = news;
        document.getElementById("newspaper").classList.add("show")
    }
}

// Écouteurs d'événements pour mettre à jour l'horodatage
document.addEventListener('mousemove', updateLastActivity);
document.addEventListener('mousedown', updateLastActivity);

// Démarrer la vérification périodique
checkTimer = setInterval(checkInactivity, CHECK_INTERVAL);