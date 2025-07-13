const fs = require("fs");
const path = require("path");

const routesDir = path.join(__dirname, "routes");

function scanDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".js")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const matches = content.match(/router\.\w+\(["'`]\/:[^a-zA-Z]/g);
      if (matches) {
        console.log("🚨 Possible issue in:", fullPath);
        matches.forEach((m) => console.log("   👉", m));
      }
    }
  });
}

scanDir(routesDir);
