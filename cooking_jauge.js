class CookingGauge {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.cursorPosition = 0;
    this.speed = 0.007; // Vitesse de déplacement du curseur
    this.isActive = false;
    this.isVisible = false;
    this.result = null; // 'perfect', 'overcooked', 'undercooked'
    
    this.zones = {
      undercooked: [0, 0.7],
      perfect: [0.7, 0.8],
      overcooked: [0.8, 1]
    };
    
    this.colors = {
      undercooked: color(255, 255, 255),
      perfect: color(50, 205, 50),
      overcooked: color(214, 40, 40),
      cursor: color(0, 0, 0)
    };
  }

  start() {
    this.isActive = true;
    this.isVisible = true;
    this.cursorPosition = 0;
    this.result = null;
    document.getElementById("cook_btn").classList.add("hide");
  }

  stop() {
    this.isActive = false;
    const position = this.cursorPosition;
    if (position >= this.zones.perfect[0] && position <= this.zones.perfect[1]) {
      this.result = 'perfect';
    } else if (position < this.zones.perfect[0]) {
      this.result = 'undercooked';
    } else {
      this.result = 'overcooked';
    }
    pizza.isCooking = false;
    pizza.isCooked = true;
    return this.result;
  }
  
  hide(){
    this.isVisible = false;
  }

  update() {
    if (this.isActive) {
      this.cursorPosition += this.speed;
      if (this.cursorPosition >= 1) {
        this.handleCookingClick();
      }
    }
  }

  draw() {
    push();
    noStroke();
    
    fill(0);
    rect(this.x - 3, 
         this.y - 3, 
         this.width + 6, 
         this.height + 6);
         
    fill(this.colors.undercooked);
    rect(this.x + (this.width * this.zones.undercooked[0]), 
         this.y, 
         this.width * (this.zones.undercooked[1] - this.zones.undercooked[0]), 
         this.height);
         
    fill(this.colors.perfect);
    rect(this.x + (this.width * this.zones.perfect[0]), 
         this.y, 
         this.width * (this.zones.perfect[1] - this.zones.perfect[0]), 
         this.height);
         
    fill(this.colors.overcooked);
    rect(this.x + (this.width * this.zones.overcooked[0]), 
         this.y, 
         this.width * (this.zones.overcooked[1] - this.zones.overcooked[0]), 
         this.height);
    
    if (this.isActive || this.result) {
      const cursorX = this.x + (this.width * this.cursorPosition);
      image(assets.cursor_fire, cursorX - 15, this.y - 50, 30, 55.5)
    }
    
    pop();
  }
  
   //gére le clic pendant la cuisson
  handleCookingClick() {
    if (this.isActive) {
      const cook_status = this.stop();
      
      if(cook_status === "undercooked"){
        customer.setState('leaving');
        customer.showSpeechBubble("Pas assez cuit, je vais ailleurs !");
        recipeCard.hide();
        cookingGauge.hide();
      } else if(cook_status === "overcooked"){
        customer.setState('leaving');
        customer.showSpeechBubble("Trop cuit, je vais ailleurs !");
        recipeCard.hide();
        cookingGauge.hide();
      } else {
        customer.handlePizzaDelivery();
        cookingGauge.hide();
      }
    }
    return 1;
  }
}