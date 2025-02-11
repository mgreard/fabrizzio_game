const mainCommands = {
  "mine.exe": (game) => {
    if(game.state.servers > 0){
      game.miningSystem.startManualMining();
      if(customerManager.customer.state === "waiting"){
        customerManager.customer.showSpeechBubble("Hum hum, excusez-moi !")
      }
    } else {
        game.mainTerminal.write("Vous devez disposer d'au moins un serveur.\r\n");
        game.mainTerminal.renderPrompt();
    }
  },
  "harvest.exe": (game) => {
    const cryptoAmount = game.state.cryptoBalance
    const convert =  cryptoAmount * CONFIG.GAME.HARVEST_RATIO;
    game.state.moneyBalance += convert;
    game.state.cryptoBalance = 0;
    game.mainTerminal.write(`${highlighted(cryptoAmount.toFixed(2))} ZCoins en ${highlighted(`${convert.toFixed(2)}$`)}\r\n`);
    game.mainTerminal.renderPrompt();
  },
  "buy": (game, args) => {
      const [itemId] = args;
      if (!itemId) {
        game.mainTerminal.write("Veuillez préciser l'ID de l'équipement. Ex: buy drill\r\n");
        game.mainTerminal.renderPrompt();
        return;
      }

      if (itemId === "server") {
        game.marketSystem.buyServer();
      } else {
        game.marketSystem.buyEquipment(itemId);
      }
      game.mainTerminal.renderPrompt();
  },
  /*"clean.exe": (game) => {
    game.cleaningSystem.startCleaning(5);
  },*/
  "market.exe": (game) => {
    game.marketSystem.listEquipments();
      game.mainTerminal.renderPrompt();
  },
  "exit": (game) => {
      if(!grottiView){
        showCookView();
        assets.grotti.play()
        grottiView = true;
        game.mainTerminal.renderPrompt();
      }
  }
}


function showHome(term) {
  term.showCommands(term) ;
  term.renderPrompt() ;
}