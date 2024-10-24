import { Controller, Get, Post, Delete, Tags, Route, Path, UploadedFile, SuccessResponse } from "tsoa";
import { provideSingleton, inject } from "../utils/provideSingleton";
import RequestResponse from "../utils/request.response";
import { IDocument } from "../models/document.model";
import fs from "fs";
import IDocumentService from "../services/document.interface";

@Tags("Documents")
@Route("documents")
@provideSingleton(DocumentController)
export class DocumentController extends Controller {
    constructor(
        @inject("IDocumentService") private documentService: IDocumentService) {
        super();
    }

    @Get()
    public async getDocuments(): Promise<IDocument[] | RequestResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.documentService.getDocuments();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Get("/:docId")
    public async getDocument(@Path() docId: number): Promise<IDocument | RequestResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.documentService.getDocument(docId);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Post()
    @SuccessResponse("201", "Created")
    public async createDocument(@UploadedFile() file: Express.Multer.File): Promise<any | RequestResponse> {

        return new Promise(async (resolve) => {

            try {
                if (!file) {
                    this.setStatus(400);
                    return resolve({ message: "Invalid file stream object" });
                }

                const uploadFolder = "./uploads/";

                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder);
                }

                const fileName = file.filename || file.originalname;
                const uploadPath = "./uploads/" + file.originalname;

                let input: any = {
                    docName: fileName,
                    docFileType: file.mimetype,
                    docLocation: uploadPath
                };

                const content = await this.documentService.createDocument(input, undefined);

                return resolve(content);

            } catch (ex: any) {

                this.setStatus(400);
                return resolve({ status: 400, message: ex.message });

            }
        });

    }

    @Delete("/:docId")
    public async deleteDocument(@Path() docId: number): Promise<boolean | RequestResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.documentService.deleteDocument(docId, undefined);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }
}
