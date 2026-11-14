// Waits for the host extension to finish loading, then runs our modules.
// FoE Hammer fires 'forgehammer#loaded'; FoE Helper fires 'foe-helper#loaded'.
// The guard ensures only one init runs even if both extensions are present.
//
// Settings are written to document.documentElement.dataset.fhcSettings by
// settings-bridge.js (isolated world) before this runs.
//
// To add a new feature: create modules/<name>.js, register it on window.FHC,
// add a default in settings-bridge.js, then call its .patch() here guarded by settings.

{
	let _started = false;
	function _init() {
		if (_started) return;
		_started = true;

		let settings = {};
		try {
			settings = JSON.parse(document.documentElement.dataset.fhcSettings || '{}');
		} catch (e) {}

		if (settings['text-select'])   window.FHC.TextSelect.patch();
		if (settings['all-buildings']) window.FHC.AllBuildings.patch();

		const _isHelper = typeof FH === 'undefined';
		if (settings['ge-marker'] && _isHelper) {
			window.FHC.GEMarker.patch(settings['ge-marker-threshold'] || 1, settings['ge-marker-mode'] || 'threshold');
		}
	}
	window.addEventListener('forgehammer#loaded', _init, { once: true });
	window.addEventListener('foe-helper#loaded',  _init, { once: true });
}
