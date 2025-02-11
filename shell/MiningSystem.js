class MiningSystem {
  constructor(game) {
    this.game = game;
    this.miningInterval = null;
  }

  startManualMining() {
    const term = this.game.mainTerminal;
    term.write("cliquer sur une touche pour quitter\r\n");
    this.game.state.manualMinageInProgress = true;
    this.performManualMining();
  }

  performManualMining() {
    if (!this.game.state.manualMinageInProgress) return;

    const minedAmount = this.game.state.manualRate + this.getHashRate();
    const randomFactor = Math.random() * 1.2 + 0.9;
    const miningDuration = Math.random() * 300 + this.game.state.manualSpeed;
    const steps = 20;
    let progress = 0;

    this.miningInterval = setInterval(() => {
      progress++;
      const bar = `[${"=".repeat(progress)}${" ".repeat(steps - progress)}]`;
      const percent = Math.round((progress / steps) * 100);
      
      this.game.mainTerminal.write(`\rMinage manuel en cours : ${bar} (${percent}%)`);

      if (progress >= steps) {
        clearInterval(this.miningInterval);
        const totalMined = minedAmount * randomFactor;
        this.game.state.cryptoBalance += totalMined;
        this.game.mainTerminal.write(`\r\nVous avez miné ${highlightedLight(totalMined.toFixed(2))} ZCoins!\r\n`);
        
        if (this.game.state.manualMinageInProgress) {
          this.performManualMining();
        }
      }
    }, miningDuration / steps);
  }

  stopManualMining() {
    this.game.state.manualMinageInProgress = false;
    if (this.miningInterval) {
      clearInterval(this.miningInterval);
      this.game.mainTerminal.newLine();
      this.game.mainTerminal.renderPrompt();
    }
  }

  mineAutomatically() {
    const minedAmount = this.getHashRate() / 10;
    const randomFactor = Math.random() * 0.2 + 0.9;
    this.game.state.cryptoBalance += minedAmount * randomFactor;
    
  }

  getHashRate() {
    return this.game.state.servers * this.game.state.serversRate;
  }

  checkAutoServerPurchase() {
    const nextCost = this.game.marketSystem.getServerCost();
    if (this.game.state.moneyBalance >= nextCost) {
      this.game.marketSystem.buyServer();
    }
  }
}