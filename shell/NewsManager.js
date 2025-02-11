// Données pour la génération aléatoire
const newsData = {
  suspects: [
    "Fabbrizio Kaluzzo", '"Lil Curt"', "Octavio Sereno"
  ],
  victims: [
    "young students", "local residents", "tourists", "hikers", "photographers",
    "climbers", "joggers", "park visitors", "mountain bikers", "camping enthusiasts"
  ],
  locations: [
    "North Ridge", "Echo Point", "Shadow Valley", "Misty Peak", "Devil's Corner",
    "Sunset Overlook", "Eagle's Nest", "Windy Pass", "Crystal Cave entrance", "Old Lighthouse path"
  ],
  weather: [
    "heavy fog", "strong winds", "light rain", "complete darkness", "stormy conditions",
    "unusual mist", "clear skies", "gathering storm clouds", "freezing temperatures", "mysterious haze"
  ],
  events: [
    "mysterious disappearance", "unexplained fall", "suspicious accident",
    "strange incident", "mass vanishing", "tragic accident",
    "unsettling occurrence", "bizarre situation", "grim discovery",
    "dark happening", "supernatural occurrence", "unexplained phenomenon"
  ],
  times: [
    "early morning", "late evening", "midnight", 
    "afternoon", "late night", "early hours", "sunset", "sunrise"
  ],
  witnesses: [
    "local fisherman", "park ranger", "morning jogger", "elderly couple",
    "group of campers", "wildlife photographer", "maintenance worker",
    "lost tourist", "midnight patrol officer", "amateur astronomer"
  ],
  evidence: [
    "strange footprints", "unexplained lights", "mysterious sounds",
    "abandoned equipment", "cryptic messages", "unusual markings",
    "torn clothing", "broken cameras", "scrambled radio signals",
    "unexplained temperature drops"
  ],
  authorities: [
    "Local Police", "Coast Guard", "Park Rangers", "Search and Rescue Team",
    "Special Investigation Unit", "Emergency Response Team", "Marine Patrol",
    "Mountain Rescue Squad", "Detective Division", "Environmental Protection Agency"
  ],
  templates: [
    // Templates basiques
    "{suspect}, spotted near {location}, involved in a {event} during {time}. {authority} investigating after {evidence} discovered.",
    
    // Templates avec victimes multiples
    "Group of {count} {victims} missing after {event} at {location}. {suspect} seen in area during {time}. {authority} reports {evidence}.",
    
    // Templates avec conditions météo
    "{event} at {location} during {weather}. {suspect} last person seen. {count} {victims} unaccounted for. {authority} finds {evidence}.",
    
    // Templates avec témoins
    "{witness} reports {event} at {location}. {suspect} implicated. {authority} confirms {count} {victims} involved. {evidence} at scene.",
    
    // Templates mystérieux
    "{authority} baffled by {event} involving {suspect} and {count} {victims}. {witness} describes {evidence} near {location} during {weather}.",
    
    // Templates détaillés
    "{time} {event} leaves community shocked. {suspect} connected to disappearance of {count} {victims} at {location}. {authority} investigating {evidence} found during {weather}.",
    
    // Templates avec multiples éléments
    "{location} scene of {event}. {witness} spots {suspect} near {evidence}. {authority} confirms {count} {victims} missing during {weather} at {time}.",
  ]
};

class NewsSystem {
  constructor() {
    this.lastNews = null;
  }

  generateNews() {
    const template = this.getRandomElement(newsData.templates);
    
    // Données de base
    const data = {
      suspect: this.getRandomElement(newsData.suspects),
      event: this.getRandomElement(newsData.events),
      time: this.getRandomElement(newsData.times),
      location: this.getRandomElement(newsData.locations),
      weather: this.getRandomElement(newsData.weather),
      witness: this.getRandomElement(newsData.witnesses),
      evidence: this.getRandomElement(newsData.evidence),
      authority: this.getRandomElement(newsData.authorities),
      victims: this.getRandomElement(newsData.victims),
      count: this.getRandomVictimCount()
    };

    // Remplacement des placeholders dans le template
    let news = template;
    for (const [key, value] of Object.entries(data)) {
      news = news.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    this.lastNews = news;
    return this.formatNews(news);
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomVictimCount() {
    // Génère un nombre de victimes avec une distribution plus réaliste
    const distributions = [
      { weight: 50, range: [1, 3] },      // 50% de chance d'avoir 1-3 victimes
      { weight: 30, range: [4, 7] },      // 30% de chance d'avoir 4-7 victimes
      { weight: 15, range: [8, 12] },     // 15% de chance d'avoir 8-12 victimes
      { weight: 5, range: [13, 20] }      // 5% de chance d'avoir 13-20 victimes
    ];

    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const dist of distributions) {
      cumulative += dist.weight;
      if (random <= cumulative) {
        const [min, max] = dist.range;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
    
    return Math.floor(Math.random() * 3) + 1; // Fallback
  }

  formatNews(news) {
    //const date = new Date().toLocaleString();
    //const separator = "=".repeat(70);
    //const separator = "";
    //return `\r\n${separator}\r\n[${date}] ${highlightedBg("TRAGEDY AT CLIFF: "+news)}\r\n${separator}\r\n`;
    return news;
  }
}