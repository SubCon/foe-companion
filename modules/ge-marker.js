// GE Attempts Alert — FoE Helper only.
//
// Two modes (set in companion options):
//   threshold   — alert when active GE has attempts >= threshold
//   in-progress — alert whenever GE is active and not yet complete;
//                 re-shows every hour after the icon is dismissed
//
// Visual effects when alert is active:
//   • amber glow/outline on the GE Results HUD button
//   • custom icon (exclamation-warning-red.svg) above the GE ship, clickable to dismiss

window.FHC = window.FHC || {};
window.FHC.GEMarker = {

	threshold:     1,
	_mode:         'threshold',
	_alertActive:  false,
	_dismissed:    false,
	_dismissTimer: null,
	_iconUrl:      '',

	patch(threshold, mode, devMode) {
		this.threshold = (typeof threshold === 'number' && threshold >= 1) ? threshold : 1;
		this._mode     = (mode === 'in-progress') ? 'in-progress' : 'threshold';
		this._iconUrl  = (document.documentElement.dataset.fhcExtUrl || '') + 'icons/exclamation-warning-red.svg';

		const style = document.createElement('style');
		style.textContent = `
			#gexStat-Btn.fhc-ge-alert {
				outline: 2px solid #e8a020;
				outline-offset: -2px;
				background: radial-gradient(ellipse at center, rgba(232,160,32,0.28) 0%, transparent 72%) !important;
			}
			/* custom GE marker icon — 20% larger than base 48px */
			.fhc-ge-icon {
				position: absolute;
				width: 73px;
				height: 73px;
				left: -37px;
				top: -220px;
				pointer-events: auto;
				cursor: pointer;
				filter: drop-shadow(0 4px 6px rgba(0,0,0,0.55));
				animation: building-marker-bob 1.6s ease-in-out infinite;
			}
			.fhc-ge-icon:hover { filter: drop-shadow(0 4px 6px rgba(0,0,0,0.55)) brightness(1.2); }
		`;
		document.head.appendChild(style);

		const orig = GExAttempts.refreshGUI;
		GExAttempts.refreshGUI = () => {
			orig();
			window.FHC.GEMarker._update();
		};

		// detect when the user closes all markers via BuildingMarker's ✕ button
		window.addEventListener('foe-helper#building-marker-changed', () => {
			const BM = window.FHC.GEMarker;
			if (BM._alertActive && typeof BuildingMarker !== 'undefined' && BuildingMarker._markers.length === 0) {
				BM._alertActive = false;
				BM._dismissed   = true;
				if (BM._mode === 'in-progress') BM._startDismissTimer();
			}
		});

		this._update();
		if (devMode) this._addTestButton();
	},

	_findGEEntity() {
		return Object.values(MainParser.CityMapData || {})
			.find(e => String(e.cityentity_id || '').includes('GuildExpedition'));
	},

	_shouldAlert() {
		const { count, state } = GExAttempts;
		const running = state.active && state.GEprogress !== 159;
		return this._mode === 'in-progress'
			? running
			: running && count >= this.threshold;
	},

	_update() {
		const BM = window.FHC.GEMarker;
		const shouldAlert = BM._shouldAlert();

		const btn = document.getElementById('gexStat-Btn');
		if (btn) btn.classList.toggle('fhc-ge-alert', shouldAlert);

		if (shouldAlert && !BM._alertActive && !BM._dismissed) {
			BM._alertActive = true;
			const entity = BM._findGEEntity();
			if (entity && typeof BuildingMarker !== 'undefined') {
				BuildingMarker.show(entity.id).then(success => {
					if (!success || !BuildingMarker._markers.length) return;
					const arrowEl = BuildingMarker._markers[0].element;
					const svg = arrowEl.querySelector('svg');
					if (svg) svg.style.display = 'none';

					const img = document.createElement('img');
					img.src       = BM._iconUrl;
					img.className = 'fhc-ge-icon';
					img.title     = 'Guild Expedition — click to dismiss' +
					                (BM._mode === 'in-progress' ? ' (re-appears in 1 hour)' : '');
					img.addEventListener('click', e => {
						e.stopPropagation();
						BM._dismissed   = true;
						BM._alertActive = false;
						if (typeof BuildingMarker !== 'undefined') BuildingMarker.hide();
						if (BM._mode === 'in-progress') BM._startDismissTimer();
					});
					arrowEl.appendChild(img);
				});
			}
		} else if (!shouldAlert && BM._alertActive) {
			BM._alertActive = false;
			BM._clearDismissTimer();
			if (typeof BuildingMarker !== 'undefined') BuildingMarker.hide();
		}

		// reset dismissed state whenever the alert condition is not met,
		// so the icon fires again on the next GE session / next time threshold is crossed
		if (!shouldAlert) {
			BM._dismissed = false;
			BM._clearDismissTimer();
		}
	},

	_startDismissTimer() {
		this._clearDismissTimer();
		this._dismissTimer = setTimeout(() => {
			this._dismissed    = false;
			this._dismissTimer = null;
			this._update();
		}, 60 * 60 * 1000); // 1 hour
	},

	_clearDismissTimer() {
		if (this._dismissTimer) {
			clearTimeout(this._dismissTimer);
			this._dismissTimer = null;
		}
	},

	// Floating dev button — remove once testing is done.
	_addTestButton() {
		const btn = document.createElement('div');
		btn.id = 'fhc-ge-test-btn';
		btn.textContent = 'GE TEST';
		Object.assign(btn.style, {
			position:     'fixed',
			bottom:       '12px',
			right:        '12px',
			zIndex:       '99999',
			background:   '#1a1a2e',
			color:        '#e8a020',
			border:       '1px solid #e8a020',
			padding:      '4px 10px',
			cursor:       'pointer',
			fontSize:     '11px',
			borderRadius: '4px',
			fontFamily:   'sans-serif',
			userSelect:   'none'
		});

		let testOn = false;
		btn.addEventListener('click', () => {
			testOn = !testOn;
			if (testOn) {
				GExAttempts.state.active     = true;
				GExAttempts.state.GEprogress = 1;
				GExAttempts.setCount(8);
				btn.textContent      = 'GE TEST ✓';
				btn.style.background = '#e8a020';
				btn.style.color      = '#1a1a2e';
			} else {
				GExAttempts.state.active = false;
				GExAttempts.setCount(0);
				btn.textContent      = 'GE TEST';
				btn.style.background = '#1a1a2e';
				btn.style.color      = '#e8a020';
			}
		});

		document.body.appendChild(btn);
	}
};
