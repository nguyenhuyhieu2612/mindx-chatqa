

import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import type { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';

export interface MindXMCPTransportOptions {
  url: string;
  token: string;
}

export class MindXMCPTransport implements Transport {
  private readonly url: string;
  private readonly token: string;
  private messageId = 0;
  private mcpSessionId?: string;

  onmessage?: (message: JSONRPCMessage) => void;
  onerror?: (error: Error) => void;
  onclose?: () => void;

  constructor(options: MindXMCPTransportOptions) {
    this.url = options.url;
    this.token = options.token;
  }

  /**
   * Start transport. AI SDK will call initialize() via send().
   */
  async start(): Promise<void> {
    // Ready - AI SDK handles initialize
  }

  /**
   * Send JSON-RPC message to server
   */
  async send(message: JSONRPCMessage): Promise<void> {
    try {
      // Skip notifications - server doesn't support MCP notification protocol
      const method = (message as any).method;
      if (method?.startsWith('notifications/')) {
        return;
      }

      const response = await this.httpRequest(message);

      if (response && this.onmessage) {
        this.onmessage(response);
      }
    } catch (error) {
      this.onerror?.(error as Error);
      throw error;
    }
  }

  /**
   * Close transport and clear session
   */
  async close(): Promise<void> {
    this.mcpSessionId = undefined;
    this.onclose?.();
  }

  /**
   * Execute HTTP request with authentication and session management
   */
  private async httpRequest(message: JSONRPCMessage): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'Authorization': `Bearer ${this.token}`,
    };

    // Include session ID in subsequent requests after initialization
    if (this.mcpSessionId) {
      headers['mcp-session-id'] = this.mcpSessionId;
    }

    const response = await fetch(this.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    // Capture session ID from initialize response
    const sessionId = response.headers.get('mcp-session-id');
    if (sessionId && !this.mcpSessionId) {
      this.mcpSessionId = sessionId;
    }

    return this.parseResponse(response);
  }

  /**
   * Parse response based on content-type (JSON or SSE)
   */
  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/event-stream')) {
      const text = await response.text();
      const dataMatch = text.match(/data: (.+)/);
      if (dataMatch) {
        return JSON.parse(dataMatch[1]);
      }
      throw new Error('Invalid SSE format');
    }

    return response.json();
  }
}

