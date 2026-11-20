# Security Policy & Governance

NIMBUS is dedicated to maintaining the highest level of security, data privacy, and ethical compliance for urban air quality telemetry.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Architecture & Threat Model

1. **Zero Client Secrets**: NIMBUS connects to Open-Meteo's open endpoints and requires zero client-side API secrets, tokens, or credential storage.
2. **Strict Sanitization**: Geolocation inputs and city queries undergo strict URL parameter encoding and client-side sanitization to prevent Cross-Site Scripting (XSS) and injection attacks.
3. **No Personal Data Stored**: Geolocation is evaluated locally in the browser memory and never transmitted to proprietary third-party advertising or tracking servers.
4. **Content Security Policy (CSP)**: Scripts and styles are locked to modern origin integrity policies.
5. **Deterministic Offline Fallbacks**: In the event of network disruption or API denial of service, NIMBUS shifts to an in-memory deterministic simulation model, preventing unhandled exceptions.

## Reporting a Vulnerability

If you discover any security vulnerability in NIMBUS, please report it via GitHub Security Advisories or contact:
`dev303.tech@gmail.com`

Vulnerabilities are acknowledged within 24 hours with coordinated mitigation patches.
