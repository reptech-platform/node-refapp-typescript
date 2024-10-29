import { Container } from "inversify";

/**************** Repositories *********************/

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
 * AirlineStaff Repositories
 */
import IDeleteAirlineStaffRepository, { DeleteAirlineStaffRepository } from "../repositories/airlinestaff/delete.airlinestaff.repository";
import IGetAirlineStaffRepository, { GetAirlineStaffRepository } from "../repositories/airlinestaff/get.airlinestaff.repository";
import IGetAirlineStaffsRepository, { GetAirlineStaffsRepository } from "../repositories/airlinestaff/get.airlinestaffs.repository";
import ICreateAirlineStaffRepository, { CreateAirlineStaffRepository } from "../repositories/airlinestaff/post.airlinestaff.repository";
import IUpdateAirlineStaffRepository, { UpdateAirlineStaffRepository } from "../repositories/airlinestaff/put.airlinestaff.repository";
import ISearchAirlineStaffRepository, { SearchAirlineStaffRepository } from "../repositories/airlinestaff/search.airlinestaff.repository";

/**
 * Airport Repositories
 */
import IDeleteAirportRepository, { DeleteAirportRepository } from "../repositories/airport/delete.airport.repository";
import IGetAirportRepository, { GetAirportRepository } from "../repositories/airport/get.airport.repository";
import IGetAirportsRepository, { GetAirportsRepository } from "../repositories/airport/get.airports.repository";
import ICreateAirportRepository, { CreateAirportRepository } from "../repositories/airport/post.airport.repository";
import IUpdateAirportRepository, { UpdateAirportRepository } from "../repositories/airport/put.airport.repository";
import ISearchAirportRepository, { SearchAirportRepository } from "../repositories/airport/search.airport.repository";

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
 * PersonTrip Repositories
 */
import IDeletePersonTripRepository, { DeletePersonTripRepository } from "../repositories/persontrip/delete.persontrip.repository"
import IGetPersonTripRepository, { GetPersonTripRepository } from "../repositories/persontrip/get.persontrip.repository";
import IGetPersonTripsRepository, { GetPersonTripsRepository } from "../repositories/persontrip/get.persontrips.repository";
import ICreatePersonTripRepository, { CreatePersonTripRepository } from "../repositories/persontrip/post.persontrip.repository";
import IUpdatePersonTripRepository, { UpdatePersonTripRepository } from "../repositories/persontrip/put.persontrip.repository";
import ISearchPersonTripRepository, { SearchPersonTripRepository } from "../repositories/persontrip/search.persontrip.repository";

/**
 * Trip Repositories
 */
import IDeleteTripRepository, { DeleteTripRepository } from "../repositories/trip/delete.trip.repository";
import IGetTripRepository, { GetTripRepository } from "../repositories/trip/get.trip.repository";
import IGetTripsRepository, { GetTripsRepository } from "../repositories/trip/get.trips.repository";
import ICreateTripRepository, { CreateTripRepository } from "../repositories/trip/post.trip.repository";
import IUpdateTripRepository, { UpdateTripRepository } from "../repositories/trip/put.trip.repository";
import ISearchTripRepository, { SearchTripRepository } from "../repositories/trip/search.trip.repository";


/**************** SERVICES *********************/

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
 * AirlineStaff Services
 */
import IDeleteAirlineStaffService, { DeleteAirlineStaffService } from "../services/airlinestaff/delete.airlinestaff.service";
import IGetAirlineStaffService, { GetAirlineStaffService } from "../services/airlinestaff/get.airlinestaff.service";
import IGetAirlineStaffsService, { GetAirlineStaffsService } from "../services/airlinestaff/get.airlinestaffs.service";
import ICreateAirlineStaffService, { CreateAirlineStaffService } from "../services/airlinestaff/post.airlinestaff.service";
import IUpdateAirlineStaffService, { UpdateAirlineStaffService } from "../services/airlinestaff/put.airlinestaff.service";
import ISearchAirlineStaffService, { SearchAirlineStaffService } from "../services/airlinestaff/search.airlinestaff.service";

/**
 * Airport Services
 */
import IDeleteAirportService, { DeleteAirportService } from "../services/airport/delete.airport.service";
import IGetAirportService, { GetAirportService } from "../services/airport/get.airport.service";
import IGetAirportsService, { GetAirportsService } from "../services/airport/get.airports.service";
import ICreateAirportService, { CreateAirportService } from "../services/airport/post.airport.service";
import IUpdateAirportService, { UpdateAirportService } from "../services/airport/put.airport.service";
import ISearchAirportService, { SearchAirportService } from "../services/airport/search.airport.service";

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
 * PersonTrip Services
 */
import IDeletePersonTripService, { DeletePersonTripService } from "../services/persontrip/delete.persontrip.service";
import IGetPersonTripService, { GetPersonTripService } from "../services/persontrip/get.persontrip.service";
import IGetPersonTripsService, { GetPersonTripsService } from "../services/persontrip/get.persontrips.service";
import ICreatePersonTripService, { CreatePersonTripService } from "../services/persontrip/post.persontrip.service";
import IUpdatePersonTripService, { UpdatePersonTripService } from "../services/persontrip/put.persontrip.service";
import ISearchPersonTripService, { SearchPersonTripService } from "../services/persontrip/search.persontrip.service";

