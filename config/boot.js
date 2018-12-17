const dotenv = require('dotenv');
const path = require('path');

// Read .env file in project root if present
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
