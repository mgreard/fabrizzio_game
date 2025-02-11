
class WindowsWindow {
  constructor(x, y, w, h, contentCallback, constraints = null) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.title = "";
    this.contentCallback = contentCallback;
    this.padding = 10;
    
    this.sourceBuffer = createGraphics(w - this.padding * 2, h - 30 - this.padding);
    this.contentCanvas = createGraphics(w - this.padding * 2, h - 30 - this.padding, WEBGL);
    this.securityShader = this.contentCanvas.createShader(vertexShader, fragmentShader);
    
    this.windowBg = loadImage('assets/images/window.png');
    
    // Définition de la zone du bouton de fermeture
    this.closeButton = {
      x: w - 30,  // Position relative à la fenêtre
      y: 5,       // Position relative à la fenêtre
      width: 20,  // Largeur de la zone cliquable
      height: 20  // Hauteur de la zone cliquable
    };
    
    
    // Ajout des contraintes de déplacement
    this.constraints = constraints || {
      x: 0,
      y: 0,
      width: Number.MAX_SAFE_INTEGER,
      height: Number.MAX_SAFE_INTEGER
    };
    
    
    // État de la fenêtre
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    
    this.onClickCallback = null;
    this.onCloseCallback = null;
    this.isVisible = false;
  }

  setOnClick(callback) {
    this.onClickCallback = callback;
  }
  
  // Définir ou mettre à jour les contraintes
  setConstraints(constraints) {
    this.constraints = constraints;
  }
  
  // Méthode pour contraindre la position de la fenêtre
  constrainPosition(newX, newY) {
    const minX = this.constraints.x;
    const maxX = this.constraints.x + this.constraints.width - this.w;
    const minY = this.constraints.y;
    const maxY = this.constraints.y + this.constraints.height - this.h;
    
    return {
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    };
  }
  
  // Mise à jour du contenu
  updateContent() {
    this.sourceBuffer.clear();
    if (this.contentCallback) {
      this.contentCallback(this.sourceBuffer);
    }
  
  }

  // Nouvelle méthode pour définir le callback de fermeture
  setOnClose(callback) {
    this.onCloseCallback = callback;
  }
  
  // Vérifier si un point est dans la zone du bouton de fermeture
  isOverCloseButton(mx, my) {
    const relativeX = mx - this.x;
    const relativeY = my - this.y;
    return (
      relativeX >= this.closeButton.x &&
      relativeX <= this.closeButton.x + this.closeButton.width &&
      relativeY >= this.closeButton.y &&
      relativeY <= this.closeButton.y + this.closeButton.height
    );
  }

  close() {
    this.isVisible = false;
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  show() {
    this.isVisible = true;
  }
  
  // Gestion du drag & drop
  mousePressed(mx, my) {
    if (!this.isVisible) return;

    // Vérifier d'abord si on clique sur le bouton de fermeture
    if (this.isOverCloseButton(mx, my)) {
      this.close();
      return;
    }
    
    if (mx > this.x && mx < this.x + this.w &&
        my > this.y && my < this.y + 30) {
      this.isDragging = true;
      this.dragOffsetX = mx - this.x;
      this.dragOffsetY = my - this.y;
    }

    if (this.onClickCallback && !this.isDragging) {
      if (mx > this.x && mx < this.x + this.w &&
          my > this.y && my < this.y + this.h) {
        this.onClickCallback();
      }
    }
  }

  mouseDragged(mx, my) {
    if (!this.isVisible) return;
    
    if (this.isDragging) {
      const newPosition = this.constrainPosition(
        mx - this.dragOffsetX,
        my - this.dragOffsetY
      );
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }

  mouseReleased() {
    this.isDragging = false;
  }
  
  setTitle(title){
    this.title = title;
  }

 display() {
    if (!this.isVisible) return;
    
    push();
    translate(this.x + this.w/2, this.y + this.h/2);
    translate(-this.w/2, -this.h/2);
    
    // Fond de la fenêtre
    image(this.windowBg, 0, 0, this.w, this.h);
    
    // Optionnel : dessiner une surbrillance quand la souris est sur le bouton de fermeture
    if (this.isOverCloseButton(mouseX - this.x, mouseY - this.y)) {
      push();
      noFill();
      stroke(255, 0, 0, 100);
      rect(this.closeButton.x, this.closeButton.y, 
           this.closeButton.width, this.closeButton.height);
      pop();
    }
    
    // Titre
    fill(255);
    textSize(12);
    textAlign(LEFT, CENTER);
    text(this.title, 10, 12);
    
    // Appliquer le shader
    this.contentCanvas.shader(this.securityShader);
    
    // Passer les uniformes nécessaires
    this.securityShader.setUniform('u_resolution', [this.contentCanvas.width, this.contentCanvas.height]);
    this.securityShader.setUniform('u_time', millis() / 1000.0);
    this.securityShader.setUniform('tex0', this.sourceBuffer);
    
    // Dessiner un rectangle plein écran pour appliquer le shader
    this.contentCanvas.rect(-this.contentCanvas.width/2, -this.contentCanvas.height/2, 
                           this.contentCanvas.width, this.contentCanvas.height);
    
    // Afficher le résultat final
    image(this.contentCanvas, this.padding, 30);
    pop();
  }
}