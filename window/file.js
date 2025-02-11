// Types de fichiers supportés
const FileType = {
  FOLDER: 'folder',
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'crypto'
};

// Structure de données pour le système de fichiers
class FileSystem {
  constructor() {
    this.root = {
      type: FileType.FOLDER,
      name: 'root',
      children: {}
    };
  }

  // Ajouter un fichier ou dossier au chemin spécifié
  addItem(path, item) {
    if (!path || path === '') {
      // Ajout direct à la racine
      this.root.children[item.name] = item;
      return;
    }

    const parts = path.split('/').filter(p => p);
    let current = this.root;
    
    // Naviguer jusqu'au dossier parent
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current.children)) {
        current.children[part] = {
          type: FileType.FOLDER,
          name: part,
          children: {}
        };
      }
      current = current.children[part];
    }
    
    // Ajouter l'item dans le dernier dossier
    const lastName = parts[parts.length - 1];
    if (item.type === FileType.FOLDER) {
      if (!current.children[lastName]) {
        current.children[lastName] = {
          type: FileType.FOLDER,
          name: lastName,
          children: {}
        };
      }
      // Fusionner les enfants si c'est un dossier
      if (item.children) {
        Object.assign(current.children[lastName].children, item.children);
      }
    } else {
      current.children[lastName] = item;
    }
  }
  

  // Obtenir un item par son chemin
  getItem(path) {
    // Si le chemin est vide, undefined, null ou pas une chaîne
    if (!path || typeof path !== 'string') return this.root;
  
    // Si c'est une chaîne vide
    if (path === '') return this.root;
    
    console.log(path, "path")
    
    const parts = path.split('/').filter(p => p);
    let current = this.root;
    
    for (const part of parts) {
      if (!(part in current.children)) {
        return null;
      }
      current = current.children[part];
    }
    
    return current;
  }

  // Lister tous les éléments d'un dossier
  listItems(path = '') {
    const folder = this.getItem(path);
    return folder ? folder.children : {};
  }
}