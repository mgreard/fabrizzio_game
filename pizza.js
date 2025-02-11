// Types d'animations possibles
const ANIMATION_TYPES = {
  ADDITION: 'addition',
  COOKING: 'cooking',
  PICKUP: 'pickup'
};

// Classe de base pour les animations
class Animation {
  constructor(duration) {
    this.startTime = null;
    this.duration = duration;
    this.isComplete = false;
  }

  start() {
    this.startTime = millis();
    this.isComplete = false;
  }

  getProgress() {
    if (!this.startTime) return 0;
    const elapsed = millis() - this.startTime;
    const progress = constrain(elapsed / this.duration, 0, 1);
    if (progress >= 1) this.isComplete = true;
    return progress;
  }
}

// Gestionnaire d'animations
class AnimationManager {
  constructor(pizza) {
    this.pizza = pizza;
    this.currentAnimation = null;
    this.animations = {
      [ANIMATION_TYPES.ADDITION]: this.createAdditionAnimation(),
      [ANIMATION_TYPES.COOKING]: this.createCookingAnimation(),
      [ANIMATION_TYPES.PICKUP]: this.createPickupAnimation()
    };
  }

  createAdditionAnimation() {
    const { canvasWidth, canvasHeight, offsetX, offsetY, pizzaDiameter, pizzaScale } = this.pizza;
    return {
      duration: 500,
      setup: () => {
        return {
          startPos: { x: canvasWidth/2 + offsetX, y: canvasHeight/2 + offsetY },
          endPos: { x: canvasWidth/2 + offsetX, y: canvasHeight/2 + offsetY },
          startScale: 0,
          endScale: 1
        };
      },
      update: (progress, params) => {
        this.pizza.pizzaX = lerp(params.startPos.x, params.endPos.x, progress);
        this.pizza.pizzaY = lerp(params.startPos.y, params.endPos.y, progress);
        this.pizza.pizzaScale = lerp(params.startScale, params.endScale, progress);
      }
    };
  }

  createCookingAnimation() {
    const { canvasWidth, canvasHeight, offsetX, offsetY, pizzaDiameter, pizzaScale } = this.pizza;
    return {
      duration: 2000,
      setup: () => {
        return {
          pizzaStart: { x: canvasWidth/2 + offsetX, y: canvasHeight/2 + offsetY },
          pizzaEnd: { x: canvasWidth/2 + offsetX, y: canvasHeight + offsetY + 70 },
          pelleStart: { x: canvasWidth/2 + offsetX, y: canvasHeight + pizzaDiameter },
          pelleEnd: { x: canvasWidth/2 + offsetX, y: canvasHeight/2 + offsetY + 70 },
          startScale: this.pizza.pizzaScale,
          endScale: 0.9
        };
      },
      update: (progress, params) => {
        if (progress > 0.5) {
          const p = map(progress, 0.5, 1, 0, 1);
          this.pizza.pizzaX = lerp(params.pizzaStart.x, params.pizzaEnd.x, p);
          this.pizza.pizzaY = lerp(params.pizzaStart.y, params.pizzaEnd.y, p);
          this.pizza.pelleX = lerp(params.pelleEnd.x, params.pelleStart.x, p);
          this.pizza.pelleY = lerp(params.pelleEnd.y, params.pelleStart.y, p);
        } else {
          const p = map(progress, 0, 0.5, 0, 1);
          this.pizza.pelleX = lerp(params.pelleStart.x, params.pelleEnd.x, p);
          this.pizza.pelleY = lerp(params.pelleStart.y, params.pelleEnd.y, p);
        }
        this.pizza.pizzaScale = lerp(params.startScale, params.endScale, progress);
      },
      complete: () => {
        this.pizza.isCooked = true;
        this.pizza.metadata.lastModified = Date.now();
      }
    };
  }

