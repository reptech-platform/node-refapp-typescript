import { Controller, Get, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { IPerson } from "../../models/person.model";
import IGetPersonsService from "../../services/person/get.persons.service";

@Tags("Persons")
@Route("persons/all")
@provideSingleton(PersonGetAllController)
export class PersonGetAllController extends Controller {
    constructor(
        @inject("IGetPersonsService") private getPersonsService: IGetPersonsService
    ) {
        super();
    }

    /**
     * Define a GET endpoint to get all persons
     * @returns IPerson[] | RequestResponse
     */
    @Get()
    public async getPersons(): Promise<IPerson[] | RequestResponse> {

        try {

            // Await the result of the gets method from the getPersonsService
            return await this.getPersonsService.getPersons();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
