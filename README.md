# FoE Companion

A small add-on that runs alongside the **FoE Hammer** or **FoE Helper** browser extension and brings a couple of quality-of-life improvements that aren't in the originals.

---

## What it adds

### 1. Copy text anywhere
FoE Hammer and FoE Helper normally block you from selecting or copying text inside their panels. This add-on lifts that restriction — you can now highlight any text and copy it with Ctrl+C as you would on any normal web page.

---

### 2. "All Buildings" tab in Daily Production

The Productions panel gets a new **first tab** that shows every building in your city in a single list — not split up by what they produce.

**Why is this useful?**

When you open the Productions panel you usually have to hop between tabs (Forge Points, Goods, Supplies…) to check what's ready and what isn't. The All Buildings tab gives you the complete picture at a glance:

- **Collection status** — buildings that are ready to collect show a "Done" label highlighted in green. Buildings that aren't ready yet show the exact time they will be — either as a clock time or a "in X minutes" countdown depending on your extension settings.
- **Motivated / Star status** — each building shows whether it has been aided (motivated). If you use self-aid kits you can quickly see which buildings still need attention before you collect.
- **Era** — the age each building belongs to is shown next to its name. You can click the Era column header to sort and group buildings by age, which makes it easy to see the full picture when your city spans multiple eras.

In short: one tab, everything visible, no switching around.

---

### 3. Guild Expedition attempts alert *(FoE Helper only for now)*

When you have Guild Expedition attempts available, the companion makes sure you don't miss them.

**HUD button highlight** — the GE Results button in the Helper panel gets an amber glow and outline when the alert condition is met. It's visually distinct from Helper's own red "data missing" state so it doesn't cause confusion.

**Map marker** — a warning icon appears above the GE ship on the city map, bobbing in the same style as Helper's own building markers. Click the icon to dismiss it.

Two trigger modes, selectable in the companion options:

- **Attempts ≥ threshold** — fires when GE is running and your available attempt count is at or above a number you set (1–8). Good if you want a nudge only when you have several tries stocked up.
- **GE in progress (hourly reminder)** — fires whenever GE is active and not yet complete, regardless of attempt count. After you dismiss the icon it re-appears automatically after one hour, so it keeps reminding you throughout the GE week.

The marker tracks the GE ship as you pan and zoom the map, and disappears on its own when GE ends or completes.

---

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `foe-companion` folder.
5. Repeat in any other Chrome profile where you play.

FoE Hammer and FoE Helper are unmodified and continue to update automatically from the Chrome Web Store.
