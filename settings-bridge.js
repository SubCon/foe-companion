// Runs in isolated world. Reads settings from chrome.storage.local and
// writes them to the page as a data attribute so the MAIN world scripts can read them.
// companion.js waits for the host extension's loaded event, which fires well after
// this async read completes, so no race condition.

const DEFAULTS = {
    'text-select':  true,
    'all-buildings': true
};

chrome.storage.local.get(DEFAULTS, (settings) => {
    document.documentElement.dataset.fhcSettings = JSON.stringify(settings);
});
