# MyPDF

MyPDF provides online image and PDF tools: JPG → WebP, PNG → WebP, WebP → JPG, JPG → PNG, image compression and resizing, plus PDF merge, split, organize, compress, rotate, watermark, page numbering, image-to-PDF, PDF-to-JPG, crop, and typed-signature tools. The React/Vite frontend talks to an Express API that validates uploads and processes them with Sharp. Files are held in memory during processing; nothing is saved to MongoDB or persisted on disk.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm

## Run locally

```sh
npm install
npm --prefix client install
npm --prefix server install
copy server/.env.example server/.env
npm run dev
```

Open http://localhost:5173. The API listens on http://localhost:5000. `npm run build` creates the production frontend bundle and prerenders the home page, every image and PDF tool page, and all public legal and information pages for search crawlers. It also generates `robots.txt` and a canonical `sitemap.xml` in `client/dist`. Set `SITE_URL` and `VITE_SITE_URL` to your final public HTTPS origin at build time. Set `GOOGLE_SITE_VERIFICATION` to your Search Console HTML-tag token to enable ownership verification; see `client/.env.production.example`. For production, serve `client/dist` from a static host and set `CLIENT_ORIGIN` on the API to the deployed frontend origin.

## API

`POST /api/convert` accepts multipart form data with `image` and `tool` fields. Optional fields are `quality` (1–100), `width`, and `height`. The response is an image attachment. Supported tool IDs: `jpg-to-webp`, `png-to-webp`, `webp-to-jpg`, `jpg-to-png`, `compress-image`, `resize-image`.

`GET /api/health` returns a small health response. Upload limit defaults to 15 MB; configure `MAX_FILE_SIZE_MB` and `PORT` in the server environment.

## Deployment

The included `render.yaml` deploys an API web service and static frontend on Render when this folder is the repository root. If the project lives in a larger repository, copy the blueprint to its root and adjust each service `rootDir`. The frontend, API, and canonical origins in the blueprint use the service names shown there; if you change the names or domains, update `VITE_API_URL`, `VITE_SITE_URL`, `SITE_URL`, and `CLIENT_ORIGIN` to match. For other hosts, deploy the API with `npm start` from `server` and the frontend as a static Vite site. Set `VITE_API_URL`, `VITE_SITE_URL`, and `SITE_URL` at frontend build time and `CLIENT_ORIGIN` on the API. Follow `SEO-LAUNCH-CHECKLIST.md` to add Search Console verification and submit the sitemap after deploying to your public domain.

The site includes privacy, cookie, terms, acceptable use, disclaimer, about, and contact pages. Legal pages are templates and must be completed with verified operator and deployment details before public launch. No account, ads, billing, conversion history, or HEIC support is included. Those need separate product and operational decisions.
