import { Controller, Get, Post, Delete, Tags, Route, Path, FormField, Response, UploadedFile, SuccessResponse } from "tsoa";
import { provideSingleton, inject } from "../utils/provideSingleton";
import Helper from "../utils/helper.utils";
import DocumentsService from "../services/document.service";
import PersonAttachmentsService from "../services/personattachment.service";
import { IDocument } from "../models/document.model";
import fs from "fs";

@Tags("Documents")
@Route("documents")
@provideSingleton(DocumentsController)
export class DocumentsController extends Controller {
    constructor(
        @inject(DocumentsService) private documentsService: DocumentsService,
        @inject(PersonAttachmentsService) private personAttachmentsService: PersonAttachmentsService,
        @inject(Helper) private helper: Helper) {
        super();
    }

    @Get("/")
    public async getDocuments(): Promise<IDocument[]> {
        return await this.documentsService.getDocuments();
    }

    @Get("/:id")
    public async getDocument(@Path() id: string): Promise<IDocument> {
        return await this.documentsService.getDocument(id);
    }

    @Post("/")
    @SuccessResponse("201", "Created")
    @Response(400, "Bad Request")
    @Response(500, "Internal Error")
    public async createDocument(
        @FormField() personId: string,
        @UploadedFile() file: Express.Multer.File): Promise<any> {

        return new Promise(async (resolve, reject) => {

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

            const documentId = content._id;

            input = { personId, documentId };

            await this.personAttachmentsService.createPersonAttachment(input);

            return resolve(this.setStatus(201));
        });

    }

    /* // Updated document should not be allowed. Because, if you update the document existing document will become orphan
    @Put("/:id")
    public async updateDocument(): Promise<JsonResult> {
        const content = await this.documentsService.updateDocument(req.params.id, req.body);
        const statusCode = 200;
        return this.json(content, statusCode);
    } */

    @Delete("/:id")
    public async deleteDocument(@Path() id: string): Promise<boolean> {
        await this.personAttachmentsService.deletePersonAttachmentByDocId(id);
        return await this.documentsService.deleteDocument(id);
    }
}
