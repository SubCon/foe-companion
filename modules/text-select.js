window.FHC = window.FHC || {};

// Re-enables text selection and Ctrl+C throughout the FoE Helper UI.
// FoE / FoE Helper apply user-select:none broadly; this injects a style
// tag after all their stylesheets so our !important wins.
window.FHC.TextSelect = {
	patch() {
		const style = document.createElement('style');
		style.id = 'fhc-text-select';
		style.textContent = '* { -webkit-user-select: auto !important; user-select: auto !important; }';
		document.head.appendChild(style);
	}
};
