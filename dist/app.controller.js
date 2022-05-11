"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const sdk_1 = require("@hashgraph/sdk");
const common_1 = require("@nestjs/common");
const { PrivateKey, Client, TransferTransaction, Hbar } = require("@hashgraph/sdk");
require("dotenv").config();
const axios = require('axios').default;
const configuration_1 = __importDefault(require("./config/configuration"));
let AppController = class AppController {
    status() {
        return 'Status OK.';
    }
    async createAccount() {
        const client = Client.forTestnet();
        client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);
        const newAccountPrivateKey = await PrivateKey.generateED25519();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;
        const newAccount = await new sdk_1.AccountCreateTransaction()
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
    async getBalance(address) {
        let balanceParams = { "account.id": address };
        let response = await axios.get((0, configuration_1.default)().hederaTestnetAPI + "balances", { params: balanceParams });
        return response.data.balances[0].balance;
    }
    async getTransactions() {
        let txParams = { "transactiontype": "CRYPTOTRANSFER", "result": "success", "limit": 100, "order": "asc" };
        let response = await axios.get((0, configuration_1.default)().hederaTestnetAPI + "transactions", { params: txParams });
        return response.data;
    }
    async getLastTransaction() {
        let txParams = { "result": "success", "limit": 1 };
        let response = await axios.get((0, configuration_1.default)().hederaTestnetAPI + "transactions", { params: txParams });
        return response.data;
    }
    async sendHBAR(accountId, privateKey, sendingAccountId, amount) {
        const client = Client.forTestnet();
        client.setOperator(accountId, privateKey);
        let negativeAmount = amount * -1;
        const sendHbar = await new TransferTransaction()
            .addHbarTransfer(accountId, Hbar.fromTinybars(negativeAmount))
            .addHbarTransfer(sendingAccountId, Hbar.fromTinybars(amount))
            .execute(client);
        const transactionReceipt = await sendHbar.getReceipt(client);
        return transactionReceipt.status.toString();
    }
};
__decorate([
    (0, common_1.Get)('getStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "status", null);
__decorate([
    (0, common_1.Get)('createAccount'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Get)('getBalance/:address'),
    __param(0, (0, common_1.Param)("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('getTransactions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('getLastTransaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getLastTransaction", null);
__decorate([
    (0, common_1.Post)('sendHBAR'),
    __param(0, (0, common_1.Body)("accountId")),
    __param(1, (0, common_1.Body)("privateKey")),
    __param(2, (0, common_1.Body)("to")),
    __param(3, (0, common_1.Body)("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "sendHBAR", null);
AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map