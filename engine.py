import yfinance as yf

def get_quantum_logic(ticker):
    try:
        stock = yf.Ticker(ticker)
        todays_data = stock.history(period="1d")
        
        if todays_data.empty:
            return {'pct': 50, 'label': "NO DATA"}

        current_price = todays_data['Close'].iloc[-1]
        high = todays_data['High'].max()
        low = todays_data['Low'].min()

        # Calculate Strength
        if high == low:
            strength = 50
        else:
            strength = int(((current_price - low) / (high - low)) * 100)

        # --- YOUR TRADING TERMS ---
        if strength >= 85:
            status = "STRONG BUY"
        elif strength >= 65:
            status = "BUY"
        elif strength >= 35:
            status = "CONSOLIDATING"
        elif strength >= 15:
            status = "WEAK"
        else:
            status = "STRONG SELL"

        return {'pct': strength, 'label': status}
        
    except Exception:
        return {'pct': 50, 'label': "NEUTRAL"}