/**
 * Trip Services
 */
import IDeleteTripService, { DeleteTripService } from "../services/trip/delete.trip.service";
import IGetTripService, { GetTripService } from "../services/trip/get.trip.service";
import IGetTripsService, { GetTripsService } from "../services/trip/get.trips.service";
import ICreateTripService, { CreateTripService } from "../services/trip/post.trip.service";
import IUpdateTripService, { UpdateTripService } from "../services/trip/put.trip.service";
import ISearchTripService, { SearchTripService } from "../services/trip/search.trip.service";

export default class ContainerConfigLoader {
    public static Load(iocContainer: Container) {

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

        // AirlineStaff Repositories
        iocContainer.bind<IDeleteAirlineStaffRepository>('IDeleteAirlineStaffRepository').to(DeleteAirlineStaffRepository);
        iocContainer.bind<IGetAirlineStaffRepository>('IGetAirlineStaffRepository').to(GetAirlineStaffRepository);
        iocContainer.bind<IGetAirlineStaffsRepository>('IGetAirlineStaffsRepository').to(GetAirlineStaffsRepository);
        iocContainer.bind<ICreateAirlineStaffRepository>('ICreateAirlineStaffRepository').to(CreateAirlineStaffRepository);
        iocContainer.bind<IUpdateAirlineStaffRepository>('IUpdateAirlineStaffRepository').to(UpdateAirlineStaffRepository);
        iocContainer.bind<ISearchAirlineStaffRepository>('ISearchAirlineStaffRepository').to(SearchAirlineStaffRepository);

        // AirlineStaff Services
        iocContainer.bind<IDeleteAirlineStaffService>('IDeleteAirlineStaffService').to(DeleteAirlineStaffService);
        iocContainer.bind<IGetAirlineStaffService>('IGetAirlineStaffService').to(GetAirlineStaffService);
        iocContainer.bind<IGetAirlineStaffsService>('IGetAirlineStaffsService').to(GetAirlineStaffsService);
        iocContainer.bind<ICreateAirlineStaffService>('ICreateAirlineStaffService').to(CreateAirlineStaffService);
        iocContainer.bind<IUpdateAirlineStaffService>('IUpdateAirlineStaffService').to(UpdateAirlineStaffService);
        iocContainer.bind<ISearchAirlineStaffService>('ISearchAirlineStaffService').to(SearchAirlineStaffService);

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

        // PersonTrip Repositories
        iocContainer.bind<IDeletePersonTripRepository>('IDeletePersonTripRepository').to(DeletePersonTripRepository);
        iocContainer.bind<IGetPersonTripRepository>('IGetPersonTripRepository').to(GetPersonTripRepository);
        iocContainer.bind<IGetPersonTripsRepository>('IGetPersonTripsRepository').to(GetPersonTripsRepository);
        iocContainer.bind<ICreatePersonTripRepository>('ICreatePersonTripRepository').to(CreatePersonTripRepository);
        iocContainer.bind<IUpdatePersonTripRepository>('IUpdatePersonTripRepository').to(UpdatePersonTripRepository);
        iocContainer.bind<ISearchPersonTripRepository>('ISearchPersonTripRepository').to(SearchPersonTripRepository);

        // PersonTrip Services
        iocContainer.bind<IDeletePersonTripService>('IDeletePersonTripService').to(DeletePersonTripService);
        iocContainer.bind<IGetPersonTripService>('IGetPersonTripService').to(GetPersonTripService);
        iocContainer.bind<IGetPersonTripsService>('IGetPersonTripsService').to(GetPersonTripsService);
        iocContainer.bind<ICreatePersonTripService>('ICreatePersonTripService').to(CreatePersonTripService);
        iocContainer.bind<IUpdatePersonTripService>('IUpdatePersonTripService').to(UpdatePersonTripService);
        iocContainer.bind<ISearchPersonTripService>('ISearchPersonTripService').to(SearchPersonTripService);

        // Trip Repositories
        iocContainer.bind<IDeleteTripRepository>('IDeleteTripRepository').to(DeleteTripRepository);
        iocContainer.bind<IGetTripRepository>('IGetTripRepository').to(GetTripRepository);
        iocContainer.bind<IGetTripsRepository>('IGetTripsRepository').to(GetTripsRepository);
        iocContainer.bind<ICreateTripRepository>('ICreateTripRepository').to(CreateTripRepository);
        iocContainer.bind<IUpdateTripRepository>('IUpdateTripRepository').to(UpdateTripRepository);
        iocContainer.bind<ISearchTripRepository>('ISearchTripRepository').to(SearchTripRepository);

        // Trip Services
        iocContainer.bind<IDeleteTripService>('IDeleteTripService').to(DeleteTripService);
        iocContainer.bind<IGetTripService>('IGetTripService').to(GetTripService);
        iocContainer.bind<IGetTripsService>('IGetTripsService').to(GetTripsService);
        iocContainer.bind<ICreateTripService>('ICreateTripService').to(CreateTripService);
        iocContainer.bind<IUpdateTripService>('IUpdateTripService').to(UpdateTripService);
        iocContainer.bind<ISearchTripService>('ISearchTripService').to(SearchTripService);

    }
}

