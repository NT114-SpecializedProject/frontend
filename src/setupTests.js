// src/setupTests.js

// Mocking TextEncoder and TextDecoder for Jest tests
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
