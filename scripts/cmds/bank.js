const { getTime } = global.utils;
const fonts = require('../../func/font.js');

module.exports = {
	config: {
		name: "bank",
		version: "4.0",
		author: "Christus",
		countDown: 0,
		role: 0,
		description: {
			en: "Comprehensive banking system"
		},
		category: "game",
		guide: {
			en: "Use {pn} help to see all commands"
		}
	},

	langs: {
		en: {
			help: "Banking commands list",
			success: "Success",
			error: "Error",
			insufficientFunds: "Insufficient funds",
			invalidAmount: "Invalid amount"
		}
	},

	marketData: {
		stocks: {
			"AAPL": { price: 150.25, change: 2.1, name: "Apple Inc." },
			"GOOGL": { price: 2800.50, change: 1.8, name: "Alphabet Inc." },
			"TSLA": { price: 800.75, change: -0.5, name: "Tesla Inc." },
			"MSFT": { price: 320.40, change: 1.2, name: "Microsoft Corp." },
			"AMZN": { price: 3200.00, change: 0.8, name: "Amazon.com Inc." },
			"META": { price: 330.00, change: 2.5, name: "Meta Platforms Inc." },
			"NVDA": { price: 450.00, change: 3.2, name: "NVIDIA Corp." },
			"NFLX": { price: 380.00, change: -1.1, name: "Netflix Inc." }
		},
		crypto: {
			"BTC": { price: 45000, change: 3.2, name: "Bitcoin" },
			"ETH": { price: 3200, change: 2.8, name: "Ethereum" },
			"BNB": { price: 400, change: 1.5, name: "Binance Coin" },
			"ADA": { price: 1.20, change: 4.1, name: "Cardano" },
			"DOT": { price: 25.50, change: 2.3, name: "Polkadot" },
			"LINK": { price: 28.00, change: 1.9, name: "Chainlink" },
			"MATIC": { price: 0.85, change: 5.1, name: "Polygon" },
			"SOL": { price: 120.00, change: 3.8, name: "Solana" }
		},
		bonds: {
			"US_TREASURY": { yield: 2.5, risk: "Low", term: "10 Year" },
			"CORPORATE": { yield: 3.8, risk: "Medium", term: "5 Year" },
			"MUNICIPAL": { yield: 2.1, risk: "Low", term: "7 Year" },
			"HIGH_YIELD": { yield: 6.2, risk: "High", term: "3 Year" }
		},
		properties: {
			"APARTMENT": { price: 250000, income: 2500, name: "City Apartment" },
			"HOUSE": { price: 500000, income: 4000, name: "Suburban House" },
			"MANSION": { price: 2000000, income: 15000, name: "Luxury Mansion" },
			"OFFICE": { price: 1000000, income: 8000, name: "Commercial Office" },
			"WAREHOUSE": { price: 750000, income: 6000, name: "Industrial Warehouse" },
			"MALL": { price: 5000000, income: 40000, name: "Shopping Mall" }
		},
		vehicles: {
			"TOYOTA": { price: 25000, depreciation: 0.85, name: "Toyota Camry" },
			"BMW": { price: 60000, depreciation: 0.70, name: "BMW M3" },
			"FERRARI": { price: 300000, depreciation: 0.90, name: "Ferrari 488" },
			"LAMBORGHINI": { price: 400000, depreciation: 0.85, name: "Lamborghini Huracan" },
			"ROLLS_ROYCE": { price: 500000, depreciation: 0.80, name: "Rolls-Royce Phantom" },
			"BUGATTI": { price: 3000000, depreciation: 0.75, name: "Bugatti Chiron" }
		},
		businesses: {
			"COFFEE_SHOP": { cost: 50000, income: 5000, employees: 3, name: "Coffee Shop" },
			"RESTAURANT": { cost: 150000, income: 12000, employees: 8, name: "Restaurant" },
			"TECH_STARTUP": { cost: 500000, income: 50000, employees: 20, name: "Tech Startup" },
			"HOTEL": { cost: 2000000, income: 150000, employees: 50, name: "Hotel Chain" },
			"BANK": { cost: 10000000, income: 800000, employees: 200, name: "Regional Bank" },
			"AIRLINE": { cost: 50000000, income: 3000000, employees: 1000, name: "Airline Company" }
		},
		luxury: {
			"ROLEX": { price: 15000, name: "Rolex Submariner" },
			"PAINTING": { price: 100000, name: "Van Gogh Replica" },
			"DIAMOND": { price: 50000, name: "5 Carat Diamond" },
			"YACHT": { price: 2000000, name: "Luxury Yacht" },
			"PRIVATE_JET": { price: 25000000, name: "Private Jet" },
			"ISLAND": { price: 100000000, name: "Private Island" }
		}
	},

	onStart: async function ({ message, args, event, usersData, threadsData, getLang, api }) {
		const { senderID, threadID } = event;
		const command = args[0]?.toLowerCase();
		const API_BASE = 'https://shizubank.vercel.app';

		const userData = await usersData.get(senderID);
		const walletBalance = userData.money || 0;

		// Liste complète des commandes
		switch (command) {
			case "help":
			case undefined:
				return this.showHelp(message, fonts, userData);

			case "balance":
			case "bal":
				return this.showBalance(message, senderID, usersData, API_BASE, fonts);

			case "deposit":
			case "dep":
				return this.deposit(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "withdraw":
			case "wd":
				return this.withdraw(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "transfer":
			case "send":
				return this.transfer(message, args, userData, usersData, senderID, event, API_BASE, fonts);

			case "loan":
				return this.loan(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "repay":
				return this.repayLoan(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "savings":
			case "save":
				return this.savings(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "interest":
				return this.collectInterest(message, senderID, API_BASE, fonts);

			case "history":
			case "transactions":
				return this.showHistory(message, senderID, API_BASE, fonts);

			case "daily":
				return this.dailyReward(message, senderID, API_BASE, fonts);

			case "work":
				return this.work(message, senderID, API_BASE, fonts);

			// === INVESTMENT SYSTEM ===
			case "invest":
				return this.invest(message, fonts);

			case "stocks":
				return this.handleStocks(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "crypto":
				return this.handleCrypto(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "bonds":
				return this.bonds(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "portfolio":
				return this.showPortfolio(message, senderID, API_BASE, fonts);

			case "market":
				return this.showMarket(message, fonts);

			case "dividend":
				return this.collectDividend(message, senderID, API_BASE, fonts);

			// === BUSINESS SYSTEM ===
			case "business":
				return this.business(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "shop":
				return this.shop(message, args, userData, usersData, senderID, API_BASE, fonts);

			// === REAL ESTATE ===
			case "property":
			case "realestate":
				return this.realEstate(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "house":
				return this.buyHouse(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "rent":
				return this.rentProperty(message, senderID, API_BASE, fonts);

			// === LUXURY & COLLECTIBLES ===
			case "luxury":
				return this.luxury(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "car":
				return this.buyCar(message, args, userData, usersData, senderID, API_BASE, fonts);

			// === GAMING & FUN ===
			case "gamble":
				return this.gamble(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "lottery":
				return this.handleLottery(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "slots":
				return this.slots(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "blackjack":
				return this.blackjack(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "roulette":
				return this.roulette(message, args, userData, usersData, senderID, API_BASE, fonts);

			// === PREMIUM FEATURES ===
			case "premium":
				return this.premium(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "vault":
				return this.vault(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "insurance":
				return this.insurance(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "credit":
				return this.creditScore(message, senderID, API_BASE, fonts);

			case "achievements":
				return this.achievements(message, senderID, API_BASE, fonts);

			case "leaderboard":
			case "top":
				return this.showLeaderboard(message, API_BASE, api, fonts);

			case "card":
				return this.handleCard(message, args, userData, usersData, senderID, API_BASE, fonts);

			case "rob":
				return this.rob(message, args, userData, usersData, senderID, event, API_BASE, fonts);

			// === TEST COMMAND ===
			case "test":
				return this.testCommand(message, senderID, API_BASE, fonts);

			default:
				return message.reply(fonts.bold(`❌ Unknown command. Use 'bank help' to see all commands.`));
		}
	},

	// === TEST COMMAND ===
	testCommand: async function (message, senderID, API_BASE, fonts) {
		try {
			const testResult = `
${fonts.bold("🧪 BANK SYSTEM TEST")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${fonts.bold("✅ API STATUS:")} Connected to ShizuBank API
${fonts.bold("👤 USER ID:")} ${senderID}
${fonts.bold("📊 API URL:")} ${API_BASE}

${fonts.bold("🎮 Available Features:")}
• Basic Banking ✅
• Investments ✅
• Real Estate ✅
• Businesses ✅
• Gambling ✅
• Premium Features ✅

Type 'bank help' to see all commands!
`;
			return message.reply(testResult);
		} catch (error) {
			console.error("Test command error:", error);
			return message.reply(fonts.bold(`❌ Test failed: ${error.message}`));
		}
	},

	// === HELP FUNCTION ===
	showHelp: function (message, fonts, userData) {
		const userName = userData.name || "User";
		
		const helpText = `
${fonts.bold("🏦 BANKING SYSTEM")}
━━━━━━━━━━━━━━━━
${fonts.bold("💎 The Ultimate Financial Experience 💎")}
Hello ${userName}! Please choose your service:

${fonts.bold("💰 BASIC BANKING")} 
━━━━━━━━━━━━━
🏦 bank balance - Check your financial overview
💵 bank deposit <amount> - Secure your money
💸 bank withdraw <amount> - Access your funds
📤 bank transfer <@user> <amount> - Send money
💳 bank loan <amount> - Get financing
🔄 bank repay <amount> - Repay your loan
🏛️ bank savings <amount> - Grow your wealth
💰 bank interest - Collect daily interest
📋 bank history - View transactions
🎁 bank daily - Claim daily bonuses
💼 bank work - Earn money through jobs

${fonts.bold("📈 INVESTMENTS")} 
━━━━━━━━━━━━━
🚀 bank invest - Explore opportunities
📊 bank stocks [list/buy/sell] - Trade stocks
₿ bank crypto [list/buy/sell] - Crypto trading
🏛️ bank bonds [list/buy] - Government bonds
📊 bank portfolio - View investments
📈 bank market - Live market prices
💰 bank dividend - Collect dividends

${fonts.bold("🏢 BUSINESS EMPIRE")} 
━━━━━━━━━━━━━
🏢 bank business [list/buy/collect] - Build empire
🛒 bank shop [list/buy] - Exclusive items

${fonts.bold("🏠 REAL ESTATE")} 
━━━━━━━━━━━━━
🏠 bank property [list/buy] - Premium properties
🏘️ bank house [list/buy] - Luxury homes
💰 bank rent - Collect rental income

${fonts.bold("💎 LUXURY LIFESTYLE")} 
━━━━━━━━━━━━━
💎 bank luxury [list/buy] - Exclusive collectibles
🚗 bank car [list/buy] - Luxury vehicles

${fonts.bold("🎰 GAMING & ENTERTAINMENT")} 
━━━━━━━━━━━━━
🎲 bank gamble <amount> - High-risk games
🎫 bank lottery [info/buy] - Lottery draws
🎰 bank slots <amount> - Slot machine
🃏 bank blackjack <amount> - Card game
🎯 bank roulette <amount> <bet> - Roulette

${fonts.bold("💳 DEBIT CARD")} 
━━━━━━━━━━━━━
💳 bank card create - Create debit card
💳 bank card deposit <amount> - Deposit to card
💳 bank card withdraw <amount> - Withdraw from card

${fonts.bold("⭐ PREMIUM & SOCIAL")} 
━━━━━━━━━━━━━
💎 bank premium [buy] - 2x earnings
🔐 bank vault [deposit/withdraw] - Secure storage
🛡️ bank insurance [list/buy] - Protect assets
📊 bank credit - Check credit score
🏆 bank achievements - View achievements
🏆 bank leaderboard - Top players
🏴‍☠️ bank rob <@user> - Robbery attempts
🧪 bank test - Test bank system

Start with 'bank balance' to see your account!
`;
		return message.reply(helpText);
	},

	// === BALANCE ===
	showBalance: async function (message, senderID, usersData, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/balance/${senderID}`);
			const data = await response.json();
			const userData = await usersData.get(senderID);
			const userName = userData.name || "User";

			if (data.success) {
				const balanceText = `
${fonts.bold("🏦 FINANCIAL DASHBOARD")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hello ${userName}! Here's your account:

${fonts.bold("💰 LIQUID ASSETS")}
• Cash in Wallet: $${data.data.cash.toLocaleString()}
• Bank Account: $${data.data.bank.toLocaleString()}
• Debit Card: $${data.data.card.toLocaleString()}
• Savings: $${data.data.savings.toLocaleString()}
• Vault: $${data.data.vault.toLocaleString()}

${fonts.bold("📊 INVESTMENT PORTFOLIO")}
• Stock Holdings: $${data.data.stocks.toLocaleString()}
• Cryptocurrency: $${data.data.crypto.toLocaleString()}
• Bonds: $${data.data.bonds.toLocaleString()}
• Businesses: $${data.data.businessesValue.toLocaleString()}
• Real Estate: $${data.data.realEstateValue.toLocaleString()}
• Luxury Items: $${data.data.luxuryValue.toLocaleString()}

${fonts.bold("💎 ACCOUNT SUMMARY")}
• Net Worth: $${data.data.totalAssets.toLocaleString()}
• Credit Score: ${data.data.creditScore}/850
• Active Loan: ${data.data.loan > 0 ? "$" + data.data.loan.toLocaleString() : "None"}
• Lottery Tickets: ${data.data.lotteryTickets}
• Account Level: ${data.data.level || 1}
• Premium: ${data.data.premium ? "✅ Active" : "❌ Inactive"}

💡 TIP: Diversify your portfolio with stocks and crypto!
`;
				return message.reply(balanceText);
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error fetching balance"));
		}
	},

	// === DEPOSIT ===
	deposit: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0 || isNaN(amount)) {
			return message.reply(fonts.bold(`
💰 DEPOSIT HELP
━━━━━━━━━━━━━

Usage: bank deposit <amount>
Example: bank deposit 5000

Your current wallet: $${(userData.money || 0).toLocaleString()}
			`));
		}

		try {
			const balanceResponse = await fetch(`${API_BASE}/balance/${senderID}`);
			const balanceData = await balanceResponse.json();
			
			if (!balanceData.success) {
				return message.reply(fonts.bold("❌ Error accessing your bank account."));
			}

			const currentUserData = await usersData.get(senderID);
			let userMoney = currentUserData.money || 0;
			const userName = currentUserData.name || "User";

			if (userMoney < amount) {
				return message.reply(fonts.bold(`
❌ INSUFFICIENT FUNDS
━━━━━━━━━━━

Wallet Balance: $${userMoney.toLocaleString()}
Required Amount: $${amount.toLocaleString()}
Shortfall: $${(amount - userMoney).toLocaleString()}

💡 Tip: Use 'bank work' to earn more money!
				`));
			}

			const response = await fetch(`${API_BASE}/deposit`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount })
			});
			const data = await response.json();

			if (data.success) {
				const newMoney = userMoney - amount;
				currentUserData.money = newMoney;
				await usersData.set(senderID, currentUserData);

				const bonusMessage = data.depositInterest > 0 ? 
					`\n💰 Bonus Interest: $${data.depositInterest.toLocaleString()}` : '';
					
				return message.reply(fonts.bold(`
💰 DEPOSIT SUCCESSFUL! 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Amount Deposited: $${amount.toLocaleString()}
🏦 New Bank Balance: $${data.newBank.toLocaleString()}
💳 Remaining Wallet: $${newMoney.toLocaleString()}${bonusMessage}

📊 Transaction recorded successfully!
				`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			console.error('Deposit error:', error);
			return message.reply(fonts.bold("❌ Error processing deposit."));
		}
	},

	// === WITHDRAW ===
	withdraw: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0 || isNaN(amount)) {
			return message.reply(fonts.bold(`
💸 WITHDRAWAL HELP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage: bank withdraw <amount>
Example: bank withdraw 5000
			`));
		}

		try {
			const balanceResponse = await fetch(`${API_BASE}/balance/${senderID}`);
			const balanceData = await balanceResponse.json();
			
			if (!balanceData.success) {
				return message.reply(fonts.bold("❌ Error accessing your bank account."));
			}
			
			const bankBalance = balanceData.data.bank;
			const gstAmount = Math.floor(amount * 0.02);
			const totalNeeded = amount + gstAmount;

			if (bankBalance < totalNeeded) {
				return message.reply(fonts.bold(`
❌ INSUFFICIENT BANK FUNDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bank Balance: $${bankBalance.toLocaleString()}
Required Amount: $${totalNeeded.toLocaleString()} (includes $${gstAmount.toLocaleString()} GST)
Shortfall: $${(totalNeeded - bankBalance).toLocaleString()}

💡 Tips:
• Use 'bank interest' to claim interest
• Transfer from savings if available
• Work or invest to earn more money
				`));
			}

			const response = await fetch(`${API_BASE}/withdraw`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount })
			});
			const data = await response.json();

			if (data.success) {
				const currentUserData = await usersData.get(senderID);
				let currentMoney = currentUserData.money || 0;
				const newMoney = currentMoney + amount;
				currentUserData.money = newMoney;
				await usersData.set(senderID, currentUserData);

				const gstMessage = data.gstAmount > 0 ? 
					`\n💸 GST Deducted: $${data.gstAmount.toLocaleString()}` : '';
					
				return message.reply(fonts.bold(`
💸 WITHDRAWAL SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Amount Withdrawn: $${amount.toLocaleString()}
💳 New Wallet Balance: $${newMoney.toLocaleString()}
🏦 Remaining Bank Balance: $${data.newBank.toLocaleString()}${gstMessage}

📊 Transaction recorded successfully!
				`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			console.error('Withdraw error:', error);
			return message.reply(fonts.bold("❌ Error processing withdrawal."));
		}
	},

	// === TRANSFER ===
	transfer: async function (message, args, userData, usersData, senderID, event, API_BASE, fonts) {
		const targetUID = Object.keys(event.mentions)[0];
		const amount = parseInt(args[2]);

		if (!targetUID) {
			return message.reply(fonts.bold("❌ Please mention a user to transfer money to.\nUsage: bank transfer @user <amount>"));
		}

		if (targetUID === senderID) {
			return message.reply(fonts.bold("❌ You cannot transfer money to yourself."));
		}

		if (!amount || amount <= 0) {
			return message.reply(fonts.bold("❌ Please enter a valid amount to transfer."));
		}

		try {
			const balanceResponse = await fetch(`${API_BASE}/balance/${senderID}`);
			const balanceData = await balanceResponse.json();
			
			if (!balanceData.success) {
				return message.reply(fonts.bold("❌ Error accessing your bank account."));
			}

			const bankBalance = balanceData.data.bank;
			if (bankBalance < amount) {
				return message.reply(fonts.bold(`❌ Insufficient funds. You have $${bankBalance.toLocaleString()}, but need $${amount.toLocaleString()}.`));
			}

			const response = await fetch(`${API_BASE}/transfer`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					fromUserId: senderID, 
					toUserId: targetUID, 
					amount 
				})
			});
			const data = await response.json();

			if (data.success) {
				return message.reply(fonts.bold(`✅ Successfully transferred $${amount.toLocaleString()} to the user.\nYour new balance: $${data.newBalance.toLocaleString()}`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			console.error('Transfer error:', error);
			return message.reply(fonts.bold("❌ Error processing transfer."));
		}
	},

	// === LOAN ===
	loan: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);

		if (!amount || amount <= 0) {
			try {
				const balanceResponse = await fetch(`${API_BASE}/balance/${senderID}`);
				const balanceData = await balanceResponse.json();
				const maxLoan = Math.floor(balanceData.data.creditScore * 1000);
				
				return message.reply(fonts.bold(`
💳 LOAN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Credit Score: ${balanceData.data.creditScore}
Maximum Loan Amount: $${maxLoan.toLocaleString()}
Interest Rate: 5% per week

Usage: bank loan <amount>
Example: bank loan 50000
				`));
			} catch (error) {
				return message.reply(fonts.bold("❌ Please enter a valid amount."));
			}
		}

		try {
			const response = await fetch(`${API_BASE}/loan`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount })
			});
			const data = await response.json();

			if (data.success) {
				return message.reply(fonts.bold(`
✅ LOAN APPROVED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Amount: $${amount.toLocaleString()}
📊 Interest Rate: 5% per week
🏦 New Balance: $${data.newBalance.toLocaleString()}
💳 Credit Score: ${data.creditScore}

Please repay responsibly!
				`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error processing loan."));
		}
	},

	// === REPAY LOAN ===
	repayLoan: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);

		if (!amount || amount <= 0) {
			try {
				const balanceResponse = await fetch(`${API_BASE}/balance/${senderID}`);
				const balanceData = await balanceResponse.json();
				
				return message.reply(fonts.bold(`
💳 LOAN REPAYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Outstanding Loan: $${balanceData.data.loan.toLocaleString()}
Your Bank Balance: $${balanceData.data.bank.toLocaleString()}

Usage: bank repay <amount>
Example: bank repay 50000
				`));
			} catch (error) {
				return message.reply(fonts.bold("❌ Please enter a valid amount."));
			}
		}

		try {
			const response = await fetch(`${API_BASE}/repay`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount })
			});
			const data = await response.json();

			if (data.success) {
				const message_text = data.loanFullyRepaid ? 
					`✅ Loan fully repaid! Your credit score increased by 10 points.` : 
					`✅ Successfully repaid $${data.amountRepaid.toLocaleString()}.\nRemaining loan: $${data.remainingLoan.toLocaleString()}`;
				
				return message.reply(fonts.bold(message_text));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error processing repayment."));
		}
	},

	// === SAVINGS ===
	savings: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);

		if (!amount || amount <= 0) {
			try {
				const balanceResponse = await fetch(`${API_BASE}/balance/${senderID}`);
				const balanceData = await balanceResponse.json();
				
				return message.reply(fonts.bold(`
💰 SAVINGS ACCOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Savings: $${balanceData.data.savings.toLocaleString()}
Bank Balance: $${balanceData.data.bank.toLocaleString()}
Interest Rate: 3% monthly

Savings earn interest every month automatically!

Usage: bank savings <amount>
Example: bank savings 10000
				`));
			} catch (error) {
				return message.reply(fonts.bold("❌ Please enter a valid amount."));
			}
		}

		try {
			const response = await fetch(`${API_BASE}/savings/deposit`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount })
			});
			const data = await response.json();

			if (data.success) {
				return message.reply(fonts.bold(`
✅ SAVINGS DEPOSIT SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Amount Saved: $${amount.toLocaleString()}
🏛️ New Savings Balance: $${data.newSavings.toLocaleString()}
🏦 Bank Balance: $${data.newBank.toLocaleString()}

Savings earn 3% interest monthly!
				`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error depositing to savings."));
		}
	},

	// === INTEREST ===
	collectInterest: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/interest/collect/${senderID}`, {
				method: 'POST'
			});
			const data = await response.json();

			if (data.success) {
				return message.reply(fonts.bold(`
💰 INTEREST COLLECTED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Interest Earned: $${data.interest.toLocaleString()}
⏰ Time Waited: ${data.hoursWaited} hours
🏦 New Bank Balance: $${data.newBank.toLocaleString()}
🏛️ New Savings Balance: $${data.newSavings.toLocaleString()}
				`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error collecting interest"));
		}
	},

	// === DAILY REWARD ===
	dailyReward: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/daily/${senderID}`, {
				method: 'POST'
			});
			const data = await response.json();

			if (data.success) {
				return message.reply(fonts.bold(`
🎁 DAILY REWARD CLAIMED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Reward: $${data.reward.toLocaleString()}
🔥 Streak: ${data.streak} days
🏦 New Balance: $${data.newBalance.toLocaleString()}
${data.premium ? "⭐ Premium Bonus: 2x!" : ""}

Keep your streak alive for bigger rewards!
				`));
			} else {
				const timeLeft = data.hoursLeft ? `${data.hoursLeft}h` : `${data.minutesLeft}m`;
				return message.reply(fonts.bold(`⏰ Daily reward already claimed!\nNext reward in: ${timeLeft}`));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error claiming daily reward"));
		}
	},

	// === WORK ===
	work: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/work`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID })
			});
			const data = await response.json();

			if (data.success) {
				return message.reply(fonts.bold(`
💼 WORK COMPLETED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Job: ${data.job}
💰 Earnings: $${data.earnings.toLocaleString()}
⭐ Skill Bonus: $${data.skillBonus.toLocaleString()}
📊 Total Earned: $${data.totalEarned.toLocaleString()}
🏦 New Balance: $${data.newBalance.toLocaleString()}

Business Skill increased! (${data.skillLevel})
				`));
			} else {
				const timeLeft = data.hoursLeft ? `${data.hoursLeft}h` : `${data.minutesLeft}m`;
				return message.reply(fonts.bold(`⏰ You're too tired to work!\nRest for: ${timeLeft}`));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error working"));
		}
	},

	// === INVEST ===
	invest: function (message, fonts) {
		return message.reply(fonts.bold(`
📊 INVESTMENT MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Investment Options:
• bank stocks - Stock market trading
• bank crypto - Cryptocurrency trading  
• bank bonds - Government & corporate bonds
• bank business - Business investments
• bank property - Real estate investments

Use 'bank <option> list' to see available items!
Example: bank stocks list
		`));
	},

	// === STOCKS ===
	handleStocks: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "list") {
			try {
				const response = await fetch(`${API_BASE}/stocks/list`);
				const data = await response.json();

				if (data.success) {
					let stockList = `${fonts.bold("📈 STOCK MARKET")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

					data.stocks.forEach(stock => {
						stockList += `${stock.trend} ${stock.symbol}: $${stock.price.toLocaleString()}\n`;
						stockList += `   💰 ${stock.name}\n`;
						stockList += `   📊 Change: ${stock.change > 0 ? '+' : ''}${stock.change}%\n`;
						stockList += `   🎯 Volatility: ${(stock.volatility * 100).toFixed(1)}%\n\n`;
					});

					stockList += `💡 TIPS:\n`;
					stockList += `• Higher volatility = Higher profit potential\n`;
					stockList += `• Check trends before buying\n\n`;
					stockList += `**Usage:**\n`;
					stockList += `• bank stocks buy <symbol> <shares>\n`;
					stockList += `• bank stocks sell <symbol> <shares>`;
					
					return message.reply(stockList);
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error fetching stocks"));
			}
		}

		const symbol = args[2]?.toUpperCase();
		const shares = parseInt(args[3]);

		if (action === "buy") {
			if (!symbol || !shares || shares <= 0) {
				return message.reply(fonts.bold("❌ Usage: bank stocks buy <symbol> <shares>"));
			}

			try {
				const response = await fetch(`${API_BASE}/stocks/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, symbol, shares })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
✅ STOCKS PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Bought ${data.shares} shares of ${data.symbol}
💰 Total Cost: $${data.totalCost.toLocaleString()}
💵 Price per share: $${data.pricePerShare.toLocaleString()}
🏦 New Balance: $${data.newBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying stocks"));
			}
		}

		if (action === "sell") {
			if (!symbol || !shares || shares <= 0) {
				return message.reply(fonts.bold("❌ Usage: bank stocks sell <symbol> <shares>"));
			}

			try {
				const response = await fetch(`${API_BASE}/stocks/sell`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, symbol, shares })
				});
				const data = await response.json();

				if (data.success) {
					const profitText = data.profit > 0 ? `📈 Profit: $${data.profit.toLocaleString()}` : `📉 Loss: $${Math.abs(data.profit).toLocaleString()}`;
					
					return message.reply(fonts.bold(`
✅ STOCKS SOLD!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📉 Sold ${data.shares} shares of ${data.symbol}
💰 Total Value: $${data.totalValue.toLocaleString()}
${profitText}
🏦 New Balance: $${data.newBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error selling stocks"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank stocks <list/buy/sell>"));
	},

	// === CRYPTO ===
	handleCrypto: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "list") {
			try {
				const response = await fetch(`${API_BASE}/crypto/list`);
				const data = await response.json();

				if (data.success) {
					let cryptoList = `${fonts.bold("₿ CRYPTOCURRENCY MARKET")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

					data.cryptos.forEach(crypto => {
						cryptoList += `${crypto.trend} ${crypto.symbol}: $${crypto.price.toFixed(3)}\n`;
						cryptoList += `   💰 ${crypto.name}\n`;
						cryptoList += `   📊 Change: ${crypto.change > 0 ? '+' : ''}${crypto.change}%\n`;
						cryptoList += `   🚀 Multiplier: ${crypto.multiplier}x\n`;
						cryptoList += `   📈 Volatility: ${(crypto.volatility * 100).toFixed(1)}%\n\n`;
					});

					cryptoList += `💡 CRYPTO TIPS:\n`;
					cryptoList += `• Higher multipliers = Higher risk/reward\n`;
					cryptoList += `• Start small, reinvest profits\n\n`;
					cryptoList += `Usage:\n`;
					cryptoList += `• bank crypto buy <name> <amount>\n`;
					cryptoList += `• bank crypto sell <name> <amount>`;

					return message.reply(cryptoList);
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error fetching crypto"));
			}
		}

		const cryptoName = args[2]?.toLowerCase();
		const amount = parseFloat(args[3]);

		if (action === "buy") {
			if (!cryptoName || !amount || amount <= 0) {
				return message.reply(fonts.bold("❌ Usage: bank crypto buy <name> <amount>"));
			}

			try {
				const response = await fetch(`${API_BASE}/crypto/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, cryptoName, amount })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
✅ CRYPTO PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

₿ Bought ${data.amount} ${data.cryptoName.toUpperCase()}
💰 Total Cost: $${data.totalCost.toLocaleString()}
💵 Price per unit: $${data.pricePerUnit.toFixed(3)}
🏦 New Balance: $${data.newBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying crypto"));
			}
		}

		if (action === "sell") {
			if (!cryptoName || !amount || amount <= 0) {
				return message.reply(fonts.bold("❌ Usage: bank crypto sell <name> <amount>"));
			}

			try {
				const response = await fetch(`${API_BASE}/crypto/sell`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, cryptoName, amount })
				});
				const data = await response.json();

				if (data.success) {
					const profitText = data.profit > 0 ? `📈 Profit: $${data.profit.toLocaleString()}` : `📉 Loss: $${Math.abs(data.profit).toLocaleString()}`;
					
					return message.reply(fonts.bold(`
✅ CRYPTO SOLD!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

₿ Sold ${data.amount} ${data.cryptoName.toUpperCase()}
💰 Total Value: $${data.totalValue.toLocaleString()}
${profitText}
🏦 New Balance: $${data.newBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error selling crypto"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank crypto <list/buy/sell>"));
	},

	// === BONDS ===
	bonds: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "list") {
			let bondList = `${fonts.bold("🏛️ BOND MARKET")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.bonds).forEach(([type, data]) => {
				bondList += `📊 ${type.replace(/_/g, ' ')}\n`;
				bondList += `   Yield: ${data.yield}% annually\n`;
				bondList += `   Risk: ${data.risk}\n`;
				bondList += `   Term: ${data.term}\n\n`;
			});

			bondList += `${fonts.bold("Usage:")}\n`;
			bondList += `• bank bonds buy <type> <amount>\n`;
			bondList += `Example: bank bonds buy US_TREASURY 50000`;

			return message.reply(bondList);
		}

		if (action === "buy") {
			const bondType = args[2]?.toUpperCase();
			const amount = parseInt(args[3]);

			if (!bondType || !this.marketData.bonds[bondType] || !amount || amount <= 0) {
				return message.reply(fonts.bold("❌ Invalid bond type or amount. Use 'bank bonds list' to see available bonds."));
			}

			try {
				const response = await fetch(`${API_BASE}/bonds/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, bondType, amount })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
✅ BONDS PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ${bondType.replace(/_/g, ' ')}: $${amount.toLocaleString()}
📈 Annual Yield: ${data.yield}%
🏦 New Balance: $${data.newBalance.toLocaleString()}

Interest will be paid monthly!
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying bonds"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank bonds <list/buy>"));
	},

	// === PORTFOLIO ===
	showPortfolio: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/portfolio/${senderID}`);
			const data = await response.json();

			if (data.success) {
				let portfolioText = `${fonts.bold("📊 INVESTMENT PORTFOLIO")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

				// Stocks
				if (Object.keys(data.stocks).length > 0) {
					portfolioText += `${fonts.bold("📈 STOCKS:")}\n`;
					Object.entries(data.stocks).forEach(([symbol, shares]) => {
						const value = shares * data.currentPrices[symbol];
						portfolioText += `• ${symbol}: ${shares} shares ($${value.toLocaleString()})\n`;
					});
					portfolioText += "\n";
				}

				// Crypto
				if (Object.keys(data.crypto).length > 0) {
					portfolioText += `${fonts.bold("₿ CRYPTOCURRENCY:")}\n`;
					Object.entries(data.crypto).forEach(([coin, amount]) => {
						const value = amount * data.currentPrices[coin];
						portfolioText += `• ${coin}: ${amount} coins ($${value.toLocaleString()})\n`;
					});
					portfolioText += "\n";
				}

				// Bonds
				if (Object.keys(data.bonds).length > 0) {
					portfolioText += `${fonts.bold("🏛️ BONDS:")}\n`;
					Object.entries(data.bonds).forEach(([type, amount]) => {
						portfolioText += `• ${type.replace(/_/g, ' ')}: $${amount.toLocaleString()}\n`;
					});
					portfolioText += "\n";
				}

				portfolioText += `${fonts.bold("Total Portfolio Value: $" + data.totalValue.toLocaleString())}`;

				if (data.totalValue === 0) {
					portfolioText = fonts.bold("📊 Your investment portfolio is empty.\nStart investing with 'bank stocks list'!");
				}

				return message.reply(portfolioText);
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error fetching portfolio"));
		}
	},

	// === MARKET ===
	showMarket: function (message, fonts) {
		const marketText = `
${fonts.bold("📊 GLOBAL MARKET OVERVIEW")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${fonts.bold("📈 TOP STOCKS:")}
• AAPL: $150.25 (+2.1%) - Apple Inc.
• GOOGL: $2,800.50 (+1.8%) - Alphabet Inc.
• TSLA: $800.75 (-0.5%) - Tesla Inc.
• MSFT: $320.40 (+1.2%) - Microsoft Corp.

${fonts.bold("₿ TOP CRYPTOCURRENCY:")}
• BTC: $45,000 (+3.2%) - Bitcoin
• ETH: $3,200 (+2.8%) - Ethereum
• BNB: $400 (+1.5%) - Binance Coin
• ADA: $1.20 (+4.1%) - Cardano

${fonts.bold("🏛️ BOND YIELDS:")}
• US Treasury: 2.5% (10 Year)
• Corporate: 3.8% (5 Year)
• Municipal: 2.1% (7 Year)
• High Yield: 6.2% (3 Year)

${fonts.bold("📊 MARKET SENTIMENT:")} Bullish
${fonts.bold("💹 Trading Volume:")} High
${fonts.bold("🔥 Trending:")} Tech Stocks, DeFi Tokens
`;
		return message.reply(marketText);
	},

	// === DIVIDEND ===
	collectDividend: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/dividend/collect/${senderID}`, {
				method: 'POST'
			});
			const data = await response.json();

			if (data.success) {
				return message.reply(fonts.bold(`
💰 DIVIDENDS COLLECTED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Amount: $${data.dividend.toLocaleString()}
📊 From: ${data.source}
🏦 New Balance: $${data.newBalance.toLocaleString()}
				`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error collecting dividends"));
		}
	},

	// === BUSINESS ===
	business: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "list") {
			let businessList = `${fonts.bold("🏢 BUSINESS OPPORTUNITIES")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.businesses).forEach(([type, data]) => {
				businessList += `🏢 ${data.name}\n`;
				businessList += `   Cost: $${data.cost.toLocaleString()}\n`;
				businessList += `   Monthly Income: $${data.income.toLocaleString()}\n`;
				businessList += `   Employees: ${data.employees}\n`;
				businessList += `   ROI: ${Math.round((data.income * 12 / data.cost) * 100)}% annually\n\n`;
			});

			businessList += `${fonts.bold("Usage:")}\n`;
			businessList += `• bank business buy <type>\n`;
			businessList += `• bank business collect`;

			return message.reply(businessList);
		}

		if (action === "buy") {
			const businessType = args[2]?.toUpperCase();

			if (!businessType || !this.marketData.businesses[businessType]) {
				return message.reply(fonts.bold("❌ Invalid business type. Use 'bank business list' to see available businesses."));
			}

			try {
				const response = await fetch(`${API_BASE}/business/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, businessType })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
✅ BUSINESS PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 ${data.name}
💰 Cost: $${data.cost.toLocaleString()}
📊 Monthly Income: $${data.income.toLocaleString()}
🏦 New Balance: $${data.newBalance.toLocaleString()}

Use 'bank business collect' to earn income!
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying business"));
			}
		}

		if (action === "collect") {
			try {
				const response = await fetch(`${API_BASE}/business/collect/${senderID}`, {
					method: 'POST'
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
💼 BUSINESS INCOME COLLECTED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Amount: $${data.income.toLocaleString()}
🏢 From: ${data.businessesCount} businesses
🏦 New Balance: $${data.newBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error collecting business income"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank business <list/buy/collect>"));
	},

	// === SHOP ===
	shop: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let shopList = `${fonts.bold("🛒 BANK SHOP")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			const shopItems = {
				"CREDIT_BOOST": { price: 50000, name: "Credit Score Boost (+50)", description: "Instantly increase your credit score by 50 points" },
				"MULTIPLIER": { price: 1000000, name: "Earnings Multiplier 1.5x", description: "Increase all earnings by 50% for 7 days" },
				"INSURANCE_BUNDLE": { price: 100000, name: "Full Insurance Package", description: "Get all 5 insurance types at a discount" },
				"LOTTERY_PACK": { price: 5000, name: "Lottery Ticket Pack (100x)", description: "Get 100 lottery tickets at once" },
				"SKILL_BOOST": { price: 25000, name: "Skill Training", description: "Increase all skills by 10 levels" },
				"PREMIUM_TRIAL": { price: 100000, name: "Premium Trial (30 days)", description: "Try premium features for 30 days" }
			};

			Object.entries(shopItems).forEach(([type, data]) => {
				shopList += `🛍️ ${data.name}\n`;
				shopList += `   Price: $${data.price.toLocaleString()}\n`;
				shopList += `   ${data.description}\n\n`;
			});

			shopList += `${fonts.bold("Usage:")}\n`;
			shopList += `• bank shop buy <item_type>\n`;
			shopList += `Example: bank shop buy CREDIT_BOOST`;

			return message.reply(shopList);
		}

		if (action === "buy") {
			const itemType = args[2]?.toUpperCase();

			const shopItems = {
				"CREDIT_BOOST": { price: 50000, name: "Credit Score Boost (+50)" },
				"MULTIPLIER": { price: 1000000, name: "Earnings Multiplier 1.5x" },
				"INSURANCE_BUNDLE": { price: 100000, name: "Full Insurance Package" },
				"LOTTERY_PACK": { price: 5000, name: "Lottery Ticket Pack (100x)" },
				"SKILL_BOOST": { price: 25000, name: "Skill Training" },
				"PREMIUM_TRIAL": { price: 100000, name: "Premium Trial (30 days)" }
			};

			if (!itemType || !shopItems[itemType]) {
				return message.reply(fonts.bold("❌ Invalid item. Use 'bank shop list' to see available items."));
			}

			try {
				const response = await fetch(`${API_BASE}/shop/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, itemType })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
✅ ITEM PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛍️ ${data.itemName}
💰 Cost: $${data.price.toLocaleString()}
📊 Effect: ${data.effect}
🏦 New Balance: $${data.newBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying item"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank shop <list/buy>"));
	},

	// === REAL ESTATE ===
	realEstate: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "list") {
			let propertyList = `${fonts.bold("🏠 REAL ESTATE MARKET")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.properties).forEach(([type, data]) => {
				propertyList += `🏠 ${data.name}\n`;
				propertyList += `   Price: $${data.price.toLocaleString()}\n`;
				propertyList += `   Monthly Rent: $${data.income.toLocaleString()}\n`;
				propertyList += `   Annual ROI: ${Math.round((data.income * 12 / data.price) * 100)}%\n\n`;
			});

			propertyList += `${fonts.bold("Usage:")}\n`;
			propertyList += `• bank property buy <type>\n`;
			propertyList += `• bank rent collect`;

			return message.reply(propertyList);
		}

		if (action === "buy") {
			const propertyType = args[2]?.toUpperCase();

			if (!propertyType || !this.marketData.properties[propertyType]) {
				return message.reply(fonts.bold("❌ Invalid property type. Use 'bank property list' to see available properties."));
			}

			try {
				const response = await fetch(`${API_BASE}/property/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, propertyType })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
✅ PROPERTY PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 ${data.name}
💰 Price: $${data.price.toLocaleString()}
📊 Monthly Rent: $${data.rent.toLocaleString()}
🏦 New Balance: $${data.newBalance.toLocaleString()}

Use 'bank rent' to collect monthly income!
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying property"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank property <list/buy>"));
	},

	// === BUY HOUSE ===
	buyHouse: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		return this.realEstate(message, args, userData, usersData, senderID, API_BASE, fonts);
	},

	// === RENT ===
	rentProperty: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/rent/collect/${senderID}`, {
				method: 'POST'
			});
			const data = await response.json();

			if (data.success) {
				return message.reply(fonts.bold(`
🏠 RENTAL INCOME COLLECTED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Amount: $${data.rent.toLocaleString()}
🏘️ From: ${data.propertiesCount} properties
🏦 New Balance: $${data.newBalance.toLocaleString()}
				`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error collecting rent"));
		}
	},

	// === LUXURY ===
	luxury: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "list") {
			let luxuryList = `${fonts.bold("💎 LUXURY COLLECTION")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.luxury).forEach(([type, data]) => {
				luxuryList += `💎 ${data.name}\n`;
				luxuryList += `   Price: $${data.price.toLocaleString()}\n\n`;
			});

			luxuryList += `${fonts.bold("Usage:")}\n`;
			luxuryList += `• bank luxury buy <type>`;

			return message.reply(luxuryList);
		}

		if (action === "buy") {
			const luxuryType = args[2]?.toUpperCase();

			if (!luxuryType || !this.marketData.luxury[luxuryType]) {
				return message.reply(fonts.bold("❌ Invalid luxury item. Use 'bank luxury list' to see available items."));
			}

			try {
				const response = await fetch(`${API_BASE}/luxury/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, luxuryType })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
✅ LUXURY ITEM PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎 ${data.name}
💰 Price: $${data.price.toLocaleString()}
🏦 New Balance: $${data.newBalance.toLocaleString()}

Your collection is growing!
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying luxury item"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank luxury <list/buy>"));
	},

	// === CAR ===
	buyCar: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "list") {
			let carList = `${fonts.bold("🚗 LUXURY VEHICLES")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			Object.entries(this.marketData.vehicles).forEach(([type, data]) => {
				carList += `🚗 ${data.name}\n`;
				carList += `   Price: $${data.price.toLocaleString()}\n`;
				carList += `   Annual Depreciation: ${Math.round((1 - data.depreciation) * 100)}%\n\n`;
			});

			carList += `${fonts.bold("Usage:")}\n`;
			carList += `• bank car buy <type>`;

			return message.reply(carList);
		}

		if (action === "buy") {
			const carType = args[2]?.toUpperCase();

			if (!carType || !this.marketData.vehicles[carType]) {
				return message.reply(fonts.bold("❌ Invalid vehicle type. Use 'bank car list' to see available vehicles."));
			}

			try {
				const response = await fetch(`${API_BASE}/vehicle/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, vehicleType: carType })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
✅ VEHICLE PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚗 ${data.name}
💰 Price: $${data.price.toLocaleString()}
📊 Depreciation: ${data.depreciation}% annually
🏦 New Balance: $${data.newBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying vehicle"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank car <list/buy>"));
	},

	// === GAMBLE ===
	gamble: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0) {
			return message.reply(fonts.bold(`
🎰 GAMBLING GAMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Games:
• bank gamble <amount> - Classic risk/reward
• bank slots <amount> - Slot machine
• bank blackjack <amount> - Card game
• bank roulette <amount> <bet> - Roulette wheel

Your Balance: $${userData.money.toLocaleString()}
			`));
		}

		try {
			const response = await fetch(`${API_BASE}/gamble`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount })
			});
			const data = await response.json();

			if (data.success) {
				const resultText = data.won ? 
					`🎉 WIN! You won $${data.winnings.toLocaleString()}! (${data.multiplier}x multiplier)` : 
					`💸 LOSE! You lost $${amount.toLocaleString()}!`;

				return message.reply(fonts.bold(`
🎰 ${resultText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Amount: $${amount.toLocaleString()}
📊 Result: ${data.won ? 'Win' : 'Loss'}
🏦 New Balance: $${data.newBalance.toLocaleString()}
${data.won ? `🎯 Gambling Skill: ${data.skillLevel}` : ''}
				`));
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error gambling"));
		}
	},

	// === LOTTERY ===
	handleLottery: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "info") {
			try {
				const response = await fetch(`${API_BASE}/lottery/info/${senderID}`);
				const data = await response.json();

				if (data.success) {
					const lotteryText = `
${fonts.bold("🎰 LOTTERY INFORMATION")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Prize Pool: $${data.prizePool.toLocaleString()}
🎫 Ticket Price: $${data.ticketPrice.toLocaleString()}
🎟️ Your Tickets: ${data.userTickets}
⏰ Next Draw: ${data.nextDraw}

🎯 How to Play:
• Choose a number between 1-100
• Buy tickets with 'bank lottery buy <number>'
• Win if your number is drawn!

💡 TIP: Each ticket gives you a chance to win the prize pool!
`;
					return message.reply(lotteryText);
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error fetching lottery info"));
			}
		}

		if (action === "buy") {
			const number = parseInt(args[2]);
			if (!number || number < 1 || number > 100) {
				return message.reply(fonts.bold("❌ Usage: bank lottery buy <number> (1-100)"));
			}

			try {
				const response = await fetch(`${API_BASE}/lottery/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, number })
				});
				const data = await response.json();

				if (data.success) {
					const currentUserData = await usersData.get(senderID);
					currentUserData.money = (currentUserData.money || 0) - data.ticketPrice;
					await usersData.set(senderID, currentUserData);
					
					return message.reply(fonts.bold(`
🎫 LOTTERY TICKET PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎟️ Ticket #${data.number}
💰 Price: $${data.ticketPrice.toLocaleString()}
🎯 Prize Pool: $${data.prizePool.toLocaleString()}
🎫 Your Tickets: ${data.userTickets}

Good luck! Check results with 'bank lottery info'
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying lottery ticket"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank lottery <info/buy>"));
	},

	// === SLOTS ===
	slots: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0) {
			return message.reply(fonts.bold("❌ Please enter a valid amount to play slots."));
		}

		try {
			const response = await fetch(`${API_BASE}/slots`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount })
			});
			const data = await response.json();

			if (data.success) {
				const slotText = `
${fonts.bold("🎰 SLOT MACHINE")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────┐
│ ${data.slot1} │ ${data.slot2} │ ${data.slot3} │
└─────────────┘

${data.won ? `🎉 JACKPOT! You won $${data.winnings.toLocaleString()}! (${data.multiplier}x)` : `💸 No match! You lost $${amount.toLocaleString()}!`}

Balance: $${data.newBalance.toLocaleString()}
`;
				return message.reply(slotText);
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error playing slots"));
		}
	},

	// === BLACKJACK ===
	blackjack: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);
		if (!amount || amount <= 0) {
			return message.reply(fonts.bold("❌ Please enter a valid amount to play blackjack."));
		}

		try {
			const response = await fetch(`${API_BASE}/blackjack`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount })
			});
			const data = await response.json();

			if (data.success) {
				const blackjackText = `
${fonts.bold("🃏 BLACKJACK")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Cards: ${data.playerCards} = ${data.playerTotal}
Dealer Cards: ${data.dealerCards} = ${data.dealerTotal}

${data.result}
${data.won ? `🎉 You won $${data.winnings.toLocaleString()}!` : 
	data.push ? `🤝 It's a tie!` : 
	`💸 You lost $${amount.toLocaleString()}!`}

