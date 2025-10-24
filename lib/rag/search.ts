import { generateEmbedding } from "./embeddings";
import { searchSimilar } from "./vectordb";

export interface SearchResult {
    text: string;
    score: number;
    source: string;
    week: string;
    filename: string;
    chunkIndex: number;
}

export interface SearchOptions {
    topK?: number;
    minScore?: number;
    filter?: Record<string, string>;
}

/**
 * Search the knowledge base using semantic search
 * 
 * @param query - The search query
 * @param options - Search configuration options
 * @returns Array of search results sorted by relevance
 * 
 * @example
 * ```typescript
 * const results = await searchKnowledge("How to deploy on Azure?", {
 *   topK: 5,
 *   minScore: 0.7
 * });
 * ```
 */
export const searchKnowledge = async (
    query: string,
    options: SearchOptions = {}
): Promise<SearchResult[]> => {
    const { topK = 5, minScore = 0.0, filter } = options;

    try {
        // Step 1: Generate query embedding
        const queryEmbedding = await generateEmbedding(query);

        // Step 2: Search in Pinecone
        const results = await searchSimilar(queryEmbedding, topK, filter);

        // Step 3: Format and filter results
        const formattedResults: SearchResult[] = results
            .filter(result => (result.score || 0) >= minScore)
            .map(result => ({
                text: result.metadata?.text as string || "",
                score: result.score || 0,
                source: result.metadata?.source as string || "unknown",
                week: result.metadata?.week as string || "unknown",
                filename: result.metadata?.filename as string || "unknown",
                chunkIndex: result.metadata?.chunkIndex as number || 0,
            }));

        return formattedResults;
    } catch (error) {
        console.error("Search knowledge failed:", error);
        throw new Error(`Failed to search knowledge base: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};

/**
 * Search and format results as context string for AI
 * 
 * @param query - The search query
 * @param options - Search options
 * @returns Formatted context string ready for AI injection
 * 
 * @example
 * ```typescript
 * const context = await searchKnowledgeAsContext("Deploy on Azure", { topK: 3 });
 * // Use context in AI prompt
 * ```
 */
export const searchKnowledgeAsContext = async (
    query: string,
    options: SearchOptions = {}
): Promise<string> => {
    const results = await searchKnowledge(query, options);

    if (results.length === 0) {
        return "No relevant information found in the knowledge base.";
    }

    const context = results
        .map((result, index) => {
            const header = `[${index + 1}] Source: ${result.source} (${result.week}) | Score: ${result.score.toFixed(3)}`;
            const content = result.text.trim();
            return `${header}\n${content}`;
        })
        .join("\n\n---\n\n");

    return context;
};

/**
 * Search with filtering by week
 * 
 * @param query - Search query
 * @param week - Week to filter by (e.g., "week-1")
 * @param topK - Number of results
 * @returns Filtered search results
 */
export const searchByWeek = async (
    query: string,
    week: string,
    topK: number = 5
): Promise<SearchResult[]> => {
    return searchKnowledge(query, {
        topK,
        filter: { week },
    });
};

/**
 * Get related documents based on similarity
 * Useful for "See also" or "Related topics" features
 * 
 * @param sourceText - The source text to find related content for
 * @param topK - Number of related documents
 * @returns Related documents
 */
export const getRelatedDocuments = async (
    sourceText: string,
    topK: number = 5
): Promise<SearchResult[]> => {
    return searchKnowledge(sourceText, {
        topK: topK + 1, // +1 because the source itself might be included
        minScore: 0.5, // Only moderately related
    });
};

/**
 * Multi-query search - search multiple queries and merge results
 * Useful for comprehensive answers
 * 
 * @param queries - Array of search queries
 * @param topKPerQuery - Results per query
 * @returns Merged and deduplicated results
 */
export const multiQuerySearch = async (
    queries: string[],
    topKPerQuery: number = 3
): Promise<SearchResult[]> => {
    const allResults: SearchResult[] = [];
    const seenTexts = new Set<string>();

    for (const query of queries) {
        const results = await searchKnowledge(query, { topK: topKPerQuery });
        
        for (const result of results) {
            // Deduplicate by text content
            if (!seenTexts.has(result.text)) {
                seenTexts.add(result.text);
                allResults.push(result);
            }
        }
    }

    // Sort by score descending
    allResults.sort((a, b) => b.score - a.score);

    return allResults;
};

