import { Pinecone } from "@pinecone-database/pinecone"

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = () => {
    if (!pineconeClient) {
        pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        })
    }
    return pineconeClient;
}

export const getPineconeIndex = () => {
    const client = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX_NAME!;
    return client.index(indexName);
}
