// Smoke test: start the bridge, initialize, list tools. IDENTITYOS_MCP_URL can point at a local server.
import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const p = spawn(process.execPath, ["index.js"], { env: process.env, stdio: ["pipe", "pipe", "inherit"] });
const lines = [];
p.stdout.on("data", (b) => lines.push(...b.toString().split("\n").filter(Boolean)));
const send = (m) => p.stdin.write(JSON.stringify(m) + "\n");
send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } } });
send({ jsonrpc: "2.0", method: "notifications/initialized" });
send({ jsonrpc: "2.0", id: 2, method: "tools/list" });
p.stdin.end();
p.on("exit", () => {
  const msgs = lines.map((l) => JSON.parse(l));
  const init = msgs.find((m) => m.id === 1), list = msgs.find((m) => m.id === 2);
  assert.equal(init.result.serverInfo.name, "identityos");
  assert.ok(list.result.tools.length > 0);
  assert.ok(list.result.tools.every((t) => t.annotations?.readOnlyHint === true));
  console.log(`ok: ${init.result.serverInfo.title} ${init.result.protocolVersion}, ${list.result.tools.length} tools: ${list.result.tools.map((t) => t.name).join(", ")}`);
});
