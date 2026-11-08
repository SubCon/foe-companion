// Waits for the host extension to finish loading, then runs our modules.
// FoE Hammer fires 'forgehammer#loaded'; FoE Helper fires 'foe-helper#loaded'.
// The guard ensures only one init runs even if both extensions are present.
//
// To add a new feature: create modules/<name>.js, register it on window.FHC,
// then call its .patch() here.

{
	let _started = false;
	function _init() {
		if (_started) return;
		_started = true;
		window.FHC.TextSelect.patch();
		window.FHC.AllBuildings.patch();
	}
	window.addEventListener('forgehammer#loaded', _init, { once: true });
	window.addEventListener('foe-helper#loaded',  _init, { once: true });
}
