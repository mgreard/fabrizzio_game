class GameState {
  constructor() {
    this.moneyBalance = 0;
    this.cryptoBalance = 0;
    this.servers = 0;
    this.serversRate = 0.1;
    this.autoServerEnabled = false;
    
    this.currentInput = "";
    this.commandHistory = [];
    this.historyIndex = -1;
    
    this.cleaningInProgress = false;
    this.manualMinageInProgress = false;
    
    this.manualSpeed = CONFIG.GAME.MANUAL_SPEED;
    this.manualRate = CONFIG.GAME.MANUAL_RATE;
  }
}