/* global console, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require("child_process");

const requiredVars = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SITE_URL",
];
const convexArgs = process.argv.slice(2).join(" ");

for (const name of requiredVars) {
  if (!process.env[name]) {
    console.error(`Missing ${name} in your shell environment.`);
    process.exit(1);
  }
}

const cwd = "/Users/dev/Desktop/ffw/wreath-site";
const shell = "/bin/bash";

for (const name of requiredVars) {
  execSync(`npx convex env set ${name} "$${name}" ${convexArgs}`.trim(), {
    stdio: "inherit",
    env: process.env,
    cwd,
    shell,
  });
}

console.log("Stripe-related Convex environment variables set.");
