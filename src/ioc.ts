import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";

// Import Services Classes
import AirlineService from "./services/impl/airline.service";
import AirportService from "./services/impl/airport.service";
import PersonService from "./services/impl/person.service";
import AirlineStaffService from "./services/impl/airlinestaff.service";
import DocumentService from "./services/impl/document.service";
import PersonTripService from "./services/impl/persontrip.service";
import TripService from "./services/impl/trip.service";

// Import Services interfaces
import IAirportService from "./services/airport.interface";
import IAirlineService from "./services/airline.interface";
import IPersonService from "./services/person.interface";
import IAirlineStaffService from "./services/airlinestaff.interface";
import IDocumentService from "./services/document.interface";
import IPersonTripService from "./services/persontrip.interface";
import ITripService from "./services/trip.interface";

// Import Repositories Classes
import AirlineRepository from "./repositories/impl/airline.repository";
import AirportRepository from "./repositories/impl/airport.repository";
import PersonRepository from "./repositories/impl/person.repository";
import AirlineStaffRepository from "./repositories/impl/airlinestaff.repository";
import DocumentRepository from "./repositories/impl/document.repository";
import PersonTripRepository from "./repositories/impl/persontrip.repository";
import TripRepository from "./repositories/impl/trip.repository";

// Import Repositories Interfaces
import IAirlineRepository from "./repositories/airline.repository";
import IAirportRepository from "./repositories/airport.repository";
import IPersonRepository from "./repositories/person.repository";
import IAirlineStaffRepository from "./repositories/airlinestaff.repository";
import IDocumentRepository from "./repositories/document.repository";
import IPersonTripRepository from "./repositories/persontrip.repository";
import ITripRepository from "./repositories/trip.repository";


/* 
* Import all person methods 
*/
// Repositories
import IDeletePersonRepository from "./repositories/person/delete.person.repository";
import { DeletePersonRepository } from "./repositories/person/delete.person.repository";
import IGetPersonRepository from "./repositories/person/get.person.repository";
import { GetPersonRepository } from "./repositories/person/get.person.repository";
import IGetPersonsRepository from "./repositories/person/get.persons.repository";
import { GetPersonsRepository } from "./repositories/person/get.persons.repository";
import ICreatePersonRepository from "./repositories/person/post.person.repository";
import { CreatePersonRepository } from "./repositories/person/post.person.repository";
import IUpdatePersonRepository from "./repositories/person/put.person.repository";
import { UpdatePersonRepository } from "./repositories/person/put.person.repository";
import ISearchPersonRepository from "./repositories/person/search.person.repository";
import { SearchPersonRepository } from "./repositories/person/search.person.repository";
// Services
import IDeletePersonService from "./services/person/delete.person.service";
import { DeletePersonService } from "./services/person/delete.person.service";
import IGetPersonService from "./services/person/get.person.service";
import { GetPersonService } from "./services/person/get.person.service";
import IGetPersonsService from "./services/person/get.persons.service";
import { GetPersonsService } from "./services/person/get.persons.service";
import ICreatePersonService from "./services/person/post.person.service";
import { CreatePersonService } from "./services/person/post.person.service";
import IUpdatePersonService from "./services/person/put.person.service";
import { UpdatePersonService } from "./services/person/put.person.service";
import ISearchPersonService from "./services/person/search.person.service";
import { SearchPersonService } from "./services/person/search.person.service";



// Create a new container tsoa can use
const iocContainer = new Container();

iocContainer.bind<IAirlineService>('IAirlineService').to(AirlineService);
iocContainer.bind<IAirlineRepository>('IAirlineRepository').to(AirlineRepository);

iocContainer.bind<IAirportService>('IAirportService').to(AirportService);
iocContainer.bind<IAirportRepository>('IAirportRepository').to(AirportRepository);

iocContainer.bind<IAirlineStaffService>('IAirlineStaffService').to(AirlineStaffService);
iocContainer.bind<IAirlineStaffRepository>('IAirlineStaffRepository').to(AirlineStaffRepository);

iocContainer.bind<IDocumentService>('IDocumentService').to(DocumentService);
iocContainer.bind<IDocumentRepository>('IDocumentRepository').to(DocumentRepository);

iocContainer.bind<IPersonTripService>('IPersonTripService').to(PersonTripService);
iocContainer.bind<IPersonTripRepository>('IPersonTripRepository').to(PersonTripRepository);

iocContainer.bind<ITripService>('ITripService').to(TripService);
iocContainer.bind<ITripRepository>('ITripRepository').to(TripRepository);

iocContainer.bind<IPersonService>('IPersonService').to(PersonService);
iocContainer.bind<IPersonRepository>('IPersonRepository').to(PersonRepository);

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

decorate(injectable(), Controller); // Makes tsoa's Controller injectable

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

// export according to convention
export { iocContainer };