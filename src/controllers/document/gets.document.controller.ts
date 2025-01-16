import { Controller, Get, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { IDocument } from "../../models/document.model";
import IGetDocumentsService from "../../services/document/get.documents.service";

@Tags("Documents")
@Route("documents/all")
@provideSingleton(DocumentGetAllController)
export class DocumentGetAllController extends Controller {
    constructor(
        @inject("IGetDocumentsService") private getDocumentsService: IGetDocumentsService
    ) {
        super();
    }

    /**
     * Define a GET endpoint to get all Documents
     * @returns IDocument[] | RequestResponse
     */
    @Get()
    public async getDocuments(): Promise<IDocument[] | RequestResponse> {

        try {

            // Await the result of the gets method from the getDocumentsService
            return await this.getDocumentsService.getDocuments();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
