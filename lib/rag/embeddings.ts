import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";


const EMBEDDING_MODEL = google.textEmbeddingModel("text-embedding-004");
export const EMBEDDING_DIMENSIONS = 768;


export const generateEmbedding = async (text: string): Promise<number[]> => {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error("Text cannot be empty");
        }

        const { embedding } = await embed({
            model: EMBEDDING_MODEL,
            value: text,
        });

        return embedding;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}


export const generateEmbeddings = async (texts: string[]): Promise<number[][]> => {
    try {
        if (!texts || texts.length === 0) {
            throw new Error("Texts array cannot be empty");
        }

        // Filter out empty texts
        const validTexts = texts.filter(text => text && text.trim().length > 0);
        
        if (validTexts.length === 0) {
            throw new Error("No valid texts to embed");
        }

        // Gemini API limit: 100 requests per batch
        const BATCH_SIZE = 100;
        const allEmbeddings: number[][] = [];

        // Process in batches
        for (let i = 0; i < validTexts.length; i += BATCH_SIZE) {
            const batch = validTexts.slice(i, i + BATCH_SIZE);
            
            const { embeddings } = await embedMany({
                model: EMBEDDING_MODEL,
                values: batch,
            });

            allEmbeddings.push(...embeddings);
            
            // Log progress for large batches
            if (validTexts.length > BATCH_SIZE) {
                const progress = Math.min(i + BATCH_SIZE, validTexts.length);
                console.log(`   Embedded ${progress}/${validTexts.length} texts`);
            }
        }

        return allEmbeddings;
    } catch (error) {
        console.error("Error generating embeddings:", error);
        throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}


export const cosineSimilarity = (a: number[], b: number[]): number => {
    if (a.length !== b.length) {
        throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    
    if (denominator === 0) {
        return 0;
    }

    return dotProduct / denominator;
}

