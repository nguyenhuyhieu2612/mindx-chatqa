/**
 * AI Context Tracking - Monitor AI's context fetching behavior
 * 
 * Tracks:
 * - How many searches AI makes per query
 * - What context AI fetches
 * - Success rate of multi-search
 * - Performance metrics
 */

export interface ContextFetchEvent {
  sessionId: string;
  userQuery: string;
  searches: SearchAttempt[];
  timestamp: number;
  totalSearches: number;
  hadMissingContext: boolean;
  resolutionStrategy: 'single-search' | 'multi-search' | 'no-search';
}

export interface SearchAttempt {
  query: string;
  week?: string;
  topK?: number;
  success: boolean;
  resultsCount: number;
  score?: number;
  sources: string[];
  timestamp: number;
}

class ContextTracker {
  private events: ContextFetchEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events

  /**
   * Start tracking a new query
   */
  startTracking(sessionId: string, userQuery: string): string {
    const trackingId = `${sessionId}-${Date.now()}`;
    
    this.events.push({
      sessionId: trackingId,
      userQuery,
      searches: [],
      timestamp: Date.now(),
      totalSearches: 0,
      hadMissingContext: false,
      resolutionStrategy: 'no-search',
    });

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    return trackingId;
  }

  /**
   * Log a search attempt
   */
  logSearch(
    sessionId: string,
    searchQuery: string,
    success: boolean,
    resultsCount: number,
    sources: string[] = [],
    week?: string,
    topK?: number
  ): void {
    const event = this.events.find(e => e.sessionId === sessionId);
    
    if (!event) {
      console.warn(`ContextTracker: Session ${sessionId} not found`);
      return;
    }

    event.searches.push({
      query: searchQuery,
      week,
      topK,
      success,
      resultsCount,
      sources,
      timestamp: Date.now(),
    });

    event.totalSearches = event.searches.length;

    // Determine strategy
    if (event.totalSearches === 0) {
      event.resolutionStrategy = 'no-search';
    } else if (event.totalSearches === 1) {
      event.resolutionStrategy = 'single-search';
    } else {
      event.resolutionStrategy = 'multi-search';
      event.hadMissingContext = true;
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const total = this.events.length;
    
    if (total === 0) {
      return {
        totalQueries: 0,
        avgSearchesPerQuery: 0,
        multiSearchRate: 0,
        noSearchRate: 0,
        contextCompletionRate: 0,
      };
    }

    const multiSearchCount = this.events.filter(
      e => e.resolutionStrategy === 'multi-search'
    ).length;

    const noSearchCount = this.events.filter(
      e => e.resolutionStrategy === 'no-search'
    ).length;

    const totalSearches = this.events.reduce(
      (sum, e) => sum + e.totalSearches,
      0
    );

    return {
      totalQueries: total,
      avgSearchesPerQuery: (totalSearches / total).toFixed(2),
      multiSearchRate: ((multiSearchCount / total) * 100).toFixed(1) + '%',
      noSearchRate: ((noSearchCount / total) * 100).toFixed(1) + '%',
      contextCompletionRate: ((multiSearchCount / total) * 100).toFixed(1) + '%',
    };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 10): ContextFetchEvent[] {
    return this.events.slice(-limit).reverse();
  }

  /**
   * Get events by strategy
   */
  getEventsByStrategy(strategy: ContextFetchEvent['resolutionStrategy']): ContextFetchEvent[] {
    return this.events.filter(e => e.resolutionStrategy === strategy);
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Export events for analysis
   */
  exportEvents(): ContextFetchEvent[] {
    return [...this.events];
  }

  /**
   * Get insights about AI behavior
   */
  getInsights() {
    const stats = this.getStats();
    const multiSearchEvents = this.getEventsByStrategy('multi-search');
    
    // Analyze what triggers multi-search
    const commonPatterns = multiSearchEvents
      .map(e => e.userQuery.toLowerCase())
      .filter(q => 
        q.includes('how') || 
        q.includes('step') || 
        q.includes('setup') ||
        q.includes('deploy')
      );

    const multiSearchQueries = multiSearchEvents.map(e => ({
      query: e.userQuery,
      searches: e.searches.map(s => s.query),
      searchCount: e.totalSearches,
    }));

    return {
      stats,
      insights: {
        aiIsLearning: multiSearchEvents.length > 5,
        avgSearchDepth: stats.avgSearchesPerQuery,
        commonMultiSearchTriggers: commonPatterns.length,
        exampleMultiSearches: multiSearchQueries.slice(0, 5),
      },
    };
  }
}

// Singleton instance
export const contextTracker = new ContextTracker();

/**
 * Console logging utility for dev
 */
export function logContextBehavior() {
  console.log('\n🤖 AI Context Behavior Stats:');
  console.log('─'.repeat(50));
  
  const stats = contextTracker.getStats();
  console.log(`Total Queries: ${stats.totalQueries}`);
  console.log(`Avg Searches/Query: ${stats.avgSearchesPerQuery}`);
  console.log(`Multi-Search Rate: ${stats.multiSearchRate}`);
  console.log(`Context Completion: ${stats.contextCompletionRate}`);
  
  console.log('\n📊 Recent Multi-Search Examples:');
  const recentMulti = contextTracker
    .getEventsByStrategy('multi-search')
    .slice(-3);
  
  for (const event of recentMulti) {
    console.log(`\nQuery: "${event.userQuery}"`);
    console.log(`Searches made: ${event.totalSearches}`);
    for (const search of event.searches) {
      console.log(`  → "${search.query}" (${search.resultsCount} results)`);
    }
  }
  
  console.log('\n' + '─'.repeat(50));
}

/**
 * Hook for Application Insights / monitoring
 */
export function trackContextEvent(event: Partial<ContextFetchEvent>) {
  // TODO: Integrate with Azure App Insights
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Context Event:', {
      strategy: event.resolutionStrategy,
      searches: event.totalSearches,
      hadMissingContext: event.hadMissingContext,
    });
  }
}

