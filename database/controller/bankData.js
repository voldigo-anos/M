const { readFileSync, writeFileSync, existsSync } = require('fs-extra');
const path = require('path');

class BankDataController {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/bankData.json');
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (existsSync(this.dataPath)) {
        const data = readFileSync(this.dataPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading bank data:', error);
    }
    return {};
  }

  saveData() {
    try {
      writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving bank data:', error);
    }
  }

  async get(userId) {
    return this.data[userId] || null;
  }

  async getAll() {
    return this.data;
  }

  async create(userId) {
    const newBank = {
      userId: userId,
      balance: 0,
      savings: 0,
      vault: 0,
      loan: 0,
      loanDate: null,
      lastInterest: null,
      lastDaily: null,
      lastWork: null,
      lastRob: null,
      creditScore: 750,
      bankLevel: 1,
      multiplier: 1,
      premium: false,
      frozen: false,
      streak: 0,
      reputation: 0,
      achievements: [],
      transactions: [],
      stocks: {},
      crypto: {},
      bonds: {},
      businesses: [],
      realEstate: [],
      vehicles: [],
      luxury: [],
      insurance: {},
      lotteryTickets: 0,
      skills: {
        gambling: 0,
        trading: 0,
        business: 0,
        investing: 0
      }
    };

    this.data[userId] = newBank;
    this.saveData();
    return newBank;
  }

  async set(userId, data) {
    this.data[userId] = data;
    this.saveData();
    return data;
  }

  async delete(userId) {
    delete this.data[userId];
    this.saveData();
  }
}

module.exports = BankDataController;
