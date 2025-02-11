function loadAssets() {
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
    cursor_fire: null,
    computer: null,
    security: null,
    moman: null,
    jungo: null,
    profil: null,
  };

  assets.moman = loadImage("assets/images/Moman.png");
  assets.jungo = loadImage("assets/images/jungo.png");
  assets.profil = loadImage("assets/images/profil_picture.png");

  assets.pelle = loadImage('assets/images/pelle.png');
  assets.box = loadImage('assets/images/pizza_box.png');
  assets.security = loadImage('assets/images/security_bg.jpg');
  assets.cursor_fire = loadImage('assets/images/cursor_fire.png');
  assets.bg_customer = loadImage('assets/images/bg_customer.png');
  assets.customer = loadImage('assets/images/customer1.png');
  assets.bg_desk = loadImage('assets/images/bg_desk.png');
  assets.computer = loadImage('assets/images/computer.png');
  
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
  
  //load videos
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

  return assets;
}
