import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../utils/request.response";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IPerson } from "../models/person.model";
import { Search, SearchResults } from "../models/search.model";
import IDeletePersonService from "../services/person/delete.person.service";
import IGetPersonService from "../services/person/get.person.service";
import IGetPersonsService from "../services/person/get.persons.service";
import ICreatePersonService from "../services/person/post.person.service";
import IUpdatePersonService from "../services/person/put.person.service";
import ISearchPersonService from "../services/person/search.person.service";

@Tags("Persons")
@Route("persons")
@provideSingleton(PersonController)
export class PersonController extends Controller {
    constructor(
        @inject("IGetPersonService") private getPersonService: IGetPersonService,
        @inject("IGetPersonsService") private getPersonsService: IGetPersonsService,
        @inject("ICreatePersonService") private createPersonService: ICreatePersonService,
        @inject("IUpdatePersonService") private updatePersonService: IUpdatePersonService,
        @inject("IDeletePersonService") private deletePersonService: IDeletePersonService,
        @inject("ISearchPersonService") private searchPersonService: ISearchPersonService
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

    /**
     * Define a GET endpoint to get all persons
     * @returns IPerson[] | RequestResponse
     */
    @Get()
    public async gets(): Promise<IPerson[] | RequestResponse> {

        try {

            // Await the result of the gets method from the getPersonsService
            return await this.getPersonsService.gets();

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

    /**
     * Define a PUT endpoint with the parameter 'userName' and body parameter 'IPerson'
     * @param userName 
     * @param body 
     * @returns RequestResponse
     */
    @Put("/:userName")
    public async update(@Path() userName: string, @Body() body: IPerson): Promise<RequestResponse> {

        try {

            // Await the result of the update method from the updatePersonService
            await this.updatePersonService.update(userName, body, undefined);

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
    public async delete(@Path() userName: string): Promise<RequestResponse> {

        try {

            // Await the result of the delete method from the deletePersonService
            await this.deletePersonService.delete(userName, undefined);

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
     * Define a POST endpoint to search persons count
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchCount method from the searchPersonService
            return await this.searchPersonService.searchCount(body);

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
    public async search(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the search method from the searchPersonService
            return await this.searchPersonService.search(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
