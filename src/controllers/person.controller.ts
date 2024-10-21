import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../utils/request.response";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IPerson } from "../models/person.model";
import { Search, SearchResults } from "../models/search.model";
import { IDocument } from "../models/document.model";
import IPersonService from "../services/person.interface";

@Tags("Persons")
@Route("persons")
@provideSingleton(PersonController)
export class PersonController extends Controller {
    constructor(
        @inject("IPersonService") private personService: IPersonService,
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

            // Await the result of the getAirlines method from the airlinesService
            return await this.personService.getPersons();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint with the path parameter 'userName'
     * @param userName
     * @returns IPerson | RequestResponse
     */
    @Get("/:userName")
    public async getPerson(@Path() userName: string): Promise<IPerson | RequestResponse> {

        try {

            // Validated the provided userName is exist in the database or not
            const isExist = await this.personService.isPersonExist(userName);

            if (!isExist) {
                // If no person is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} person does not exist` };
            }

            // Await the result of the getPerson method from the personService
            return await this.personService.getPerson(userName);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the body parameter 'IPerson'
     * @param body 
     * @returns 
     */
    @Post()
    public async createPerson(@Body() body: IPerson): Promise<RequestResponse> {

        try {

            // Await the result of the createPerson method from the personService
            await this.personService.createPerson(body, undefined);

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

    /**
     * Define a PUT endpoint with the parameter 'userName' and body parameter 'IPerson'
     * @param userName 
     * @param body 
     * @returns RequestResponse
     */
    @Put("/:userName")
    public async updatePerson(@Path() userName: string, @Body() body: IPerson): Promise<RequestResponse> {

        try {

            // Validated the provided userName is exist in the database or not
            const isExist = await this.personService.isPersonExist(userName);

            if (!isExist) {
                // If no person is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} person does not exist` };
            }

            // Await the result of the updatePerson method from the personService
            await this.personService.updatePerson(userName, body, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Updated person ${userName} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a DELETE endpoint with the parameter 'userName'
     * @param userName 
     * @returns RequestResponse
     */
    @Delete("/:userName")
    public async deletePerson(@Path() userName: string): Promise<RequestResponse> {

        try {

            // Validated the provided userName is exist in the database or not
            const isExist = await this.personService.isPersonExist(userName);

            if (!isExist) {
                // If no person is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} person does not exist` };
            }

            // Await the result of the getAirlines method from the airlinesService
            await this.personService.deletePerson(userName, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Deleted person ${userName} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint to add persons's documents
     * @param userName 
     * @param body 
     * @returns RequestResponse
     */
    @Post("/:userName/document")
    public async updatePersonDocument(@Path() userName: string, @Body() body: IDocument[]): Promise<RequestResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            await this.personService.updatePersonDocument(userName, body, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Updated ${userName} person documents successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a DELETE endpoint to delete persons's documents
     * @param userName 
     * @param body 
     * @returns RequestResponse
     */
    @Delete("/:userName/document/:docId")
    public async deletePersonDocument(@Path() userName: string, @Path() docId: number): Promise<RequestResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            await this.personService.deletePersonDocument(userName, docId, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Deleted ${userName} person documents successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint to get persons count
     * @returns number | RequestResponse
     */
    @Get("/records/count")
    public async getPersonCount(): Promise<number | RequestResponse> {

        try {

            // Await the result of the getPersonCount method from the personService
            return await this.personService.getPersonCount();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint to search persons count
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchPersonCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchPersonCount method from the personService
            return await this.personService.searchPersonCount(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a POST endpoint to search persons
     * @param body 
     * @returns SearchResults | RequestResponse
     */
    @Post("/search")
    public async searchPerson(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the searchPerson method from the personService
            return await this.personService.searchPerson(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
