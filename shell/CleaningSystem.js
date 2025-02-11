class CleaningSystem {
  constructor(game) {
    this.game = game;
    this.cleaningInterval = null;
  }

  startCleaning(interval) {
    if (this.game.state.cleaningInProgress) {
      this.game.mainTerminal.write("\r\nLe processus de blanchiment est déjà en cours.\r\n");

      return;
    }

    this.game.state.cleaningInProgress = true;
    this.game.mainTerminal.write("cliquer sur une touche pour quitter\r\n");
    
    this.cleaningInterval = setInterval(() => {
      this.processCleaning();
    }, interval * 1000);
  }

  processCleaning() {
    if (this.game.state.fakeCustomers <= 0) {
      this.game.mainTerminal.write("Aucun faux client disponible pour blanchir l'argent.\r\n");
      return;
    }

    const randomDirty = 5 + Math.floor(Math.random() * 21);
    
    if (this.game.state.moneyDirty >= randomDirty) {
      this.game.state.moneyDirty -= randomDirty;
      const converted = randomDirty * CONFIG.GAME.CLEANING_RATE;
      this.game.state.moneyBalance += converted;
      this.game.state.fakeCustomers--;
      
      this.game.mainTerminal.write(
        `Un faux client a blanchi ${highlightedLight(`${randomDirty}$`)} sale => ${highlightedLight(`${converted.toFixed(2)}$`)} propre.\r\n`
      );
    } else {
      this.game.mainTerminal.write("Pas assez d'argent sale pour blanchir cette fois-ci.\r\n");
    }
  }

  stopCleaning() {
    this.game.state.cleaningInProgress = false;
    if (this.cleaningInterval) {
      clearInterval(this.cleaningInterval);
      this.game.mainTerminal.renderPrompt();
    }
  }
}