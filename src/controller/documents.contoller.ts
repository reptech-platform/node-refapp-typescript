import * as express from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, httpPost } from "inversify-express-utils";
import { JsonResult } from "inversify-express-utils/lib/results";
import TYPES from "../constants/types";
import DocumentsService from "../services/documents.service";
import { UploadedFile } from "express-fileupload";
import Helper from "../utils/helper.utils";
import PersonAttachmentsService from "../services/personattachments.service";
import fs from "fs";

@controller("/documents")

export class DocumentsController extends BaseHttpController {
    constructor(
        @inject(TYPES.DocumentsService) private documentsService: DocumentsService,
        @inject(TYPES.PersonAttachmentsService) private personAttachmentsService: PersonAttachmentsService,
        @inject(TYPES.Helper) private helper: Helper) {
        super();
    }

    @httpGet("/")
    public async getDocuments(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.documentsService.getDocuments();
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id")
    public async getDocument(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.documentsService.getDocument(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpPost("/")
    public async createDocument(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {

        return new Promise(async (resolve, reject) => {
            if (!req.files || Object.keys(req.files).length === 0) {
                return reject(this.json("No files were uploaded", 400));
            }

            let personId = req.body?.personId;

            if (this.helper.IsNullValue(personId)) {
                return reject(res.status(400).send("Document mapping id could not find"));
            }

            personId = this.helper.ObjectId(personId);
            const _file = req.files.file as UploadedFile;
            const uploadFolder = "./uploads/";

            if (!fs.existsSync(uploadFolder)) {
                fs.mkdirSync(uploadFolder);
            }

            const uploadPath = "./uploads/" + _file.name;

            _file.mv(uploadPath, async (err) => {
                if (err) {
                    return reject(res.status(500).send(err));
                }

                let input: any = {
                    docName: _file.name,
                    docFileType: _file.mimetype,
                    docLocation: uploadPath
                };

                const content = await this.documentsService.createDocument(input);

                const documentId = content._id;

                input = { personId, documentId };

                await this.personAttachmentsService.createPersonAttachment(input);

                return resolve(this.json(content, 201));

            });
        });

    }

    /* // Updated document should not be allowed. Because, if you update the document existing document will become orphan
    @httpPut("/:id")
    public async updateDocument(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.documentsService.updateDocument(req.params.id, req.body);
        const statusCode = 200;
        return this.json(content, statusCode);
    } */

    @httpDelete("/:id")
    public async deleteDocument(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {

        await this.personAttachmentsService.deletePersonAttachmentByDocId((req.params.id));
        const content = await this.documentsService.deleteDocument(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
