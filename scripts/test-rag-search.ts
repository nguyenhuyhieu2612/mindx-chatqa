import "dotenv/config";
import { searchKnowledge, searchKnowledgeAsContext, searchByWeek, multiQuerySearch } from "../lib/rag/search";

async function testRAGSearch() {
    console.log("🔍 Testing RAG Search Functions\n");
    console.log("=".repeat(70));

    try {
        // Test 1: Basic search
        console.log("\n📝 Test 1: Basic Search");
        console.log("-".repeat(70));
        
        const query1 = "How to deploy on Azure Kubernetes?";
        console.log(`Query: "${query1}"\n`);
        
        const results1 = await searchKnowledge(query1, { topK: 3, minScore: 0.5 });
        
        console.log(`Found ${results1.length} results:\n`);
        for (const [i, result] of results1.entries()) {
            console.log(`${i + 1}. Score: ${result.score.toFixed(4)}`);
            console.log(`   Source: ${result.source} (${result.week})`);
            console.log(`   Preview: ${result.text.substring(0, 100).replace(/\n/g, " ")}...`);
            console.log();
        }

        // Test 2: Search as context (formatted for AI)
        console.log("\n📝 Test 2: Search as Context (for AI)");
        console.log("-".repeat(70));
        
        const query2 = "What are the authentication options?";
        console.log(`Query: "${query2}"\n`);
        
        const context = await searchKnowledgeAsContext(query2, { topK: 2 });
        console.log("Formatted context:");
        console.log(context.substring(0, 400) + "...\n");

        // Test 3: Search by week
        console.log("\n📝 Test 3: Search by Week");
        console.log("-".repeat(70));
        
        const query3 = "deployment";
        const week = "week-1";
        console.log(`Query: "${query3}" | Filter: ${week}\n`);
        
        const results3 = await searchByWeek(query3, week, 3);
        
        console.log(`Found ${results3.length} results from ${week}:\n`);
        for (const [i, result] of results3.entries()) {
            console.log(`${i + 1}. ${result.source} - Score: ${result.score.toFixed(4)}`);
        }

        // Test 4: Multi-query search
        console.log("\n\n📝 Test 4: Multi-Query Search");
        console.log("-".repeat(70));
        
        const queries = [
            "HTTPS setup",
            "SSL certificate",
            "domain configuration"
        ];
        console.log(`Queries: ${queries.join(", ")}\n`);
        
        const results4 = await multiQuerySearch(queries, 2);
        
        console.log(`Found ${results4.length} unique results:\n`);
        for (const [i, result] of results4.entries()) {
            console.log(`${i + 1}. ${result.source} - Score: ${result.score.toFixed(4)}`);
        }

        // Test 5: Low score filtering
        console.log("\n\n📝 Test 5: Score Filtering");
        console.log("-".repeat(70));
        
        const query5 = "random unrelated query about cooking";
        console.log(`Query: "${query5}" | Min Score: 0.7\n`);
        
        const results5 = await searchKnowledge(query5, { topK: 5, minScore: 0.7 });
        
        if (results5.length === 0) {
            console.log("✅ Correctly filtered out low-score results (< 0.7)");
        } else {
            console.log(`Found ${results5.length} high-quality results (>= 0.7 score)`);
        }

        console.log("\n" + "=".repeat(70));
        console.log("\n✅ All RAG search tests completed!");
        console.log("\n💡 Next steps:");
        console.log("   1. Create AI tool: lib/ai/tools/search-knowledge.ts");
        console.log("   2. Integrate into chat route");
        console.log("   3. Update system prompts");

    } catch (error) {
        console.error("\n❌ Test failed:", error);
        console.error("\n🔍 Troubleshooting:");
        console.error("   1. Ensure knowledge base is ingested");
        console.error("   2. Check Pinecone connection");
        console.error("   3. Verify API keys in .env");
        process.exit(1);
    }
}

testRAGSearch();

