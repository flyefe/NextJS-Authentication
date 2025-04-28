# App Structure

This document outlines the structure and routing system of the app, based on a Next.js (App Router) architecture.

---

## Routing System Explanation

This app uses the Next.js App Router, which is file-system based. Each folder inside `src/app` (except for special files like `layout.tsx`, `globals.css`, etc.) represents a route. Nested folders represent nested routes. Each folder can contain a `page.tsx` file (the entry point for that route), and optionally `layout.tsx` for shared layouts, and `api` folders for route handlers (API endpoints).

### Key Points:
- **Top-Level Routes:**
  - `/` (Home): `src/app/page.tsx`
  - `/login`: `src/app/login/page.tsx`
  - `/signup`: `src/app/signup/page.tsx`
  - `/verifyemail`: `src/app/verifyemail/page.tsx`
  - `/profile`: `src/app/profile/page.tsx`
  - `/shipping-calculator`: `src/app/shipping-calculator/page.tsx`
  - `/admin`: `src/app/admin/page.tsx` (if present)
- **API Routes:**
  - `/api/*`: All API endpoints are defined in `src/app/api` and its subfolders.
- **Error Handling:**
  - `not-found.tsx` provides a custom 404 page.
- **Shared Layout:**
  - `layout.tsx` provides the global layout (e.g., navbar, theme, etc.).

---

## Directory Structure

```
src/
  app/
    admin/
      ...
    api/
      admin/
        ...
      users/
        ...
    login/
      page.tsx
    not-found.tsx
    layout.tsx
    globals.css
    page.tsx
    profile/
      page.tsx
    shipping-calculator/
      page.tsx
    signup/
      page.tsx
    verifyemail/
      page.tsx
  components/
    GlobalNavbar.tsx
    ShippingCalculator/
      ShippingCalculator.tsx
      RouteCard.tsx
      DetailCard.tsx
      AvailableOptionsCard.tsx
      ...
    ...
```

---

## Example Route Mapping
| URL Path                | File Location                                      |
|-------------------------|----------------------------------------------------|
| `/`                     | `src/app/page.tsx`                                 |
| `/login`                | `src/app/login/page.tsx`                           |
| `/signup`               | `src/app/signup/page.tsx`                          |
| `/verifyemail`          | `src/app/verifyemail/page.tsx`                     |
| `/profile`              | `src/app/profile/page.tsx`                         |
| `/shipping-calculator`  | `src/app/shipping-calculator/page.tsx`             |
| `/api/users/*`          | `src/app/api/users/*`                              |
| `/api/admin/*`          | `src/app/api/admin/*`                              |

---

## Notes
- Any folder with a `page.tsx` is a routable page.
- API routes are only accessible server-side (under `/api`).
- Components are organized under `src/components` and are imported into pages as needed.
- The `ShippingCalculator` feature is modular, with its own folder and subcomponents.

---

For more details, see the README or the source code itself.
