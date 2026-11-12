const FEATURES = [
    {
        id:    'text-select',
        label: 'Copy text anywhere',
        desc:  'Lets you highlight and copy text inside FoE Hammer / FoE Helper panels (Ctrl+C).'
    },
    {
        id:    'all-buildings',
        label: '"All Buildings" tab in Daily Production',
        desc:  'Adds a first tab to the Productions panel showing every city building in one list.'
    }
];

const DEFAULTS = Object.fromEntries(FEATURES.map(f => [f.id, true]));

let _saveTimer = null;

function showSaved() {
    const msg = document.getElementById('saved-msg');
    msg.classList.add('visible');
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => msg.classList.remove('visible'), 1500);
}

function buildUI(settings) {
    const list = document.getElementById('feature-list');
    list.innerHTML = '';

    FEATURES.forEach(feature => {
        const row = document.createElement('div');
        row.className = 'feature';

        const info = document.createElement('div');
        info.className = 'feature-info';
        info.innerHTML =
            '<div class="feature-label">' + feature.label + '</div>' +
            '<div class="feature-desc">'  + feature.desc  + '</div>';

        const label = document.createElement('label');
        label.className = 'toggle';

        const input = document.createElement('input');
        input.type    = 'checkbox';
        input.checked = settings[feature.id] !== false;
        input.addEventListener('change', () => {
            chrome.storage.local.set({ [feature.id]: input.checked }, showSaved);
        });

        const track = document.createElement('div');
        track.className = 'toggle-track';

        label.appendChild(input);
        label.appendChild(track);
        row.appendChild(info);
        row.appendChild(label);
        list.appendChild(row);
    });
}

chrome.storage.local.get(DEFAULTS, buildUI);
