function drawPieChart(income, expense) {
    const ctx = document.getElementById('myPieChart').getContext('2d');

    // Agar pehle se chart bana ho to usse destroy karo
    if (window.myPieChart) {
        window.myPieChart.destroy();
    }

    window.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#4CAF50', '#F44336'],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.raw || 0;
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        }
    });
}