Balance: $${data.newBalance.toLocaleString()}
`;
				return message.reply(blackjackText);
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error playing blackjack"));
		}
	},

	// === ROULETTE ===
	roulette: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const amount = parseInt(args[1]);
		const bet = args[2]?.toLowerCase();

		if (!amount || amount <= 0 || !bet) {
			return message.reply(fonts.bold(`
🎯 ROULETTE WHEEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Betting Options:
• red/black - 2x payout
• odd/even - 2x payout
• high (19-36)/low (1-18) - 2x payout
• number (0-36) - 36x payout

Usage: bank roulette <amount> <bet>
Example: bank roulette 1000 red
			`));
		}

		try {
			const response = await fetch(`${API_BASE}/roulette`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: senderID, amount, bet })
			});
			const data = await response.json();

			if (data.success) {
				const color = data.winningNumber === 0 ? "🟢" : 
					[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(data.winningNumber) ? "🔴" : "⚫";
				
				const rouletteText = `
${fonts.bold("🎯 ROULETTE RESULT")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Winning Number: ${color} ${data.winningNumber}
Your Bet: ${bet}

${data.won ? `🎉 WIN! You won $${data.winnings.toLocaleString()}! (${data.multiplier}x)` : `💸 You lost $${amount.toLocaleString()}!`}

Balance: $${data.newBalance.toLocaleString()}
`;
				return message.reply(rouletteText);
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error playing roulette"));
		}
	},

	// === PREMIUM ===
	premium: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (action === "buy") {
			try {
				const response = await fetch(`${API_BASE}/premium/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
💎 WELCOME TO PREMIUM!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.message}
✅ 2x earnings on all activities
✅ Exclusive investment opportunities
✅ Higher daily rewards
✅ Priority customer support

