// Load environment variables
try {
  const path = require('path');
  const fs = require('fs');
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  }
} catch (e) {
  // dotenv not available in all environments
}
