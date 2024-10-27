import { Controller, Body, Put, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { IPerson } from "../../models/person.model";
import IUpdatePersonService from "../../services/person/put.person.service";

@Tags("Persons")
@Route("persons")
@provideSingleton(PersonUpdateController)
export class PersonUpdateController extends Controller {
    constructor(
        @inject("IUpdatePersonService") private updatePersonService: IUpdatePersonService
    ) {
        super();
    }

    /**
     * Define a PUT endpoint with the parameter 'userName' and body parameter 'IPerson'
     * @param userName 
     * @param body 
     * @returns RequestResponse
     */
    @Put("/:userName")
    public async updatePerson(@Path() userName: string, @Body() body: IPerson): Promise<RequestResponse> {

        try {

            // Await the result of the update method from the updatePersonService
            await this.updatePersonService.updatePerson(userName, body, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Updated person ${userName} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
