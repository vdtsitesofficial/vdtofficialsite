// eslint-disable-next-line no-console
console.error(`
================================================================
🛑  DEPLOY BLOCKED  ·  vdttest-site
================================================================

The live worker on vdtsites.com is currently at version
  b0d3dee5-efd5-4a47-ab58-001593e8419f   (deployed 2026-05-19)

That deployment was built from a working tree that included
~50 uncommitted source files (custom hero components, theme
images, redesign work). Those files have since been discarded
and are NOT in this git repo.

Running 'opennextjs-cloudflare build && deploy' from this folder
right now will rebuild WITHOUT those files and overwrite the
live design with an empty version of the codebase.

→ Do not deploy until the WIP source files are recovered.

If you accept the risk and truly want to deploy anyway:
  npm run deploy:force

If you want to roll the live worker back to the May 19 version
at any time:
  npx wrangler rollback b0d3dee5-efd5-4a47-ab58-001593e8419f \\
      --name vdtsites
================================================================
`);
process.exit(1);
