// Dashboard JavaScript

let activityChart = null;
let languageChart = null;

// Color palette for charts
const chartColors = {
    primary: '#4A90E2',
    success: '#50C878',
    warning: '#FFB84D',
    danger: '#FF6B6B',
    info: '#5BC0DE',
    purple: '#9B59B6',
    teal: '#1ABC9C',
    orange: '#E67E22',
    pink: '#E91E63',
    indigo: '#3F51B5'
};

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
});

// Load dashboard data from API
async function loadDashboard() {
    const loadingEl = document.getElementById('dashboard-loading');
    const errorEl = document.getElementById('dashboard-error');
    const statsCardsEl = document.getElementById('stats-cards');
    const chartsSectionEl = document.getElementById('charts-section');
    const languagePairsSectionEl = document.getElementById('language-pairs-section');
    const additionalStatsEl = document.getElementById('additional-stats');
    
    try {
        // Show loading, hide others
        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
        statsCardsEl.classList.add('hidden');
        chartsSectionEl.classList.add('hidden');
        languagePairsSectionEl.classList.add('hidden');
        additionalStatsEl.classList.add('hidden');
        
        // Fetch dashboard stats
        const response = await fetch('/api/dashboard/stats');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Hide loading, show content
        loadingEl.classList.add('hidden');
        
        // Update statistics cards
        updateStatsCards(data);
        
        // Update charts
        if (Object.keys(data.language_distribution).length > 0) {
            createLanguageChart(data.language_distribution);
        }
        
        if (data.activity_timeline && data.activity_timeline.length > 0) {
            createActivityChart(data.activity_timeline);
        }
        
        // Update language pairs
        if (data.top_language_pairs && data.top_language_pairs.length > 0) {
            updateLanguagePairs(data.top_language_pairs);
        }
        
        // Update additional stats
        updateAdditionalStats(data);
        
        // Show all sections
        statsCardsEl.classList.remove('hidden');
        if (Object.keys(data.language_distribution).length > 0 || data.activity_timeline.length > 0) {
            chartsSectionEl.classList.remove('hidden');
        }
        if (data.top_language_pairs && data.top_language_pairs.length > 0) {
            languagePairsSectionEl.classList.remove('hidden');
        }
        additionalStatsEl.classList.remove('hidden');
        
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        statsCardsEl.classList.add('hidden');
        chartsSectionEl.classList.add('hidden');
        languagePairsSectionEl.classList.add('hidden');
        additionalStatsEl.classList.add('hidden');
    }
}

// Update statistics cards with data
function updateStatsCards(data) {
    document.getElementById('total-translations').textContent = formatNumber(data.total_translations || 0);
    document.getElementById('month-translations').textContent = formatNumber(data.this_month || 0);
    document.getElementById('week-translations').textContent = formatNumber(data.this_week || 0);
    document.getElementById('today-translations').textContent = formatNumber(data.today || 0);
    document.getElementById('favorites-count').textContent = formatNumber(data.favorites_count || 0);
    document.getElementById('total-characters').textContent = formatNumber(data.total_characters || 0);
}

// Update additional statistics
function updateAdditionalStats(data) {
    const avgLengthEl = document.getElementById('avg-text-length');
    if (avgLengthEl) {
        avgLengthEl.textContent = formatNumber(data.average_text_length || 0);
    }
}

// Update language pairs list
function updateLanguagePairs(pairs) {
    const container = document.getElementById('language-pairs-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    pairs.forEach((pair, index) => {
        const pairEl = document.createElement('div');
        pairEl.className = 'language-pair-item';
        
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
        
        pairEl.innerHTML = `
            <div class="pair-rank">${medal}</div>
            <div class="pair-languages">
                <span class="pair-from">${pair.from || 'Unknown'}</span>
                <span class="pair-arrow">→</span>
                <span class="pair-to">${pair.to || 'Unknown'}</span>
            </div>
            <div class="pair-count">${pair.count} translation${pair.count !== 1 ? 's' : ''}</div>
        `;
        
        container.appendChild(pairEl);
    });
}

// Create activity timeline chart
function createActivityChart(activityData) {
    const ctx = document.getElementById('activity-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (activityChart) {
        activityChart.destroy();
    }
    
    const labels = activityData.map(item => item.day);
    const counts = activityData.map(item => item.count);
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Translations',
                data: counts,
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primary + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const date = activityData[context.dataIndex].date;
                            return `${context.parsed.y} translation${context.parsed.y !== 1 ? 's' : ''} on ${date}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create language distribution chart
function createLanguageChart(languageData) {
    const ctx = document.getElementById('language-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (languageChart) {
        languageChart.destroy();
    }
    
    const labels = Object.keys(languageData);
    const counts = Object.values(languageData);
    
    // Generate colors for each language
    const colors = generateColors(labels.length);
    
    languageChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label} (${value})`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Generate colors for charts
function generateColors(count) {
    const colorList = [
        chartColors.primary,
        chartColors.success,
        chartColors.warning,
        chartColors.danger,
        chartColors.info,
        chartColors.purple,
        chartColors.teal,
        chartColors.orange,
        chartColors.pink,
        chartColors.indigo
    ];
    
    const background = [];
    const border = [];
    
    for (let i = 0; i < count; i++) {
        const color = colorList[i % colorList.length];
        background.push(color + 'CC'); // Add transparency
        border.push(color);
    }
    
    return { background, border };
}

// Format numbers with commas
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Helper class for hidden elements
if (!document.querySelector('.hidden')) {
    const style = document.createElement('style');
    style.textContent = '.hidden { display: none !important; }';
    document.head.appendChild(style);
}

