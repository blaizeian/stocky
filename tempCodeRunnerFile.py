
@app.route('/get_stock_data/<ticker>')
def get_stock_data(ticker):
    try:
        stock = yf.Ticker(ticker)
        # We fetch 1 day of history to get the most recent closing price
        df = stock.history(period="1d")
        
        if df.empty:
            return jsonify({'error': 'No data found'}), 404

        current_price = df['Close'].iloc[-1]
        # Get previous close to calculate the "Today" change
        prev_close = stock.info.get('previousClose', current_price)
        
        change = current_price - prev_close
        percent = (change / prev_close) * 100

        return jsonify({
            'price': f"{current_price:.2f}",
            'change': f"{change:.2f}",
            'percent': f"{percent:.2f}%",
            'is_positive': change >= 0
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- Existing boot-up code ---
if __name__ == '__main__':
    app.run(debug=True)