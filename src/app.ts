
require("dotenv").config();
import "reflect-metadata";
import * as bodyParser from "body-parser";
import { InversifyExpressServer } from "inversify-express-utils";
import { DbConnection } from "./db/utils/connection.db";
import ContainerConfigLoader from "./config/container";
import fileUpload from "express-fileupload";

const container = ContainerConfigLoader.Load();

DbConnection.initConnection().then(() => {
    DbConnection.setAutoReconnect();

    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(bodyParser.urlencoded({
            extended: true,
        }));
        app.use(bodyParser.json());

        app.use(fileUpload());
    });

    const serverInstance = server.build();
    serverInstance.listen(process.env.PORT);
    console.log(`Server started on port ${process.env.PORT} :)`);
});