# Sherry Buying Opportunity — Adjustments

Source: friend feedback review, triaged and decided. Implement against current repo (`index.html`, single-file, vanilla JS, mobile-first). Keep it lean — no frameworks, no build tooling, no new dependencies unless unavoidable.

---

## 1. Order submission — real success/failure check

Currently the submit fetch uses `mode: "no-cors"`, so the client can never see whether the Apps Script call actually succeeded. Fix properly, don't patch around it.

- Update the Google Apps Script to a `doPost(e)` that returns a real JSON response (e.g. `{ status: "ok" }`), deployed with "Anyone" access so CORS works.
- Update the client fetch: remove `mode: "no-cors"`, read the actual response, branch on success/failure.
- **On failure**, show this message to the user (don't just silently reload or fail):
  > Something went wrong, please try again or contact us on WhatsApp if the error persists.
- **On success**, proceed to the submitted state (see #2).

## 2. Post-submit state — no more `location.reload()`

Replace the current behavior (which wipes the order on reload) with:

- On successful submit: change the submit button's label to **"Submitted"**.
- Below the button, show small helper text: **"Resubmit to update order."**
- The button remains clickable — resubmitting is allowed and expected (e.g. if someone wants to add bottles later). Each resubmission just creates a new row in the Sheet; that's fine, we reconcile manually. Orders are only finalized when the buying opportunity closes, so there's time to catch duplicates.
- Keep the existing confirmation popup as-is (dismissible, user returns to the order form underneath — don't change this pattern).

## 3. Persistence — localStorage

- Save the full cart state (bodega/wine selections + quantities) to `localStorage` on every change.
- On page load, restore from `localStorage` if present.
- This also covers the "proof of order" concern: since state persists, users can close the link and come back to see/edit what they selected, even after submitting.
- No backend or account system needed — purely client-side.

## 4. Filters (replace: no free-text search)

Add filter chips above the product list, not a search field (free text is fragile with 49 wines — typos, accents, etc.):

- **Bodega** (4 options)
- **Type** (Manzanilla / Amontillado / Still wine / Vinagre etc.)
- **Bottle size**
- Sticky positioning so they stay visible while scrolling.
- Toggle on/off, multiple selections allowed simultaneously (AND/OR across categories — use OR within a category, AND across categories, i.e. standard faceted filtering).

## 5. Layout — move form below product list

- Move the "Delivery Details" form (client-form div) to appear **after** the product list, not before it.
- Users should be able to dive straight into browsing/selecting before entering any personal details.

## 6. Order breakdown — new table, not sticky footer

- Add a new section/table below the product list, titled **"Your order"**.
- Lists selected items and quantities as the user builds their cart, live-updating.
- **Read-only** — do not allow quantity edits from this table. Quantity is only ever adjusted at the product row above. This avoids two sources of truth for the same number.
- Keep the sticky footer for totals only (Excl./Incl. VAT, as currently shown — that part was already correct and doesn't need changing).

## 7. Contact fields — split, no validation

- Split the current single free-text contact field into two separate inputs: **Phone/WhatsApp** and **Email**.
- Email is needed for order confirmation going forward.
- No hard validation / required-field enforcement needed — these are known, trusted WhatsApp contacts. Leave existing asterisks as-is (cosmetic only).

## 8. Deadline line

- Add a new `<p>` directly below the existing "Buying opportunity July 26" line.
- Same light grey styling as the `#888` text elsewhere (see #10 for the exact shade — use the same updated value).
- Copy: **"Available until 01 Aug 2026"**

## 9. Wine names — wrap, don't truncate

- Remove `text-overflow: ellipsis` on wine name elements.
- Let long names (e.g. "Criadera Selection En rama (Palo Cortado, 75cl)") wrap to a second line instead of being cut off.

## 10. Small fixes

- Remove `maximum-scale=1, user-scalable=no` from the viewport meta tag — don't block pinch-zoom.
- Increase `+`/`−` quantity buttons from 32×32px to 44×44px (touch target sizing).
- Nudge `#888` text color slightly lighter for better contrast against `#121212` background — subtle change only, keep the same grey aesthetic.
- Add visual state for selected rows: rows with `qty > 0` get a gold-colored left border or light background tint, so users can tell at a glance what they've picked while scrolling.
- Remove the leftover fallback string `"Add context here for Bodegas ${bodega}..."` — all bodega descriptions are now hardcoded, this dead code path can go. Also do a general pass for any other remnant/dead code from the original build.

---

## Explicitly out of scope (not implementing)

- No stock/inventory limits or "X remaining" indicators — not needed for this buying opportunity format.
- No email/backend-driven confirmation system beyond the existing popup — localStorage + resubmission covers it.
- No shopping-cart/checkout-style separate page or menu — stays a single scrollable page.
- No field validation / required-field error states.
