import mongoose from "mongoose";
mongoose.set('strictQuery', false);
mongoose.set('strictPopulate', false);

export default class DbConnection {

    public static async initConnection() {
        await DbConnection.connect(process.env.DB_CONN_URL || "");
    }

    public static async connect(connStr: string) {
        return mongoose.connect(connStr)
            .then(() => {
                console.log(`Successfully connected to ${connStr}`);
            })
            .catch((error) => {
                console.error("Error connecting to database: ", error);
                return process.exit(1);
            });
    }

    public static setAutoReconnect() {
        mongoose.connection.on("disconnected", () => DbConnection.connect(process.env.DB_CONN_URL || ""));
    }

    public static async disconnect() {
        await mongoose.connection.close();
    }
}
