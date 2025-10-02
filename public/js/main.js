// Main Application Controller
// Initializes and coordinates all modules

document.addEventListener('DOMContentLoaded', function() {
    console.log('OHS Management System Audit Tool v2.3 - Initializing...');
    
    try {
        // Initialize core modules in order
        if (window.dataManagement && window.dataManagement.initializeDataManagement) {
            window.dataManagement.initializeDataManagement();
            console.log('✓ Data Management initialized');
        }
        
        if (window.uiManagement && window.uiManagement.initializeUI) {
            window.uiManagement.initializeUI();
            console.log('✓ UI Management initialized');
        }
        
        if (window.projectManagement && window.projectManagement.initializeProjectManagement) {
            window.projectManagement.initializeProjectManagement();
            console.log('✓ Project Management initialized');
        }
        
        if (window.siteManagement && window.siteManagement.initializeSiteManagement) {
            window.siteManagement.initializeSiteManagement();
            console.log('✓ Site Management initialized');
        }
        
        if (window.reportGeneration && window.reportGeneration.initializeReportGeneration) {
            window.reportGeneration.initializeReportGeneration();
            console.log('✓ Report Generation initialized');
        }
        
        // Initialize charts after Chart.js loads
        if (typeof Chart !== 'undefined') {
            if (window.chartManagement && window.chartManagement.initializeCharts) {
                window.chartManagement.initializeCharts();
                console.log('✓ Chart Management initialized');
            }
        } else {
            // Wait for Chart.js to load
            const checkChart = setInterval(() => {
                if (typeof Chart !== 'undefined') {
                    clearInterval(checkChart);
                    if (window.chartManagement && window.chartManagement.initializeCharts) {
                        window.chartManagement.initializeCharts();
                        console.log('✓ Chart Management initialized (delayed)');
                    }
                }
            }, 100);
        }
        
        // Load default template if no data exists
        setTimeout(() => {
            const hasProject = localStorage.getItem('ohsAuditProject');
            const hasSites = localStorage.getItem('ohsAuditSites');
            const hasTemplate = localStorage.getItem('ohsAuditTemplate');
            
            if (!hasProject && !hasSites && !hasTemplate) {
                console.log('No existing data found, loading default template...');
                if (window.dataManagement && window.dataManagement.loadDefaultTemplate) {
                    window.dataManagement.loadDefaultTemplate();
                }
            }
        }, 500);
        
        console.log('🎉 OHS Management System Audit Tool fully initialized!');
        
    } catch (error) {
        console.error('Error during initialization:', error);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <strong>Initialization Error</strong><br>
            Some features may not work properly. Please refresh the page.
            <button onclick="this.parentElement.remove()" style="float: right; margin-left: 10px;">×</button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error handler:', event.error);
    
    // Don't show error notifications for minor issues
    if (event.error && event.error.message && 
        !event.error.message.includes('Script error') &&
        !event.error.message.includes('Non-Error promise rejection')) {
        
        // Show subtle error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            opacity: 0.9;
        `;
        notification.textContent = 'An error occurred. Some features may not work as expected.';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
});

// Export for debugging
window.ohsAuditTool = {
    version: '2.3',
    modules: {
        dataManagement: window.dataManagement,
        uiManagement: window.uiManagement,
        projectManagement: window.projectManagement,
        siteManagement: window.siteManagement,
        chartManagement: window.chartManagement,
        recommendations: window.recommendations,
        reportGeneration: window.reportGeneration
    }
};