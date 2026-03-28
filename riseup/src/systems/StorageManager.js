// src/systems/StorageManager.js
// Thin wrapper around localStorage for score persistence.

const StorageManager = {
  _KEY: 'riseup_highscore',

  getHighScore() {
    try {
      return parseInt(localStorage.getItem(this._KEY) || '0', 10);
    } catch {
      return 0;
    }
  },

  saveHighScore(score) {
    try {
      const current = this.getHighScore();
      if (score > current) {
        localStorage.setItem(this._KEY, String(score));
        return true;   // new record
      }
    } catch { /* storage unavailable */ }
    return false;
  },

  clearHighScore() {
    try { localStorage.removeItem(this._KEY); } catch { /* */ }
  },
};
