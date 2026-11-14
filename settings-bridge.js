// Runs in isolated world. Reads settings from chrome.storage.local and
// writes them to the page as a data attribute so the MAIN world scripts can read them.
// companion.js waits for the host extension's loaded event, which fires well after
// this async read completes, so no race condition.

const DEFAULTS = {
    'text-select':     true,
    'all-buildings':   true,
    'ge-marker':           true,
    'ge-marker-threshold': 1,
    'ge-marker-mode':      'threshold',
    'dev-mode':            false
};

// expose extension base URL to MAIN world so modules can build asset URLs
document.documentElement.dataset.fhcExtUrl = chrome.runtime.getURL('');

chrome.storage.local.get(DEFAULTS, (settings) => {
    document.documentElement.dataset.fhcSettings = JSON.stringify(settings);
});
