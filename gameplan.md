# Implementation Plan: The Secret Sherry Society Mobile Order App

## 1. Project Overview & Architecture
An ultra-minimal, high-end, mobile-first ordering app designed for top-tier hospitality clients. Clients select allocation quantities from a single-line, compact list and submit delivery details. 
* **Hosting & Deployment:** Git repository deployed to Vercel.
* **Database Backend:** Completely free via Google Apps Script (acting as a micro-API endpoint) that appends orders directly to a centralized Google Sheet.
* **Business Model Logic:** Pre-order aggregation style. No stock limits apply. 

## 2. Design System & Aesthetics
* **Vibe:** Premium, minimal, exclusive, hospitality-focused.
* **Palette:** Stark black background (`#0b0b0b`), brilliant white text (`#ffffff`), muted lines (`#222`), with an accent of elegant burnt/pale gold (`#d4af37`).
* **Typography:** Montserrat (imported via Google Fonts).
* **Mobile Constraints:** Strictly single-line entries for wines to maximize vertical screen efficiency. Absolute zero horizontal scrolling. No page transitions.

## 3. Data Definitions (49 Wine Allocations)
The wine catalog parsed directly from the July CSV data payload:
* **Bodegas Alonso:** VELO FLOR Manzanilla 75cl (€29.70), VELO FLOR Manzanilla 150cl (€90.00), 1/15 Amontillado 50cl (€97.14), 1/8 Palo Cortado 50cl (€97.14), 1/14 Oloroso 50cl (€97.14)
* **Bodegas Barrialto:** Aranza Still wine 75cl (€13.98), Santa Brígida Still wine 75cl (€16.14), Azacanes Still wine 75cl (€17.94)
* **Bodegas del Río:** Casilla verde Still wine 75cl (€11.64), Solera Playa Azul Manzanilla 37.5cl (€10.50), Solera Playa Azul Manzanilla 75cl (€14.94), Solera Playa Azul Manzanilla 150cl (€27.42), Solera Playa Oro Manzanilla 75cl (€19.38), Solera Playa Oro Manzanilla 150cl (€36.00), Solera Playa Marea Baja Manzanilla 75cl (€19.38), El Cuartito Oloroso 50cl (€19.20)
* **Bodegas Barbadillo:** Alba Baina 75cl (€12.60), Mirabras 75cl (€18.60), AS de Mirabras 75cl (€13.80), Sábalo 75cl (€13.80), Patinegro 75cl (€16.20), Tamarix 75cl (€13.80), Arboledilla Levante 75cl (€18.60), Arboledilla Poniente 75cl (€18.60), AS de Mirabras Sumatorio 75cl (€27.00), Nave Trinidad en rama 37.5cl (€13.14), Nave Trinidad en rama 75cl (€21.54), Salicornia 75cl (€15.54), Solear 37.5cl (€9.72), Solear 75cl (€13.08), Solear seasonal saca 37.5cl (€14.04), Pastora 37.5cl (€14.04), Pastora 75cl (€21.54), Pastora 150cl (€38.34), Pastora 300cl (€70.74), Criadera Selection Amontillado 75cl (€15.00), Criadera Selection Oloroso 75cl (€15.00), Criadera Selection Palo Cortado 75cl (€15.00), Principe Amontillado 37.5cl (€16.44), Obispo Gascón Palo Cortado 37.5cl (€19.50), Cuco Oloroso 37.5cl (€16.44), San Rafael Medium 37.5cl (€13.14), Eva Cream 75cl (€12.60), Laura Moscatel 37.5cl (€13.14), La Cilla Pedro Ximénez 37.5cl (€14.04), de Jerez Reserva Vinagre 25cl (€11.40), de Jerez Ecological Vinagre 25cl (€11.40), de Jerez with PX Vinagre 25cl (€11.40), de Jerez with Moscatel Vinagre 25cl (€11.40)

## 4. Technical File Requirements

### File A: `index.html` (Frontend deployed via Vercel)
* Must build full interactive list using structural layout: `[Bodegas Name] - [Wine Range] ([Type], [cl]cl)`.
* Right-aligned layout featuring `[Price]` paired tightly with a sleek UI increment/decrement stepper.
* Sticky Mobile Footer computing real-time order sums:
    * Excl. VAT Line
    * 21% Dutch VAT Line
    * Total Inc. VAT Line
* Form input capturing: Name, Company Name, Contact Info (WhatsApp/Email), Address, Postal Code & City.
* The `submitAllocation()` function must perform a JavaScript `fetch()` POST request sending JSON string payloads to the Google Web App macro execution endpoint URL.

### File B: `Code.gs` (Backend deployed via Google Sheet Extensions)
* Must listen via a `doPost(e)` trigger handler.
* Accepts the inbound JSON order parameters.
* Transforms the chosen items array into a pristine, single-cell human-readable summary block text value string (e.g., `"2x Bodegas Alonso - VELO FLOR (Manzanilla, 75cl), 1x Bodegas Barrialto - Aranza (Still wine, 75cl)"`).
* Appends data directly as a row onto the tracking target spreadsheet ledger tab sheet using sequential rows.

## 5. Steps to Execute in Editor
1. Generate the optimized `index.html` file using standard responsive markup.
2. Generate the corresponding `Code.gs` Google Apps Script resource payload handler.
3. Configure frontend script to accept a placeholder `GOOGLE_SCRIPT_URL` environment variable or constant configuration flag string for simple point-to-point connection adjustments.