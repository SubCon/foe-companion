window.FHC = window.FHC || {};
window.FHC.GBCalc = {

	patch() {
		const style = document.createElement('style');
		style.textContent = `
			/* widen narrow dash cells in GB Calculator +/- column for easier hovering */
			#costTableFordern strong.td-tooltip {
				display: inline-block;
				min-width: 30px;
				cursor: crosshair;
				text-align: center;
			}
			.fhc-safe {
				display: block;
				margin-top: 3px;
				font-size: 10px;
				color: #7ec8e3;
				cursor: pointer;
				white-space: nowrap;
			}
			.fhc-safe:hover { color: #fff; }
		`;
		document.head.appendChild(style);

		const orig = Calculator.BuildTable;
		Calculator.BuildTable = function() {
			window.FHC.GBCalc._buildWithCapture(orig);
		};
	},

	_buildWithCapture(orig) {
		// Temporarily wrap the Replacer to intercept safeRankCost as a clean integer
		// before it gets formatted into a localised tooltip string.
		// Guard: only TTProfit / TTLoss pass both vars.safe and vars.costs — all other
		// Replacer calls in BuildTable use different keys so they pass through untouched.
		const isHammer  = typeof FH !== 'undefined';
		const obj       = isHammer ? FH.helper.str : HTML;
		const fnKey     = isHammer ? 'Replacer'    : 'i18nReplacer';
		const origFn    = obj[fnKey];

		// Map: donorFpReward (string) → [safeRankCost, ...] (array handles duplicate costs)
		const safeMap = new Map();
		obj[fnKey] = function(template, vars) {
			if (vars?.safe !== undefined && vars?.costs !== undefined) {
				const k = String(vars.costs);
				if (!safeMap.has(k)) safeMap.set(k, []);
				safeMap.get(k).push(vars.safe);
			}
			return origFn.apply(this, arguments);
		};

		orig();
		obj[fnKey] = origFn;

		window.FHC.GBCalc._processTable(safeMap);
	},

	_processTable(safeMap) {
		const table = document.getElementById('costTableFordern');
		if (!table) return;

		table.querySelectorAll('.fhc-safe').forEach(el => el.remove());

		table.querySelectorAll('tr').forEach(tr => {
			// col 2 has copy-fp + clickable; col 3 has copy-fp without clickable
			const col2 = tr.querySelector('strong.copy-fp.clickable');
			const col3 = tr.querySelector('strong.td-tooltip.copy-fp:not(.clickable)');
			if (!col2 || !col3) return;

			const values = safeMap.get(col2.getAttribute('data-copy'));
			const safe   = values?.shift(); // shift preserves order for duplicate costs keys
			if (!safe || safe <= 0) return;

			const fmt  = String(safe).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			const small = document.createElement('small');
			small.className = 'copy-fp clickable fhc-safe';
			small.setAttribute('data-copy', safe);
			small.title = 'Place locked at — click to fill';
			small.innerHTML = '🔒 ' + fmt;

			col3.closest('td').appendChild(small);
		});
	}
};
