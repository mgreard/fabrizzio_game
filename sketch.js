// Configuration globale
const CANVAS_WIDTH = 884;
let CUSTOMER_SECTION_HEIGHT = 348.5;
let PIZZA_SECTION_HEIGHT = 371.28;
const CANVAS_HEIGHT = 719.78 ;

// Assets globaux
let assets;

// Instance de jeu
let pizza;
let customer;
let recipeCard;
let shellGame;
let cookingGauge;
let securityWindow;

let grottiView = false;

// Préchargement des assets
function preload() {
  assets = loadAssets();
}

// Initialisation
function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('canvas-container');
  
  customer = new Customer();
  recipeCard = new RecipeCard(document.querySelector('.recipe-card'));
  cookingGauge = new CookingGauge(48, CANVAS_HEIGHT/2 + 70, 190, 16);
  shellGame = new ShellGame();
  os = new FakeOS();
  
  const securityCamConstraints = {x: 100, y: 397, width: 690, height: 255};
  securityWindow = new SecurityWindow(100, 397, 300, 230, securityCamConstraints);
  
  initEvents();
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
  customer.update();
  customer.draw();
  
  // Dessin de l'aperçu de l'ingrédient sélectionné
  if(pizza && customer?.order?.recipeId !== "hawaienne"){
    pizza.drawIngredientPreview(mouseX, mouseY);
  }
  
  fill(0);
  rect(0, CUSTOMER_SECTION_HEIGHT - 4, CANVAS_WIDTH, 8)
  
  // Dessiner la jauge de cuisson si active
  if (cookingGauge.isVisible) {
    cookingGauge.update();
    cookingGauge.draw();
  }
  
  if(securityWindow.isVisible){
    push()
    image(assets.security, 0, CUSTOMER_SECTION_HEIGHT + 10, CANVAS_WIDTH, PIZZA_SECTION_HEIGHT - 10);
    image(assets.computer, 0, CUSTOMER_SECTION_HEIGHT, CANVAS_WIDTH, PIZZA_SECTION_HEIGHT);
    pop()
    securityWindow.updateContent();
    securityWindow.display();
  }

  if(os.isVisible){
    os.draw();
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

function showShellView(){
    document.querySelector(".pizza_builder").classList.remove("cook_view")
    document.querySelector(".pizza_builder").classList.add("computer_view")
}

function showComputerView(){
  os.show();
}

function showCookView(){
  document.querySelector(".pizza_builder").classList.remove("computer_view")
  document.querySelector(".pizza_builder").classList.add("cook_view")
}