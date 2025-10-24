/**
 * MCP Client for MindX Knowledge Base Server
 * 
 * Manages connection lifecycle and provides tools from the MCP server.
 * Requires MINDX_DEV_TOKEN environment variable.
 */

import { experimental_createMCPClient as createMCPClient } from 'ai';
import { MindXMCPTransport } from './mindx-mcp-transport';

let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | null = null;

/**
 * Get or create singleton MCP client instance
 */
export const getKbDevClient = async () => {
  if (mcpClient) return mcpClient;

  if (!process.env.MINDX_DEV_TOKEN) {
    console.warn('[MCP] MINDX_DEV_TOKEN not configured - MCP features disabled');
    return null;
  }

  try {
    const transport = new MindXMCPTransport({
      url: 'https://mcp-knowledge-base-dev.mindx.edu.vn/mcp',
      token: process.env.MINDX_DEV_TOKEN,
    });

    mcpClient = await createMCPClient({
      transport: transport as any,
    });

    return mcpClient;
  } catch (error) {
    console.error('[MCP] Failed to initialize client:', error);
    return null;
  }
};

/**
 * Get all available tools from MCP server
 */
export const getKbDevTools = async () => {
  const client = await getKbDevClient();

  if (!client) {
    return {};
  }

  try {
    return await client.tools();
  } catch (error) {
    console.error('[MCP] Failed to load tools:', error);
    return {};
  }
};

/**
 * Close MCP client and cleanup resources
 */
export const closeKbDevClient = async () => {
  if (mcpClient) {
    try {
      await mcpClient.close();
      mcpClient = null;
    } catch (error) {
      console.error('[MCP] Failed to close client:', error);
    }
  }
};

