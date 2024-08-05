import { Container } from "inversify";
import TYPES from "../constants/types";
import PersonsService from "../services/persons.service";
import { PersonsController } from "../controller/persons.contoller";

import { TripsController } from "../controller/trips.contoller";
import TripsService from "../services/trips.service";

import { DocumentsController } from "../controller/documents.contoller";
import DocumentsService from "../services/documents.service";

import PersonAttachmentsService from "../services/personattachments.service";

import TripTravellersService from "../services/triptravellers.service";
import PersonTripsService from "../services/persontrips.service";

import AirportsService from "../services/airports.service";
import { AirportsController } from "../controller/airports.controller";
import AirlinesService from "../services/airlines.service";
import { AirlinesController } from "../controller/airlines.controller";

import Helper from "../utils/helper.utils";

export default class ContainerConfigLoader {
    public static Load(): Container {
        const container = new Container();
        container.bind<Helper>(TYPES.Helper).to(Helper);
        container.bind<PersonsService>(TYPES.PersonsService).to(PersonsService);
        container.bind<PersonsController>(TYPES.PersonsController).to(PersonsController);
        container.bind<TripsService>(TYPES.TripsService).to(TripsService);
        container.bind<TripsController>(TYPES.TripsController).to(TripsController);
        container.bind<DocumentsService>(TYPES.DocumentsService).to(DocumentsService);
        container.bind<DocumentsController>(TYPES.DocumentsController).to(DocumentsController);
        container.bind<PersonAttachmentsService>(TYPES.PersonAttachmentsService).to(PersonAttachmentsService);
        container.bind<TripTravellersService>(TYPES.TripTravellersService).to(TripTravellersService);
        container.bind<PersonTripsService>(TYPES.PersonTripsService).to(PersonTripsService);
        container.bind<AirportsService>(TYPES.AirportsService).to(AirportsService);
        container.bind<AirportsController>(TYPES.AirportsController).to(AirportsController);
        container.bind<AirlinesService>(TYPES.AirlinesService).to(AirlinesService);
        container.bind<AirlinesController>(TYPES.AirlinesController).to(AirlinesController);
        return container;
    }
}