from flask import Flask, render_template, request
import yfinance as yf
from flask import jsonify, request
from flask import Flask, render_template, jsonify

from engine import get_quantum_logic
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    # Default values for the first load
    ticker_symbol = "AAPL"
    balance = 10000
    risk_percent = 1
    
    if request.method == 'POST':
        # Check if the user is searching for a ticker
        if 'ticker' in request.form:
            ticker_symbol = request.form.get('ticker').upper()
        
        # Check if the user is using the Risk Sizer
        if 'balance' in request.form:
            balance = float(request.form.get('balance', 10000))
            risk_percent = float(request.form.get('risk_percent', 1))

    # Calculate Suggested Max Loss
    max_loss = balance * (risk_percent / 100)

    try:
        stock = yf.Ticker(ticker_symbol)
        info = stock.info
        
        # Gathering data for our various sections
        data = {
            "ticker": ticker_symbol,
            "name": info.get('longName', 'Unknown Asset'),
            "price": f"{info.get('currentPrice', 0.00):,.2f}",
            "change": round(info.get('regularMarketChangePercent', 0.00), 2),
            "rsi": 58.2,  # Logic for real RSI calculation can be added here
            "volatility": info.get('beta', 'N/A'),
            "max_loss": f"{max_loss:,.2f}",
            "balance": balance,
            "risk_percent": risk_percent
        }
    except Exception as e:
        print(f"Error fetching data: {e}")
        data = {"ticker": "ERROR", "name": "Invalid Ticker", "price": "0.00", "change": 0}

    return render_template('index.html', **data)

@app.route('/get_stock_data/<ticker>')
def get_stock_data(ticker):
    try:
        import yfinance as yf
        stock = yf.Ticker(ticker)
        
        # Fetching 2 days of data gives us today and yesterday's close
        df = stock.history(period="2d")
        
        if df.empty or len(df) < 1:
            return jsonify({'error': 'No data found'}), 404

        # Use the latest close price
        current_price = df['Close'].iloc[-1]
        
        # Use the previous day's close for the change calculation
        # If there's only 1 day of data, use the Open of today
        if len(df) > 1:
            prev_close = df['Close'].iloc[-2]
        else:
            prev_close = df['Open'].iloc[0]

        change = current_price - prev_close
        percent = (change / prev_close) * 100

        
        # This calls your new engine file
        quantum_results = get_quantum_logic(ticker)

        
        return jsonify({
            'price': f"{current_price:.2f}",
            'change': f"{change:+.2f}",
            'percent': f"{percent:.2f}%",
            'signal_pct': quantum_results['pct'],
            'signal_label': quantum_results['label']
            # <--- Change this to 1 or 0
        })
    except Exception as e:
        print(f"Error for {ticker}: {e}") # This prints to your terminal!
        return jsonify({'error': str(e)}), 500



# --- Existing boot-up code ---
# ... all your routes and logic above ...

if __name__ == "__main__":
    import os
    # This line is the "magic" that finds the live server's port
    port = int(os.environ.get("PORT", 5000))
    # host='0.0.0.0' tells the server to listen to all incoming public requests
    app.run(host='0.0.0.0', port=port)