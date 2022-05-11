export declare class AppController {
    status(): string;
    createAccount(): Promise<any>;
    getBalance(address: string): Promise<any>;
    getTransactions(): Promise<object>;
    getLastTransaction(): Promise<object>;
    sendHBAR(accountId: string, privateKey: string, sendingAccountId: string, amount: number): Promise<any>;
}
