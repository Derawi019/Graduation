// Admin Dashboard JavaScript

let activityChart = null;
let languageChart = null;
let providerChart = null;

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

let currentUsersPage = 1;
let currentTranslationsPage = 1;
let usersPagination = null;
let translationsPagination = null;

// Initialize admin dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAdminDashboard();
});

// Load admin dashboard data from API
async function loadAdminDashboard() {
    const loadingEl = document.getElementById('admin-loading');
    const errorEl = document.getElementById('admin-error');
    const statsCardsEl = document.getElementById('stats-cards');
    const chartsSectionEl = document.getElementById('charts-section');
    
    try {
        // Show loading, hide others
        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
        statsCardsEl.classList.add('hidden');
        chartsSectionEl.classList.add('hidden');
        
        // Fetch admin stats
        const response = await fetch('/api/admin/stats');
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Access denied. Admin privileges required.');
            }
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
        
        if (Object.keys(data.provider_distribution).length > 0) {
            createProviderChart(data.provider_distribution);
        }
        
        // Show all sections
        statsCardsEl.classList.remove('hidden');
        if (Object.keys(data.language_distribution).length > 0 || 
            data.activity_timeline.length > 0 || 
            Object.keys(data.provider_distribution).length > 0) {
            chartsSectionEl.classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Failed to load admin dashboard:', error);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorEl.innerHTML = `<p>Failed to load admin dashboard: ${error.message}</p>`;
        statsCardsEl.classList.add('hidden');
        chartsSectionEl.classList.add('hidden');
    }
}

// Update statistics cards with data
function updateStatsCards(data) {
    document.getElementById('total-users').textContent = formatNumber(data.total_users || 0);
    document.getElementById('total-translations').textContent = formatNumber(data.total_translations || 0);
    document.getElementById('verified-users').textContent = formatNumber(data.verified_users || 0);
    document.getElementById('active-users').textContent = formatNumber(data.active_users || 0);
    document.getElementById('new-users-month').textContent = formatNumber(data.new_users_month || 0);
    document.getElementById('translations-month').textContent = formatNumber(data.translations_month || 0);
}

// Create activity timeline chart
function createActivityChart(activityData) {
    const ctx = document.getElementById('activity-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (activityChart) {
        activityChart.destroy();
    }
    
    const labels = activityData.map(d => d.day);
    const counts = activityData.map(d => d.count);
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Translations',
                data: counts,
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primary + '20',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
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
    
    const languages = Object.keys(languageData);
    const counts = Object.values(languageData);
    const colors = generateColors(languages.length);
    
    languageChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: languages,
            datasets: [{
                data: counts,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        }
    });
}

// Create provider distribution chart
function createProviderChart(providerData) {
    const ctx = document.getElementById('provider-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (providerChart) {
        providerChart.destroy();
    }
    
    const providers = Object.keys(providerData);
    const counts = Object.values(providerData);
    const colors = [chartColors.primary, chartColors.success, chartColors.info, chartColors.warning];
    
    providerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: providers.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
            datasets: [{
                label: 'Users',
                data: counts,
                backgroundColor: colors.slice(0, providers.length),
                borderColor: colors.slice(0, providers.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Load users list
async function loadUsers(page = 1) {
    const search = document.getElementById('user-search')?.value || '';
    const tbody = document.getElementById('users-table-body');
    
    if (!tbody) return;
    
    try {
        tbody.innerHTML = '<tr><td colspan="9" class="loading-text">Loading users...</td></tr>';
        
        let url = `/api/admin/users?page=${page}&per_page=20`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-text">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${escapeHtml(user.email || 'N/A')}</td>
                <td>${escapeHtml(user.name || user.username || 'N/A')}</td>
                <td><span class="badge badge-${user.provider === 'google' ? 'success' : 'info'}">${user.provider || 'local'}</span></td>
                <td>${user.email_verified ? '<span class="badge badge-success">✓</span>' : '<span class="badge badge-warning">✗</span>'}</td>
                <td>${user.is_admin ? '<span class="badge badge-danger">Admin</span>' : '-'}</td>
                <td>${formatNumber(user.translations_count || 0)}</td>
                <td>${formatDate(user.created_at)}</td>
                <td>${user.last_login ? formatDate(user.last_login) : 'Never'}</td>
            </tr>
        `).join('');
        
        // Update pagination
        updatePagination('users-pagination', page, data.pages, loadUsers);
        currentUsersPage = page;
        
    } catch (error) {
        console.error('Failed to load users:', error);
        tbody.innerHTML = `<tr><td colspan="9" class="error-text">Error loading users: ${error.message}</td></tr>`;
    }
}

// Load translations list
async function loadTranslations(page = 1) {
    const search = document.getElementById('translation-search')?.value || '';
    const tbody = document.getElementById('translations-table-body');
    
    if (!tbody) return;
    
    try {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-text">Loading translations...</td></tr>';
        
        let url = `/api/admin/translations?page=${page}&per_page=20`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.translations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-text">No translations found</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.translations.map(trans => `
            <tr>
                <td>${trans.id}</td>
                <td>${escapeHtml(trans.user_email || 'Unknown')}</td>
                <td><span class="badge">${trans.detected_language || 'Unknown'}</span></td>
                <td><span class="badge">${trans.target_language || 'Unknown'}</span></td>
                <td>${escapeHtml(trans.original_text)}</td>
                <td>${escapeHtml(trans.translated_text)}</td>
                <td>${formatDate(trans.timestamp)}</td>
            </tr>
        `).join('');
        
        // Update pagination
        updatePagination('translations-pagination', page, data.pages, loadTranslations);
        currentTranslationsPage = page;
        
    } catch (error) {
        console.error('Failed to load translations:', error);
        tbody.innerHTML = `<tr><td colspan="7" class="error-text">Error loading translations: ${error.message}</td></tr>`;
    }
}

// Helper functions
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateColors(count) {
    const colors = [
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
    
    // Repeat colors if needed
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    return result;
}

function updatePagination(containerId, currentPage, totalPages, loadFunction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        html += `<button onclick="${loadFunction.name}(${currentPage - 1})" class="pagination-btn">← Previous</button>`;
    } else {
        html += `<button disabled class="pagination-btn">← Previous</button>`;
    }
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        html += `<button onclick="${loadFunction.name}(1)" class="pagination-btn">1</button>`;
        if (startPage > 2) {
            html += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            html += `<button class="pagination-btn active">${i}</button>`;
        } else {
            html += `<button onclick="${loadFunction.name}(${i})" class="pagination-btn">${i}</button>`;
        }
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="pagination-ellipsis">...</span>`;
        }
        html += `<button onclick="${loadFunction.name}(${totalPages})" class="pagination-btn">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        html += `<button onclick="${loadFunction.name}(${currentPage + 1})" class="pagination-btn">Next →</button>`;
    } else {
        html += `<button disabled class="pagination-btn">Next →</button>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

