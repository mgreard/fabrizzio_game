class Customer {
  constructor() {
    
    // État du client
    this.state = 'walking_in'; // walking_in, ordering, waiting, eating, leaving
    this.patience = random() * 100 + 100; // Niveau de patience sur 100
    this.satisfactionLevel = 100; // Niveau de satisfaction sur 100
    
    // Position et mouvement
    this.position = { x: -100, y: CUSTOMER_SECTION_HEIGHT };
    this.targetPosition = { x: 0, y: 0 };
    this.speed = 2;
    this.offsetY = 11;
    
    // Commande
    this.order = {
      recipeId: null,
      orderTime: null,
      maxWaitingTime: 20, // en secondes
      tip: 0
    };
    
    // Bulle de dialogue
    this.speechBubble = {
      text: "",
      visible: false,
      duration: 3000, // durée d'affichage en ms
      timeout: null
    };
    
    // Animation
    this.sprite = null;
    this.currentAnimation = 'idle';
    this.setState('walking_in');
    
  }

  // Gestion de l'état
  setState(newState) {
    this.state = newState;
    this.updateAnimation();
    
    // Actions spécifiques selon l'état
    switch(newState) {
      case 'walking_in':
        this.moveTo(200, CUSTOMER_SECTION_HEIGHT)
        setTimeout(() => {
          this.setState('ordering');
        }, 2000)
        break;
      case 'ordering':
        this.generateOrder();
        this.setState('waiting');
        break;
      case 'waiting':
        this.startWaitingTimer();
        break;
      case 'eating':
        cookingGauge.hide();
        break;
      case 'leaving':
        this.moveTo(1500, CUSTOMER_SECTION_HEIGHT)
        cookingGauge.hide();
        break;
    }
  }

  // Gestion de la commande
  generateOrder() {
    const recipes = Object.keys(PIZZA_RECIPES);
    this.order.recipeId = recipes[Math.floor(Math.random() * recipes.length)];
    this.order.orderTime = Date.now();

    // Peupler la carte de recette
    recipeCard.populateRecipe(PIZZA_RECIPES[this.order.recipeId]);
    recipeCard.show();

    // Afficher la bulle
    this.showSpeechBubble(`Je voudrais une ${PIZZA_RECIPES[this.order.recipeId].name}, s'il vous plaît !`, null);
    document.getElementById("cook_btn").classList.remove("hide");
    cookingGauge.hide();
    
    pizza = new Pizza(assets, CANVAS_WIDTH, CANVAS_HEIGHT);
    pizza.animatePizzaAddition()
  }
  
  startWaitingTimer() {
    
  }

  // Évaluation de la pizza servie
  evaluatePizza() {
    const validation = PizzaValidator.validateAgainstRecipe(pizza, this.order.recipeId);
    
    if (validation.isValid) {
      this.satisfactionLevel = 100 - (validation.warnings.length * 10);
      this.showSpeechBubble("Délicieux !");
    } else {
      this.satisfactionLevel = Math.max(0, 100 - (validation.errors.length * 20));
      this.showSpeechBubble("Hmm... Ce n'est pas exactement ce que j'avais commandé...");
    }
    return this.satisfactionLevel;
  }

  // Gestion de la patience
  updatePatience() {
    if (this.state === 'waiting') {
      const waitingTime = (Date.now() - this.order.orderTime) / 1000;
      this.patience = Math.max(0, 100 - (waitingTime / this.order.maxWaitingTime) * 100);
      
      if (this.patience <= 30) {
        this.showSpeechBubble("J'attends depuis un moment...");
      }
      
      if (this.patience <= 0) {
        this.setState('leaving');
        this.showSpeechBubble("Tant pis, je vais ailleurs !");
        recipeCard.hide();
      }
    }
  }
  
  

  // Calcul du pourboire
  calculateTip() {
    const baseAmount = 5; // Pourboire de base en euros
    const satisfactionMultiplier = this.satisfactionLevel / 100;
    const patienceMultiplier = this.patience / 100;
    
    
    this.order.tip = Math.round(baseAmount * satisfactionMultiplier * patienceMultiplier * 100) / 100;
    return this.order.tip;
  }

  // Gestion des déplacements
  moveTo(x, y) {
    this.targetPosition = { x, y };
  }

  update() {
    // Mise à jour de la position
    if (this.position.x !== this.targetPosition.x || this.position.y !== this.targetPosition.y) {
      const dx = this.targetPosition.x - this.position.x;
      const dy = this.targetPosition.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > this.speed) {
        this.position.x += (dx / distance) * this.speed;
        this.position.y += (dy / distance) * this.speed;
      } else {
        this.position = {...this.targetPosition};
      }
    }

    // Mise à jour de la patience
    this.updatePatience();
  }

  // Gestion de la bulle de dialogue
   showSpeechBubble(text, duration = 3000) {
    // Ne mettre à jour que si le texte est différent
    if (this.speechBubble.text !== text) {
      clearTimeout(this.speechBubble.timeout);
      
      this.speechBubble.text = text;
      this.speechBubble.visible = true;
           
      if(duration) {
        this.speechBubble.timeout = setTimeout(() => {
          this.speechBubble.visible = false;
        }, duration);
      }
    }
  }

  // Gestion des animations
  updateAnimation() {
    switch(this.state) {
      case 'walking_in':
        this.currentAnimation = 'walking';
        break;
      case 'ordering':
        this.currentAnimation = 'talking';
        break;
      case 'waiting':
        this.currentAnimation = 'idle';
        break;
      case 'eating':
        this.currentAnimation = 'eating';
        break;
      case 'leaving':
        this.currentAnimation = 'walking';
        break;
    }
  }
  
  draw() {
    const clientWidth = 126.5;
    const clientHeight = 190.5;
    
    push(); // Sauvegarde le contexte de transformation
    
    translate(this.position.x, height - this.position.y - this.offsetY - clientHeight);
    
    // Animation de "bounce"
    let bounceHeight = sin(frameCount * 0.1) * 2;
    translate(0, bounceHeight);
    
    // Corps du client
    image(assets.customers[0], 0, 0, clientWidth, clientHeight);
    
    if(this.state === "waiting"){
      this.drawPatienceBar(clientWidth, clientHeight);
    }
    this.drawSpeechBubble(clientWidth);
    
    pop(); // Restaure le contexte de transformation
  }
  
  drawPatienceBar(clientWidth, clientHeight) {
    const patienceBarWidth = 50;
    const patienceBarHeight = 10;
    const patienceBarY = -patienceBarHeight/2;

    // Fond de la jauge
    fill(68);
    rect(clientWidth/2 - patienceBarWidth/2, patienceBarY, patienceBarWidth, patienceBarHeight);

    // Niveau de patience
    let patienceColor;
    if (this.patience > 70) patienceColor = color('#4CAF50');
    else if (this.patience > 30) patienceColor = color('#FFC107');
    else patienceColor = color('#F44336');

    fill(patienceColor);
    rectMode(CORNER);
    rect(clientWidth/2 - patienceBarWidth/2, patienceBarY, 
         (patienceBarWidth * this.patience / 100), patienceBarHeight);
  }
  
  
  drawSpeechBubble(clientWidth) {
    if (this.speechBubble.visible && this.speechBubble.text) {

      const bubblePadding = 10;
      const maxBubbleWidth = 230;

      textSize(15);
      textFont('Arial');
      textAlign(CENTER, CENTER);

      let lines = [];
      let words = this.speechBubble.text.split(' ');
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        let testLine = currentLine + ' ' + words[i];
        if (textWidth(testLine) > maxBubbleWidth) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      const lineHeight = 16;
      const bubbleWidth = maxBubbleWidth;
      const bubbleHeight = lines.length * lineHeight + bubblePadding * 2;
      const bubbleX = clientWidth - bubbleWidth/2;
      const bubbleY = -bubbleHeight - 20;

      fill(255);
      noStroke();
      rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);
      
      triangle(clientWidth + 10, bubbleY + bubbleHeight,
               clientWidth - 0, bubbleY + bubbleHeight + 10,
               clientWidth - 10, bubbleY + bubbleHeight);

      fill(0);
      lines.forEach((line, index) => {
        text(line, clientWidth, bubbleY + bubblePadding + (index + 1) * lineHeight - 8);
      });
    }
  }
  
}