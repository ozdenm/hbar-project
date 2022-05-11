import { AccountCreateTransaction } from '@hashgraph/sdk';
import { Get, Controller, Body, Param, Post } from '@nestjs/common';
const { PrivateKey,
	Client,
	TransferTransaction,
  Hbar
  } = require("@hashgraph/sdk");
require("dotenv").config();
const axios = require('axios').default;
import configuration from './config/configuration';

@Controller()
export class AppController {
  
  @Get('getStatus')
  status(): string {
    return 'Status OK.';
  }

  @Get('createAccount')
  async createAccount(): Promise<any> {

    const client = Client.forTestnet();
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);

    const newAccountPrivateKey = await PrivateKey.generateED25519(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    const newAccount = await new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(1000))
      .execute(client);
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;
    let accountDetails = {
      accountID: newAccountId.toString(),
      accountPublicKey: newAccountPublicKey.toString(),
      accountPrivateKey: newAccountPrivateKey.toString()
    };
    return accountDetails;
  }

  @Get('getBalance/:address')
  async getBalance(
    @Param("address") address: string,
  ): Promise<any> {
    let balanceParams = { "account.id": address};
    let response = await axios.get(configuration().hederaTestnetAPI + "balances",{ params: balanceParams});
    return response.data.balances[0].balance;
  }

  @Get('getTransactions')
  async getTransactions(): Promise<object> {
    let txParams = { "transactiontype": "CRYPTOTRANSFER", "result": "success", "limit": 100, "order": "asc"};
    let response = await axios.get(configuration().hederaTestnetAPI + "transactions",{ params: txParams});
    return response.data;
  }
  @Get('getLastTransaction')
  async getLastTransaction(): Promise<object> {
    let txParams = { "result": "success", "limit": 1};
    let response = await axios.get(configuration().hederaTestnetAPI + "transactions",{ params: txParams});
    return response.data;
  }

  @Post('sendHBAR')
  async sendHBAR(
    @Body("accountId") accountId: string,
    @Body("privateKey") privateKey: string,
    @Body("to") sendingAccountId: string,
    @Body("amount") amount: number,
  ): Promise<any> {

    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);
    let negativeAmount = amount * -1;
    const sendHbar = await new TransferTransaction()
      .addHbarTransfer(accountId, Hbar.fromTinybars(negativeAmount)) //Sending account
      .addHbarTransfer(sendingAccountId, Hbar.fromTinybars(amount)) //Receiving account
      .execute(client);

    const transactionReceipt = await sendHbar.getReceipt(client);
    return transactionReceipt.status.toString();
  }
}