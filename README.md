# Bonapp client

Bonapp is an Angular 21 and Ionic 9 application packaged for web and native mobile with Capacitor 8. The repository is the client-only GitHub project `bon-app/client`; the HTTP API remains a separate AWS Lambda project in the workspace's `api/` directory.

## Local development

Use Node.js 24 (pinned by `.nvmrc`) and npm:

```sh
npm ci
npm start
```

The development server runs at `http://localhost:4200` and calls `http://localhost:3000/dev/`. Use `npm run build` for a production build in `www/`, `npm test -- --watch=false` for Vitest, `npm run lint` for ESLint, and `npm run e2e` for the Playwright smoke tests.

## Cloudflare Pages hosting

The Angular production build is a static single-page application. Connect this repository to Cloudflare Pages with these settings:

| Setting | Value |
| --- | --- |
| Repository | `bon-app/client` |
| Production branch | `master` |
| Root directory | `/` (repository root) |
| Framework preset | None / custom |
| Build command | `npm ci && npm run build` |
| Build output directory | `www` |
| Node.js version | `24` (`.nvmrc`) |

Set the Pages build environment variable `SKIP_DEPENDENCY_INSTALL` to `1` for both Production and Preview. The build command already runs `npm ci`, so this prevents Pages from running a separate automatic package install before it. Keep the build command exactly `npm ci && npm run build`; do not append `--allow-scripts` to `npm ci`.

Do not set `NPM_CONFIG_ALLOW_SCRIPTS`, `NPM_CONFIG_STRICT_ALLOW_SCRIPTS`, or `NPM_CONFIG_DANGEROUSLY_ALLOW_ALL_SCRIPTS` in Pages. Remove those variables if they already exist. Packages that need install-time scripts are approved by the version-pinned `allowScripts` policy in `package.json`.

Enable preview deployments for non-production branches and pull requests. Attach `bonapp.life` as the production custom domain. Cloudflare Pages provides the SPA fallback to `index.html` for deep links; do not add a top-level `404.html` to `www/`.

Redirect `www.bonapp.life` to the apex using Cloudflare **Rules → Redirect Rules**:

- Match expression: `http.host eq "www.bonapp.life"`
- Dynamic destination: `concat("https://bonapp.life", http.request.uri.path)`
- Status code: `301`
- Preserve the query string

Make sure `www.bonapp.life` has a proxied Cloudflare DNS record so the redirect rule receives its traffic.

This redirects all paths on `www` to the corresponding apex path and replaces the current `www` site with the redirect.

Cloudflare Git integration publishes production after pushes to `master`; branch and pull-request builds get preview URLs. Production builds use `src/environments/environment.prod.ts`, which retains the existing AWS API Gateway `/dev/` endpoint and provider settings. The Pages project deploys only the client; it does not deploy the API. Before enabling checkout, confirm the API is reachable from the hosted origin and verify payment settings. Do not test by submitting live payments.

## Smoke checks

For each preview, check the home page, sign-in, recipe browsing, and direct navigation to `/checkout` and `/order-confirm/:id`. Confirm that browser API requests reach the configured AWS endpoint. After domain activation, verify HTTPS on `bonapp.life` and that `www.bonapp.life` returns a permanent redirect preserving paths and query strings.
