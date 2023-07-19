require('dotenv').config();
const BigNumber = require('bignumber.js');
const { createCompany, getCompany, generateCompanyDetails } = require('../services/company');
const logger = require('../services/winston');

function compareCompanyDetails(companyDetails, newCompanyDetails) {
	const duplicate = [];
	`${companyDetails[0]}` === newCompanyDetails.companyDetails.country.country_code
		? duplicate.push(true)
		: duplicate.push(false);
	`${companyDetails[1]}` === newCompanyDetails.companyDetails.legalName
		? duplicate.push(true)
		: duplicate.push(false);
	`${companyDetails[2]}` === newCompanyDetails.companyDetails.nickName
		? duplicate.push(true)
		: duplicate.push(false);
	`${companyDetails[3]}` === newCompanyDetails.companyDetails.subDomain
		? duplicate.push(true)
		: duplicate.push(false);
	null === newCompanyDetails.companyDetails.external_url
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[5][0] === newCompanyDetails.APIs.WS ? duplicate.push(true) : duplicate.push(false);
	companyDetails[5][1] === newCompanyDetails.APIs.REST
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[5][2] === newCompanyDetails.APIs.FIX
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[5][3] === newCompanyDetails.modules.trading
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[5][4] === newCompanyDetails.modules.settlement
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[5][5] === newCompanyDetails.modules.market_data
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[5][6] === newCompanyDetails.modules.analytics
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[6].id === newCompanyDetails.products.id
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[6].default_qty === newCompanyDetails.products.default_qty
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[6].authorized_qty_min === newCompanyDetails.products.authorized_qty_min
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[6].authorized_qty_max === newCompanyDetails.products.authorized_qty_max
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[7].id === newCompanyDetails.exposures.id
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[7].amount === newCompanyDetails.exposures.amount
		? duplicate.push(true)
		: duplicate.push(false);
	companyDetails[8] === newCompanyDetails.fee_rate ? duplicate.push(true) : duplicate.push(false);

	for (const bool of duplicate) {
		try {
			bool === true;
		} catch {
			throw 'Company details do not match up to data sent';
		}
	}
	return true;
}



async function companyFlow(REST_TOKEN) {
	logger.info(`STARTING COMPANY FLOW. CREATING NEW COMPANY`);
	const generatedCompanyDetails = await generateCompanyDetails(REST_TOKEN);
	logger.info(`CREATING NEW COMPANY WITH RANDOM GENERATED DATA:`)
	const newCompanyId = (await createCompany(REST_TOKEN, generatedCompanyDetails)).id;
	const newCompanyDetails = await getCompany(REST_TOKEN, newCompanyId);
	let correctDetails = compareCompanyDetails(generatedCompanyDetails, newCompanyDetails);
	logger.info(`COMPARING GENERATED COMPANY DATA WITH NEW COMPANY SETTINGS`);
	if (correctDetails === true) {
		logger.info('NEW COMPANY SETTINGS ARE CORRECT');
	} else {
		logger.info('NEW COMPANY SETTINGS ARE NOT CORRECT');
	}

	logger.info(`FINISHED COMPANY FLOW`);
}

module.exports = {
	companyFlow,
};
