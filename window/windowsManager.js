class WindowManager {
  constructor() {
    this.windows = [];
    // Garder une trace des fenêtres ouvertes par leur titre
    this.openWindowTitles = new Set();
    // Ajouter une référence à la fenêtre active
    this.activeWindow = null;
  }

  createWindow(x, y, w, h, content, title, isCam = false) {
    if (this.openWindowTitles.has(title)) {
      const existingWindow = this.windows.find(w => w.title === title);
      if (existingWindow) {
        this.bringToFront(existingWindow);
      }
      return null;
    }

    let win;
    if(isCam){
      win = new SecurityWindow(x, y, w, h, content, {x: 100, y: CUSTOMER_SECTION_HEIGHT + 50 , width: width - 200, height: PIZZA_SECTION_HEIGHT});
    } else {
      win = new WindowsWindow(x, y, w, h, content, {x: 100, y: CUSTOMER_SECTION_HEIGHT + 50 , width: width - 200, height: PIZZA_SECTION_HEIGHT});
    }
    win.setTitle(title);
    this.openWindowTitles.add(title);
    
    win.setOnClose(() => {
      this.openWindowTitles.delete(title);
      this.windows = this.windows.filter(w => w !== win);
      if (this.activeWindow === win) {
        this.activeWindow = null;
      }
    });
    
    this.windows.push(win);
    win.show();
    this.bringToFront(win);
    return win;
  }

  bringToFront(window) {
    console.log(window, "window")
    this.windows = this.windows.filter(w => w !== window);
    this.windows.push(window);
    this.activeWindow = window;
  }

  handleMouse() {
    if (mouseIsPressed) {
      // Si on a une fenêtre active, on ne gère que celle-là
      if (this.activeWindow) {
        this.activeWindow.mouseDragged(mouseX, mouseY);
      } else {
        // Sinon, on cherche la fenêtre cliquée, de la plus haute à la plus basse
        for (let i = this.windows.length - 1; i >= 0; i--) {
          const win = this.windows[i];
          if (this.isMouseOverWindow(win)) {
            win.mousePressed(mouseX, mouseY);
            if (win.isDragging) {
              this.activeWindow = win;
              this.bringToFront(win);
            }
            break; // On sort dès qu'on a trouvé une fenêtre
          }
        }
      }
    } else {
      // Quand on relâche le clic
      if (this.activeWindow) {
        this.activeWindow.mouseReleased();
        this.activeWindow = null;
      }
      // Réinitialiser toutes les fenêtres par sécurité
      this.windows.forEach(win => win.mouseReleased());
    }
  }

  // Utilitaire pour vérifier si la souris est sur une fenêtre
  isMouseOverWindow(win) {
    if(!win) return false;
    return (mouseX > win.x && 
           mouseX < win.x + win.w && 
           mouseY > win.y && 
           mouseY < win.y + win.h) ? win : false;
  }

  display() {
    this.windows.forEach(win => {
      win.updateContent();
      win.display();
    });
  }
}