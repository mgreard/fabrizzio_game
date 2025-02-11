const CONFIG = {
  TERMINAL: {
    MAIN: {
      cursorBlink: true,
      rows: 11,
      cols: 80,
      theme: {
        background: "#000", // "#012f3a",
        foreground: "#2da69a",
        cursor: "#fff",
        cursorAccent: "#2da69a",
        selectionForeground: "#000",
        selectionBackground: "#2da69a"
      },
      fontSize: 13,
      fontFamily: 'monospace',
    },
    STATUS: {
      cursorBlink: false,
      disableStdin: true, 
      rows: 2,
      cols: 80,
      theme: {
        background: "#000",
        foreground: "#2da69a",
        cursor: "#000",
        cursorAccent: "#000",
        selectionForeground: "#000",
        selectionBackground: "#2da69a"
      },
      fontSize: 13,
      fontFamily: 'monospace',
    }
  },
  GAME: {
    DEFAULT_HASH_RATE: 0,
    MANUAL_RATE: 0.2,
    MANUAL_SPEED: 4000,
    SERVER_BASE_COST: 50,
    SERVER_COST_RATIO: 1.5,
    HARVEST_RATIO: 100
  }
};