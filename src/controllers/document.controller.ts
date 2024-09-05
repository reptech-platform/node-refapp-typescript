import { Controller, Get, Post, Delete, Tags, Route, Path, FormField, Response, UploadedFile, SuccessResponse } from "tsoa";
import { provideSingleton, inject } from "../utils/provideSingleton";
import Helper from "../utils/helper.utils";
import ErrorResponse from "../utils/error.response";
import DocumentsService from "../services/document.service";
import { IDocument } from "../models/document.model";
import fs from "fs";

@Tags("Documents")
@Route("documents")
@provideSingleton(DocumentsController)
export class DocumentsController extends Controller {
    constructor(
        @inject(DocumentsService) private documentsService: DocumentsService,
        @inject(Helper) private helper: Helper) {
        super();
    }

    @Get()
    public async getDocuments(): Promise<IDocument[] | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.documentsService.getDocuments();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Get("/:docId")
    public async getDocument(@Path() docId: number): Promise<IDocument | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.documentsService.getDocument(docId);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Post()
    @SuccessResponse("201", "Created")
    @Response(400, "Bad Request")
    @Response(500, "Internal Error")
    public async createDocument(
        @FormField() personId: string,
        @UploadedFile() file: Express.Multer.File): Promise<any | ErrorResponse> {

        return new Promise(async (resolve, reject) => {

            try {
                if (!file) {
                    return resolve(this.setStatus(400));
                }

                if (this.helper.IsNullValue(personId)) {
                    return resolve(this.setStatus(400));
                }

                personId = this.helper.ObjectId(personId);

                const uploadFolder = "./uploads/";

                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder);
                }

                const uploadPath = "./uploads/" + file.filename;

                let input: any = {
                    docName: file.filename,
                    docFileType: file.mimetype,
                    docLocation: uploadPath
                };

                const content = await this.documentsService.createDocument(input);

                const documentId = content.docid;

                input = { personId, documentId };

                //await this.personAttachmentsService.createPersonAttachment(input);

                return resolve(this.setStatus(201));

            } catch (ex: any) {

                this.setStatus(400);
                return resolve({ status: 400, message: ex.message });

            }
        });

    }

    /* // Updated document should not be allowed. Because, if you update the document existing document will become orphan
    @Put("/:id")
    public async updateDocument(): Promise<JsonResult> {
        const content = await this.documentsService.updateDocument(req.params.id, req.body);
        const statusCode = 200;
        return this.json(content, statusCode);
    } */

    @Delete("/:docId")
    public async deleteDocument(@Path() docId: number): Promise<boolean | ErrorResponse> {
        //await this.personAttachmentsService.deletePersonAttachmentByDocId(id);

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.documentsService.deleteDocument(docId);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }
}
