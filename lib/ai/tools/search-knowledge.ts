import { tool } from "ai";
import { z } from "zod";
import { searchKnowledgeAsContext, searchByWeek } from "@/lib/rag/search";
import { contextTracker } from "@/lib/ai/context-tracker";


export const searchKnowledgeTool = tool({
    description: `🚨 CRITICAL: This is your ONLY source for technical answers. 

⚠️ WARNING: Using information NOT from search results = WRONG ANSWER!

**🔴 ABSOLUTE RULES - ZERO TOLERANCE - NO EXCEPTIONS:**

1. **SEARCH FIRST, ALWAYS**
   - You MUST search this KB BEFORE answering ANY technical question
   - NEVER skip searching, even if you "know" the answer

2. **SEARCH RESULTS ONLY**
   - You MUST NOT add ANY commands, steps, or information NOT in search results
   - ❌ FORBIDDEN EXAMPLE: "az aks update --attach-acr" (NOT IN KB!)
   - If search results don't mention it → You CANNOT mention it
   - If you're not 100% certain it's from search results → DON'T use it

3. **MULTI-SEARCH FOR COMPLEX QUESTIONS**
   - You MUST search MULTIPLE TIMES (2-3) for complex questions
   - Check prerequisites → Search them
   - Missing context → Search again

4. **ADMIT WHEN NOT FOUND**
   - If info NOT found in KB after searching → Admit it honestly
   - NEVER make up answers from general knowledge
   - Say: "This is not in the course materials"

**VERIFICATION CHECK:**
Before including ANY command or step, ask yourself:
- ❓ "Did I see this EXACT text in the search results?"
- ❓ "Can I cite which Week/Task this came from?"
- If answer is NO → DON'T include it!

**INTELLIGENT CONTEXT FETCHING:**

You can (and MUST) call this tool MULTIPLE TIMES in the same response when you detect missing context.

**Knowledge Base Contents:**
- Week 1: Azure Cloud setup, deployment, HTTPS, authentication
- Week 2: Advanced deployment, monitoring, scaling, CI/CD
- Week 3: Security, optimization, production best practices

**When to Search:**

Initial Search (MANDATORY):
- ANY technical question about Azure, AKS, ACR, Docker, Kubernetes
- Questions about deployment, architecture, setup
- Questions about specific steps or tasks
- Questions about components, services, configuration

Additional Searches (INTELLIGENT):
- Retrieved context mentions components you don't understand
- Steps reference prerequisites from other sections
- Context says "as configured in..." pointing elsewhere
- Technical terms are used without definition
- Dependencies are mentioned but not explained

**Search Strategy:**

1st Search: Broad query for main topic
\`\`\`
searchKnowledge(query: "deploy Azure AKS")
\`\`\`

2nd Search (if needed): Specific missing pieces
\`\`\`
searchKnowledge(query: "Azure Container Registry definition")
searchKnowledge(query: "prerequisites Step 1")
\`\`\`

**Examples of Multi-Search:**

User: "How to connect AKS to ACR?"
→ Search 1: "connect AKS ACR" (gets the command)
→ Analyze: Mentions "ACR must be created first"
→ Search 2: "create ACR" (gets prerequisite steps)
→ Answer: Complete with prerequisites + main steps

User: "Deploy with ingress controller"
→ Search 1: "deploy ingress controller" (gets deployment)
→ Analyze: References "AKS cluster from Step 2"
→ Search 2: "AKS cluster setup Step 2" (gets cluster setup)
→ Answer: Complete deployment guide

**If NOT Found After Searching:**
"Thông tin về [topic] không có trong tài liệu khóa học. Knowledge base bao gồm Azure deployment (Week 1-3). Bạn có thể hỏi về các chủ đề này không?"

**Important:**
- MANDATORY: Call this tool for ALL technical questions
- You can call 2-3 times per response if needed
- Each search should be targeted and specific
- Don't search for the same thing twice
- Stop when you have complete context
- ALWAYS cite sources in your answer`,
    
    inputSchema: z.object({
        query: z.string().describe("The search query - be specific and descriptive"),
        week: z.enum(["week-1", "week-2", "week-3", "all"]).optional().describe("Filter by specific week, or 'all' for all weeks (default)"),
        topK: z.number().min(1).max(10).optional().describe("Number of results to return (default: 5)"),
    }),
    
    execute: async (input) => {
        const { query, week, topK = 5 } = input;
        
        // Generate session ID for tracking (use timestamp + query hash)
        const sessionId = `${Date.now()}-${query.slice(0, 20)}`;
        
        try {
            let context: string;
            let sources: string[] = [];
            let resultsCount = 0;
            
            // Search by week if specified
            if (week && week !== "all") {
                const results = await searchByWeek(query, week, topK);
                resultsCount = results.length;
                sources = results.map(r => r.source);
                
                // Log tracking
                contextTracker.logSearch(
                    sessionId,
                    query,
                    results.length > 0,
                    resultsCount,
                    sources,
                    week,
                    topK
                );
                
                if (results.length === 0) {
                    return {
                        success: false,
                        message: `No relevant information found in ${week} for query: "${query}"`,
                        context: "",
                        sources: [],
                    };
                }
                
                context = results
                    .map((r, i) => `[${i + 1}] Source: ${r.source} | Score: ${r.score.toFixed(3)}\n${r.text}`)
                    .join("\n\n---\n\n");
                
                return {
                    success: true,
                    message: `Found ${results.length} results from ${week}`,
                    context,
                    sources,
                    scores: results.map(r => r.score),
                };
            }
            
            // Search all weeks
            context = await searchKnowledgeAsContext(query, { topK });
            
            // Extract sources and count from context
            const sourceMatches = Array.from(context.matchAll(/Source: ([^\s]+)/g));
            sources = sourceMatches.map(m => m[1]);
            resultsCount = sources.length;
            
            const success = context !== "No relevant information found in the knowledge base.";
            
            // Log tracking
            contextTracker.logSearch(
                sessionId,
                query,
                success,
                resultsCount,
                sources,
                week,
                topK
            );
            
            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔍 AI Search: "${query}" → ${resultsCount} results`);
            }
            
            if (!success) {
                return {
                    success: false,
                    message: `No relevant information found for query: "${query}"`,
                    context: "",
                    sources: [],
                };
            }
            
            return {
                success: true,
                message: `Found relevant information`,
                context,
                sources,
            };
            
        } catch (error) {
            console.error("Search knowledge tool error:", error);
            
            // Log failed search
            contextTracker.logSearch(
                sessionId,
                query,
                false,
                0,
                [],
                week,
                topK
            );
            
            return {
                success: false,
                message: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                context: "",
                sources: [],
            };
        }
    },
});


export function formatWithCitations(context: string, sources: string[]): string {
    const uniqueSources = [...new Set(sources)];
    
    return `${context}

---
📚 Sources:
${uniqueSources.map((s, i) => `[${i + 1}] ${s}`).join("\n")}`;
}

