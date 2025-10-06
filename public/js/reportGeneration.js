// Report Generation Module
// Handles generation of audit reports in various formats

// Generate comprehensive audit report
function generateAuditReport() {
    try {
        const project = window.app ? window.app.getCurrentProject() : null;
        
        if (!project) {
            alert('No audit data available to generate report.');
            return null;
        }
        
        const report = {
            metadata: {
                generatedDate: new Date().toISOString(),
                generatedBy: 'OHS Management System Audit Tool',
                version: '2.3',
                reportTitle: document.getElementById('reportTitle')?.value || 'OCCUPATIONAL HEALTH & SAFETY AUDIT REPORT',
                reportSubtitle: document.getElementById('reportSubtitle')?.value || 'Management System & Site Performance Audit',
                companyName: document.getElementById('companyName')?.value || '',
                reportDescription: document.getElementById('reportDescription')?.value || ''
            },
            project: project,
            summary: generateReportSummary(project),
            recommendations: window.recommendations?.generateRecommendations() || [],
            charts: captureChartsForReport()
        };
        
        return report;
    } catch (error) {
        console.error('Error generating audit report:', error);
        alert('Error generating report. Please check the console for details.');
        return null;
    }
}

// Generate comprehensive summary for report
function generateReportSummary(project) {
    try {
        const summary = {
            projectName: project.projectName || 'Default Project',
            currentSite: project.currentSite || 'Default Site',
            totalSites: project.sites ? Object.keys(project.sites).length : 0,
            inspectionDate: document.getElementById('inspectionDate')?.value || new Date().toISOString().split('T')[0],
            leadAuditor: project.leadAuditor || document.getElementById('leadAuditor')?.value || 'Not specified',
            projectDirector: project.projectDirector || document.getElementById('projectDirector')?.value || 'Not specified',
            overallScores: {},
            siteScores: {},
            managementScore: 0,
            criticalIssues: [],
            recommendations: 0
        };
        
        // Calculate management system score
        if (project.managementSystemAudit) {
            let totalManagementScore = 0;
            let totalManagementQuestions = 0;
            
            for (const section in project.managementSystemAudit) {
                if (Array.isArray(project.managementSystemAudit[section])) {
                    project.managementSystemAudit[section].forEach(item => {
                        if (item.score > 0) {
                            totalManagementScore += item.score;
                            totalManagementQuestions++;
                        }
                        if (item.score === 1) {
                            summary.criticalIssues.push({
                                type: 'Management System',
                                section: section,
                                issue: item.name
                            });
                        }
                    });
                }
            }
            
            summary.managementScore = totalManagementQuestions > 0 ? 
                Math.round((totalManagementScore / totalManagementQuestions) * 100) / 100 : 0;
        }
        
        // Calculate site scores
        if (project.sites) {
            for (const siteName in project.sites) {
                const site = project.sites[siteName];
                let totalSiteScore = 0;
                let totalSiteQuestions = 0;
                
                for (const section in site) {
                    if (Array.isArray(site[section])) {
                        site[section].forEach(item => {
                            if (item.score > 0) {
                                totalSiteScore += item.score;
                                totalSiteQuestions++;
                            }
                            if (item.score === 1) {
                                summary.criticalIssues.push({
                                    type: 'Site Performance',
                                    site: siteName,
                                    section: section,
                                    issue: item.name
                                });
                            }
                        });
                    }
                }
                
                summary.siteScores[siteName] = totalSiteQuestions > 0 ? 
                    Math.round((totalSiteScore / totalSiteQuestions) * 100) / 100 : 0;
            }
        }
        
        // Calculate overall scores using chart management functions
        if (window.chartManagement && window.chartManagement.calculateOverallScore) {
            summary.overallScores = {
                management: window.chartManagement.calculateOverallScore('management'),
                currentSite: window.chartManagement.calculateOverallScore('all'),
                allSites: window.chartManagement.calculateOverallScore('all-sites'),
                projectOverview: window.chartManagement.calculateOverallScore('total')
            };
        }
        
        return summary;
    } catch (error) {
        console.error('Error generating report summary:', error);
        return {
            projectName: 'Unknown Project',
            totalSites: 0,
            managementScore: 0,
            siteScores: {},
            criticalIssues: [],
            overallScores: {}
        };
    }
    
    // Calculate overall compliance
    if (projectData && projectData.score > 0 && summary.averageSiteScore > 0) {
        summary.overallCompliance = Math.round((projectData.score + summary.averageSiteScore) / 2);
    } else if (projectData && projectData.score > 0) {
        summary.overallCompliance = projectData.score;
    } else if (summary.averageSiteScore > 0) {
        summary.overallCompliance = summary.averageSiteScore;
    }
    
    // Count critical issues (scores of 1 or 2)
    if (projectData && projectData.questions) {
        summary.criticalIssues += projectData.questions.filter(q => q.score <= 2 && q.score > 0).length;
    }
    
    if (sitesData) {
        sitesData.forEach(site => {
            if (site.questions) {
                summary.criticalIssues += site.questions.filter(q => q.score <= 2 && q.score > 0).length;
            }
        });
    }
    
    return summary;
}

