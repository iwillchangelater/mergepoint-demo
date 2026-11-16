# Mergepoint Pages demo

A static Next.js version of the issue board for exploring URLs. It uses fictional issues and browser-local storage for changes.

## Explore the routes

- `/w/product-engineering/` opens the board.
- `/w/product-engineering/?view=list&q=webhook` opens a filtered list. Reload the page or use Back to revisit the filter.
- `/w/product-engineering/issues/11/` opens a seeded issue directly. Next.js generates the seeded issue pages using `generateStaticParams()`.
- `/w/product-engineering/issues/new/` opens the create form. A new record opens at `/w/product-engineering/issues/?number=13` or the next available number.
- `/routes/` provides links to try each pattern.

The GitHub Pages site adds the repository name before these paths. The workflow reads that prefix from `configure-pages` and passes it to the Next.js `basePath`.

## Run locally

Use Node.js 24 and run the following from this folder.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` to generate static files in `out/`.

GitHub Pages serves the generated files. The complete Mergepoint app uses a Node server for sign-in, Server Actions, REST mutations, and PostgreSQL. [Next.js static export guide](https://nextjs.org/docs/app/guides/static-exports)
