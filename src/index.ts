import { createServer } from 'node:http';
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';

import { env } from './config.ts';
import { registerWebSearchTool } from './tools/web-search.ts';

function createMcpServer(): McpServer {
  const mcp = new McpServer(
    {
      name: 'searxng-mcp',
      version: '1.0.0',
    },
    {
      instructions: [
        'Use web_search for current, recent, or time-sensitive information.',
        'Prefer one broad search query first.',
        'Only perform additional searches when the initial results are insufficient or conflicting.',
        'Use the URLs returned by search results as source references when relevant.',
      ].join(' '),
    },
  );

  registerWebSearchTool(mcp);

  return mcp;
}

const mcpHandler = createMcpHandler(createMcpServer);
const nodeHandler = toNodeHandler(mcpHandler);

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');

  res.setHeader(
    'Access-Control-Allow-Headers',
    ['Content-Type', 'Accept', 'Mcp-Session-Id', 'MCP-Protocol-Version', 'Last-Event-ID'].join(', '),
  );

  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (url.pathname !== '/mcp') {
    res.writeHead(404, {
      'content-type': 'text/plain; charset=utf-8',
    });

    res.end('Not found');
    return;
  }

  void nodeHandler(req, res);
});

server.listen(env.PORT, '0.0.0.0', () => {
  console.log({
    mcp: `http://0.0.0.0:${env.PORT}/mcp`,
    searxng: env.SEARXNG_URL,
  });
});
