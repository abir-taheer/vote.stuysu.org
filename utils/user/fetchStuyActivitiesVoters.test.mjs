import assert from "node:assert/strict";
import test from "node:test";
import fetchStuyActivitiesVoters from "./fetchStuyActivitiesVoters.js";

const voter = { email: "student@stuy.edu", gradYear: 2030, active: true };

test("accepts a complete roster that spans the upstream page boundary", async (t) => {
  const voters = Array.from({ length: 1001 }, (_, i) => ({
    ...voter,
    email: `student${i}@stuy.edu`,
  }));
  const fetchMock = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true, data: voters })
  );

  assert.deepEqual(await fetchStuyActivitiesVoters("test-token"), voters);
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.deepEqual(fetchMock.mock.calls[0].arguments, [
    "https://base.stuysu.org/functions/v1/export-voters",
    { headers: { authorization: "Bearer test-token" } },
  ]);
});

test("rejects a roster at the legacy export cap before sync can use it", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true, data: Array(1000).fill(voter) })
  );

  await assert.rejects(fetchStuyActivitiesVoters("test-token"), /1,000 rows/);
});

test("accepts a roster below the legacy export cap", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true, data: [voter] })
  );

  assert.deepEqual(await fetchStuyActivitiesVoters("test-token"), [voter]);
});

test("rejects an unsuccessful export even if it returns HTTP 200", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: false, data: [voter] })
  );

  await assert.rejects(fetchStuyActivitiesVoters("test-token"), /valid roster/);
});
