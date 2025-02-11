
class ShellGame {
  constructor() {
    this.state = new GameState();
    
    this.mainTerminal = new EnhancedShell(
      CONFIG.TERMINAL.MAIN,
      document.getElementById("terminal-container"),
      this,
      mainCommands
    )
    this.statusTerminal = new EnhancedShell(
      CONFIG.TERMINAL.STATUS,
      document.getElementById("status-container"),
      this
    )

    this.miningSystem = new MiningSystem(this);
    this.marketSystem = new MarketSystem(this);

    this.startGameLoops();
    showHome(this.mainTerminal);
  }

  renderCurrentInput() {
    this.mainTerminal.write('\x1b[2K\r');
    this.mainTerminal.write(this.mainTerminal.getPrompt() + this.state.currentInput);
  }

  startGameLoops() {
    setInterval(() => {
      //this.miningSystem.mineAutomatically();
      if (this.state.autoServerEnabled) {
        this.miningSystem.checkAutoServerPurchase();
      }
      this.updateStatusBar();
    }, 100);
  }

  updateStatusBar() {
    this.statusTerminal.write('\x1b[2J');
    this.statusTerminal.write('\x1b[H');
    
    const statusText = 
      `Dollars: ${highlightedLight(`${this.state.moneyBalance.toFixed(2)}$`)} | ` +
      `ZCoins: ${highlightedLight(this.state.cryptoBalance.toFixed(2))} | ` +
      `Hashrate: ${highlightedLight(this.miningSystem.getHashRate().toFixed(2))} | ` +
      `Serveurs: ${highlightedLight(this.state.servers)}`;
    
    this.statusTerminal.write(statusText);
  }
}