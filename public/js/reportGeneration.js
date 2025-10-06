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

// Generate summary statistics
function generateSummary(projectData, sitesData) {
    const summary = {
        totalSites: sitesData ? sitesData.length : 0,
        completedSites: sitesData ? sitesData.filter(site => site.completed).length : 0,
        averageSiteScore: 0,
        projectScore: projectData ? projectData.score : 0,
        overallCompliance: 0,
        criticalIssues: 0,
        recommendations: 0
    };
    
    // Calculate average site score
    if (sitesData && sitesData.length > 0) {
        const completedSites = sitesData.filter(site => site.completed);
        if (completedSites.length > 0) {
            summary.averageSiteScore = Math.round(
                completedSites.reduce((sum, site) => sum + site.score, 0) / completedSites.length
            );
        }
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

// Initialize report generation
function initializeReportGeneration() {
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