const assert = require("assert");
const http = require("http");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");
const pool = require("./config/db");
const { jwtSecret } = require("./config/jwt");
const authMiddleware = require("./middlewares/auth");
const {
  projectSchema,
} = require("./validations/projectValidation");
const {
  skillSchema,
} = require("./validations/skillValidation");
const {
  updateProfileSchema,
} = require("./validations/personalValidation");
const {
  createEducationSchema,
} = require("./validations/educationValidation");
const projectServices = require("./services/projects");
const skillServices = require("./services/skills");
const contactServices = require("./services/contact");
const educationServices = require("./services/education");
const personalServices = require("./services/personalServices");

const requestJson = (baseUrl, method, route, body = null, headers = {}) =>
  new Promise((resolve, reject) => {
    const payload = body !== null ? JSON.stringify(body) : null;
    const url = new URL(route, baseUrl);
    const req = http.request(
      url,
      {
        method,
        headers: {
          ...(payload
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload),
              }
            : {}),
          ...headers,
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          try {
            resolve({
              status: res.statusCode,
              data: raw ? JSON.parse(raw) : null,
            });
          } catch {
            resolve({ status: res.statusCode, data: raw });
          }
        });
      },
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });

async function runHttpAndValidationTests() {
  console.log("🔍 Running API, Validation & Security Tests...\n");

  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Health & 404
    const health = await requestJson(baseUrl, "GET", "/api/health");
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.success, true);
    console.log("✅ 1. Health endpoint returned 200");

    const notFound = await requestJson(baseUrl, "GET", "/api/non-existent");
    assert.strictEqual(notFound.status, 404);
    assert.strictEqual(notFound.data.success, false);
    console.log("✅ 2. 404 handler returned 404");

    const spaRoot = await fetch(`${baseUrl}/`);
    assert.strictEqual(spaRoot.status, 200);
    assert.ok(spaRoot.headers.get("content-type")?.includes("text/html"));
    const cspHeader = spaRoot.headers.get("content-security-policy") || "";
    assert.ok(cspHeader.includes("https:") && cspHeader.includes("blob:"));
    const spaDeepRoute = await fetch(`${baseUrl}/admin/login`);
    assert.strictEqual(spaDeepRoute.status, 200);
    console.log("✅ 2b. Express serves built Vue SPA & history fallback with valid CSP");

    // 2. Auth protection (401)
    for (const [method, route] of [
      ["PUT", "/api/profile"],
      ["POST", "/api/projects"],
      ["GET", "/api/contact"],
      ["POST", "/api/upload/avatar"],
      ["POST", "/api/upload/resume"],
    ]) {
      const res = await requestJson(baseUrl, method, route, {});
      assert.strictEqual(res.status, 401, `${method} ${route} should require auth`);
    }
    const invalidJwtRes = await requestJson(baseUrl, "GET", "/api/contact", null, {
      Authorization: "Bearer invalid.jwt.token",
    });
    assert.strictEqual(invalidJwtRes.status, 401);
    const fakeSignedToken = jwt.sign({ id: 999 }, `${jwtSecret}-wrong`);
    const wrongSigRes = await requestJson(baseUrl, "GET", "/api/contact", null, {
      Authorization: `Bearer ${fakeSignedToken}`,
    });
    assert.strictEqual(wrongSigRes.status, 401);
    console.log("✅ 3. Protected routes reject unauthenticated / invalid tokens (401)");

    // 3. RBAC isAdmin middleware unit check
    let nextCalled = false;
    let statusAssigned = null;
    authMiddleware.isAdmin(
      { user_role: "user" },
      {
        status(code) {
          statusAssigned = code;
          return { json() {} };
        },
      },
      () => {
        nextCalled = true;
      },
    );
    assert.strictEqual(statusAssigned, 403);
    assert.strictEqual(nextCalled, false);
    authMiddleware.isAdmin(
      { user_role: "admin" },
      { status() { return { json() {} }; } },
      () => {
        nextCalled = true;
      },
    );
    assert.strictEqual(nextCalled, true);
    console.log("✅ 4. RBAC isAdmin middleware rejects non-admin (403) and allows admin");

    // 4. Route validation checks via HTTP
    const verifyMissing = await requestJson(baseUrl, "GET", "/api/auth/verify-email");
    assert.strictEqual(verifyMissing.status, 400);

    const invalidId = await requestJson(baseUrl, "GET", "/api/projects/not-an-id");
    assert.strictEqual(invalidId.status, 400);

    const badContact = await requestJson(baseUrl, "POST", "/api/contact", {
      sender_name: "A",
      sender_email: "not-an-email",
      subject: "Hi",
      message: "short",
    });
    assert.strictEqual(badContact.status, 400);
    assert.ok(Array.isArray(badContact.data.errors) && badContact.data.errors.length > 0);
    console.log("✅ 5. Query, param ID, and body validation return 400 properly");

    // 5. Joi schema edge-case checks
    const emptySlugProj = projectSchema.validate({
      title: "My Portfolio",
      slug: "",
      description: "Test description",
      thumbnail_url: "/uploads/avatar-123.png",
    });
    assert.strictEqual(emptySlugProj.error, undefined);

    const xssUrlProj = projectSchema.validate({
      title: "XSS Test",
      description: "Test",
      live_url: "javascript:alert(1)",
    });
    assert.ok(xssUrlProj.error, "javascript: URI must be rejected");

    const xssAvatarProfile = updateProfileSchema.validate({
      full_name: "Siv Punleu",
      title: "Developer",
      bio: "Bio",
      email: "test@example.com",
      avatar_url: "javascript:alert(1)",
    });
    assert.ok(xssAvatarProfile.error, "javascript: avatar_url must be rejected");

    const localAvatarProfile = updateProfileSchema.validate({
      full_name: "Siv Punleu",
      title: "Developer",
      bio: "Bio",
      email: "test@example.com",
      avatar_url: "/uploads/avatar-123.png",
      resume_url: "/uploads/resume-123.pdf",
    });
    assert.strictEqual(localAvatarProfile.error, undefined);

    const emptyProfSkill = skillSchema.validate({
      name: "Vue.js",
      category: "Frontend",
      proficiency_percent: "",
      display_order: "",
    });
    assert.strictEqual(emptyProfSkill.error, undefined);

    const eduValid = createEducationSchema.validate({
      school_name: "RUPP",
      degree: "BSc",
      start_date: "2020-01-01",
      end_date: "",
      display_order: "",
    });
    assert.strictEqual(eduValid.error, undefined);
    console.log("✅ 6. Schema edge cases (empty slug, /uploads path, empty proficiency, XSS URL blocking) passed");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function runDbTests() {
  console.log("\n🔍 Running Live Database Service Tests...\n");

  const profile = await personalServices.getProfile();
  console.log("✅ DB 1. Profile Service:", profile.full_name, "-", profile.title);

  const education = await educationServices.getAllEducation();
  console.log("✅ DB 2. Education Service: Found", education.length, "records");

  const projects = await projectServices.getAllProjects();
  console.log("✅ DB 3. Projects Service: Found", projects.length, "projects");

  const skills = await skillServices.getAllSkills();
  console.log("✅ DB 4. Skills Service: Found", skills.length, "skills");

  const testMsg = await contactServices.submitContactMessage({
    sender_name: "Test Visitor",
    sender_email: "test@example.com",
    subject: "Collaboration Inquiry",
    message: "Hello! This is an automated test message to verify the contact service works.",
  });
  await contactServices.deleteContactMessage(testMsg.id);
  console.log("✅ DB 5. Contact Service create + cleanup passed");
}

async function main() {
  try {
    await runHttpAndValidationTests();
    if (process.argv.includes("--db")) {
      await runDbTests();
    }
    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("\n❌ Test Failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