  createPickupAnimation() {
    const { canvasWidth, canvasHeight, offsetX, offsetY, pizzaDiameter, pizzaScale } = this.pizza;
  
    return {
      duration: 2000,
      setup: () => {
        return {
          pizzaStart: { x: canvasWidth/2 + offsetX, y: canvasHeight + pizzaDiameter },
          pizzaEnd: { x: canvasWidth/2 + offsetX, y: canvasHeight/2 + offsetY },
          boxStart: { x: canvasWidth/2 + offsetX, y: canvasHeight/2 - 200},
          boxEnd: { x: canvasWidth/2 + offsetX, y: canvasHeight/2 + offsetY + 20 },
          pelleStart: { x: canvasWidth/2 + offsetX, y: canvasHeight + pizzaDiameter },
          pelleEnd: { x: canvasWidth/2 + offsetX, y: canvasHeight/2 + offsetY + 70 },
          startScale: pizzaScale,
          endScale: 0.9
        };
      },
      update: (progress, params) => {
        if (progress < 0.5) {
          const p = map(progress, 0, 0.5, 0, 1);
          this.updatePickupFirstHalf(p, params);
        } else {
          const p = map(progress, 0.5, 1, 0, 1);
          this.updatePickupSecondHalf(p, params);
        }
        this.pizza.pizzaScale = lerp(params.startScale, params.endScale, progress);
      }
    };
  }

  updatePickupFirstHalf(progress, params) {
    this.pizza.pizzaX = lerp(params.pizzaStart.x, params.pizzaEnd.x, progress);
    this.pizza.pizzaY = lerp(params.pizzaStart.y, params.pizzaEnd.y, progress);
    this.pizza.pelleX = lerp(params.pelleStart.x, params.pelleEnd.x, progress);
    this.pizza.pelleY = lerp(params.pelleStart.y, params.pelleEnd.y, progress);
    this.pizza.boxX = lerp(params.boxStart.x, params.boxEnd.x, progress);
    this.pizza.boxY = lerp(params.boxStart.y, params.boxEnd.y, progress);
  }

  updatePickupSecondHalf(progress, params) {
    this.pizza.pizzaX = lerp(params.boxEnd.x, params.boxStart.x, progress);
    this.pizza.pizzaY = lerp(params.boxEnd.y, params.boxStart.y, progress);
    this.pizza.pelleX = lerp(params.pelleEnd.x, params.pelleStart.x, progress);
    this.pizza.pelleY = lerp(params.pelleEnd.y, params.pelleStart.y, progress);
    this.pizza.boxX = lerp(params.boxEnd.x, params.boxStart.x, progress);
    this.pizza.boxY = lerp(params.boxEnd.y, params.boxStart.y, progress);
  }

  startAnimation(type, callback) {
    const animationConfig = this.animations[type];
    if (!animationConfig) return;

    this.currentAnimation = {
      animation: new Animation(animationConfig.duration),
      config: animationConfig,
      params: animationConfig.setup(),
      type
    };

    this.currentAnimation.animation.start();
    this.pizza.isAnimating = true;
    this.pizza.animationType = type;
    this.callback = callback;
  }

  update() {
    if (!this.currentAnimation) return;

    const progress = this.currentAnimation.animation.getProgress();
    this.currentAnimation.config.update(progress, this.currentAnimation.params);

    if (this.currentAnimation.animation.isComplete) {
      if (this.currentAnimation.config.complete) {
        this.currentAnimation.config.complete();
      }
      this.pizza.isAnimating = false;
      this.currentAnimation = null;
      if(this.callback){
        this.callback();
      }
    }
  }
}


class Pizza {
  constructor(assets, canvasWidth, canvasHeight) {
    // Configuration du canvas
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.pizzaDiameter = 330;
    this.offsetX = 55;
    this.offsetY = 175;
    
    // Assets graphiques
    this.assets = assets;
    
    // État de la pizza
    this.base = {
      type: null,
      image: null
    };
    this.ingredients = [];
    this.isCooked = false;
    
    // Métadonnées
    this.metadata = {
      createdAt: Date.now(),
      lastModified: Date.now(),
      name: "Ma pizza"
    };

    // État de l'interaction
    this.currentTool = null;
    this.lastSprinkleTime = {};
    
    // Zone autorisée pour le placement
    this.allowedZone = {
      x: this.offsetX,
      y: this.offsetY,
      radius: this.pizzaDiameter/2 - 40
    };
    
    // --- Propriétés d'animation ---
    this.animationType = null;      // "addition" ou "pickup" par exemple

    // Position/échelle actuelles pour le dessin
    // (initialement, on place la pizza au centre, échelle 1)
    this.pizzaX = this.canvasWidth/2 + this.offsetX;
    this.pizzaY = this.canvasHeight/2 + this.offsetY;
    this.pizzaScale = 1;
    
    
    //pelle
    this.pelleX = this.canvasWidth/2 + this.offsetX;
    this.pelleY = this.canvasHeight/2 + this.offsetY;
    
    //box
    this.boxX = this.canvasWidth/2 + this.offsetX;
    this.boxY = this.canvasHeight/2 + this.offsetY;
    
    // Ajouter le gestionnaire d'animations
    this.animationManager = new AnimationManager(this);
    
  }

