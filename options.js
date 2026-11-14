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
    },
    {
        id:    'ge-marker',
        label: 'GE Attempts Alert (Helper only)',
        desc:  'Highlights the GE Results button with an amber glow when available attempts reach the threshold.'
    },
    {
        id:           'ge-marker-threshold',
        label:        'GE alert threshold (1–8)',
        desc:         'Minimum attempts needed to trigger the GE alert (used by "Attempts ≥ threshold" mode).',
        type:         'number',
        min:          1,
        max:          8,
        defaultValue: 1
    },
    {
        id:           'ge-marker-mode',
        label:        'GE alert condition',
        desc:         '"Attempts ≥ threshold" fires when you have enough tries. "GE in progress" fires whenever GE is running and not yet complete — re-shows every hour after dismissal.',
        type:         'select',
        options:      [
            { value: 'threshold',   label: 'Attempts ≥ threshold' },
            { value: 'in-progress', label: 'GE in progress (hourly reminder)' }
        ],
        defaultValue: 'threshold'
    }
];

const DEFAULTS = Object.fromEntries(
    FEATURES.map(f => [f.id, f.defaultValue !== undefined ? f.defaultValue : true])
);

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

        row.appendChild(info);

        if (feature.type === 'select') {
            const select = document.createElement('select');
            select.style.cssText = 'padding:3px 6px;background:#0f3460;color:#e0e0e0;border:1px solid #0f3460;border-radius:4px;font-size:12px;cursor:pointer;';
            feature.options.forEach(opt => {
                const o = document.createElement('option');
                o.value       = opt.value;
                o.textContent = opt.label;
                o.selected    = (settings[feature.id] || feature.defaultValue) === opt.value;
                select.appendChild(o);
            });
            select.addEventListener('change', () => {
                chrome.storage.local.set({ [feature.id]: select.value }, showSaved);
            });
            row.appendChild(select);
        } else if (feature.type === 'number') {
            const input = document.createElement('input');
            input.type  = 'number';
            input.min   = feature.min;
            input.max   = feature.max;
            input.value = settings[feature.id] !== undefined ? settings[feature.id] : (feature.defaultValue || 1);
            input.style.cssText = 'width:52px;padding:3px 6px;background:#0f3460;color:#e0e0e0;border:1px solid #0f3460;border-radius:4px;font-size:13px;text-align:center;';
            input.addEventListener('change', () => {
                const val = Math.max(feature.min, Math.min(feature.max, parseInt(input.value) || feature.min));
                input.value = val;
                chrome.storage.local.set({ [feature.id]: val }, showSaved);
            });
            row.appendChild(input);
        } else {
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
            row.appendChild(label);
        }

        list.appendChild(row);
    });
}

chrome.storage.local.get(DEFAULTS, buildUI);
