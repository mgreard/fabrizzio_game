class MarketSystem {
  constructor(game) {
    this.game = game;
    this.equipments = [
      {
        id: "drill",
        name: "Accelerateur",
        description: "Minage + rapide",
        cost: 2,
        costRatio: 1.2,
        effect: () => {
          this.game.state.manualSpeed *= 0.90;
        },
        requirements: () => true,
        maxLevel: 20,
        level: 1
      },
      {
        id: "cooling",
        name: "WaterCooling",
        description: "Améliore la production des serveurs de 50%",
        cost: 10,
        costRatio: 1.5,
        effect: () => {
          this.game.state.serversRate *= 1.20;
        },
        requirements: () => this.game.state.servers >= 5,
        maxLevel: 10,
        level: 1
      },
      {
        id: "autobuy",
        name: "Auto-Buy",
        description: "Achat auto des serveurs",
        cost: 30,
        costRatio: 1.0,
        effect: () => {
          this.game.state.autoServerEnabled = true;
        },
        requirements: () => true,
        maxLevel: 1,
        level: 0
      }
    ];
  }

  buyServer() {
    const cost = this.getServerCost();
    if (this.game.state.moneyBalance >= cost) {
      this.game.state.moneyBalance -= cost;
      this.game.state.servers++;
      this.game.mainTerminal.write(highlightedLight(`\r\nServeur acheté! Vous avez maintenant ${this.game.state.servers} serveur(s).\r\n`));
    } else {
      this.game.mainTerminal.write(`Pas assez de Dollars! Il vous faut ${highlighted(cost.toFixed(2))}$ pour acheter un serveur.\r\n`);
    }
  }

  buyEquipment(equipmentId) {
    const equipment = this.equipments.find(e => e.id === equipmentId);
    if (!equipment) {
      this.game.mainTerminal.write("Équipement introuvable.\r\n");
      return;
    }

    if (equipment.maxLevel && equipment.level >= equipment.maxLevel) {
      this.game.mainTerminal.write("Équipement déjà au niveau maximum.\r\n");
      return;
    }

    if (!equipment.requirements()) {
      this.game.mainTerminal.write("Vous ne remplissez pas les conditions pour cet équipement.\r\n");
      return;
    }

    const cost = this.getEquipmentCost(equipment);
    if (this.game.state.cryptoBalance < cost) {
      this.game.mainTerminal.write(`Pas assez de ZCoins! Il vous faut ${cost.toFixed(2)} ZCoins pour acheter cet équipement.\r\n`);
      return;
    }

    this.game.state.cryptoBalance -= cost;
    equipment.effect();
    equipment.level += 1;
    
    this.game.mainTerminal.write(highlightedLight(`\Équipement acheté : ${equipment.name}`));
    if (equipment.maxLevel) {
      this.game.mainTerminal.write(highlightedLight(` (Niveau ${equipment.level})`));
    }
    this.game.mainTerminal.write(highlightedLight("\r\n"));
  }

  getServerCost() {
    return CONFIG.GAME.SERVER_BASE_COST * Math.pow(CONFIG.GAME.SERVER_COST_RATIO, this.game.state.servers);
  }

  getEquipmentCost(equipment) {
    return equipment.cost * Math.pow(equipment.costRatio, equipment.level);
  }

  listEquipments() {
    const term = this.game.mainTerminal;
    
    // Server listing
    const serverCost = this.getServerCost();
    const canAffordServer = (this.game.state.moneyBalance >= serverCost);
    if (canAffordServer) {
      term.write(highlighted(`[server] Serveur de minage | ${serverCost.toFixed(2)}$\r\n`));
    } else {
      term.write(`[server] Serveur de minage | ${highlighted(serverCost.toFixed(2))}$\r\n`);
    }

    // Equipment listing
    for (const equipment of this.equipments) {
      if (!equipment.requirements()) continue;
      const cost = this.getEquipmentCost(equipment);
      const canAfford = (this.game.state.cryptoBalance >= cost) && (equipment.level < equipment.maxLevel || !equipment?.maxLevel);

      if (equipment.maxLevel && equipment.level >= equipment.maxLevel) {
        term.write(`[${equipment.id}] ${equipment.name} | Max level atteint\r\n`);
        continue;
      }
      
      if (canAfford) {
        term.write(highlighted(
          `[${equipment.id}] ${equipment.name} | ${equipment.description} | ${cost.toFixed(2)} ZCoins`
        ));
        if(equipment.maxLevel){
          term.write(highlighted(` | Niveau ${equipment.level}/${equipment.maxLevel}`));
        }
        term.write(highlighted(`\r\n`));
      } else {
        term.write(
          `[${equipment.id}] ${equipment.name} | ${equipment.description} | ${highlighted(cost.toFixed(2))} ZCoins`
        );
        if(equipment.maxLevel){
          term.write(` | Niveau ${equipment.level}/${equipment.maxLevel}`);
        }
        term.write(`\r\n`);
      }
    }

    term.write("\r\nUtilisez la commande \"buy <ID>\" pour acheter un équipement. (ex: buy drill)\r\n");
  }
}