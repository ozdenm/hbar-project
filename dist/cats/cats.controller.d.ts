import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
export declare class CatsController {
    private catsService;
    constructor(catsService: CatsService);
    create(createCatDto: CreateCatDto): void;
    findAll(): Promise<any>;
}
