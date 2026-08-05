import assert from "node:assert/strict";
import test from "node:test";

import { validateContactPayload, validateVendorFields, validateVendorFile } from "../lib/form-validation";

test("contact validation accepts a complete trimmed payload", () => {
  assert.deepEqual(
    validateContactPayload({
      name: "  Wael  ",
      email: " client@example.com ",
      subject: " Event support ",
      message: " We need help with an event. ",
    }),
    {
      value: {
        name: "Wael",
        email: "client@example.com",
        subject: "Event support",
        message: "We need help with an event.",
      },
    },
  );
});

test("contact validation rejects an invalid email", () => {
  assert.deepEqual(
    validateContactPayload({ name: "Wael", email: "wrong", subject: "Event", message: "Hello" }),
    { error: "Enter a valid email address." },
  );
});

test("vendor validation requires every reference-site field", () => {
  assert.deepEqual(
    validateVendorFields({ event: "Kuwait Coffee Festival", businessName: "Pop", contactPerson: "Wael" }),
    { error: "Complete all required fields." },
  );
});

test("vendor validation accepts a supported category and valid email", () => {
  assert.deepEqual(
    validateVendorFields({
      event: "The Big Fest",
      businessName: "Pop",
      contactPerson: "Wael",
      email: "vendor@example.com",
      phone: "+965 9000 0000",
      category: "Arts & Crafts",
      description: "Handmade products",
      instagram: "@pop",
    }),
    {
      value: {
        event: "The Big Fest",
        businessName: "Pop",
        contactPerson: "Wael",
        email: "vendor@example.com",
        phone: "+965 9000 0000",
        category: "Arts & Crafts",
        description: "Handmade products",
        instagram: "@pop",
      },
    },
  );
});

test("vendor attachment validation rejects unsupported file types", () => {
  assert.equal(validateVendorFile({ size: 1024, type: "text/plain" }), "Documents must be PDF, JPG, PNG, or WebP files up to 10 MB.");
});

test("vendor attachment validation accepts a PDF within the size limit", () => {
  assert.equal(validateVendorFile({ size: 1024, type: "application/pdf" }), null);
});
