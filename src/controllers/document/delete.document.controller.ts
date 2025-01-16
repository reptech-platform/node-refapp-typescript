import { Controller, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IDeleteDocumentService from "../../services/document/delete.document.service";

// Tags and route for the controller
@Tags("Documents")
@Route("documents")
// This decorator ensures that DocumentDeleteController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(DocumentDeleteController)
export class DocumentDeleteController extends Controller {
    // Injecting the IDeleteDocumentService
    constructor(
        @inject("IDeleteDocumentService") private deleteDocumentService: IDeleteDocumentService
    ) {
        super();
    }

    /**
     * Delete a Document by their docId
     * @param docId 
     * @returns IDocument | RequestResponse
     */
    @Delete("/:docId")
    public async deleteDocument(@Path() docId: number): Promise<RequestResponse> {
        try {
            // Await the result of the get method from the deleteDocumentService
            await this.deleteDocumentService.deleteDocument(docId, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Document ${docId} deleted successfuly.` };

        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
