// marketData.js

/**
 * Fetches price and change data from Flask and updates the UI
 * @param {string} symbol - The ticker symbol (e.g., 'TSLA')
 */
// marketData.js - The Price Specialist

async function fetchLiveMarketData(symbol) {
    const priceEl = document.getElementById('live-price');
    const changeEl = document.getElementById('live-change');

    console.log("Fetching live data for:", symbol);

    try {
        // This calls your Flask route (we will build this in app.py next)
        const response = await fetch(`/get_stock_data/${symbol}`);
        const data = await response.json();

        if (data.price) {
            // 1. Update the Price Text
            priceEl.innerText = `$${data.price}`;

            // 2. Determine if it's up or down for the arrow and class
            const isPositive = parseFloat(data.change) >= 0;
            const arrow = isPositive ? "▲" : "▼";

            // 3. Update the Status Text
            changeEl.innerText = `${arrow} ${data.percent} Today`;

            // 4. Toggle your CSS classes (status-up vs status-down)
            if (isPositive) {
                changeEl.classList.add('status-up');
                changeEl.classList.remove('status-down');
            } else {
                changeEl.classList.add('status-down');
                changeEl.classList.remove('status-up');
            }

            
            updateQuantumSignal(data);
        }

        
      
    } catch (error) {
        console.error("Market Data Error:", error);
    }
}