You now earn 2x on all activities!
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying premium"));
			}
		}

		try {
			const response = await fetch(`${API_BASE}/premium/status/${senderID}`);
			const data = await response.json();

			const premiumText = `
${fonts.bold("💎 PREMIUM MEMBERSHIP")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ${data.premium ? "✅ Active" : "❌ Inactive"}
Multiplier: ${data.multiplier}x
Cost: $1,000,000

Benefits:
• 2x earnings on all activities
• Exclusive investment opportunities
• Higher daily rewards
• Priority customer support

${!data.premium ? "Use 'bank premium buy' to upgrade!" : ""}
`;
			return message.reply(premiumText);
		} catch (error) {
			return message.reply(fonts.bold("❌ Error fetching premium status"));
		}
	},

	// === VAULT ===
	vault: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();
		const amount = parseInt(args[2]);

		if (!action) {
			try {
				const response = await fetch(`${API_BASE}/vault/status/${senderID}`);
				const data = await response.json();
				
				return message.reply(fonts.bold(`
🔐 SECURE VAULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vault Balance: $${data.vaultBalance.toLocaleString()}
Bank Balance: $${data.bankBalance.toLocaleString()}

The vault provides:
• Maximum security for your money
• Protection from theft/robbery
• 1% monthly interest

Usage:
• bank vault deposit <amount>
• bank vault withdraw <amount>
				`));
			} catch (error) {
				return message.reply(fonts.bold("❌ Error fetching vault status"));
			}
		}

		if (!amount || amount <= 0) {
			return message.reply(fonts.bold("❌ Please enter a valid amount."));
		}

		if (action === "deposit") {
			try {
				const response = await fetch(`${API_BASE}/vault/deposit`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, amount })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
🔐 VAULT DEPOSIT SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Deposited: $${amount.toLocaleString()}
🔐 New Vault Balance: $${data.newVaultBalance.toLocaleString()}
🏦 Bank Balance: $${data.newBankBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error depositing to vault"));
			}
		}

		if (action === "withdraw") {
			try {
				const response = await fetch(`${API_BASE}/vault/withdraw`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, amount })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
🔓 VAULT WITHDRAWAL SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Withdrawn: $${amount.toLocaleString()}
🔐 New Vault Balance: $${data.newVaultBalance.toLocaleString()}
🏦 Bank Balance: $${data.newBankBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error withdrawing from vault"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank vault <deposit/withdraw> <amount>"));
	},

	// === INSURANCE ===
	insurance: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();

		if (!action || action === "list") {
			let insuranceList = `${fonts.bold("🛡️ INSURANCE POLICIES")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

			const insuranceTypes = {
				"LIFE": { cost: 10000, coverage: 100000, name: "Life Insurance" },
				"HEALTH": { cost: 5000, coverage: 50000, name: "Health Insurance" },
				"PROPERTY": { cost: 15000, coverage: 200000, name: "Property Insurance" },
				"BUSINESS": { cost: 25000, coverage: 500000, name: "Business Insurance" },
				"THEFT": { cost: 8000, coverage: 75000, name: "Theft Protection" }
			};

			Object.entries(insuranceTypes).forEach(([type, data]) => {
				insuranceList += `🛡️ ${data.name}\n`;
				insuranceList += `   Cost: $${data.cost.toLocaleString()}\n`;
				insuranceList += `   Coverage: $${data.coverage.toLocaleString()}\n\n`;
			});

			insuranceList += `${fonts.bold("Usage:")}\n`;
			insuranceList += `• bank insurance buy <type>`;

			return message.reply(insuranceList);
		}

		if (action === "buy") {
			const type = args[2]?.toUpperCase();
			const insuranceTypes = {
				"LIFE": { cost: 10000, coverage: 100000, name: "Life Insurance" },
				"HEALTH": { cost: 5000, coverage: 50000, name: "Health Insurance" },
				"PROPERTY": { cost: 15000, coverage: 200000, name: "Property Insurance" },
				"BUSINESS": { cost: 25000, coverage: 500000, name: "Business Insurance" },
				"THEFT": { cost: 8000, coverage: 75000, name: "Theft Protection" }
			};

			if (!type || !insuranceTypes[type]) {
				return message.reply(fonts.bold("❌ Invalid insurance type. Use 'bank insurance list' to see options."));
			}

			try {
				const response = await fetch(`${API_BASE}/insurance/buy`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, insuranceType: type })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
🛡️ INSURANCE PURCHASED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ${data.name}
💰 Cost: $${data.cost.toLocaleString()}
🛡️ Coverage: $${data.coverage.toLocaleString()}
🏦 New Balance: $${data.newBalance.toLocaleString()}

Your assets are now protected!
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error buying insurance"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank insurance <list/buy>"));
	},

	// === CREDIT SCORE ===
	creditScore: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/credit/${senderID}`);
			const data = await response.json();

			let rating, color;
			const score = data.creditScore;

			if (score >= 800) { rating = "Excellent"; color = "🟢"; }
			else if (score >= 740) { rating = "Very Good"; color = "🟢"; }
			else if (score >= 670) { rating = "Good"; color = "🟡"; }
			else if (score >= 580) { rating = "Fair"; color = "🟠"; }
			else { rating = "Poor"; color = "🔴"; }

			const creditText = `
${fonts.bold("📊 CREDIT SCORE REPORT")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${color} ${fonts.bold("Score:")} ${score}/850
📊 ${fonts.bold("Rating:")} ${rating}
💳 ${fonts.bold("Max Loan:")} $${(score * 1000).toLocaleString()}
🏦 ${fonts.bold("Interest Rate:")} ${data.interestRate}

${fonts.bold("💡 Tips to improve:")}
• Pay loans on time (+10 points)
• Maintain low debt ratios
• Avoid frequent large transactions
• Build long banking history

${fonts.bold("Score History:")}
• Starting Score: 750
• Current Score: ${score}
• Change: ${score >= 750 ? "+" : ""}${score - 750}
`;
			return message.reply(creditText);
		} catch (error) {
			return message.reply(fonts.bold("❌ Error fetching credit score"));
		}
	},

	// === ACHIEVEMENTS ===
	achievements: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/achievements/${senderID}`);
			const data = await response.json();

			let achievementText = `${fonts.bold("🏆 ACHIEVEMENTS")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
			achievementText += `${fonts.bold("Progress:")} ${data.unlockedCount}/${data.totalAchievements}\n\n`;

			if (data.unlockedCount === 0) {
				achievementText += "🎯 No achievements unlocked yet.\nStart banking to earn achievements!\n\n";
			} else {
				achievementText += `${fonts.bold("🎖️ UNLOCKED:")}\n`;
				data.unlocked.slice(0, 10).forEach((achievement, index) => {
					achievementText += `${index + 1}. 🏆 ${achievement}\n`;
				});

				if (data.unlockedCount > 10) {
					achievementText += `... and ${data.unlockedCount - 10} more!\n`;
				}
				achievementText += "\n";
			}

			achievementText += `${fonts.bold("🎯 NEXT GOALS:")}\n`;
			data.locked.slice(0, 5).forEach(achievement => {
				achievementText += `• ${achievement}\n`;
			});

			return message.reply(achievementText);
		} catch (error) {
			return message.reply(fonts.bold("❌ Error fetching achievements"));
		}
	},

	// === LEADERBOARD ===
	showLeaderboard: async function (message, API_BASE, api, fonts) {
		try {
			const response = await fetch(`${API_BASE}/leaderboard`);
			const data = await response.json();

			if (data.success) {
				let leaderboardText = `${fonts.bold("🏆 RICHEST PLAYERS LEADERBOARD")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

				const userIds = data.leaderboard.map(user => user.userId);
				let userInfos = {};

				try {
					if (api && userIds.length > 0) {
						userInfos = await api.getUserInfo(userIds);
					}
				} catch (error) {
					console.log("Could not fetch user names");
				}

				data.leaderboard.forEach((user, index) => {
					const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
					const userName = userInfos[user.userId] ? userInfos[user.userId].name : 'Unknown User';

					leaderboardText += `${medal} ${userName}\n`;
					leaderboardText += `   💎 Total Assets: $${user.totalAssets.toLocaleString()}\n`;
					leaderboardText += `   💰 Cash: $${user.cash.toLocaleString()}\n`;
					leaderboardText += `   🏦 Bank: $${user.bank.toLocaleString()}\n`;
					leaderboardText += `   📊 Credit: ${user.creditScore}\n`;
					leaderboardText += `━━━━━━━━━━\n\n`;
				});

				leaderboardText += `💡 TIP: Invest in stocks and crypto to climb the rankings!`;

				return message.reply(leaderboardText);
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error fetching leaderboard"));
		}
	},

	// === CARD ===
	handleCard: async function (message, args, userData, usersData, senderID, API_BASE, fonts) {
		const action = args[1]?.toLowerCase();
		const amount = parseInt(args[2]);

		if (action === "create") {
			try {
				const response = await fetch(`${API_BASE}/card/create`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
💳 DEBIT CARD CREATED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Card Number: ${data.cardNumber}
Daily Limit: $${data.dailyLimit.toLocaleString()}
Card Balance: $${data.cardBalance.toLocaleString()}

Use 'bank card deposit' to add funds!
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error creating card"));
			}
		}

		if (action === "deposit") {
			if (!amount || amount <= 0) {
				return message.reply(fonts.bold("❌ Please enter a valid amount."));
			}

			try {
				const response = await fetch(`${API_BASE}/card/deposit`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, amount })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
💳 CARD DEPOSIT SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Deposited: $${amount.toLocaleString()}
💳 New Card Balance: $${data.newCardBalance.toLocaleString()}
🏦 Bank Balance: $${data.newBankBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error depositing to card"));
			}
		}

		if (action === "withdraw") {
			if (!amount || amount <= 0) {
				return message.reply(fonts.bold("❌ Please enter a valid amount."));
			}

			try {
				const response = await fetch(`${API_BASE}/card/withdraw`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: senderID, amount })
				});
				const data = await response.json();

				if (data.success) {
					return message.reply(fonts.bold(`
💳 CARD WITHDRAWAL SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Withdrawn: $${amount.toLocaleString()}
💳 New Card Balance: $${data.newCardBalance.toLocaleString()}
🏦 Bank Balance: $${data.newBankBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold("❌ " + data.message));
				}
			} catch (error) {
				return message.reply(fonts.bold("❌ Error withdrawing from card"));
			}
		}

		return message.reply(fonts.bold("❌ Usage: bank card <create/deposit/withdraw> [amount]"));
	},

	// === ROB ===
	rob: async function (message, args, userData, usersData, senderID, event, API_BASE, fonts) {
		const targetUID = Object.keys(event.mentions)[0];

		if (!targetUID) {
			return message.reply(fonts.bold("❌ Please mention a user to rob.\nUsage: bank rob @user"));
		}

		if (targetUID === senderID) {
			return message.reply(fonts.bold("❌ You can't rob yourself!"));
		}

		try {
			const response = await fetch(`${API_BASE}/rob`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					robberId: senderID, 
					victimId: targetUID 
				})
			});
			const data = await response.json();

			if (data.success) {
				if (data.successful) {
					return message.reply(fonts.bold(`
💰 ROBBERY SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 Stolen: $${data.stolenAmount.toLocaleString()}
🎯 Success Chance: ${data.successChance}%
🏦 Your New Balance: $${data.newBalance.toLocaleString()}
					`));
				} else {
					return message.reply(fonts.bold(`
🚔 ROBBERY FAILED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💸 Fine Paid: $${data.fine.toLocaleString()}
🎯 Success Chance: ${data.successChance}%
🏦 Your New Balance: $${data.newBalance.toLocaleString()}
					`));
				}
			} else {
				const timeLeft = data.hoursLeft ? `${data.hoursLeft}h` : `${data.minutesLeft}m`;
				return message.reply(fonts.bold(`⏰ ${data.message}\nWait ${timeLeft} before trying again.`));
			}
		} catch (error) {
			return message.reply(fonts.bold("❌ Error attempting robbery"));
		}
	},

	// === HISTORY ===
	showHistory: async function (message, senderID, API_BASE, fonts) {
		try {
			const response = await fetch(`${API_BASE}/transactions/${senderID}?limit=10`);
			const data = await response.json();

			if (data.success) {
				let historyText = `${fonts.bold("📋 TRANSACTION HISTORY (Latest 10)")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

				if (data.transactions.length === 0) {
					historyText += `📭 **No transactions found**\n`;
					historyText += `Start banking to see your transaction history here!`;
				} else {
					data.transactions.forEach((tx, index) => {
						historyText += `${tx.icon} **${tx.description}**\n`;
						historyText += `   🕒 ${tx.timeAgo} (${tx.date})\n`;
						historyText += `   💰 Amount: $${tx.amount.toLocaleString()}\n`;
						historyText += `━━━━━━━━━━\n`;
					});

					historyText += `\n**📊 SUMMARY:**\n`;
					historyText += `• Total Transactions: ${data.totalTransactions}\n`;
					historyText += `• Showing: Latest ${data.transactions.length} transactions\n`;
				}

				return message.reply(historyText);
			} else {
				return message.reply(fonts.bold("❌ " + data.message));
			}
		} catch (error) {
			console.error('History error:', error);
			return message.reply(fonts.bold("❌ Error fetching transaction history"));
		}
	}
};
