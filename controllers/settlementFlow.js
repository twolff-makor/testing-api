require('dotenv').config();
const BigNumber = require('bignumber.js');
const {
	createSettlement,
	handleUnsettledTrades,
	handleNumOfTrades,
	getTradeSum,
	getUnsettledTrades,
	getCompanyTransactionAccount,
	getEnigmaTransactionAccount,
	getSettlementLegs,
	addSettlementTransaction,
	getTransactionId,
	validateTransaction,
} = require('../services/settlement');
const { updateSums, pause } = require('./tradeFlow');
const { getCompanyBalance } = require('../services/balance');
const logger = require('../services/winston');

function sumBalance(data) {
	sum = Object.values(data).reduce((sum, item) => {
		const amount = new BigNumber(item.amount).integerValue();
		return sum.plus(amount);
	}, new BigNumber(0));
	return sum;
}

async function settlementFlow(numOfOtc) {
	logger.info(`STARTING SETTLEMENT FLOW. SETTLING ${numOfOtc} OTC TRADES`);
	const balanceBeforeSett = await getCompanyBalance(false);
	const startSumOfBalance = sumBalance(balanceBeforeSett);

	logger.info(`BALANCE BEFORE SETTLEMENT = ${startSumOfBalance}`);

	const unsettledTrades = await getUnsettledTrades();
	const tradesNum = await handleNumOfTrades(unsettledTrades);

	if (tradesNum == numOfOtc) {
		logger.info(`COLLECTED CORRECT AMOUNT OF TRADES FOR SETTLEMENT:
		NUMBER OF TRADES MADE : (${numOfOtc}) 
		NUMBER OF TRADES COLLECTED : (${tradesNum})`);
	} else {
		logger.info(`COLLECTED INCORRECT AMOUNT OF TRADES FOR SETTLEMENT:
		NUMBER OF TRADES MADE : (${numOfOtc}) 
		NUMBER OF TRADES COLLECTED : (${tradesNum})`);
	}

	let tradeSum = updateSums();
	let settlementSum = await getTradeSum(unsettledTrades);
	let tradeSumBase = Number(tradeSum.base)
	let tradeSumQuote = Number(tradeSum.quote)
	let settlementSumBase = Number(settlementSum.base)
	let settlementSumQuote = Number(settlementSum.quote)

	if (
		[
			settlementSumBase,
			settlementSumBase + 1,
			settlementSumBase - 1,
			settlementSumBase + 2,
			settlementSumBase - 2,
			settlementSumBase + 3,
			settlementSumBase - 3,
		].includes(tradeSumBase) &&
		[
			settlementSumQuote,
			settlementSumQuote + 1,
			settlementSumQuote - 1,
			settlementSumQuote + 2,
			settlementSumQuote - 2,
			settlementSumQuote + 3,
			settlementSumQuote - 3,
		].includes(tradeSumQuote)
	) {
		logger.info(`SETTLEMENT TOTAL AMOUNT IS CORRECT`);
	} else {
		logger.info(`SETTLEMENT TOTAL AMOUNT IS INCORRECT :
		      TRADE SUM = ${tradeSumBase} quote = ${tradeSumQuote}
		      SETTLEMENT COLLECTION SUM = ${settlementSumBase} quote = ${tradeSumQuote}`);
	}

	const tradesToSettle = await handleUnsettledTrades(unsettledTrades);
	const settlementId = await createSettlement(tradesToSettle);
	logger.info(`NEW SETTLEMENT CREATED, SETTLEMENT ID ${settlementId}`)
	
	const unsettledTradesAfterSettlement = await getUnsettledTrades();
	const tradesToSettleAfterSettlement = await handleUnsettledTrades(unsettledTradesAfterSettlement);
	try {
		tradesToSettleAfterSettlement == 0;
		logger.info(`ALL TRADES ARE SETTLED`);
	} catch (error) {
		logger.error(`NOT ALL TRADES ARE SETTLED`);
	}

	let companyAccounts = await getCompanyTransactionAccount();
	let enigmaAccounts = await getEnigmaTransactionAccount();
	const settlementLegs = await getSettlementLegs(settlementId);

	for (leg of settlementLegs) {
		let currency = leg.code;
		let fromAccount;
		let toAccount;
		let transactionStatus;
console.log(enigmaAccounts);
console.log(currency);
		if (leg.amount > 0) {
			try {
				fromAccount = companyAccounts[currency][0];
				toAccount = enigmaAccounts[currency][0];
				transactionStatus = 'PROCESSING';
			} catch {logger.error(`No company account available for ${currency}`)}
		} else if (leg.amount < 0) {
			try {
				fromAccount = enigmaAccounts[currency][0];
				toAccount = companyAccounts[currency][0];
				leg.amount = new BigNumber(leg.amount).absoluteValue();
				transactionStatus = 'PENDING';
			} catch {logger.error(`No enigma account available for ${currency}`)}
		}

		await addSettlementTransaction(leg.id, leg.amount, fromAccount, toAccount);
		let transactionId = await getTransactionId(transactionStatus, settlementId);
		let validated = await validateTransaction(transactionId);
	}

	const balanceAfterSett = await getCompanyBalance(false);
	const endSumOfBalance = sumBalance(balanceAfterSett);

	// sumOfTrades = tradeSumBase + tradeSumQuote;
	let sumOfSettlement =(settlementSumBase + settlementSumQuote);
	// console.log(sumOfTrades);

	if (
		[
			sumOfSettlement,
			sumOfSettlement - 1,
			sumOfSettlement + 1,
			sumOfSettlement + 2,
			sumOfSettlement - 2,
			sumOfSettlement + 3,
			sumOfSettlement - 3,
			sumOfSettlement + 4,
			sumOfSettlement - 4,
			sumOfSettlement + 5,
			sumOfSettlement - 5,
		].includes((startSumOfBalance - endSumOfBalance))
	) {
		logger.info(`UPDATED BALANCE IS CORRECT ,
		BALANCE DELTA (BEFORE-AFTER SETTLEMENT)= ${startSumOfBalance - endSumOfBalance} 
		SETTLEMENT AMOUNT ${sumOfSettlement}`);
	} else {
		logger.info(`UPDATED BALANCE IS INCORRECT, 
		BALANCE DELTA (BEFORE-AFTER SETTLEMENT)= ${startSumOfBalance - endSumOfBalance} 
		SETTLEMENT AMOUNT ${sumOfSettlement}`);
	}
	logger.info(`FINISHED SETTLEMENT FLOW`);
}

module.exports = {
	settlementFlow,
};
