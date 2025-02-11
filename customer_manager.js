// Gestionnaire du client
class CustomerManager {
  constructor(canvasWidth, canvasHeight) {
    this.customer = null;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.spawnInterval = 1500; // 1.5 secondes entre chaque client
    this.lastSpawnTime = 0;
  }

  update() {
    // Spawn de nouveaux clients
    if (millis() - this.lastSpawnTime > this.spawnInterval && 
        this.customer === null) {
      this.spawnCustomer();
      this.lastSpawnTime = millis();
      this.spawnInterval = random() * 3000 + 1500;
    }
    
    if(this.customer){
       this.customer.update();
      // Suppression des clients partis
      if (this.customer.state === 'leaving' && 
          this.isCustomerOffScreen(this.customer)) {
        this.customer = null;
      }
    }
   
  }

  draw() {
    if(this.customer){
      this.customer.draw();
    }
  }

  spawnCustomer() {
    console.log("spawnCustomer")
    const customer = new Customer();
    
    this.customer = customer;
    return customer;
  }

  isCustomerOffScreen(customer) {
    return customer.position.x >= this.canvasWidth + 200;
  }

  handlePizzaDelivery() {
    if (this.customer && this.customer.state === 'waiting') {
      const satisfactionLevel = this.customer.evaluatePizza();
      const tip = this.customer.calculateTip();
      this.customer.setState('eating');
      pizza.animatePizzaPickup();
      recipeCard.populatePrices(PIZZA_RECIPES[this.customer.order.recipeId].price.toFixed(2) * satisfactionLevel / 100, tip);
      
      shellGame.state.moneyBalance += PIZZA_RECIPES[this.customer.order.recipeId].price.toFixed(2) * satisfactionLevel / 100 + tip;
      
      // Après un délai, faire partir le client
      setTimeout(() => {
        this.customer.setState('leaving');
        this.customer.showSpeechBubble("Merci, bonne journée !");
      }, 2000);
      
      setTimeout(() => {
        recipeCard.hide();
      }, 3000)
    }
  }
}
