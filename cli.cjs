#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

const appName = process.argv[2];

if (!appName) {
  console.error("Please provide a name for your app.");
  process.exit(1);
}

const appDir = path.join(process.cwd(), appName);
const currentDir = __dirname; // Get the directory of the script

// Create project directory
fs.mkdirSync(appDir, { recursive: true });

// Copy everything from the current directory (where the script is located) to the appDir
fs.copy(currentDir, appDir)
  .then(() => {
    console.log(`Created project ${appName} at ${appDir}`);
  })
  .catch((err) => {
    console.error("Error copying files:", err);
  });
