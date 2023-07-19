# testing-api
Running tests :
1. Make sure you have the .env up and running.
2. To run test in DEV environment input ENV=DEV into .env file --- trade+sett flow have not been adapted for DEV yet !
3. To run test in UAT environment input ENV=UAT into .env file --- When running tests on UAT DO NOT run company tests !! -- it will create a new domain automatically 

So far we have 2 running and fully functional test flows:
1. Trade flow
2. Settlement flow 
3. Create new company

These flows work together, read the below to understand how they work: 
1. Trade flow :

..to be continued 


2. Settlement flow :
-> get current (before settlement) balance 
-> add the two types of balance to one bigger sum (base = the currency we are acquiring (usually crypto). quote = the currency we are using to buy the base (usually fiat))
-> get unsettled trades 
-> count number of trades that we got from the get unsettled trades request 
-> compare the number of trades collected to the trade counter from trade flow
-> get sum of all the collected trades 
-> get sum of all the trades made in trade flow 
-> compare the two trade sums - it is not 100% accurate because of decimal issues 
-> create settlement 
-> get unsettled trades, confirm there are no trades to settle
-> get transaction accounts and settlement legs
-> run over settlement legs and validate them one by one (*if sum amount > 0 enigma is receiving & status === processing, if sum amount < 0 enigma is sending & status === pending. )
-> get current (after settlement) balance 
-> get settlement sum
-> compare balance to balance before settlement, there should be a delta that is equal to sum of settlement



Issues that need to be worked on :
1. Decimal issues 
2. dev/uat environments - add uat functionalities to dev 
3. export to csv + mail/teams result (link to trade/settlement?)

Tests that need to be added :
1. company flow - edit company, add more log info
2. edit trade
3. cancel trade
4. cancel settlement 
