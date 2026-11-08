window.FHC = window.FHC || {};

// Adds an "All buildings" tab as the first tab in the Productions widget.
// Shows every connected city building — star/motivate status, name, era,
// next collection time, and map-eye link.
window.FHC.AllBuildings = {
	patch() {
		// Add 'all' as the first tab type if not already present
		if (!Productions.Types.includes('all')) {
			Productions.Types.unshift('all');
		}

		// Intercept buildTableByType so the 'all' tab gets our renderer
		const _orig = Productions.buildTableByType.bind(Productions);
		Productions.buildTableByType = function (type) {
			if (type === 'all') return Productions.buildAllTable();
			return _orig(type);
		};

		Productions.buildAllTable = function () {
			let table = [],
				rowA = [],
				inADay = Math.floor(Date.now() / 1000) + 86400,
				showRelativeTime = JSON.parse(FH.Storage.getItem('productionsShowRelativeTime') || 'false'),
				showAMPMTime    = JSON.parse(FH.Storage.getItem('productionsShowAMPMTime') || 'false');

			// BuildingsAll is populated by PrepareData() before any tab renders
			for (const building of Productions.BuildingsAll) {
				if (building?.player_id !== FH.Player.ID || !building.state.connected) continue;

				rowA.push('<tr>');

				// Star / motivation icon + set/chain badge
				rowA.push('<td class="text-center">');
				if (building.state.isPolivated !== undefined)
					rowA.push(building.state.isPolivated ? srcLinks.icons('when_motivated') : '☆');
				if (building.setBuilding !== undefined)
					rowA.push('<img src="' + srcLinks.get('/shared/icons/' + building.setBuilding.name + '.png', true) + '" class="chain-set-ico">');
				if (building.chainBuilding !== undefined)
					rowA.push('<img src="' + srcLinks.get('/shared/icons/' + building.chainBuilding.name + '.png', true) + '" class="chain-set-ico">');
				rowA.push('</td>');

				// Building name with tooltip
				rowA.push(
					'<td data-text="' + FH.helper.str.cleanup(building.name) + '" exportvalue="' + building.name + '">' +
					'<span data-meta_id="' + building.entityId + '"' +
					' data-eff="' + (building.rating?.totalScore * 100) + '"' +
					' data-era="' + (building.eraName === 'AllAge' ? '' : building.eraName) + '"' +
					' data-callback_tt="building"' +
					' class="helperTT' + (FH.Main.Allies.buildingList?.[building.id] ? ' ally' : '') + '">' +
					building.name + '</span></td>'
				);

				// Era
				let eraIdx = Technologies.Eras[building.eraName];
				rowA.push(
					'<td data-number="' + eraIdx + '" exportvalue="' + FH.t('Eras.' + eraIdx + '.short') + '">' +
					FH.t('Eras.' + eraIdx + '.short') + '</td>'
				);

				// Collection time
				let time = '-';
				const at = building.state.times?.at;
				if (at) {
					if (showRelativeTime)
						time = moment.unix(at).fromNow();
					else if (showAMPMTime)
						time = moment.unix(at).format('LTS');
					else
						time = moment.unix(at).format(at <= inADay ? 'HH:mm:ss' : 'dddd, HH:mm');
				}
				let done = building.state.name === 'collectable' ? FH.t('Boxes.Productions.Done') : '';
				rowA.push(
					'<td style="white-space:nowrap" data-date="' + (at || 9999999999) + '">' +
					(done === '' ? time : '<b class="text-success">' + done + '</b>') +
					'</td>'
				);

				// Map-eye link
				rowA.push(
					'<td class="text-right">' +
					'<span class="show-entity" data-id="' + building.id + '">' +
					'<img class="game-cursor" src="' + FH.extUrl + 'images/hud/open-eye.png"></span></td>'
				);

				rowA.push('</tr>');
			}

			if (rowA.length > 0) {
				table.push('<table id="all-list" class="foe-table sortable-table TSinactive all-list active exportable">');
				table.push('<thead class="sticky">');
				table.push('<tr>');
				table.push('<th colspan="2"><input type="text" placeholder="' + FH.t('Boxes.Productions.FilterTable') + '" class="filterCurrentList"></th>');
				table.push('<th colspan="3"></th>');
				table.push('</tr>');
				table.push('<tr class="sorter-header exportheader">');
				table.push('<th class="no-sort tdmin" data-type="prodlistall"> </th>');
				table.push('<th class="ascending" data-type="prodlistall" data-export="' + FH.t('Boxes.BlueGalaxy.Building') + '">' + FH.t('Boxes.BlueGalaxy.Building') + '</th>');
				table.push('<th class="is-number" data-type="prodlistall" data-export="' + FH.t('Boxes.Productions.Headings.era') + '">' + FH.t('Boxes.Productions.Headings.era') + '</th>');
				table.push('<th class="is-date" data-type="prodlistall">' + FH.t('General.Collection') + '</th>');
				table.push('<th class="no-sort" data-type="prodlistall"> </th>');
				table.push('</tr>');
				table.push('</thead>');
				table.push('<tbody class="prodlistall">');
				table.push(rowA.join(''));
				table.push('</tbody>');
				table.push('</table>');
			} else {
				table.push('<div class="empty-list">' + FH.t('Boxes.Productions.EmptyList') + '</div>');
			}

			return table.join('');
		};
	}
};
