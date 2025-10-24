import { generateEmbeddings } from "./embeddings";
import { createDocumentChunks, splitDocuments, type ChunkMetadata, type DocumentChunk, type ChunkingOptions } from "./chunking";
import { upsertVectors, type VectorRecord } from "./vectordb";
import { nanoid } from "nanoid";

export interface IngestDocument {
    text: string;
    metadata?: Omit<ChunkMetadata, "chunkIndex" | "totalChunks">;
}

export interface IngestResult {
    success: boolean;
    totalDocuments: number;
    totalChunks: number;
    totalVectors: number;
    errors?: string[];
}

export const ingestDocument = async (
    text: string,
    metadata: Omit<ChunkMetadata, "chunkIndex" | "totalChunks"> = {},
    options: ChunkingOptions = {}
): Promise<string[]> => {
    const chunks = await createDocumentChunks(text, metadata, options);
    
    console.log(`📄 Created ${chunks.length} chunks from document`);

    const texts = chunks.map(chunk => chunk.text);
    const embeddings = await generateEmbeddings(texts);
    
    console.log(`🔢 Generated ${embeddings.length} embeddings`);

    const vectors: VectorRecord[] = chunks.map((chunk, index) => ({
        id: nanoid(), // Generate unique ID for each vector
        values: embeddings[index],
        metadata: {
            text: chunk.text,
            ...chunk.metadata,
        },
    }));

    await upsertVectors(vectors);

    return vectors.map(v => v.id);
};


export const ingestDocuments = async (
    documents: IngestDocument[],
    options: ChunkingOptions = {}
): Promise<IngestResult> => {
    console.log(`\n📚 Starting batch ingest of ${documents.length} documents...`);
    
    const errors: string[] = [];
    let totalChunks = 0;
    let totalVectors = 0;

    try {
        const allChunks = await splitDocuments(
            documents.map(doc => ({
                text: doc.text,
                metadata: doc.metadata,
            })),
            options
        );

        totalChunks = allChunks.length;
        console.log(`📄 Created ${totalChunks} total chunks`);

        const texts = allChunks.map(chunk => chunk.text);
        const embeddings = await generateEmbeddings(texts);
        
        console.log(`🔢 Generated ${embeddings.length} embeddings`);

        const vectors: VectorRecord[] = allChunks.map((chunk, index) => ({
            id: nanoid(),
            values: embeddings[index],
            metadata: {
                text: chunk.text,
                ...chunk.metadata,
            },
        }));

        await upsertVectors(vectors);
        
        totalVectors = vectors.length;

        console.log(`✅ Successfully ingested ${totalVectors} vectors\n`);

        return {
            success: true,
            totalDocuments: documents.length,
            totalChunks,
            totalVectors,
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`❌ Ingest failed: ${errorMessage}`);
        
        errors.push(errorMessage);

        return {
            success: false,
            totalDocuments: documents.length,
            totalChunks,
            totalVectors,
            errors,
        };
    }
};


export const ingestDocumentsWithProgress = async (
    documents: IngestDocument[],
    options: ChunkingOptions = {},
    onProgress?: (current: number, total: number, percentage: number) => void
): Promise<IngestResult> => {
    console.log(`\n📚 Starting batch ingest of ${documents.length} documents with progress tracking...`);
    
    const errors: string[] = [];
    let totalChunks = 0;
    let totalVectors = 0;

    try {
        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            
            await ingestDocument(doc.text, doc.metadata, options);
            
            const current = i + 1;
            const percentage = Math.round((current / documents.length) * 100);
            
            if (onProgress) {
                onProgress(current, documents.length, percentage);
            }
            
            console.log(`📊 Progress: ${current}/${documents.length} (${percentage}%)`);
        }

        return {
            success: true,
            totalDocuments: documents.length,
            totalChunks,
            totalVectors,
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push(errorMessage);

        return {
            success: false,
            totalDocuments: documents.length,
            totalChunks,
            totalVectors,
            errors,
        };
    }
};

