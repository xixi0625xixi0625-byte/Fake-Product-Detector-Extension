# Fake-Product-Detector-Extension

A Chrome extension designed to scan e-commerce and marketplace listings in real-time to detect common fraudulent patterns, phishing behaviors, and transaction scams.

## Tech Stack
* JavaScript (ES6+)
* Chrome Extension API (Manifest V3)
* Tesseract.js (for client-side OCR image analysis)
* HTML5 / TailwindCSS (or custom popup styling)

## Key Features
* Textual Risk Analysis: Scans the active browser tab's text for high-risk categories including offline payment red flags (Zelle, Crypto), communication hijacking (WhatsApp, Gmail), and false urgency pressure.
* OCR Image Scanning: Integrates Tesseract.js to extract text from uploaded images/receipts and detect forgery indicators like hidden watermarks ("void", "sample").
* Dynamic Risk Scoring: Aggregates detected risk vectors into a live, color-coded scam probability score (0-100%).

## Architecture
* manifest.json: Extension entry point configuring activeTab and scripting permissions.
* popup.html / popup.js: UI rendering and core heuristic rule-matching engine.
