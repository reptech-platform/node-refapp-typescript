import { Container } from "inversify";
import TYPES from "../constants/types";
import PersonsService from "../services/persons.service";
import { PersonsController } from "../controller/persons.contoller";

import { TripsController } from "../controller/trips.contoller";
import TripsService from "../services/trips.service";

import { DocumentsController } from "../controller/documents.contoller";
import DocumentsService from "../services/documents.service";

import PersonAttachmentsService from "../services/personattachments.service";

import TravellersService from "../services/travellers.service";

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
        container.bind<TravellersService>(TYPES.TravellersService).to(TravellersService);
        return container;
    }
}