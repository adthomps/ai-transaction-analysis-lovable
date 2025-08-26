import { Hono } from 'hono';
import mockTransDetails from './src/mockData/mock_data_transdetails.json';
import { serveStatic } from 'hono/cloudflare-workers';

// Debug endpoint to verify mock data access
// All API routes must be defined before the catch-all route

type Bindings = {
  ASSETS: unknown;
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Debug endpoint to verify mock data access
app.get('/api/debug/mock-transactions', (c) => {
  return c.json({ mockTransDetails });
});

// Transaction lookup endpoint
app.get('/api/transaction/:id', async (c) => {
  const id = c.req.param('id');
  // Strictly find transaction by transId in mock data array
  let transaction = null;
  if (Array.isArray(mockTransDetails)) {
    transaction = mockTransDetails.find((t) => t.transId === id) || null;
  }
  // Debug log for lookup result
  console.log(`[Transaction Lookup] Requested ID: ${id}, Found:`, transaction);
  // If not found, return 404
  if (!transaction) {
    return c.json({ error: 'Transaction not found', debug: { requestedId: id, found: null } }, 404, {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }
  return c.json({ ...transaction, debug: { requestedId: id, found: transaction.transId } }, 200, {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
});

// OpenAI-powered analysis endpoint
app.post('/api/analyze', async (c) => {
  const body = await c.req.json();
  const { transaction, promptType } = body;

  // Prompt templates (simplified, can be expanded)
  const prompts = {
    basic: "Analyze the following transaction:\nID: {{transId}}\nStatus: {{transactionStatus}}\nAuth Amount: ${{authAmount}}\nSettle Amount: ${{settleAmount}}\nResponse Code: {{responseCode}}\nReason: {{responseReasonDescription}}",
    fraud: "Review for fraud risk:\nID: {{transId}}\nStatus: {{transactionStatus}}\nAuth Amount: ${{authAmount}}\nSettle Amount: ${{settleAmount}}\nResponse Code: {{responseCode}}\nReason: {{responseReasonDescription}}"
  };
  const selectedPrompt = prompts[promptType as keyof typeof prompts] || prompts.basic;
  const filledPrompt = selectedPrompt
    .replace("{{transId}}", transaction.transId || "Not available")
    .replace("{{transactionStatus}}", transaction.transactionStatus || "Not available")
    .replace("{{authAmount}}", transaction.authAmount !== undefined ? transaction.authAmount.toFixed(2) : "Not available")
    .replace("{{settleAmount}}", transaction.settleAmount !== undefined ? transaction.settleAmount.toFixed(2) : "Not available")
    .replace("{{responseCode}}", transaction.responseCode || "Not available")
    .replace("{{responseReasonDescription}}", transaction.responseReasonDescription || "Not available");

  // Make a real OpenAI API call
  const openaiApiKey = c.env.OPENAI_API_KEY;
  if (!openaiApiKey || openaiApiKey === 'sk-REPLACE_ME') {
    return c.json({ error: 'OpenAI API key is missing or not set. Please add your key to the .env file.' }, 401);
  }
  const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
  const model = "gpt-3.5-turbo";
  const maxTokens = 256;

  const payload = {
    model,
    messages: [
      { role: "system", content: "You are an AI assistant specializing in payment transaction analysis." },
      { role: "user", content: filledPrompt },
    ],
    max_tokens: maxTokens,
  };

  const response = await fetch(openaiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
  return c.json({ error: `OpenAI API call failed with status: ${response.status}` }, undefined, {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }
  const aiData = await response.json();
  const aiInsights = aiData.choices?.[0]?.message?.content || "No insights generated.";

  return c.json({
    transactionId: transaction.transId,
    promptType,
    aiInsights,
    prompt: filledPrompt,
    timestamp: new Date().toISOString(),
  }, 200, {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
});

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve static assets
app.get('/assets/*', serveStatic({ root: './', manifest: {} }));
app.get('/favicon.ico', serveStatic({ path: './favicon.ico', manifest: {} }));
app.get('/robots.txt', serveStatic({ path: './robots.txt', manifest: {} }));

// ...existing code...

// Serve static files with proper MIME types
// This must be the last route defined in the file
app.get('*', async (c, next) => {
  const url = new URL(c.req.url);
  const pathname = url.pathname;

  // Serve static assets
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/)) {
    try {
  const response = await (c.env.ASSETS as { fetch: (url: string) => Promise<Response> }).fetch(c.req.url);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error('Error serving static file:', error);
    }
  }

  // If the route starts with /api/, return 404 (do not serve SPA fallback)
  if (pathname.startsWith('/api/')) {
    return c.json({ error: 'API route not found', debug: { requestedPath: pathname } }, 404);
  }

  // SPA fallback - serve index.html for all other routes
  try {
    const indexUrl = new URL('/index.html', c.req.url);
  const response = await (c.env.ASSETS as { fetch: (url: string) => Promise<Response> }).fetch(indexUrl.toString());
    if (response.ok) {
      // Handle redirects
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('Location');
        if (location) {
          return c.redirect(location);
        }
      }
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }
  } catch (error) {
    console.error('Error serving SPA fallback:', error);
  }

  return c.notFound();
});

export default app;