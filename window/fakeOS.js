
// Classe principale du système
class FakeOS {
  constructor() {
    this.fileSystem = new FileSystem();
    this.iconManager = new IconManager(this.fileSystem);
    this.windowManager = new WindowManager();
    this.isVisible = false;
    
    // Initialiser avec des fichiers de test
    this.initializeFileSystem();
  }
  
  show(){
    this.isVisible = true;
    pizza.hideTools();
    document.querySelector(".pizza_builder").classList.remove("cook_view")
    document.querySelector(".pizza_builder").classList.add("computer_view")
  }
  hide(){
    this.isVisible = false;
    pizza.showTools();
    document.querySelector(".pizza_builder").classList.add("cook_view")
    document.querySelector(".pizza_builder").classList.remove("computer_view")
  }

  initializeFileSystem() {
    // Exemple de structure
    this.fileSystem.addItem('crypto', {
      type: FileType.DOCUMENT,
      name: 'crypto',
      children: {}
    });
    
    this.fileSystem.addItem('cam', {
      type: FileType.DOCUMENT,
      name: 'cam',
      children: {}
    });
    
    this.fileSystem.addItem('serment.txt', {
      type: FileType.TEXT,
      name: 'serment.txt',
      content: "Comme cette carte qui brule,\r\nQue mon ame aille brulée en enfer\r\nsi je trahis le serment d'omerta"
    });
  
    this.fileSystem.addItem('supect.jpg', {
      type: FileType.IMAGE,
      name: 'supect.jpg',
      window: {w: 232, h: 234},
      content: (buffer) => {
        buffer.image(assets.moman, 0, 0, 232, 234 )
      }
    });
    
    this.fileSystem.addItem('missing.jpg', {
      type: FileType.IMAGE,
      name: 'missing.jpg',
      window: {w: 384},
      content: (buffer) => {
        buffer.image(assets.jungo, 0, 0, 384, 138 )
      }
    });
    
    this.fileSystem.addItem('profil_picture.jpg', {
      type: FileType.IMAGE,
      name: 'profil_picture.jpg',
      window: {w: 300, h: 300},
      content: (buffer) => {
        buffer.image(assets.profil, 0, 0, 300, 300 )
      }
    });   
    
    // Mettre à jour l'affichage des icônes
    this.iconManager.layoutIcons(this.fileSystem.root.children, 20, 20);
  }

  // Gestionnaire de contenu selon le type
  createContentCallback(item) {
    return (buffer) => {
      buffer.background(51);
      
      switch(item.type) {
        case FileType.TEXT:
          buffer.background(255);
          
          buffer.fill(0);
          buffer.textSize(14);
          buffer.text(item.content, 10, 20);
          break;
          
        case FileType.FOLDER:
          // Créer une vue de navigateur de fichiers
          buffer.fill(255);
          let y = 10;
          Object.values(item.children).forEach(child => {
            const icon = this.iconManager.iconImages[child.type] || this.iconManager.iconImages[FileType.TEXT];
            buffer.image(icon, 10, y, 20, 20);
            buffer.text(child.name, 40, y + 15);
            y += 30;
          });
          break;
          
        case FileType.IMAGE:
          item.content(buffer)
          break;
      }
    };
  }

  
   mousePressed() {
    // Vérifier si le clic a touché une fenêtre
    this.windowManager.handleMouse();

    // Si une fenêtre est active, ne pas interagir avec les icônes du bureau
    if (this.windowManager.activeWindow) return;

    const clickedItem = this.iconManager.handleClick(mouseX, mouseY);
    if (clickedItem) {
      const newWindow = this.windowManager.createWindow(
        random(200, 300),
        CUSTOMER_SECTION_HEIGHT + 50 + random(10, 20),
        clickedItem?.window?.w || 400,
        clickedItem?.window?.h || 300,
        this.createContentCallback(clickedItem),
        clickedItem.name,
        clickedItem.name === "cam"
      );

      if (!newWindow) {
        console.log("Cette fenêtre est déjà ouverte");
      }
    }
  }

  mouseDragged() {
    this.windowManager.handleMouse();
  }

  mouseReleased() {
    this.windowManager.handleMouse();
  }

  draw() {
    push()
    fill(0)
    rect(96, CUSTOMER_SECTION_HEIGHT + 46, CANVAS_WIDTH - 180, PIZZA_SECTION_HEIGHT - 100);
    this.iconManager.display();
    this.windowManager.display();
    //image(assets.computer, 0, 0, CANVAS_WIDTH, PIZZA_SECTION_HEIGHT);
    pop();
  }
}