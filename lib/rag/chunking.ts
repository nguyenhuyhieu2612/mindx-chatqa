import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export interface ChunkMetadata {
    source?: string;
    chunkIndex?: number;
    totalChunks?: number;
    [key: string]: string | number | undefined;
}

export interface DocumentChunk {
    id: string;
    text: string;
    metadata: ChunkMetadata;
}

export interface ChunkingOptions {
    chunkSize?: number;
    chunkOverlap?: number;
    separators?: string[];
}


const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", ". ", "! ", "? ", ", ", " ", ""],
};


export const splitText = async (
    text: string,
    options: ChunkingOptions = {}
): Promise<string[]> => {
    const config = { ...DEFAULT_OPTIONS, ...options };

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: config.chunkSize,
        chunkOverlap: config.chunkOverlap,
        separators: config.separators,
    });

    const chunks = await splitter.splitText(text);
    return chunks;
};

export const createDocumentChunks = async (
    text: string,
    metadata: Omit<ChunkMetadata, "chunkIndex" | "totalChunks"> = {},
    options: ChunkingOptions = {}
): Promise<DocumentChunk[]> => {
    const chunks = await splitText(text, options);
    const totalChunks = chunks.length;

    return chunks.map((chunk, index) => ({
        id: `${metadata.source || "doc"}-chunk-${index}`,
        text: chunk,
        metadata: {
            ...metadata,
            chunkIndex: index,
            totalChunks,
        },
    }));
};


export const splitDocuments = async (
    documents: Array<{
        text: string;
        metadata?: Omit<ChunkMetadata, "chunkIndex" | "totalChunks">;
    }>,
    options: ChunkingOptions = {}
): Promise<DocumentChunk[]> => {
    const allChunks: DocumentChunk[] = [];

    for (const doc of documents) {
        const chunks = await createDocumentChunks(
            doc.text,
            doc.metadata || {},
            options
        );
        allChunks.push(...chunks);
    }

    return allChunks;
};


export const calculateChunkSize = (targetTokens: number = 500): number => {
    return Math.floor(targetTokens * 2.5);
};


export const getChunkingStats = async (
    text: string,
    options: ChunkingOptions = {}
) => {
    const chunks = await splitText(text, options);
    
    const chunkLengths = chunks.map(c => c.length);
    const avgLength = chunkLengths.reduce((a, b) => a + b, 0) / chunks.length;
    const minLength = Math.min(...chunkLengths);
    const maxLength = Math.max(...chunkLengths);

    return {
        totalChunks: chunks.length,
        avgChunkLength: Math.round(avgLength),
        minChunkLength: minLength,
        maxChunkLength: maxLength,
        totalCharacters: text.length,
    };
};

