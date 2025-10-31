import "dotenv/config"; // Load .env file
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ingestDocuments, type IngestDocument } from "../lib/rag/pipeline";

/**
 * Read all markdown files from knowledge-base directory
 */
function readKnowledgeBase(baseDir: string): IngestDocument[] {
    const documents: IngestDocument[] = [];
    
    function readDirectory(dir: string, parentPath: string = "") {
        const entries = readdirSync(dir);
        
        for (const entry of entries) {
            const fullPath = join(dir, entry);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Recursively read subdirectories
                readDirectory(fullPath, join(parentPath, entry));
            } else if (entry.endsWith(".md")) {
                // Read markdown file
                const content = readFileSync(fullPath, "utf-8");
                const relativePath = join(parentPath, entry);
                
                // Extract metadata from path
                const pathParts = relativePath.split(/[/\\]/);
                const week = pathParts[0] || "unknown"; // e.g., "week-1"
                const filename = entry.replace(".md", ""); // e.g., "overview"
                
                documents.push({
                    text: content,
                    metadata: {
                        source: relativePath.replace(/\\/g, "/"),
                        week,
                        filename,
                        fileType: "markdown",
                    },
                });
                
                console.log(`📖 Read: ${relativePath} (${content.length} characters)`);
            }
        }
    }
    
    readDirectory(baseDir);
    return documents;
}

/**
 * Main ingest function
 */
async function ingestKnowledgeBase() {
    console.log("🚀 Starting Knowledge Base Ingestion\n");
    console.log("=" .repeat(70));
    
    const knowledgeBasePath = join(process.cwd(), "lib", "rag", "knowledge-base");
    
    console.log(`\n📂 Reading documents from: ${knowledgeBasePath}\n`);
    
    try {
        // Step 1: Read all documents
        const documents = readKnowledgeBase(knowledgeBasePath);
        
        if (documents.length === 0) {
            console.log("\n⚠️  No documents found in knowledge-base directory");
            console.log("   Make sure markdown files exist in: lib/rag/knowledge-base/");
            return;
        }
        
        console.log(`\n✅ Found ${documents.length} documents`);
        console.log("\n" + "=".repeat(70));
        
        // Show summary
        console.log("\n📊 Document Summary:");
        const byWeek = documents.reduce((acc, doc) => {
            const week = doc.metadata?.week || "unknown";
            acc[week] = (acc[week] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        for (const [week, count] of Object.entries(byWeek)) {
            console.log(`   ${week}: ${count} documents`);
        }
        
        const totalChars = documents.reduce((sum, doc) => sum + doc.text.length, 0);
        console.log(`\n   Total characters: ${totalChars.toLocaleString()}`);
        console.log(`   Average per document: ${Math.round(totalChars / documents.length).toLocaleString()}`);
        
        console.log("\n" + "=".repeat(70));
        
        // Step 2: Ingest to Pinecone
        console.log("\n🔄 Starting ingestion pipeline...\n");
        
        const result = await ingestDocuments(documents, {
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        
        console.log("=".repeat(70));
        console.log("\n📈 Ingestion Results:");
        console.log(`   Success: ${result.success ? "✅" : "❌"}`);
        console.log(`   Total Documents: ${result.totalDocuments}`);
        console.log(`   Total Chunks: ${result.totalChunks}`);
        console.log(`   Total Vectors: ${result.totalVectors}`);
        
        if (result.errors && result.errors.length > 0) {
            console.log(`\n❌ Errors:`);
            for (const error of result.errors) {
                console.log(`   - ${error}`);
            }
        }
        
        console.log("\n" + "=".repeat(70));
        
        if (result.success) {
            console.log("\n🎉 Knowledge base successfully ingested!");
            console.log("\n💡 Next steps:");
            console.log("   1. Test search: npx tsx scripts/test-search.ts");
            console.log("   2. Verify in Pinecone dashboard");
            console.log("   3. Integrate RAG into chat API");
        } else {
            console.log("\n❌ Ingestion failed. Check errors above.");
            process.exit(1);
        }
        
    } catch (error) {
        console.error("\n❌ Fatal error:", error);
        console.error("\n🔍 Troubleshooting:");
        console.error("   1. Check GOOGLE_GENERATIVE_AI_API_KEY in .env");
        console.error("   2. Check PINECONE_API_KEY and PINECONE_INDEX_NAME in .env");
        console.error("   3. Verify Pinecone index exists with dimension 768");
        console.error("   4. Check internet connection");
        process.exit(1);
    }
}

// Run the script
ingestKnowledgeBase();

