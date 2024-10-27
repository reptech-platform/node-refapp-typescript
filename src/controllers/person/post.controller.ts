import { Controller, Body, Post, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { IPerson } from "../../models/person.model";
import ICreatePersonService from "../../services/person/post.person.service";

@Tags("Persons")
@Route("persons")
@provideSingleton(PersonCreateController)
export class PersonCreateController extends Controller {
    constructor(
        @inject("ICreatePersonService") private createPersonService: ICreatePersonService
    ) {
        super();
    }

    /**
     * Define a POST endpoint with the body parameter 'IPerson'
     * @param body 
     * @returns 
     */
    @Post()
    public async create(@Body() body: IPerson): Promise<RequestResponse> {

        try {

            // Await the result of the create method from the createPersonService
            await this.createPersonService.create(body, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Added persion ${body.userName} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }
}
