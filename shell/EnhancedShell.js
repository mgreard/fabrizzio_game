class EnhancedShell {
  constructor(config, container, game, customCommands) {
    this.game = game;
    this.customCommands = customCommands;
    this.terminal = new Terminal(config);
    this.terminal.open(container);
    this.currentPath = "~";
    this.currentUser = "fabrizzio";
    this.hostname = "crypto-os";
    this.commandHistory = [];
    this.historyIndex = 0;
    this.inputBuffer = "";
    this.cursorPosition = 0;
    
    // Pour l'autocomplétion
    this.availableCommands = [
      {key: "help", desc: "Consulter les commandes disponibles"},
      {key: "mine", desc: "Démarrer le minage"},
      {key: "market", desc: "Lister les équipements"},
      {key: "buy", desc: "Acheter des équipements"},
      {key: "whoami", desc: "Fournit des informations sur l'utilisateur"},
      {key: "harvest", desc: "Convertis les ZCoins en Dollars"},
      {key: "cam.exe", desc: "Affiche les caméra de sécurité"},
      {key: "clear", desc: "Nettoyage du terminal"}
    ];
    
    this.setupEventListeners()
  }

  getPrompt() {
    const username = this.formatText(this.currentUser, "white");
    const hostname = this.formatText(this.hostname, "white");
    const path = this.formatText(this.currentPath, "white");
    const symbol = this.currentUser === "root" ? "#" : "$";
    return `${username}@${hostname}:${path}${symbol} `;
  }
  
  renderPrompt(){
    this.newLine()
    this.terminal.write(this.getPrompt());
  }
  
  newLine() {
    this.terminal.write("\r\n")
  }

  formatText(text, color) {
    const colors = {
      red: "\x1b[31m",
      green: "\x1b[38;2;0;136;0m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      lightGreen: "\x1b[38;2;136;255;136m",
      cyan: "\x1b[36m",
      reset: "\x1b[0m",
      white: "\x1b[37m"
    };
    return `${colors[color]}${text}${colors.reset}`;
  }
  
  write(text) {
    this.terminal.write(text);
  }

  clear() {
    this.terminal.clear();
    this.terminal.write("\r\n"); 
  }
  
  setupEventListeners() {
    this.terminal.onKey(({ key, domEvent }) => {
      updateLastActivity()
      if (this.game.state.cleaningInProgress) {
        this.game.cleaningSystem.stopCleaning();
        return;
      }

      if (this.game.state.manualMinageInProgress) {
        this.game.miningSystem.stopManualMining();
        return;
      }

      this.handleInput(key, domEvent) 
    });
  }

  handleInput(key, domEvent) {
    switch (domEvent.key) {
      case "Tab":
        domEvent.preventDefault();
        this.handleTabCompletion();
        break;

      case "ArrowLeft":
        if (this.cursorPosition > 0) {
          this.cursorPosition--;
          this.terminal.write("\b");
        }
        break;

      case "ArrowRight":
        if (this.cursorPosition < this.inputBuffer.length) {
          this.terminal.write(this.inputBuffer[this.cursorPosition]);
          this.cursorPosition++;
        }
        break;

      case "ArrowUp":
        this.navigateHistory("up");
        break;

      case "ArrowDown":
        this.navigateHistory("down");
        break;

      case "Home":
        while (this.cursorPosition > 0) {
          this.terminal.write("\b");
          this.cursorPosition--;
        }
        break;

      case "End":
        while (this.cursorPosition < this.inputBuffer.length) {
          this.terminal.write(this.inputBuffer[this.cursorPosition]);
          this.cursorPosition++;
        }
        break;

      case "Backspace":
        if (this.cursorPosition > 0) {
          this.inputBuffer = 
            this.inputBuffer.slice(0, this.cursorPosition - 1) + 
            this.inputBuffer.slice(this.cursorPosition);
          this.cursorPosition--;
          
          // Redessiner la ligne
          this.terminal.write("\b \b");
          const remainingText = this.inputBuffer.slice(this.cursorPosition);
          if (remainingText) {
            this.terminal.write(remainingText + " \b".repeat(remainingText.length));
          }
        }
        break;

      case "Enter":
        this.terminal.write("\r\n");
        if (this.inputBuffer.trim()) {
          this.commandHistory.push(this.inputBuffer);
          this.executeCommand(this.inputBuffer);
        }
        this.historyIndex = this.commandHistory.length;
        this.inputBuffer = "";
        this.cursorPosition = 0;
        break;

      default:
        if (key.length === 1) {
          // Insérer le caractère à la position du curseur
          this.inputBuffer = 
            this.inputBuffer.slice(0, this.cursorPosition) + 
            key + 
            this.inputBuffer.slice(this.cursorPosition);
          this.cursorPosition++;
          
          // Afficher le reste de la ligne
          this.terminal.write(key);
          const remainingText = this.inputBuffer.slice(this.cursorPosition);
          if (remainingText) {
            this.terminal.write(remainingText + "\b".repeat(remainingText.length));
          }
        }
    }
  }

  handleTabCompletion() {
    const words = this.inputBuffer.split(" ");
    const lastWord = words[words.length - 1];
    
    const matches = this.availableCommands.filter(cmd => 
      cmd.key.startsWith(lastWord)
    );

    if (matches.length === 1) {
      // Complétion unique
      const completion = matches[0].slice(lastWord.length);
      this.terminal.write(completion);
      this.inputBuffer += completion;
      this.cursorPosition += completion.length;
    } else if (matches.length > 1) {
      // Plusieurs possibilités
      this.terminal.write("\r\n");
      matches.forEach(match => {
        this.terminal.write(`${match}  `);
      });
      this.terminal.write("\r\n" + this.getPrompt() + this.inputBuffer);
    }
  }

  navigateHistory(direction) {
    if (direction === "up" && this.historyIndex > 0) {
      this.historyIndex--;
    } else if (direction === "down" && this.historyIndex < this.commandHistory.length) {
      this.historyIndex++;
    }

    // Effacer la ligne actuelle
    this.terminal.write("\r" + " ".repeat(this.getPrompt().length + this.inputBuffer.length) + "\r");
    this.terminal.write(this.getPrompt());

    if (this.historyIndex < this.commandHistory.length) {
      this.inputBuffer = this.commandHistory[this.historyIndex];
    } else {
      this.inputBuffer = "";
    }
    
    this.cursorPosition = this.inputBuffer.length;
    this.terminal.write(this.inputBuffer);
  }
  
  showCommands(){
    this.write("TAB pour auto-compléter la commande \r\n");
  
    // Trouver la longueur maximale des clés
    const maxKeyLength = Math.max(...this.availableCommands.map(cmd => cmd.key.length));

    Object.values(this.availableCommands).forEach((cmd) => {
      // Calculer le nombre d'espaces nécessaires pour l'alignement
      const padding = ' '.repeat(maxKeyLength - cmd.key.length);
      this.write(highlightedLight(cmd.key) + padding + " - " + cmd.desc + "\r\n");
    });
  
    this.write("\r\n");
  }

  getBasicCommands() {
    return {
      clear: () => {
        this.clear();
        this.renderPrompt()
      },
      help: () => {
        this.showCommands();
        this.renderPrompt()
      },
      
      pwd: () => {
        this.terminal.write(`/home/${this.currentUser}${this.currentPath === "~" ? "" : "/" + this.currentPath}\r\n`);
        this.renderPrompt()
      },
      
      whoami: () => {
        this.terminal.write(`${this.currentUser}\r\n`);
        this.renderPrompt()
        
        document.querySelector(".fab_instant").classList.add("show");
        setTimeout(() => {
          document.querySelector(".fab_instant").classList.remove("show");
        }, 2000)
      },
      
      date: () => {
        this.terminal.write(`${new Date().toLocaleString()}\r\n`);
        this.renderPrompt()
      },
      
      ls: (game, args) => {
        const files = [
          { name: "Action_For_San_Andreas", type: "dir", color: "red" },
          { name: "belle_terrasse.jpg", type: "file", color: "yellow" },
          { name: "cam.exe", type: "file", color: "green" },
          { name: "Gigi D'Agostino - L'Amour Toujours.mp3", type: "file", color: "yellow" },
          { name: "THE_GOD_FATHER.1972.TS.IT.avi", type: "file", color: "yellow" }
        ];
        
        files.forEach(file => {
          this.terminal.write(this.formatText(file.name, file.color) + "  ");
        });
        this.terminal.write("\r\n");
        this.renderPrompt()
      },
      
      cd: (game, args) => {
        const newPath = args[0] || "~";
        if (newPath === "..") {
          if (this.currentPath !== "~") {
            this.currentPath = this.currentPath.split("/").slice(0, -1).join("/") || "~";
          }
        } else {
          this.currentPath = newPath;
        }
        this.renderPrompt()
      }
    };
  }
    
    
  executeCommand(input) {
    const [cmd, ...args] = input.split(" ");
    const handler = this.customCommands[cmd] || this.getBasicCommands()[cmd];
    
    if (handler) {
      handler(this.game, args);
    } else {
      this.write("Commande ou Programme inconnu\r\n");
      this.renderPrompt()
    }
  }
}