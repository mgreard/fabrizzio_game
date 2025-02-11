
// Configuration des ingrédients avec tailles et paramètres spécifiques
const INGREDIENTS_CONFIG = {
  basilic: { 
    variations: ['Basilic1.png', 'Basilic2.png', 'Basilic3.png'],
    type: 'solid',
    size: { width: 40, height: 40 },
    sprinkleConfig: {
      spreadRadius: 25,    // Rayon d'étalement
      rate: 2,            // Nombre maximum d'éléments par seconde
      density: 0.3,       // Densité de l'effet de saupoudrage (0-1)
      minSize: 30,        // Taille minimum pour la variation aléatoire
      maxSize: 40         // Taille maximum pour la variation aléatoire
    }
  },
  goat: { 
    variations: ['Cheese1.png'],
    type: 'solid',
    size: { width: 90, height: 90 },
  },
  cheddar: { 
    variations: ['Cheese_raw.png'], 
    variations_cooked: ['Cheese_base.png'],
    type: 'solid',
    size: { width: 200, height: 200 }
  },
  ham: { 
    variations: ['Ham1.png', 'Ham2.png', 'Ham3.png'],
    type: 'solid',
    size: { width: 80, height: 80 }
  },
  mozza: { 
    variations: ['Mozza1.png', 'Mozza2.png', 'Mozza3.png'],
    type: 'solid',
    size: { width: 90, height: 90 }
  },
  mushroom: { 
    variations: ['Mushroom1.png'],
    type: 'solid',
    size: { width: 60, height: 60 }
  },
  onion: { 
    variations: ['Oignon1.png', 'Oignon2.png', 'Oignon3.png'],
    type: 'solid',
    size: { width: 90, height: 90 }
  },
  olive: { 
    variations: ['Olive1.png'],
    type: 'solid',
    size: { width: 30, height: 30 }
  },
  pepper: { 
    variations: ['Poivron1.png'],
    type: 'solid',
    size: { width: 90, height: 90 }
  },
  tomato: { 
    variations: ['Tomato1.png', 'Tomato2.png', 'Tomato3.png', 'Tomato4.png'],
    type: 'solid',
    size: { width: 90, height: 90 }
  },
  egg: { 
    variations: ['egg1.png'],
    type: 'solid',
    size: { width: 150, height: 150 }
  }
};

const PIZZA_RECIPES = {
  margherita: {
    price: 12,
    name: "Margherita",
    description: "La classique italienne",
    base: "tomato",
    ingredients: [
      { name: "mozza", quantity: 5 },
      { name: "basilic", quantity: 3 }
    ],
    maxDeviation: 0.2, // 20% de tolérance sur les quantités
  },
  
  troisFromages: {
    price: 18,
    name: "3 Fromages",
    description: "Pour les amateurs de fromage",
    base: "cream",
    ingredients: [
      { name: "mozza", quantity: 3 },
      { name: "goat", quantity: 2 },
      { name: "cheddar", quantity: 1 }
    ],
    maxDeviation: 0.15
  },
  
  vegetarienne: {
    price: 17,
    name: "Végétarienne",
    description: "Fraîche et légère",
    base: "tomato",
    ingredients: [
      { name: "mushroom", quantity: 4 },
      { name: "pepper", quantity: 3 },
      { name: "olive", quantity: 6 },
      { name: "onion", quantity: 3 }
    ],
    maxDeviation: 0.25
  },
  
  royale: {
    price: 20,
    name: "Royale",
    description: "La pizza gourmande",
    base: "tomato",
    ingredients: [
      { name: "ham", quantity: 4 },
      { name: "mushroom", quantity: 4 },
      { name: "egg", quantity: 1 },
      { name: "olive", quantity: 5 }
    ],
    maxDeviation: 0.2
  },
  
  capricciosa: {
    price: 19,
    name: "Capricciosa",
    description: "Un classique italien",
    base: "tomato",
    ingredients: [
      { name: "ham", quantity: 3 },
      { name: "mushroom", quantity: 3 },
      { name: "mozza", quantity: 3 },
      { name: "olive", quantity: 4 }
    ],
    maxDeviation: 0.2
  },
  
  napolitaine: {
    price: 16,
    name: "Napolitaine",
    description: "la tradition napolitaine",
    base: "tomato",
    ingredients: [
      { name: "mozza", quantity: 4 },
      { name: "olive", quantity: 6 },
      { name: "basilic", quantity: 4 },
      { name: "onion", quantity: 2 }
    ],
    maxDeviation: 0.2
  },
  
  montagnarde: {
    price: 21,
    name: "Montagnarde",
    description: "Une pizza réconfortante",
    base: "cream",
    ingredients: [
      { name: "cheddar", quantity: 2 },
      { name: "goat", quantity: 2 },
      { name: "mozza", quantity: 2 },
      { name: "onion", quantity: 2 },
      { name: "egg", quantity: 1 }
    ],
    maxDeviation: 0.25
  },
  
  tomato: {
    price: 15,
    name: "Tomato Rounds",
    description: "Une pizza légère mettant en valeur les rondelles de tomate",
    base: "cream",
    ingredients: [
      { name: "tomato", quantity: 4 },
      { name: "mozza", quantity: 3 },
      { name: "basilic", quantity: 3 },
      { name: "onion", quantity: 2 }
    ],
    maxDeviation: 0.2
  }
};