// Capture charts for report
function captureChartsForReport() {
    try {
        const charts = {};
        
        // Capture dashboard charts if they exist
        if (window.app && window.app.charts) {
            const chartElements = ['ratingChart', 'distributionChart', 'managementChart'];
            
            chartElements.forEach(chartId => {
                const canvas = document.getElementById(chartId);
                if (canvas) {
                    try {
                        charts[chartId] = canvas.toDataURL('image/png');
                    } catch (error) {
                        console.warn(`Could not capture chart ${chartId}:`, error);
                        charts[chartId] = null;
                    }
                }
            });
        }
        
        return charts;
    } catch (error) {
        console.error('Error capturing charts:', error);
        return {};
    }
}

// Initialize report generation functionality
function initializeReportGeneration() {
    try {
        console.log('Initializing report generation...');
        
        // Initialize logo upload functionality
        initializeLogoUpload();
        
        // Initialize report generation buttons
        const generateBtn = document.getElementById('generateDetailedReportBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', generateExecutiveReport);
        }
        
        const exportHtmlBtn = document.getElementById('exportHtmlReportBtn');
        if (exportHtmlBtn) {
            exportHtmlBtn.addEventListener('click', exportToHTML);
        }
        
        console.log('Report generation initialized successfully');
    } catch (error) {
        console.error('Error initializing report generation:', error);
    }
}

// Initialize logo upload functionality
function initializeLogoUpload() {
    try {
        const uploadBtn = document.getElementById('uploadLogoBtn');
        const fileInput = document.getElementById('logoFileInput');
        const removeBtn = document.getElementById('removeLogoBtn');
        const logoPreview = document.getElementById('logoPreview');
        const logoImage = document.getElementById('logoImage');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            if (logoImage) {
                                logoImage.src = e.target.result;
                                logoPreview.style.display = 'block';
                                removeBtn.style.display = 'inline-block';
                                
                                // Store logo data for report generation
                                window.reportLogoData = e.target.result;
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        alert('Please select a valid image file (PNG, JPG, GIF, etc.)');
                    }
                }
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                if (logoPreview) logoPreview.style.display = 'none';
                if (removeBtn) removeBtn.style.display = 'none';
                if (fileInput) fileInput.value = '';
                window.reportLogoData = null;
            });
        }
        
        console.log('Logo upload functionality initialized');
    } catch (error) {
        console.error('Error initializing logo upload:', error);
    }
}

// Generate Executive Report
function generateExecutiveReport() {
    try {
        console.log('Generating executive report...');
        
        const report = generateAuditReport();
        if (!report) {
            return;
        }
        
        // Create executive report HTML
        const reportHtml = createExecutiveReportHTML(report);
        
        // Display in a new window/tab for printing
        displayReportInNewWindow(reportHtml, 'Executive Audit Report');
        
    } catch (error) {
        console.error('Error generating executive report:', error);
        alert('Error generating executive report. Please check the console for details.');
    }
}

