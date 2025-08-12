Vercel deployment notes
=======================

- Root Directory: `frontend/sae-website` (if importing monorepo) or this repo
- Install: `npm ci` (or `npm install`)
- Build: `npm run vercel-build`
- Output: `build`

Environment variables (Production/Preview):

- `REACT_APP_API_URL` = https://<render-service>.onrender.com/api
- `REACT_APP_SUPABASE_URL` = https://<project>.supabase.co
- `REACT_APP_SUPABASE_ANON_KEY` = <anon key>
- `REACT_APP_IMAGEKIT_URL_ENDPOINT` = https://ik.imagekit.io/<id>
- `REACT_APP_IMAGEKIT_PUBLIC_KEY` = <public key>
- Optional: `REACT_APP_SCALE_TO_BASE` = true

Notes:

- vercel.json configured with `@vercel/static-build` and CSP including `wss:`.
- Backend should allow Vercel domain in ALLOWED_HOSTS/CSRF/CORS.