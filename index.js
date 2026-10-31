#!/usr/bin/env node
/**
 * identityOS MCP: a stdio bridge to the hosted identityOS MCP server.
 *
 * Clients that only run local (stdio) MCP servers start this; it forwards each
 * JSON-RPC message to https://identityos.xyz/mcp (Streamable HTTP) and writes the
 * reply back. It contains no engine code: every reading is computed by the hosted
 * service. Zero dependencies.
 *
 *   IDENTITYOS_API_KEY   optional; raises your rate limit (free tier needs no key)
 *   IDENTITYOS_MCP_URL   optional; defaults to https://identityos.xyz/mcp
 */
import { createInterface } from "node:readline";

const URL_ = process.env.IDENTITYOS_MCP_URL || "https://identityos.xyz/mcp";
const KEY = process.env.IDENTITYOS_API_KEY || "";
const VERSION = "0.1.0";

const out = (msg) => process.stdout.write(JSON.stringify(msg) + "\n");
const fail = (id, message) => out({ jsonrpc: "2.0", id, error: { code: -32603, message } });
const ids = (m) => (Array.isArray(m) ? m : [m]).filter((x) => x && x.id !== undefined).map((x) => x.id);

async function forward(msg) {
  let res;
  try {
    res = await fetch(URL_, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "user-agent": `identityos-mcp/${VERSION}`,
        ...(KEY ? { authorization: `Bearer ${KEY}` } : {}),
      },
      body: JSON.stringify(msg),
    });
  } catch (e) {
    for (const id of ids(msg)) fail(id, `Could not reach ${URL_}: ${e.message}`);
    return;
  }
  const text = await res.text();
  if (!text.trim()) return; // notification accepted (202)
  if ((res.headers.get("content-type") || "").includes("text/event-stream")) {
    for (const line of text.split(/\r?\n/)) if (line.startsWith("data:")) { const d = line.slice(5).trim(); if (d) process.stdout.write(d + "\n"); }
    return;
  }
  try {
    const body = JSON.parse(text);
    for (const m of Array.isArray(body) ? body : [body]) out(m);
  } catch {
    for (const id of ids(msg)) fail(id, `identityOS answered HTTP ${res.status}`);
  }
}

// One message at a time, in order, so replies never overtake each other.
let chain = Promise.resolve();
createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { out({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }); return; }
  chain = chain.then(() => forward(msg));
}).on("close", () => chain.then(() => process.exit(0)));
