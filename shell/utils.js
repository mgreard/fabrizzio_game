
/**
 * Retourne un coût exponentiel
 * @param {number} baseCost
 * @param {number} ratio
 * @param {number} count
 * @return {number}           - Le coût du prochain achat.
 */
function getExponentialCost(baseCost, ratio, count) {
  return baseCost * Math.pow(ratio, count);
}

// Fonctions d'affichage coloré
function highlighted(text) {
  return highlightedText(text, "#F7C548", "#000");
}

function highlightedLight(text) {
  return highlightedText(text, "#F7C548", "#000");
}
function highlightedWhite(text) {
  return highlightedText(text, "#fff", "#000");
}

function highlightedBg(text) {
  return highlightedText(text, "#012f3a", "#2da69a");
}

function prompStyle(text) {
  return highlightedText(text, "#2da69a", "#000");
}

/**
 * Affichage en couleurs (xterm)
 */
function highlightedText(text, textColorHex, backgroundColorHex) {
  const textColorRGB = hexToRgb(textColorHex);
  const bgColorRGB = hexToRgb(backgroundColorHex);
  return `\x1b[48;2;${bgColorRGB.r};${bgColorRGB.g};${bgColorRGB.b}m\x1b[38;2;${textColorRGB.r};${textColorRGB.g};${textColorRGB.b}m${text}\x1b[0m`;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Affiche chaque chaîne du tableau `messages` dans le shell
 * avec un délai de 100ms entre chaque (exemple d'animation).
 * 
 * @param {string[]} messages  Tableau de chaînes à afficher
 * @param {Terminal} term      Instance de Terminal
 * @param {Function} [callback] Optionnel : fonction appelée quand c'est fini
 */
function printStringsWithDelay(messages, term, callback) {
  let index = 0;
  
  const intervalId = setInterval(() => {
    term.write(messages[index]);
    index++;

    if (index >= messages.length) {
      clearInterval(intervalId);
      if (callback) callback();
    }
  }, 100);
}
