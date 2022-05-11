import { Cat } from './interfaces/cat.interface';
export declare class CatsService {
    private readonly cats;
    constructor();
    create(cat: Cat): void;
    findAll(): Cat[];
    getLatestBlock(): Promise<any>;
}
