import { MongoMemoryServer } from 'mongodb-memory-server';

export class MongoInMemory {
    private static mongo: MongoMemoryServer;

    static async start() {
        if (!this.mongo) {
            this.mongo = await MongoMemoryServer.create();
        }
        return this.mongo.getUri();
    }

    static async stop() {
        if (this.mongo) {
            await this.mongo.stop();
        }
    }
}
