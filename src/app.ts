
require("dotenv").config();
import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import * as bodyParser from "body-parser";
import DbConnection from "./db/utils/connection.db";

export const app = express();

DbConnection.initConnection().then(() => {
    DbConnection.setAutoReconnect();

    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    app.use(bodyParser.json());

    const options = { explorer: true };

    app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
        return res.send(
            swaggerUi.generateHTML(await import("../build/swagger.json"), options)
        );
    });

    RegisterRoutes(app);

    const errorHandler = (err: unknown, req: ExRequest, res: ExResponse, next: NextFunction) => {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(422).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }

        next();
    };

    app.use(errorHandler);


});