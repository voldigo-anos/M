const fs = require('fs-extra');
const path = require('path');

async function initDatabase() {
  const databaseDir = path.join(__dirname, 'data');
  const bankDataPath = path.join(databaseDir, 'bankData.json');

  try {
    // Créer le dossier data s'il n'existe pas
    await fs.ensureDir(databaseDir);

    // Créer bankData.json s'il n'existe pas
    if (!await fs.pathExists(bankDataPath)) {
      await fs.writeJSON(bankDataPath, {});
      console.log('✓ bankData.json created successfully');
    }

    console.log('✓ Database initialization complete');
  } catch (error) {
    console.error('✗ Database initialization error:', error);
  }
}

// Exécuter l'initialisation si ce fichier est exécuté directement
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