// Export to HTML
function exportToHTML() {
    try {
        console.log('Exporting report to HTML...');
        
        const report = generateAuditReport();
        if (!report) {
            return;
        }
        
        // Create full HTML report
        const reportHtml = createFullHTMLReport(report);
        
        // Create downloadable HTML file
        const blob = new Blob([reportHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('HTML report exported successfully');
        
    } catch (error) {
        console.error('Error exporting HTML report:', error);
        alert('Error exporting HTML report. Please check the console for details.');
    }
}

// Generate HTML report
function generateHTMLReport() {
    const report = generateAuditReport();
    if (!report) return;
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>OHS Management System Audit Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                .section { margin-bottom: 30px; }
                .section h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                .score { font-weight: bold; font-size: 1.2em; }
                .score.excellent { color: #48bb78; }
                .score.good { color: #38a169; }
                .score.fair { color: #ed8936; }
                .score.poor { color: #e53e3e; }
                .question-item { margin-bottom: 15px; padding: 10px; border-left: 4px solid #ddd; }
                .recommendation { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin-bottom: 10px; border-radius: 4px; }
                .recommendation.high { border-color: #e74c3c; background: #fdf2f2; }
                .recommendation.medium { border-color: #f39c12; background: #fef9e7; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f2f2f2; }
                .site-section { margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>OHS Management System Audit Report</h1>
                <p>Generated on: ${new Date(report.metadata.generatedDate).toLocaleDateString()}</p>
            </div>
            
            <div class="summary">
                <h2>Executive Summary</h2>
                <table>
                    <tr><td><strong>Overall Compliance Score</strong></td><td class="score ${getScoreClass(report.summary.overallCompliance)}">${report.summary.overallCompliance}%</td></tr>
                    <tr><td><strong>Management System Score</strong></td><td class="score ${getScoreClass(report.summary.projectScore)}">${report.summary.projectScore}%</td></tr>
                    <tr><td><strong>Average Site Score</strong></td><td class="score ${getScoreClass(report.summary.averageSiteScore)}">${report.summary.averageSiteScore}%</td></tr>
                    <tr><td><strong>Total Sites Audited</strong></td><td>${report.summary.completedSites} / ${report.summary.totalSites}</td></tr>
                    <tr><td><strong>Critical Issues Identified</strong></td><td>${report.summary.criticalIssues}</td></tr>
                </table>
            </div>
    `;
    
    // Management System Section
    if (report.project) {
        html += `
            <div class="section">
                <h2>Management System Audit Results</h2>
                <p><strong>Overall Score:</strong> <span class="score ${getScoreClass(report.project.score)}">${report.project.score}%</span></p>
                <p><strong>Completion Status:</strong> ${report.project.completed ? 'Completed' : 'In Progress'}</p>
        `;
        
        if (report.project.questions && report.project.questions.length > 0) {
            html += '<h3>Question Responses</h3>';
            const template = window.dataManagement?.getCurrentTemplate();
            
            report.project.questions.forEach(q => {
                if (template && template.managementQuestions[q.index]) {
                    const questionText = template.managementQuestions[q.index].text;
                    html += `
                        <div class="question-item">
                            <strong>${questionText}</strong><br>
                            Score: <span class="score ${getScoreClass(q.score * 25)}">${q.score}/4</span>
                            ${q.comment ? `<br>Comment: ${q.comment}` : ''}
                        </div>
                    `;
                }
            });
        }
        
        html += '</div>';
    }
    
    // Sites Section
    if (report.sites && report.sites.length > 0) {
        html += '<div class="section"><h2>Site Performance Audit Results</h2>';
        
        report.sites.forEach(site => {
            html += `
                <div class="site-section">
                    <h3>${site.name}</h3>
                    <p><strong>Score:</strong> <span class="score ${getScoreClass(site.score)}">${site.score}%</span></p>
                    <p><strong>Status:</strong> ${site.completed ? 'Completed' : 'In Progress'}</p>
            `;
            
            if (site.questions && site.questions.length > 0) {
                const template = window.dataManagement?.getCurrentTemplate();
                
                site.questions.forEach(q => {
                    if (template && template.siteQuestions[q.index]) {
                        const questionText = template.siteQuestions[q.index].text;
                        html += `
                            <div class="question-item">
                                <strong>${questionText}</strong><br>
                                Score: <span class="score ${getScoreClass(q.score * 25)}">${q.score}/4</span>
                                ${q.comment ? `<br>Comment: ${q.comment}` : ''}
                            </div>
                        `;
                    }
                });
            }
            
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    // Recommendations Section
    if (report.recommendations && report.recommendations.length > 0) {
        html += '<div class="section"><h2>Recommendations</h2>';
        
        report.recommendations.forEach(rec => {
            html += `
                <div class="recommendation ${rec.priority.toLowerCase()}">
                    <strong>${rec.priority} Priority - ${rec.type}</strong>
                    ${rec.site ? ` (${rec.site})` : ''}<br>
                    <strong>Issue:</strong> ${rec.issue}<br>
                    <strong>Recommendation:</strong> ${rec.recommendation}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    html += `
            <div class="section">
                <h2>Report Information</h2>
                <p><strong>Generated by:</strong> ${report.metadata.generatedBy}</p>
                <p><strong>Version:</strong> ${report.metadata.version}</p>
                <p><strong>Generated on:</strong> ${new Date(report.metadata.generatedDate).toLocaleString()}</p>
            </div>
        </body>
        </html>
    `;
    
    return html;
}

// Get CSS class for score styling
function getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
}

// Download HTML report
function downloadHTMLReport() {
    const html = generateHTMLReport();
    if (!html) return;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OHS_Audit_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Download JSON report
function downloadJSONReport() {
    const report = generateAuditReport();
    if (!report) return;
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OHS_Audit_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Print report
function printReport() {
    const html = generateHTMLReport();
    if (!html) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

// Initialize legacy report generation (keeping for backward compatibility)
function initializeLegacyReportGeneration() {
    // Setup event listeners for report buttons
    const htmlReportBtn = document.getElementById('generateHTMLReport');
    const jsonReportBtn = document.getElementById('generateJSONReport');
    const printReportBtn = document.getElementById('printReport');
    
    if (htmlReportBtn) {
        htmlReportBtn.addEventListener('click', downloadHTMLReport);
    }
    
    if (jsonReportBtn) {
        jsonReportBtn.addEventListener('click', downloadJSONReport);
    }
    
    if (printReportBtn) {
        printReportBtn.addEventListener('click', printReport);
    }
}

// Export functions for use in other modules
window.reportGeneration = {
    generateAuditReport,
    generateHTMLReport,
    downloadHTMLReport,
    downloadJSONReport,
    printReport,
    initializeReportGeneration
};