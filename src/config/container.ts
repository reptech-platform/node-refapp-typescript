import { Container } from "inversify";
/* 
* Import all person methods 
*/
// Repositories
import IDeletePersonRepository from "../repositories/person/delete.person.repository";
import { DeletePersonRepository } from "../repositories/person/delete.person.repository";
import IGetPersonRepository from "../repositories/person/get.person.repository";
import { GetPersonRepository } from "../repositories/person/get.person.repository";
import IGetPersonsRepository from "../repositories/person/get.persons.repository";
import { GetPersonsRepository } from "../repositories/person/get.persons.repository";
import ICreatePersonRepository from "../repositories/person/post.person.repository";
import { CreatePersonRepository } from "../repositories/person/post.person.repository";
import IUpdatePersonRepository from "../repositories/person/put.person.repository";
import { UpdatePersonRepository } from "../repositories/person/put.person.repository";
import ISearchPersonRepository from "../repositories/person/search.person.repository";
import { SearchPersonRepository } from "../repositories/person/search.person.repository";

// Services
import IDeletePersonService from "../services/person/delete.person.service";
import { DeletePersonService } from "../services/person/delete.person.service";
import IGetPersonService from "../services/person/get.person.service";
import { GetPersonService } from "../services/person/get.person.service";
import IGetPersonsService from "../services/person/get.persons.service";
import { GetPersonsService } from "../services/person/get.persons.service";
import ICreatePersonService from "../services/person/post.person.service";
import { CreatePersonService } from "../services/person/post.person.service";
import IUpdatePersonService from "../services/person/put.person.service";
import { UpdatePersonService } from "../services/person/put.person.service";
import ISearchPersonService from "../services/person/search.person.service";
import { SearchPersonService } from "../services/person/search.person.service";

export default class ContainerConfigLoader {
    public static Load(iocContainer: Container) {
        // Person Repositories
        iocContainer.bind<IDeletePersonRepository>('IDeletePersonRepository').to(DeletePersonRepository);
        iocContainer.bind<IGetPersonRepository>('IGetPersonRepository').to(GetPersonRepository);
        iocContainer.bind<IGetPersonsRepository>('IGetPersonsRepository').to(GetPersonsRepository);
        iocContainer.bind<ICreatePersonRepository>('ICreatePersonRepository').to(CreatePersonRepository);
        iocContainer.bind<IUpdatePersonRepository>('IUpdatePersonRepository').to(UpdatePersonRepository);
        iocContainer.bind<ISearchPersonRepository>('ISearchPersonRepository').to(SearchPersonRepository);

        // Person Services
        iocContainer.bind<IDeletePersonService>('IDeletePersonService').to(DeletePersonService);
        iocContainer.bind<IGetPersonService>('IGetPersonService').to(GetPersonService);
        iocContainer.bind<IGetPersonsService>('IGetPersonsService').to(GetPersonsService);
        iocContainer.bind<ICreatePersonService>('ICreatePersonService').to(CreatePersonService);
        iocContainer.bind<IUpdatePersonService>('IUpdatePersonService').to(UpdatePersonService);
        iocContainer.bind<ISearchPersonService>('ISearchPersonService').to(SearchPersonService);
    }
}

