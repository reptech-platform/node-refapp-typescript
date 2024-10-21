import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";

import ITripService from "./services/trip.interface";
import TripService from "./services/impl/trip.service";
import PersonService from "./services/impl/person.service";
import IPersonService from "./services/person.interface";
import AirlineService from "./services/impl/airline.service";
import IAirlineService from "./services/airline.interface";
import AirlineStaffService from "./services/impl/airlinestaff.service";
import IAirlineStaffService from "./services/airlinestaff.interface";
import AirportService from "./services/impl/airport.service";
import IAirportService from "./services/airport.interface";
import PersonTripService from "./services/impl/persontrip.service";
import IPersonTripService from "./services/persontrip.interface";
import DocumentService from "./services/impl/document.service";
import IDocumentService from "./services/document.interface";

// Create a new container tsoa can use
const iocContainer = new Container();

iocContainer.bind<IPersonService>('IPersonService').to(PersonService);
iocContainer.bind<ITripService>('ITripService').to(TripService);
iocContainer.bind<IAirlineService>('IAirlineService').to(AirlineService);
iocContainer.bind<IAirlineStaffService>('IAirlineStaffService').to(AirlineStaffService);
iocContainer.bind<IAirportService>('IAirportService').to(AirportService);
iocContainer.bind<IPersonTripService>('IPersonTripService').to(PersonTripService);
iocContainer.bind<IDocumentService>('IDocumentService').to(DocumentService);

decorate(injectable(), Controller); // Makes tsoa's Controller injectable

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

// export according to convention
export { iocContainer };