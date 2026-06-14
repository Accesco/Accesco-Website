# ACCESCO Living Platform

ACCESCO Living is a collection of web assets and applications that power the ACCESCO services and marketing site. This repository contains the public static pages and the primary Next.js application used in production.

**Contents**
- **Accesco/** — Primary Next.js application and microservices (see [Accesco/](Accesco/)).
- **index.html** — Landing page for the ACCESCO Living portal ([index.html](index.html)).
- **Privacy_policy.html** — Privacy policy ([Privacy_policy.html](Privacy_policy.html)).
- **Refund_policy.html** — Refund & cancellation policy ([Refund_policy.html](Refund_policy.html)).

## Quickstart (developer)
Requirements: Node.js 16+ and npm or Yarn.

1. Open the `Accesco` application:

```bash
cd Accesco
```

2. Install dependencies and run the development server:

```bash
npm install
npm run dev
```

3. Build for production and start:

```bash
npm run build
npm start
```

Create a `.env.local` in `Accesco/` from the provided template or the `Accesco/README.md` configuration notes before running in production.

## Repository highlights
- Grokly: marketplace & storefront integrations
- Instastyle: order tracking and mapping integrations
- Swadisht: dining, subscriptions, and food services

## Contributing
- Fork the repo, create a feature branch, and submit a pull request to `main`.
- Follow existing code style for JS/TS and React components.

## License & Contact
This project does not include a license file; add one (for example, `LICENSE.md`) before publishing. For questions or support, open an issue or contact the maintainers.

---

