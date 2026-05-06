/* === 1. RISK CALCULATOR === */
function calculateRisk() {
    const balanceEl = document.getElementById('balance');
    const riskEl = document.getElementById('risk_percent');
    const displayEl = document.getElementById('max_loss_display');

    const balance = parseFloat(balanceEl.value);
    const risk = parseFloat(riskEl.value);

    if (!isNaN(balance) && !isNaN(risk)) {
        const result = (balance * (risk / 100)).toFixed(2);
        displayEl.innerText = "$" + result;
    } else {
        displayEl.innerText = "Invalid Input";
    }
}
// 1. Move the function OUTSIDE so it is "Global"
// This allows ticker.js to see and use it.
function renderTradingView(theme) {
    const container = document.getElementById('tradingview_widget');
    if (!container) return;

    // Force the container background to match
    container.style.backgroundColor = theme === 'light' ? "#ffffff" : "#1a1a1a";
    container.innerHTML = '';

    new TradingView.widget({
        "autosize": true,
        "symbol": typeof activeTicker !== 'undefined' ? activeTicker : "NASDAQ:AAPL",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": theme,
        "style": "1",
        "locale": "en",
        "container_id": "tradingview_widget",
        "overrides": {
            "paneProperties.background": theme === 'light' ? "#ffffff" : "#1a1a1a"
        }
    });
}

// 2. The DOM Listener stays for the button and initial load
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('chart-theme-toggle');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            // chartTheme needs to be global too (defined in index.html)
            chartTheme = (chartTheme === 'dark') ? 'light' : 'dark';
            this.innerText = chartTheme === 'dark' ? "☀️ Light Mode" : "🌙 Dark Mode";
            renderTradingView(chartTheme);
        });
    }

    // Initial load when page first opens
    renderTradingView(chartTheme);
});


function toggleTradingViewFS() {
    const wrapper = document.getElementById('full-widget-wrapper');
    const btn = document.getElementById('toggle-fs-btn');

    wrapper.classList.toggle('is-fullscreen');

    if (wrapper.classList.contains('is-fullscreen')) {
        btn.innerHTML = "✕ Exit Fullscreen";
        btn.style.background = "#ff4b4b";
        document.body.style.overflow = 'hidden';
    } else {
        btn.innerHTML = "⛶ Fullscreen";
        btn.style.background = "#00ff88";
        document.body.style.overflow = 'auto';
    }

    // This tells TradingView to recalculate its size immediately
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 150);
}