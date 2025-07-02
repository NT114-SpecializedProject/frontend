// src/setupTests.js
import "@testing-library/jest-dom";
// Mocking TextEncoder and TextDecoder for Jest tests
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
