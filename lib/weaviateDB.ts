import weaviate, { WeaviateClient } from 'weaviate-ts-client';
let client: WeaviateClient;

if (!process.env.WEAVIATE_CLIENT) {
    throw new Error('Please add your weaviate URI to .env.local');
}

client = weaviate.client({
    scheme: 'http',
    host: process.env.WEAVIATE_CLIENT,
});


export function getDb() {
    if (!client) {
        throw new Error('Database client not initialized');
    }

    return client;
}