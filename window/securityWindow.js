// SecurityWindow.js
class SecurityWindow extends WindowsWindow {
  constructor(x, y, w, h, constraints) {
    // On passe les contraintes au constructeur parent
    super(x, y, w, h, null, constraints);
    
    // Initialisation des vidéos
    this.videos = [];
    this.selectedVideoIndex = -1;
    this.selectedVideo = null;
    
    // Charger les vidéos
    this.loadVideos();
    
    // Définir le callback de contenu
    this.contentCallback = (graphics) => {
      graphics.background(0);
      if (this.selectedVideo) {
        graphics.image(this.selectedVideo, 0, 0, graphics.width, graphics.height);
      }
    };
    
    // Configurer le click pour changer de vidéo
    this.setOnClick(() => this.nextVideo());
    
    // Sélectionner la première vidéo
    this.nextVideo();
  }
  
  loadVideos() {
    // Charger les 5 vidéos
    for (let i = 1; i <= 5; i++) {
      let vid = createVideo(`assets/videos/cam${i}.mp4`);
      vid.hide();
      this.videos.push(vid);
    }
  }
  
  show(){
    document.querySelector(".shell-container").classList.add("hide")
    recipeCard.hide();
    document.querySelector(".ingredients_lists").classList.add("hide");
    document.querySelector(".sauce_list").classList.add("hide");
    document.querySelector(".nav_items").classList.add("hide");
    super.show();
  }
  
  close(){
    document.querySelector(".shell-container").classList.remove("hide")
    recipeCard.show();
    document.querySelector(".ingredients_lists").classList.remove("hide");
    document.querySelector(".sauce_list").classList.remove("hide");
    document.querySelector(".nav_items").classList.remove("hide");
    super.close();
  }
  
  nextVideo() {
    this.selectedVideoIndex = this.selectedVideoIndex === this.videos.length - 1 ? 
      0 : this.selectedVideoIndex + 1;
    
    this.selectedVideo = this.videos[this.selectedVideoIndex];
    this.selectedVideo.loop();
    this.setTitle(`Security cam ${this.selectedVideoIndex + 1}`);
  }
}