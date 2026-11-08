// Waits for FoE Helper to finish loading all its modules, then runs ours.
// To add a new feature: create modules/<name>.js, register it on window.FHC,
// then call its .patch() here.

window.addEventListener('forgehammer#loaded', function () {
	window.FHC.TextSelect.patch();
	window.FHC.AllBuildings.patch();
}, { once: true });
