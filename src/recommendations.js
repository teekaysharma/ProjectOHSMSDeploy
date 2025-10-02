// Recommendations management functions
(function() {
    // Function to generate recommendations based on audit data
    function generateRecommendations(project) {
        try {
            let recommendations = '<div class="recommendations-list">';
            
            // Check management system audit
            const managementData = Object.values(project.managementSystemAudit || {}).flat();
            const managementIssues = managementData.filter(item => item.score < 3); // Non-conformances and observations
            
            if (managementIssues.length > 0) {
                const criticalIssues = managementIssues.filter(item => item.score === 1);
                const minorIssues = managementIssues.filter(item => item.score === 2);
                
                recommendations += '<div class="recommendation-category">';
                recommendations += '<h4>Management System Recommendations</h4>';
                
                if (criticalIssues.length > 0) {
                    recommendations += `<div class="recommendation-item critical">`;
                    recommendations += `<strong>Critical Issues (${criticalIssues.length}):</strong> Immediate action required for major non-conformances in the management system.`;
                    recommendations += '</div>';
                }
                
                if (minorIssues.length > 0) {
                    recommendations += `<div class="recommendation-item warning">`;
                    recommendations += `<strong>Minor Issues (${minorIssues.length}):</strong> Address minor non-conformances in the management system within the specified timeframe.`;
                    recommendations += '</div>';
                }
                
                recommendations += '</div>';
            }
            
            // Check site performance audit
            let siteIssues = [];
            if (project.currentSite && project.sites[project.currentSite]) {
                siteIssues = Object.values(project.sites[project.currentSite]).flat();
                siteIssues = siteIssues.filter(item => item.score < 3);
            }
            
            if (siteIssues.length > 0) {
                const criticalIssues = siteIssues.filter(item => item.score === 1);
                const minorIssues = siteIssues.filter(item => item.score === 2);
                
                recommendations += '<div class="recommendation-category">';
                recommendations += '<h4>Site Performance Recommendations</h4>';
                
                if (criticalIssues.length > 0) {
                    recommendations += `<div class="recommendation-item critical">`;
                    recommendations += `<strong>Critical Issues (${criticalIssues.length}):</strong> Immediate action required for major non-conformances at the site.`;
                    recommendations += '</div>';
                }
                
                if (minorIssues.length > 0) {
                    recommendations += `<div class="recommendation-item warning">`;
                    recommendations += `<strong>Minor Issues (${minorIssues.length}):</strong> Address minor non-conformances at the site within the specified timeframe.`;
                    recommendations += '</div>';
                }
                
                recommendations += '</div>';
            }
            
            // If no major issues
            if (managementIssues.length === 0 && siteIssues.length === 0) {
                recommendations += '<div class="recommendation-item success">';
                recommendations += '<strong>No major issues identified.</strong> Continue maintaining current practices and consider implementing best practices where possible.';
                recommendations += '</div>';
            }
            
            // Add general recommendations
            recommendations += '<div class="recommendation-category">';
            recommendations += '<h4>General Recommendations</h4>';
            recommendations += '<div class="recommendation-item">';
            recommendations += '<strong>Regular Reviews:</strong> Conduct regular safety reviews and audits to maintain compliance.';
            recommendations += '</div>';
            recommendations += '<div class="recommendation-item">';
            recommendations += '<strong>Training:</strong> Ensure all personnel receive regular safety training and updates.';
            recommendations += '</div>';
            recommendations += '<div class="recommendation-item">';
            recommendations += '<strong>Documentation:</strong> Maintain accurate and up-to-date safety documentation.';
            recommendations += '</div>';
            recommendations += '<div class="recommendation-item">';
            recommendations += '<strong>Communication:</strong> Foster open communication about safety concerns and improvements.';
            recommendations += '</div>';
            recommendations += '<div class="recommendation-item">';
            recommendations += '<strong>Continuous Improvement:</strong> Regularly review and improve safety processes and procedures.';
            recommendations += '</div>';
            recommendations += '</div>';
            
            recommendations += '</div>';
            return recommendations;
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return '<p>Error generating recommendations. Please try again.</p>';
        }
    }
    
    // Function to render dashboard recommendations
    function renderDashboardRecommendations() {
        try {
            console.log('Rendering dashboard recommendations...');
            const recommendationsContent = document.getElementById('recommendationsContent');
            if (recommendationsContent) {
                const project = app.getCurrentProject();
                if (!project) {
                    recommendationsContent.innerHTML = '<p>No project selected.</p>';
                    return;
                }
                
                const recommendations = generateRecommendations(project);
                recommendationsContent.innerHTML = recommendations;
                console.log('Dashboard recommendations rendered successfully');
            }
        } catch (error) {
            console.error('Error rendering dashboard recommendations:', error);
        }
    }
    
    // Load custom recommendations
    function loadCustomRecommendations() {
        try {
            const customRecommendations = localStorage.getItem('customRecommendations');
            const recommendationsContent = document.getElementById('recommendationsContent');
            
            if (customRecommendations && recommendationsContent) {
                recommendationsContent.innerHTML = customRecommendations;
            } else {
                // If no custom recommendations, generate automatic ones
                renderDashboardRecommendations();
            }
        } catch (error) {
            console.error('Error loading custom recommendations:', error);
            // Fallback to automatic recommendations
            renderDashboardRecommendations();
        }
    }
    
    // Enable recommendations edit
    function enableRecommendationsEdit() {
        try {
            const recommendationsContent = document.getElementById('recommendationsContent');
            const saveBtn = document.getElementById('saveRecommendationsBtn');
            const cancelBtn = document.getElementById('cancelEditRecommendationsBtn');
            const regenerateBtn = document.getElementById('regenerateRecommendationsBtn');
            const editBtn = document.getElementById('editRecommendationsBtn');
            
            if (recommendationsContent) {
                recommendationsContent.contentEditable = true;
                recommendationsContent.focus();
                
                if (saveBtn) saveBtn.style.display = 'inline-block';
                if (cancelBtn) cancelBtn.style.display = 'inline-block';
                if (regenerateBtn) regenerateBtn.style.display = 'none';
                if (editBtn) editBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error enabling recommendations edit:', error);
        }
    }
    
    // Save recommendations edit
    function saveRecommendationsEdit() {
        try {
            const recommendationsContent = document.getElementById('recommendationsContent');
            const saveBtn = document.getElementById('saveRecommendationsBtn');
            const cancelBtn = document.getElementById('cancelEditRecommendationsBtn');
            const regenerateBtn = document.getElementById('regenerateRecommendationsBtn');
            const editBtn = document.getElementById('editRecommendationsBtn');
            
            if (recommendationsContent) {
                const content = recommendationsContent.innerHTML;
                localStorage.setItem('customRecommendations', content);
                
                recommendationsContent.contentEditable = false;
                
                if (saveBtn) saveBtn.style.display = 'none';
                if (cancelBtn) cancelBtn.style.display = 'none';
                if (regenerateBtn) regenerateBtn.style.display = 'inline-block';
                if (editBtn) editBtn.style.display = 'inline-block';
                
                alert('Recommendations saved successfully!');
            }
        } catch (error) {
            console.error('Error saving recommendations edit:', error);
        }
    }
    
    // Cancel recommendations edit
    function cancelRecommendationsEdit() {
        try {
            const recommendationsContent = document.getElementById('recommendationsContent');
            const saveBtn = document.getElementById('saveRecommendationsBtn');
            const cancelBtn = document.getElementById('cancelEditRecommendationsBtn');
            const regenerateBtn = document.getElementById('regenerateRecommendationsBtn');
            const editBtn = document.getElementById('editRecommendationsBtn');
            
            if (recommendationsContent) {
                recommendationsContent.contentEditable = false;
                
                // Reload the original recommendations
                loadCustomRecommendations();
                
                if (saveBtn) saveBtn.style.display = 'none';
                if (cancelBtn) cancelBtn.style.display = 'none';
                if (regenerateBtn) regenerateBtn.style.display = 'inline-block';
                if (editBtn) editBtn.style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Error canceling recommendations edit:', error);
        }
    }
    
    // Regenerate recommendations
    function regenerateRecommendations() {
        try {
            // Clear custom recommendations from localStorage
            localStorage.removeItem('customRecommendations');
            
            // Regenerate automatic recommendations
            renderDashboardRecommendations();
            
            alert('Recommendations regenerated successfully!');
        } catch (error) {
            console.error('Error regenerating recommendations:', error);
        }
    }
    
    // Expose functions to global scope
    window.loadCustomRecommendations = loadCustomRecommendations;
    window.renderDashboardRecommendations = renderDashboardRecommendations;
    window.enableRecommendationsEdit = enableRecommendationsEdit;
    window.saveRecommendationsEdit = saveRecommendationsEdit;
    window.cancelRecommendationsEdit = cancelRecommendationsEdit;
    window.regenerateRecommendations = regenerateRecommendations;
})();