  // Méthodes de gestion d'état
  setBase(baseType) {
    if (!this.isCooked) {
      this.base.type = baseType;
      this.metadata.lastModified = Date.now();
    }
  }

  addIngredient(ingredientName, x, y, quantity = 1, customSize = null) {
    const config = INGREDIENTS_CONFIG[ingredientName];
    const variations = config.variations;
    const variationIndex = floor(random(variations.length));
    
    const size = customSize ? 
      { width: customSize, height: customSize } : 
      config.size;
    
    this.ingredients.push({
      name: ingredientName,
      type: config.type,
      position: { x, y },
      rotation: random(TWO_PI),
      quantity: quantity,
      variationIndex: variationIndex,
      size: size,
      addedAt: Date.now()
    });
    
    this.metadata.lastModified = Date.now();
  }

  removeLastIngredient() {
    if (this.ingredients.length > 0) {
      const removed = this.ingredients.pop();
      this.metadata.lastModified = Date.now();
      return removed;
    }
    return null;
  }

  cook() {
    if (!this.isCooked) {
      pizza.animatePizzaCooking();
    }
  }
  
  
   // Remplacer les méthodes d'animation existantes
  animatePizzaAddition() {
    this.animationManager.startAnimation(ANIMATION_TYPES.ADDITION);
  }

  animatePizzaCooking() {
    this.animationManager.startAnimation(ANIMATION_TYPES.COOKING, () => {
      if (!cookingGauge.isActive) {
        cookingGauge.start();
      }
    });
  }

  animatePizzaPickup() {
    this.animationManager.startAnimation(ANIMATION_TYPES.PICKUP);
  }

  updateAnimation() {
    this.animationManager.update();
  }

  // Méthodes de rendu
  draw() {
    
    if(this.animationType === 'cooking' || this.animationType === 'pickup'){
        this.drawPelle()
    }
    
    push();
    imageMode(CENTER);
    
    // On se déplace et on scale en fonction des valeurs animées
    translate(this.pizzaX, this.pizzaY);
    scale(this.pizzaScale);
    
    
    // Dessin de la pâte
    image(this.assets.bases.raw.dough, 0, 0, this.pizzaDiameter, this.pizzaDiameter);
    
    // Dessin de la base (sauce)
    if (this.base.type) {
      const baseImage = this.isCooked ? 
        this.assets.bases.cooked[this.base.type] :
        this.assets.bases.raw[this.base.type];
      image(baseImage, 0, 0, this.pizzaDiameter, this.pizzaDiameter);
    }
    
    // Dessin des ingrédients
    this.ingredients.forEach(ing => {
      this.drawIngredient(ing);
    });
    
    pop();
    
    if(this.animationType === 'pickup'){
        this.drawBox()
    }
    
  }

  drawIngredient(ing) {
    const imgArray = this.isCooked && this.assets.ingredients[ing.name].cooked ? 
      this.assets.ingredients[ing.name].cooked :
      this.assets.ingredients[ing.name].raw;
    const img = imgArray[ing.variationIndex];
    
    push();
    translate(ing.position.x - this.offsetX, ing.position.y - this.offsetY);
    rotate(ing.rotation);
    image(img, 0, 0, ing.size.width, ing.size.height);
    pop();
  }

