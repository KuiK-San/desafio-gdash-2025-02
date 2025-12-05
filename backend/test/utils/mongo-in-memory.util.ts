import { MongoMemoryServer } from 'mongodb-memory-server';

export class MongoInMemory {
    private mongo: MongoMemoryServer;

    async start() {
        this.mongo = await MongoMemoryServer.create();
        return this.mongo.getUri();
    }

    async stop() {
        if (this.mongo) {
            await this.mongo.stop();
        }
    }
}
