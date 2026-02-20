const { graphQlQueryToJson } = require("graphql-query-to-json");
const ora = require("ora");
const { log, getText } = global.utils;
const { config } = global.GoatBot;
const databaseType = config.database.type;
const BankDataController = require("./bankData.js"); // Importer le contrôleur bancaire

// with add null if not found data
function fakeGraphql(query, data, obj = {}) {
	if (typeof query != "string" && typeof query != "object")
		throw new Error(`The "query" argument must be of type string or object, got ${typeof query}`);
	if (query == "{}" || !data)
		return data;
	if (typeof query == "string")
		query = graphQlQueryToJson(query).query;
	const keys = query ? Object.keys(query) : [];
	for (const key of keys) {
		if (typeof query[key] === 'object') {
			if (!Array.isArray(data[key]))
				obj[key] = data.hasOwnProperty(key) ? fakeGraphql(query[key], data[key] || {}, obj[key]) : null;
			else
				obj[key] = data.hasOwnProperty(key) ? data[key].map(item => fakeGraphql(query[key], item, {})) : null;
		}
		else
			obj[key] = data.hasOwnProperty(key) ? data[key] : null;
	}
	return obj;
	// i don't know why but it's working by Copilot suggestion :)
}

module.exports = async function (api) {
	var threadModel, userModel, dashBoardModel, globalModel, sequelize = null;
	
	// Créer l'instance du contrôleur bancaire
	const bankData = new BankDataController();
	
	switch (databaseType) {
		case "mongodb": {
			const spin = ora({
				text: getText('indexController', 'connectingMongoDB'),
				spinner: {
					interval: 80,
					frames: [
						'⠋', '⠙', '⠹',
						'⠸', '⠼', '⠴',
						'⠦', '⠧', '⠇',
						'⠏'
					]
				}
			});
			const defaultClearLine = process.stderr.clearLine;
			process.stderr.clearLine = function () { };
			spin.start();
			try {
				var { threadModel, userModel, dashBoardModel, globalModel } = await require("../connectDB/connectMongoDB.js")(config.database.uriMongodb);
				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.info("MONGODB", getText("indexController", "connectMongoDBSuccess"));
			}
			catch (err) {
				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.err("MONGODB", getText("indexController", "connectMongoDBError"), err);
				process.exit();
			}
			break;
		}
		case "sqlite": {
			const spin = ora({
				text: getText('indexController', 'connectingMySQL'),
				spinner: {
					interval: 80,
					frames: [
						'⠋', '⠙', '⠹',
						'⠸', '⠼', '⠴',
						'⠦', '⠧', '⠇',
						'⠏'
					]
				}
			});
			const defaultClearLine = process.stderr.clearLine;
			process.stderr.clearLine = function () { };
			spin.start();
			try {
				var { threadModel, userModel, dashBoardModel, globalModel, sequelize } = await require("../connectDB/connectSqlite.js")();
				process.stderr.clearLine = defaultClearLine;
				spin.stop();
				log.info("SQLITE", getText("indexController", "connectMySQLSuccess"));
			}
			catch (err) {
				process.stderr.clearLine = defaultClearLine;
				spin.stop();
				log.err("SQLITE", getText("indexController", "connectMySQLError"), err);
				process.exit();
			}
			break;
		}
		default:
			break;
	}

	const threadsData = await require("./threadsData.js")(databaseType, threadModel, api, fakeGraphql);
	const usersData = await require("./usersData.js")(databaseType, userModel, api, fakeGraphql);
	const dashBoardData = await require("./dashBoardData.js")(databaseType, dashBoardModel, fakeGraphql);
	const globalData = await require("./globalData.js")(databaseType, globalModel, fakeGraphql);

	// Ajouter bankData à global.db
	global.db = {
		...global.db,
		threadModel,
		userModel,
		dashBoardModel,
		globalModel,
		threadsData,
		usersData,
		dashBoardData,
		globalData,
		bankData, // Ajout du contrôleur bancaire
		sequelize
	};

	// Créer le dossier data pour bankData s'il n'existe pas
	const fs = require('fs-extra');
	const path = require('path');
	const bankDataDir = path.join(__dirname, '../data');
	await fs.ensureDir(bankDataDir);
	
	const bankDataPath = path.join(bankDataDir, 'bankData.json');
	if (!await fs.pathExists(bankDataPath)) {
		await fs.writeJSON(bankDataPath, {});
		log.info("BANK", "Fichier bankData.json créé avec succès");
	}

	log.info("BANK", "Système bancaire initialisé");

	return {
		threadModel,
		userModel,
		dashBoardModel,
		globalModel,
		threadsData,
		usersData,
		dashBoardData,
		globalData,
		bankData, // Retourner aussi bankData
		sequelize,
		databaseType
	};
};
