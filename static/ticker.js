document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('ticker-search-input');
    const searchBtn = document.getElementById('search-button');

    function executeSearch() {
        const newTicker = searchInput.value.toUpperCase().trim();
        if (newTicker) {
            // This updates the global var and the chart
            updateDashboard(newTicker);
            searchInput.value = '';
        }
    }

    // Handle Click
    if (searchBtn) {
        searchBtn.addEventListener('click', executeSearch);
    }

    // Handle Enter Key
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                executeSearch();
            }
        });
    }
});

function updateDashboard(newTicker) {
    activeTicker = newTicker; // Update the global var

    // Update the visual text on the screen
    const assetHeader = document.getElementById('current-asset');
    if (assetHeader) assetHeader.innerText = newTicker;

    // Redraw the chart
    renderTradingView(chartTheme);

    if (typeof fetchLiveMarketData === "function") {
        fetchLiveMarketData(newTicker);
    }
}