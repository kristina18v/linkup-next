import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";

const TEST_TIMEOUT_MS = 120_000;
const REQUEST_TIMEOUT_MS = 10_000;
const SERVER_READY_TIMEOUT_MS = 90_000;

async function getFreePort() {
  const server = net.createServer();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

  return port;
}

async function waitForServer(baseUrl, child) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < SERVER_READY_TIMEOUT_MS) {
    if (child.exitCode !== null) {
      throw new Error(`Next.js server exited early with code ${child.exitCode}`);
    }

    try {
      const response = await fetch(baseUrl, {
        signal: AbortSignal.timeout(2_000),
      });

      if (response.status < 500 || response.status === 404) {
        return;
      }
    } catch {
      await delay(500);
    }
  }

  throw new Error("Next.js server did not become ready in time");
}

async function stopServer(child) {
  if (child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  const stopped = await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    delay(5_000).then(() => false),
  ]);

  if (stopped === false && child.exitCode === null) {
    child.kill("SIGKILL");
    await Promise.race([
      new Promise((resolve) => child.once("exit", resolve)),
      delay(5_000),
    ]);
  }
}

async function withNextServer(run) {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(
    process.execPath,
    [
      "--use-system-ca",
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        JWT_SECRET: "integration-test-jwt-secret",
        STRIPE_SECRET_KEY: "sk_test_integration_fake_key",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer(baseUrl, child);
    return await run(baseUrl);
  } catch (error) {
    error.message = `${error.message}\n\nNext.js output:\n${output.slice(-4_000)}`;
    throw error;
  } finally {
    await stopServer(child);
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const text = await response.text();
  let body;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return { response, body };
}

test(
  "POST /api/checkout without token returns 401 and login message",
  { timeout: TEST_TIMEOUT_MS },
  async () => {
    await withNextServer(async (baseUrl) => {
      const { response, body } = await fetchJson(`${baseUrl}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: "integration-test-item-id",
          type: "course",
        }),
      });

      assert.equal(response.status, 401);
      assert.deepEqual(body, { message: "\u041d\u0435 \u0441\u0442\u0435 \u043d\u0430\u0458\u0430\u0432\u0435\u043d\u0438" });
    });
  }
);

test(
  "GET /api/courses without token returns 401 and login message",
  { timeout: TEST_TIMEOUT_MS },
  async () => {
    await withNextServer(async (baseUrl) => {
      const { response, body } = await fetchJson(`${baseUrl}/api/courses`);

      assert.equal(response.status, 401);
      assert.deepEqual(body, { message: "\u041d\u0435 \u0441\u0442\u0435 \u043d\u0430\u0458\u0430\u0432\u0435\u043d\u0438" });
    });
  }
);

test(
  "POST /api/courses without token returns 401 and login message",
  { timeout: TEST_TIMEOUT_MS },
  async () => {
    await withNextServer(async (baseUrl) => {
      const { response, body } = await fetchJson(`${baseUrl}/api/courses`, {
        method: "POST",
        body: new FormData(),
      });

      assert.equal(response.status, 401);
      assert.deepEqual(body, { message: "\u041d\u0435 \u0441\u0442\u0435 \u043d\u0430\u0458\u0430\u0432\u0435\u043d\u0438" });
    });
  }
);
