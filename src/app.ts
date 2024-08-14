
require("dotenv").config();
import express, { Response as ExResponse, Request as ExRequest } from "express";
import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";

import * as bodyParser from "body-parser";
import { DbConnection } from "./db/utils/connection.db";
export const app = express();


DbConnection.initConnection().then(() => {
    DbConnection.setAutoReconnect();


    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());

    app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
        return res.send(
            swaggerUi.generateHTML(await import("../build/swagger.json"))
        );
    });

    RegisterRoutes(app);

});