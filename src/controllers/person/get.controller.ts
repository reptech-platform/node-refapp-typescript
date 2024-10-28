import { Controller, Get, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IGetPersonService from "../../services/person/get.person.service";
import { IPersonRead } from "../../models/person/person.read.model";

// Tags and route for the controller
@Tags("Persons")
@Route("persons")
// This decorator ensures that PersonGetController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(PersonGetController)
export class PersonGetController extends Controller {
    // Injecting the GetPersonService
    constructor(
        @inject("IGetPersonService") private getPersonService: IGetPersonService
    ) {
        super();
    }

    /**
     * Gets a person by their userName
     * @param userName 
     * @returns IPersonRead | RequestResponse
     */
    @Get("/:userName")
    public async getPerson(@Path() userName: string): Promise<IPersonRead | RequestResponse> {
        try {
            // Await the result of the get method from the getPersonService
            return await this.getPersonService.getPerson(userName);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }

    /**
     * Gets the best friend of a person by their userName
     * @param userName 
     * @returns IPersonRead | RequestResponse
     */
    @Get("/:userName/bestfriend")
    public async getBestFriend(@Path() userName: string): Promise<IPersonRead | RequestResponse> {
        try {
            // Await the result of the get best friend method by their username from the getPersonService
            return await this.getPersonService.getBestFriend(userName);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }

    /**
     * Gets the friends of a person by their userName
     * @param userName 
     * @returns IPersonRead[] | RequestResponse
     */
    @Get("/:userName/friends")
    public async getFriends(@Path() userName: string): Promise<IPersonRead[] | RequestResponse> {
        try {
            // Await the result of the get friends method by their username from the getPersonService
            return await this.getPersonService.getFriends(userName);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
