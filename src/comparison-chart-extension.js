// Add this code to your main.js or create a new file and include it after main.js

// Function to add comparison chart option to executive summary
function addComparisonChartOptionToExecutiveSummary() {
    const executiveSummarySection = document.querySelector('.executive-summary');
    if (!executiveSummarySection) return;
    
    // Check if option already exists
    if (document.getElementById('includeComparisonInSummary')) return;
    
    // Create option container
    const optionContainer = document.createElement('div');
    optionContainer.className = 'executive-summary-option';
    optionContainer.style.marginBottom = '10px';
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'includeComparisonInSummary';
    
    // Create label
    const label = document.createElement('label');
    label.htmlFor = 'includeComparisonInSummary';
    label.textContent = 'Include Site Performance Comparison Chart';
    label.style.marginLeft = '5px';
    
    // Add elements to container
    optionContainer.appendChild(checkbox);
    optionContainer.appendChild(label);
    
    // Insert before executive summary content
    const executiveSummaryContent = document.getElementById('dashboardExecutiveSummary');
    executiveSummarySection.insertBefore(optionContainer, executiveSummaryContent);
    
    // Add event listener
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            addComparisonChartToExecutiveSummary();
        } else {
            removeComparisonChartFromExecutiveSummary();
        }
    });
}

// Function to add comparison chart to executive summary
function addComparisonChartToExecutiveSummary() {
    const executiveSummaryContent = document.getElementById('dashboardExecutiveSummary');
    if (!executiveSummaryContent) return;
    
    // Remove any existing chart
    removeComparisonChartFromExecutiveSummary();
    
    // Get source chart
    const sourceCanvas = document.getElementById('siteComparisonChart');
    if (!sourceCanvas) return;
    
    const sourceChart = Chart.getChart(sourceCanvas);
    if (!sourceChart) return;
    
    // Create container for chart
    const chartContainer = document.createElement('div');
    chartContainer.className = 'executive-summary-chart-container';
    chartContainer.style.marginBottom = '20px';
    
    // Create canvas for chart
    const canvas = document.createElement('canvas');
    canvas.id = 'executiveSummaryComparisonChart';
    canvas.width = 800;
    canvas.height = 400;
    
    chartContainer.appendChild(canvas);
    
    // Insert at beginning of executive summary
    executiveSummaryContent.insertBefore(chartContainer, executiveSummaryContent.firstChild);
    
    // Create new chart with same data
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: sourceChart.config.type,
        data: JSON.parse(JSON.stringify(sourceChart.config.data)),
        options: {
            ...sourceChart.config.options,
            responsive: false,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            }
        }
    });
}

// Function to remove comparison chart from executive summary
function removeComparisonChartFromExecutiveSummary() {
    const chartContainer = document.querySelector('.executive-summary-chart-container');
    if (chartContainer) {
        chartContainer.remove();
    }
}

// Function to ensure comparison chart is included in HTML export
function ensureComparisonChartInHtmlExport() {
    // Check if comparison chart should be included
    const includeComparisonChart = document.getElementById('includeComparisonChart');
    if (!includeComparisonChart || !includeComparisonChart.checked) return;
    
    // Get source chart
    const sourceCanvas = document.getElementById('siteComparisonChart');
    if (!sourceCanvas) return;
    
    const sourceChart = Chart.getChart(sourceCanvas);
    if (!sourceChart) return;
    
    // Create temporary canvas to generate image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceChart.width;
    tempCanvas.height = sourceChart.height;
    
    const tempCtx = tempCanvas.getContext('2d');
    
    // Create temporary chart
    const tempChart = new Chart(tempCtx, {
        type: sourceChart.config.type,
        data: JSON.parse(JSON.stringify(sourceChart.config.data)),
        options: {
            ...sourceChart.config.options,
            responsive: false,
            animation: {
                duration: 0
            }
        }
    });
    
    // Wait for chart to render
    setTimeout(() => {
        // Convert to image
        const chartImage = tempCanvas.toDataURL('image/png');
        
        // Get report content
        const reportContent = document.getElementById('reportContent');
        if (!reportContent) return;
        
        // Create container for chart image
        const chartContainer = document.createElement('div');
        chartContainer.className = 'report-chart-container';
        chartContainer.innerHTML = `
            <h3>Site Performance Comparison</h3>
            <img src="${chartImage}" alt="Site Performance Comparison Chart" style="max-width: 100%; height: auto;">
        `;
        
        // Find where to insert the chart
        const insertionPoint = reportContent.querySelector('.site-performance-section') || 
                             reportContent.querySelector('.report-section') ||
                             reportContent;
        
        insertionPoint.appendChild(chartContainer);
        
        // Clean up
        tempChart.destroy();
    }, 100);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add option to executive summary
    addComparisonChartOptionToExecutiveSummary();
    
    // Hook into HTML export function
    const originalExportHtmlReport = window.exportHtmlReport;
    if (originalExportHtmlReport) {
        window.exportHtmlReport = function() {
            // Call original function
            const result = originalExportHtmlReport.apply(this, arguments);
            
            // Add comparison chart if selected
            ensureComparisonChartInHtmlExport();
            
            return result;
        };
    }
});