# Web security

This project is a static Expo web app. The production host, not React Native code, is responsible for browser response headers.

## Included protections

- `vercel.json` applies security headers on Vercel.
- `netlify.toml` applies the same headers on Netlify.
- `public/_headers` provides a Netlify-compatible fallback when the host reads exported static headers.
- The policy disables framing, plugins, forms, camera/microphone/location access, and cross-origin isolation leaks.
- HSTS is enabled, so production must be served over HTTPS.

## Deployment requirements

1. Deploy the generated web export over HTTPS only.
2. Confirm the response headers with the browser dev tools or a header scanner after deployment.
3. Do not add API keys, passwords, private certificates, or other secrets to app code or static assets. Anything shipped to the browser is public.
4. If an API is added later, enforce authentication, authorization, input validation, rate limiting, CORS allowlists, and CSRF protection on that server. These cannot be implemented securely in this static client alone.
5. If a legitimate third-party asset or API is added, update `Content-Security-Policy` in both provider configurations deliberately and document why.

## Local development

The security headers are deployment configuration. Expo development mode may use a different server and relaxed behavior; verify the production export rather than treating the development server as the security boundary.

## Offline web behavior

The web build includes a manifest and same-origin service worker. After a successful HTTPS visit, the browser can install the app and cache the app shell for later offline use. Rebuild with `npm run export:web` after changing the app. Browser speech voices and installed fonts can vary by device, so audio-related behavior should be tested on the target device while offline.
