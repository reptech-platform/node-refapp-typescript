import { Controller, Put, Tags, Route, UploadedFile, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IUpdateDocumentService from "../../services/document/put.document.service";

@Tags("Documents")
@Route("documents")
@provideSingleton(DocumentUpdateController)
export class DocumentUpdateController extends Controller {
    constructor(
        @inject("IUpdateDocumentService") private updateDocumentService: IUpdateDocumentService
    ) {
        super();
    }

    /**
     * Define a PUT endpoint with the parameter 'docId' and file parameter 'Express.Multer.File'
     * @param docId 
     * @param file 
     * @returns RequestResponse
     */
    @Put("/:docId")
    public async updateDocument(@Path() docId: number, @UploadedFile() file: Express.Multer.File): Promise<RequestResponse> {

        try {

            // Await the result of the update method from the updateDocumentService
            await this.updateDocumentService.updateDocument(docId, file, undefined);

            // Return an success response with the status and status message
            return { status: 201, message: `Document ${docId} updated successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
