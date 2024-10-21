import mongoose, { ClientSession } from "mongoose";

export default class DbSession {

    // Method to start a new session
    public static async Session(): Promise<ClientSession> {
        return await mongoose.startSession();
    }

    // Method to start a session transaction
    public static async Start(session: ClientSession): Promise<boolean> {
        session.startTransaction();
        return true;
    }

    // Method to abort a transaction and end the session
    public static async Abort(session: ClientSession | undefined): Promise<boolean> {
        let failedCommit = false;
        if (!session) return true;
        try {
            // Attempt to abort the transaction
            await session.abortTransaction();
            failedCommit = true;
        } catch (error) {
            console.log(error);
        } finally {
            // End the session
            this.endSession(session);
        }
        return failedCommit;
    }

    // Method to commit a transaction and end the session
    public static async Commit(session: ClientSession | undefined): Promise<boolean> {
        let failedAbort = false;
        if (!session) return true;
        try {
            // Attempt to commit the transaction
            await session.commitTransaction();
            failedAbort = true;
        } catch (error) {
            console.log(error);
            // Abort the transaction if commit fails
            await session.abortTransaction();
        } finally {
            // End the session
            this.endSession(session);
        }
        return failedAbort;
    }

    // Private method to end the session
    private static async endSession(session: ClientSession) {
        session.endSession();
    }
}
