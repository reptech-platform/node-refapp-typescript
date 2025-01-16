import { Controller, Post, Tags, UploadedFile, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import ICreateDocumentService from "../../services/document/post.document.service";

@Tags("Documents")
@Route("documents")
@provideSingleton(DocumentCreateController)
export class DocumentCreateController extends Controller {
    constructor(
        @inject("ICreateDocumentService") private createDocumentService: ICreateDocumentService
    ) {
        super();
    }

    /**
     * Define a POST endpoint with the body parameter 'Express.Multer.File'
     * @param file 
     * @returns RequestResponse
     */
    @Post()
    public async createDocument(@UploadedFile() file: Express.Multer.File): Promise<RequestResponse> {

        try {

            if (!file) {
                // If an error occurs, set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: "Invalid file stream object" };
            }

            // Await the result of the create method from the createDocumentService
            await this.createDocumentService.createDocument(file, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Document created successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }
}
