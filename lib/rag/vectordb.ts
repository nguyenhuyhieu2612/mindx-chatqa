import { getPineconeIndex } from "./pinecone-client";
import type { RecordMetadata } from "@pinecone-database/pinecone";

export interface VectorRecord {
    id: string;
    values: number[];
    metadata?: {
        text: string;
        source?: string;
        createdAt?: string;
        [key: string]: any;
    }
}

export const upsertVectors = async (vectors: VectorRecord[]) => {
    const index = getPineconeIndex();
    const batchSize = 100;

    for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await index.upsert(batch);
        console.log(`Upserted batch ${i / batchSize + 1}/${Math.ceil(vectors.length / batchSize)}`);
    }
    console.log(`✅ Upserted ${vectors.length} vectors`);
}

export const upsertSingleVector = async (id: string, embedding: number[], metadata: RecordMetadata) => {
    const index = getPineconeIndex();
    await index.upsert([
        {
            id,
            values: embedding,
            metadata,
        }
    ]);
}

export const searchSimilar = async (queryEmbedding: number[], topK: number = 5, filter?: Record<string, any>) => {
    const index = getPineconeIndex();

    const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        includeValues: false,
        filter
    })

    return results.matches || [];
}

export const deleteVectors = async (ids: string[]) => {
    const index = getPineconeIndex();

    await index.deleteMany(ids);
    console.log(`🗑️  Deleted ${ids.length} vectors`);
}

export const deleteAllVectors = async () => {
    const index = getPineconeIndex();
    await index.deleteAll();
    console.log("🗑️  Deleted all vectors");
}

export const getIndexStats = async () => {
    const index = getPineconeIndex();
    const stats = await index.describeIndexStats();
    return {
        totalVectors: stats.totalRecordCount || 0,
        dimension: stats.dimension,
        indexFullness: stats.indexFullness,
        namespaces: stats.namespaces,
    }
}
