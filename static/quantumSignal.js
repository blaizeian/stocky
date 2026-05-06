function updateQuantumSignal(data) {
    // Use getElementById to match the new IDs we just added
    const sentimentFill = document.getElementById('sentiment-fill');
    const signalLabel = document.getElementById('signal-label');

    if (sentimentFill && data.signal_pct !== undefined) {
        sentimentFill.style.width = `${data.signal_pct}%`;

        // Color logic
        if (data.signal_pct > 60) sentimentFill.style.background = '#00ff88';
        else if (data.signal_pct < 40) sentimentFill.style.background = '#ff3333';
        else sentimentFill.style.background = '#ffcc00';
    }

    if (signalLabel && data.signal_label) {
        signalLabel.innerText = data.signal_label;
    }
}