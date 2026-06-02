/* global console, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require("child_process");
const { exportJWK, exportPKCS8, generateKeyPair } = require("jose");
const convexArgs = process.argv.slice(2).join(" ");

(async () => {
  const keys = await generateKeyPair("RS256", { extractable: true });
  const privateKey = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);
  const jwtPrivateKey = privateKey.trimEnd().replace(/\n/g, " ");
  const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

  // Use environment variable to pass the key value, avoiding CLI parsing issues
  process.env.JWT_PRIVATE_KEY_VALUE = jwtPrivateKey;
  process.env.JWKS_VALUE = jwks;

  execSync(`npx convex env set JWT_PRIVATE_KEY "$JWT_PRIVATE_KEY_VALUE" ${convexArgs}`.trim(), {
    stdio: "inherit",
    env: process.env,
    cwd: "/Users/dev/Desktop/ffw/wreath-site",
    shell: "/bin/bash"
  });

  execSync(`npx convex env set JWKS "$JWKS_VALUE" ${convexArgs}`.trim(), {
    stdio: "inherit",
    env: process.env,
    cwd: "/Users/dev/Desktop/ffw/wreath-site",
    shell: "/bin/bash"
  });

  console.log("Done setting keys!");
})();
