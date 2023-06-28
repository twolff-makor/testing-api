require('dotenv').config();
const BigNumber = require('bignumber.js');
const {
	createCompany, 
    getCompany, 
    generateCompanyDetails
} = require('../services/company');
const logger = require('../services/winston');

function compareCompanyDetails (companyDetails, newCompanyDetails) {
   let duplicate 
   if (`${companyDetails[0]}` == newCompanyDetails.companyDetails.country.country_code && 
    `${companyDetails[1]}` == newCompanyDetails.companyDetails.legalName &&
    `${companyDetails[2]}` == newCompanyDetails.companyDetails.nickName &&
    `${companyDetails[3]}` == newCompanyDetails.companyDetails.subDomain &&
    null == newCompanyDetails.companyDetails.external_url &&
    apisAndModules[0] == newCompanyDetails.APIs.WS &&
    apisAndModules[1] == newCompanyDetails.APIs.REST &&
    apisAndModules[2] == newCompanyDetails.APIs.FIX &&
    apisAndModules[3] == newCompanyDetails.modules.trading &&
    apisAndModules[4] == newCompanyDetails.modules.settlement &&
    apisAndModules[5] == newCompanyDetails.modules.market_data &&
    apisAndModules[6] == newCompanyDetails.modules.analytics &&
    companyDetails[6].id == newCompanyDetails.products.id && 
    companyDetails[6].default_qty  == newCompanyDetails.products.default_qty && 
    companyDetails[6].authorized_qty_min == newCompanyDetails.products.authorized_qty_min &&
    companyDetails[6].authorized_qty_max == newCompanyDetails.products.authorized_qty_max &&
    companyDetails[7].id == newCompanyDetails.exposures.id &&
    companyDetails[7].amount == newCompanyDetails.exposures.amount &&
    companyDetails[8] == newCompanyDetails.feeRate ) {
        duplicate = true //// may want to change this to an array of true and false that way we know where this messed up
    }
}

async function companyFlow(REST_TOKEN) {
	// logger.info(`STARTING COMPANY FLOW. CREATING NEW COMPANY`);
    // const companyDetails = await generateCompanyDetails(REST_TOKEN);
    // const newCompanyId = await createCompany(REST_TOKEN, companyDetails);
    // console.log(newCompanyId);
    let newCompanyId = `6e138423-4f92-11ed-bac9-062cd6ab3e51`
    const newCompanyDetails = await getCompany(REST_TOKEN, newCompanyId);
    console.log(newCompanyDetails);
    let compared = compareCompanyDetails(companyDetails, newCompanyDetails);
    console.log(`this is compare dit should be true but probably will not be ----------------------------------------------- `)
	logger.info(`FINISHED COMPANY FLOW`);
}


module.exports = {
    companyFlow
}