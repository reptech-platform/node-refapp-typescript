import { Controller, Get, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IGetDocumentService from "../../services/document/get.document.service";
import { IDocument } from "../../models/document.model";

// Tags and route for the controller
@Tags("Documents")
@Route("documents")
// This decorator ensures that DocumentGetController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(DocumentGetController)
export class DocumentGetController extends Controller {
    // Injecting the GetDocumentService
    constructor(
        @inject("IGetDocumentService") private getDocumentService: IGetDocumentService
    ) {
        super();
    }

    /**
     * Gets a Document by their docId
     * @param docId 
     * @returns IDocument | RequestResponse
     */
    @Get("/:docId")
    public async getDocument(@Path() docId: number): Promise<IDocument | RequestResponse> {
        try {
            // Await the result of the get method from the getDocumentService
            return await this.getDocumentService.getDocument(docId);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
