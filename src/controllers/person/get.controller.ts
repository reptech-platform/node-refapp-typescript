import { Controller, Get, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { IPerson } from "../../models/person.model";
import IGetPersonService from "../../services/person/get.person.service";

@Tags("Persons")
@Route("persons")
@provideSingleton(PersonGetController)
export class PersonGetController extends Controller {
    constructor(
        @inject("IGetPersonService") private getPersonService: IGetPersonService
    ) {
        super();
    }

    /**
     * Define a GET endpoint with the path parameter 'userName'
     * @param userName
     * @returns IPerson | RequestResponse
     */
    @Get("/:userName")
    public async get(@Path() userName: string): Promise<IPerson | RequestResponse> {

        try {

            // Await the result of the get method from the getPersonService
            return await this.getPersonService.get(userName);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