  drawIngredientPreview(mouseX, mouseY) {
    if (this.currentTool && mouseX < this.canvasWidth && mouseY < this.canvasHeight) {
      push();
      tint(255, 127);
      imageMode(CENTER);
      const imgArray = this.assets.ingredients[this.currentTool].raw;
      const config = INGREDIENTS_CONFIG[this.currentTool];
      const img = imgArray[0];
      image(img, mouseX, mouseY, config.size.width, config.size.height);
      pop();
    }
  }
  
  drawPelle() {
    push();
    imageMode(CENTER);
    image(this.assets.pelle, this.pelleX, this.pelleY, 350, 500);
    pop();
  }
  
  drawBox(){
    push();
    imageMode(CENTER);
    image(this.assets.box, this.boxX, this.boxY, 340, 340);
    pop();
  }


  // Méthodes de validation de position
  isInAllowedZone(x, y) {
    const distance = dist(x, y, this.allowedZone.x, this.allowedZone.y);
    return distance <= this.allowedZone.radius;
  }

  isMouseOverPizza(mouseX, mouseY) {
    const d = dist(mouseX, mouseY, this.canvasWidth/2 + this.offsetX, this.canvasHeight/2 + this.offsetY);
    return d <= this.pizzaDiameter/2;
  }

  // Méthodes de gestion des interactions
  handleMousePressed(mouseX, mouseY) {
    if (this.currentTool && this.isMouseOverPizza(mouseX, mouseY)) {
      const relativeX = mouseX - this.canvasWidth/2;
      const relativeY = mouseY - this.canvasHeight/2;
      
      if (this.isInAllowedZone(relativeX, relativeY)) {
        this.addIngredient(this.currentTool, relativeX, relativeY);
      }
    }
  }

  handleMouseDragged(mouseX, mouseY) {
    if (!this.currentTool || !this.isMouseOverPizza(mouseX, mouseY)) return;

    const config = INGREDIENTS_CONFIG[this.currentTool];
    if (config.type !== 'sprinkle') return;

    const currentTime = millis();
    if (!this.lastSprinkleTime[this.currentTool]) {
      this.lastSprinkleTime[this.currentTool] = 0;
    }

    if (currentTime - this.lastSprinkleTime[this.currentTool] > (1000 / config.sprinkleConfig.rate)) {
      this.handleSprinkle(mouseX, mouseY, config.sprinkleConfig);
      this.lastSprinkleTime[this.currentTool] = currentTime;
    }
  }

  handleSprinkle(mouseX, mouseY, sprinkleConfig) {
    const relativeX = mouseX - this.canvasWidth/2;
    const relativeY = mouseY - this.canvasHeight/2;
    
    if (!this.isInAllowedZone(relativeX, relativeY)) return;

    const numParticles = floor(random(2, 4));
    for (let i = 0; i < numParticles; i++) {
      const angle = random(TWO_PI);
      const distance = random(sprinkleConfig.spreadRadius);
      const offsetX = cos(angle) * distance;
      const offsetY = sin(angle) * distance;
      
      const newX = relativeX + offsetX;
      const newY = relativeY + offsetY;
      
      if (this.isInAllowedZone(newX, newY)) {
        const size = random(sprinkleConfig.minSize, sprinkleConfig.maxSize);
        this.addIngredient(
          this.currentTool, 
          newX, 
          newY, 
          sprinkleConfig.density, 
          size
        );
      }
    }
  }

  // Méthodes utilitaires
  selectTool(toolName) {
    this.currentTool = this.currentTool !== toolName ? toolName : null;
  }

  getStats() {
    const ingredientCounts = {};
    this.ingredients.forEach(ing => {
      ingredientCounts[ing.name] = (ingredientCounts[ing.name] || 0) + 1;
    });

    return {
      totalIngredients: this.ingredients.length,
      ingredientCounts,
      base: this.base.type,
      isCooked: this.isCooked
    };
  }

  serialize() {
    return {
      base: this.base,
      ingredients: this.ingredients,
      isCooked: this.isCooked,
      metadata: this.metadata
    };
  }

  static deserialize(data, assets, canvasWidth, canvasHeight) {
    const pizza = new Pizza(assets, canvasWidth, canvasHeight);
    pizza.base = data.base;
    pizza.ingredients = data.ingredients;
    pizza.isCooked = data.isCooked;
    pizza.metadata = data.metadata;
    return pizza;
  }
}