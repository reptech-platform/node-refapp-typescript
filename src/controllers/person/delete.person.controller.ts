import { Controller, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IDeletePersonService from "../../services/person/delete.person.service";
import { IPerson } from "../../models/person.model";

// Tags and route for the controller
@Tags("Persons")
@Route("persons")
// This decorator ensures that PersonDeleteController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(PersonDeleteController)
export class PersonDeleteController extends Controller {
    // Injecting the IDeletePersonService
    constructor(
        @inject("IDeletePersonService") private deletePersonService: IDeletePersonService
    ) {
        super();
    }

    /**
     * Delete a person by their userName
     * @param userName 
     * @returns IPerson | RequestResponse
     */
    @Delete("/:userName")
    public async deletePerson(@Path() userName: string): Promise<IPerson | RequestResponse> {
        try {
            // Await the result of the get method from the getPersonService
            await this.deletePersonService.deletePerson(userName, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Record deleted successfuly.` };
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
