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

decorate(injectable(), Controller); // Makes tsoa's Controller injectable

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

// export according to convention
export { iocContainer };