import { Container } from "inversify";

/**************** Repositories *********************/

/**
 * Person Repositories
 */
import IDeletePersonRepository, { DeletePersonRepository } from "../repositories/person/delete.person.repository";
import IGetPersonRepository, { GetPersonRepository } from "../repositories/person/get.person.repository";
import IGetPersonsRepository, { GetPersonsRepository } from "../repositories/person/get.persons.repository";
import ICreatePersonRepository, { CreatePersonRepository } from "../repositories/person/post.person.repository";
import IUpdatePersonRepository, { UpdatePersonRepository } from "../repositories/person/put.person.repository";
import ISearchPersonRepository, { SearchPersonRepository } from "../repositories/person/search.person.repository";

/**
 * Airline Repositories
 */
import IDeleteAirlineRepository, { DeleteAirlineRepository } from "../repositories/airline/delete.airline.repository";
import IGetAirlineRepository, { GetAirlineRepository } from "../repositories/airline/get.airline.repository";
import IGetAirlinesRepository, { GetAirlinesRepository } from "../repositories/airline/get.airlines.repository";
import ICreateAirlineRepository, { CreateAirlineRepository } from "../repositories/airline/post.airline.repository";
import IUpdateAirlineRepository, { UpdateAirlineRepository } from "../repositories/airline/put.airline.repository";
import ISearchAirlineRepository, { SearchAirlineRepository } from "../repositories/airline/search.airline.repository";

/**
 * Airport Repositories
 */
import IDeleteAirportRepository, { DeleteAirportRepository } from "../repositories/airport/delete.airport.repository";
import IGetAirportRepository, { GetAirportRepository } from "../repositories/airport/get.airport.repository";
import IGetAirportsRepository, { GetAirportsRepository } from "../repositories/airport/get.airports.repository";
import ICreateAirportRepository, { CreateAirportRepository } from "../repositories/airport/post.airport.repository";
import IUpdateAirportRepository, { UpdateAirportRepository } from "../repositories/airport/put.airport.repository";
import ISearchAirportRepository, { SearchAirportRepository } from "../repositories/airport/search.airport.repository";

/**************** SERVICES *********************/

/**
 * Person Services
 */
import IDeletePersonService, { DeletePersonService } from "../services/person/delete.person.service";
import IGetPersonService, { GetPersonService } from "../services/person/get.person.service";
import IGetPersonsService, { GetPersonsService } from "../services/person/get.persons.service";
import ICreatePersonService, { CreatePersonService } from "../services/person/post.person.service";
import IUpdatePersonService, { UpdatePersonService } from "../services/person/put.person.service";
import ISearchPersonService, { SearchPersonService } from "../services/person/search.person.service";

/**
 * Airline Services
 */
import IDeleteAirlineService, { DeleteAirlineService } from "../services/airline/delete.airline.service";
import IGetAirlineService, { GetAirlineService } from "../services/airline/get.airline.service";
import IGetAirlinesService, { GetAirlinesService } from "../services/airline/get.airlines.service";
import ICreateAirlineService, { CreateAirlineService } from "../services/airline/post.airline.service";
import IUpdateAirlineService, { UpdateAirlineService } from "../services/airline/put.airline.service";
import ISearchAirlineService, { SearchAirlineService } from "../services/airline/search.airline.service";

/**
 * Airport Services
 */
import IDeleteAirportService, { DeleteAirportService } from "../services/airport/delete.airport.service";
import IGetAirportService, { GetAirportService } from "../services/airport/get.airport.service";
import IGetAirportsService, { GetAirportsService } from "../services/airport/get.airports.service";
import ICreateAirportService, { CreateAirportService } from "../services/airport/post.airport.service";
import IUpdateAirportService, { UpdateAirportService } from "../services/airport/put.airport.service";
import ISearchAirportService, { SearchAirportService } from "../services/airport/search.airport.service";

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

        // Airline Repositories
        iocContainer.bind<IDeleteAirlineRepository>('IDeleteAirlineRepository').to(DeleteAirlineRepository);
        iocContainer.bind<IGetAirlineRepository>('IGetAirlineRepository').to(GetAirlineRepository);
        iocContainer.bind<IGetAirlinesRepository>('IGetAirlinesRepository').to(GetAirlinesRepository);
        iocContainer.bind<ICreateAirlineRepository>('ICreateAirlineRepository').to(CreateAirlineRepository);
        iocContainer.bind<IUpdateAirlineRepository>('IUpdateAirlineRepository').to(UpdateAirlineRepository);
        iocContainer.bind<ISearchAirlineRepository>('ISearchAirlineRepository').to(SearchAirlineRepository);

        // Airline Services
        iocContainer.bind<IDeleteAirlineService>('IDeleteAirlineService').to(DeleteAirlineService);
        iocContainer.bind<IGetAirlineService>('IGetAirlineService').to(GetAirlineService);
        iocContainer.bind<IGetAirlinesService>('IGetAirlinesService').to(GetAirlinesService);
        iocContainer.bind<ICreateAirlineService>('ICreateAirlineService').to(CreateAirlineService);
        iocContainer.bind<IUpdateAirlineService>('IUpdateAirlineService').to(UpdateAirlineService);
        iocContainer.bind<ISearchAirlineService>('ISearchAirlineService').to(SearchAirlineService);

        // Airport Repositories
        iocContainer.bind<IDeleteAirportRepository>('IDeleteAirportRepository').to(DeleteAirportRepository);
        iocContainer.bind<IGetAirportRepository>('IGetAirportRepository').to(GetAirportRepository);
        iocContainer.bind<IGetAirportsRepository>('IGetAirportsRepository').to(GetAirportsRepository);
        iocContainer.bind<ICreateAirportRepository>('ICreateAirportRepository').to(CreateAirportRepository);
        iocContainer.bind<IUpdateAirportRepository>('IUpdateAirportRepository').to(UpdateAirportRepository);
        iocContainer.bind<ISearchAirportRepository>('ISearchAirportRepository').to(SearchAirportRepository);

        // Airport Services
        iocContainer.bind<IDeleteAirportService>('IDeleteAirportService').to(DeleteAirportService);
        iocContainer.bind<IGetAirportService>('IGetAirportService').to(GetAirportService);
        iocContainer.bind<IGetAirportsService>('IGetAirportsService').to(GetAirportsService);
        iocContainer.bind<ICreateAirportService>('ICreateAirportService').to(CreateAirportService);
        iocContainer.bind<IUpdateAirportService>('IUpdateAirportService').to(UpdateAirportService);
        iocContainer.bind<ISearchAirportService>('ISearchAirportService').to(SearchAirportService);

    }
}

