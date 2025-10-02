// Report generation functions
(function() {
    // Initialize logo upload
    function initializeLogoUpload() {
        try {
            const uploadBtn = document.getElementById('uploadLogoBtn');
            const fileInput = document.getElementById('logoFileInput');
            const removeBtn = document.getElementById('removeLogoBtn');
            const logoPreview = document.getElementById('logoPreview');
            const logoImage = document.getElementById('logoImage');
            const uploadArea = document.getElementById('logoUploadArea');
            const savedLogo = localStorage.getItem('companyLogo');
            if (savedLogo) {
                app.companyLogo = savedLogo;
                showLogoPreview(savedLogo);
            }
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const logoData = event.target.result;
                        app.companyLogo = logoData;
                        localStorage.setItem('companyLogo', logoData);
                        showLogoPreview(logoData);
                    };
                    reader.readAsDataURL(file);
                }
            });
            removeBtn.addEventListener('click', () => {
                app.companyLogo = null;
                localStorage.removeItem('companyLogo');
                hideLogoPreview();
            });
            function showLogoPreview(logoData) {
                logoImage.src = logoData;
                logoPreview.style.display = 'block';
                removeBtn.style.display = 'block';
                uploadArea.style.display = 'none';
            }
            function hideLogoPreview() {
                logoPreview.style.display = 'none';
                removeBtn.style.display = 'none';
                uploadArea.style.display = 'block';
                fileInput.value = '';
            }
        } catch (error) {
            console.error('Error initializing logo upload:', error);
        }
    }
    
    // Generate report header
    function generateReportHeader(siteName = null, reportType = '') {
        try {
            const reportTitle = document.getElementById('reportTitle').value || 'OCCUPATIONAL HEALTH & SAFETY AUDIT REPORT';
            const reportSubtitle = document.getElementById('reportSubtitle').value || 'Management System & Site Performance Audit';
            const companyName = document.getElementById('companyName').value || '';
            const reportDescription = document.getElementById('reportDescription').value || '';
            const projectName = document.getElementById('projectName').value || 'Not Specified';
            
            let siteDisplayName = '';
            if (reportType === 'management') {
                siteDisplayName = 'Management System Only';
            } else if (reportType === 'all') {
                siteDisplayName = 'All Sites';
            } else {
                siteDisplayName = siteName || (app.getCurrentProject()?.currentSite || 'Not Specified');
            }
            
            const leadAuditor = document.getElementById('leadAuditor').value || 'Not Specified';
            const projectDirector = document.getElementById('projectDirector').value || 'Not Specified';
            const date = document.getElementById('inspectionDate').value || 'Not Specified';
            
            let headerHtml = '<div class="report-header">';
            headerHtml += app.companyLogo ? `<div><img src="${app.companyLogo}" class="report-logo" alt="Company Logo"></div>` : '<div></div>';
            headerHtml += '<div class="report-header-content">';
            headerHtml += `<div class="report-title">${reportTitle}</div>`;
            headerHtml += `<div class="report-subtitle">${reportSubtitle}</div>`;
            
            if (companyName) {
                headerHtml += `<div style="font-weight: 600; color: #667eea; margin-bottom: 10px;">${companyName}</div>`;
            }
            
            if (reportDescription) {
                headerHtml += `<div style="font-style: italic; color: #666; margin-bottom: 15px;">${reportDescription}</div>`;
            }
            
            headerHtml += '<div class="report-details">';
            headerHtml += `<div class="report-detail"><span class="report-detail-label">PROJECT:</span> ${projectName.toUpperCase()}</div>`;
            headerHtml += `<div class="report-detail"><span class="report-detail-label">SCOPE:</span> ${siteDisplayName.toUpperCase()}</div>`;
            headerHtml += `<div class="report-detail"><span class="report-detail-label">Lead Auditor:</span> ${leadAuditor}</div>`;
            headerHtml += `<div class="report-detail"><span class="report-detail-label">Project Director:</span> ${projectDirector}</div>`;
            headerHtml += `<div class="report-detail"><span class="report-detail-label">Date:</span> ${date}</div>`;
            headerHtml += '</div></div></div>';
            
            return headerHtml;
        } catch (error) {
            console.error('Error generating report header:', error);
            return '<div class="report-header">Error generating header</div>';
        }
    }
    
    // Generate report chart images
    function generateReportChartImages(reportScope, siteName = null) {
        return new Promise((resolve) => {
            try {
                const images = {};
                
                // Determine chart scope based on report selection
                let chartScope;
                if (reportScope === 'management') {
                    chartScope = 'management';
                } else if (reportScope === 'all') {
                    chartScope = 'all-sites';
                } else {
                    chartScope = 'all';
                }
                
                // Get chart data for the report scope
                const chartData = getChartDataForScope(chartScope, siteName);
                
                // Create a hidden container for rendering charts
                const hiddenContainer = document.createElement('div');
                hiddenContainer.style.position = 'absolute';
                hiddenContainer.style.left = '-9999px';
                hiddenContainer.style.top = '-9999px';
                hiddenContainer.style.width = '800px';
                hiddenContainer.style.height = '600px';
                document.body.appendChild(hiddenContainer);
                
                try {
                    // Create canvas elements for each chart
                    const canvas1 = document.createElement('canvas');
                    canvas1.width = 800;
                    canvas1.height = 600;
                    hiddenContainer.appendChild(canvas1);
                    
                    const canvas2 = document.createElement('canvas');
                    canvas2.width = 800;
                    canvas2.height = 600;
                    hiddenContainer.appendChild(canvas2);
                    
                    const canvas3 = document.createElement('canvas');
                    canvas3.width = 800;
                    canvas3.height = 600;
                    hiddenContainer.appendChild(canvas3);
                    
                    // Generate Performance by Rating chart
                    const ratingCounts = { Excellent: 0, Good: 0, Satisfactory: 0, Low: 0, Unacceptable: 0 };
                    chartData.selectedScores.forEach(score => {
                        const percent = (score / 5) * 100;
                        if (percent > 90) ratingCounts.Excellent++;
                        else if (percent > 80) ratingCounts.Good++;
                        else if (percent > 70) ratingCounts.Satisfactory++;
                        else if (percent > 50) ratingCounts.Low++;
                        else ratingCounts.Unacceptable++;
                    });
                    
                    const ratingChart = new Chart(canvas1, {
                        type: 'doughnut',
                        data: {
                            labels: Object.keys(ratingCounts),
                            datasets: [{
                                data: Object.values(ratingCounts),
                                backgroundColor: ['#00b894', '#38a169', '#d69e2e', '#dd6b20', '#c53030']
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Performance by Rating'
                                },
                                legend: {
                                    display: true,
                                    position: 'right'
                                }
                            }
                        }
                    });
                    
                    // Generate Score Distribution chart
                    const scoreCounts = [0, 0, 0, 0, 0, 0];
                    chartData.selectedScores.forEach(s => {
                        const rounded = Math.round(s);
                        if (rounded >= 0 && rounded <= 5) scoreCounts[rounded]++;
                    });
                    
                    const distributionChart = new Chart(canvas2, {
                        type: 'polarArea',
                        data: {
                            labels: ['0 - Not Applicable', '1 - Major Non-Conformance', '2 - Minor Non-Conformance', '3 - Observation', '4 - Conformance', '5 - Best Practice'],
                            datasets: [{
                                data: scoreCounts,
                                backgroundColor: ['#c53030', '#c53030', '#dd6b20', '#d69e2e', '#38a169', '#00b894']
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Score Distribution'
                                },
                                legend: {
                                    display: true,
                                    position: 'right'
                                }
                            }
                        }
                    });
                    
                    // Generate Performance by Audit Type chart
                    const managementChart = new Chart(canvas3, {
                        type: 'bar',
                        data: {
                            labels: chartData.labels,
                            datasets: [{
                                label: 'Average Score',
                                data: chartData.avgData,
                                backgroundColor: chartData.backgroundColors
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Performance by Audit Type'
                                },
                                legend: {
                                    display: true,
                                    position: 'top'
                                }
                            },
                            scales: {
                                y: { 
                                    beginAtZero: true, 
                                    max: 5,
                                    title: {
                                        display: true,
                                        text: 'Average Score'
                                    }
                                }
                            }
                        }
                    });
                    
                    // Wait for charts to render and capture images
                    setTimeout(() => {
                        try {
                            images.ratingChart = canvas1.toDataURL('image/png');
                            images.distributionChart = canvas2.toDataURL('image/png');
                            images.managementChart = canvas3.toDataURL('image/png');
                            
                            // Destroy charts
                            ratingChart.destroy();
                            distributionChart.destroy();
                            managementChart.destroy();
                            
                            // Remove the hidden container
                            document.body.removeChild(hiddenContainer);
                            
                            // Resolve the promise with the images
                            resolve(images);
                        } catch (innerError) {
                            console.error('Error capturing chart images:', innerError);
                            // Return placeholder images if chart generation fails
                            resolve({
                                ratingChart: '',
                                distributionChart: '',
                                managementChart: ''
                            });
                            
                            // Remove the hidden container in case of error
                            if (document.body.contains(hiddenContainer)) {
                                document.body.removeChild(hiddenContainer);
                            }
                        }
                    }, 1000);
                } catch (innerError) {
                    console.error('Error generating charts:', innerError);
                    // Return placeholder images if chart generation fails
                    resolve({
                        ratingChart: '',
                        distributionChart: '',
                        managementChart: ''
                    });
                    
                    // Remove the hidden container in case of error
                    if (document.body.contains(hiddenContainer)) {
                        document.body.removeChild(hiddenContainer);
                    }
                }
            } catch (error) {
                console.error('Error in generateReportChartImages:', error);
                // Return placeholder images if chart generation fails
                resolve({
                    ratingChart: '',
                    distributionChart: '',
                    managementChart: ''
                });
            }
        });
    }
    
    // Generate executive report HTML
    function generateExecutiveReportHtml(header, reportScope = 'current', chartImages = null, summaryData = null) {
        try {
            // Use the passed summary data if available, otherwise calculate it
            const s = summaryData || getReportSummaryData(reportScope);
            const ratingInfo = app.getRatingDetails(parseFloat(s.overallPercentage));
            
            // Use the provided chart images or generate placeholders
            const chartImg1 = chartImages?.ratingChart || '';
            const chartImg2 = chartImages?.distributionChart || '';
            const chartImg3 = chartImages?.managementChart || '';
            
            // Check which charts to include based on customization options
            const includeRatingChart = document.getElementById('includeRatingChart')?.checked !== false;
            const includeDistributionChart = document.getElementById('includeDistributionChart')?.checked !== false;
            const includeManagementChart = document.getElementById('includeManagementChart')?.checked !== false;
            const includeComparisonChart = document.getElementById('includeComparisonChart')?.checked !== false;
            
            // Create a wrapper for the first page content
            let html = `<div class="first-page-content">`;
            html += header;
            
            // Section 1: Overall Summary & Dashboard
            html += `
                <div class="report-section">
                    <h3>1. Overall Summary & Dashboard</h3>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="value colored-value" style="color: ${ratingInfo.color};">${s.overallScore}</span>
                            <span class="label">Overall Score</span>
                        </div>
                        <div class="summary-item">
                            <span class="value colored-value" style="color: ${ratingInfo.color};">${s.overallPercentage}%</span>
                            <span class="label">Percentage</span>
                        </div>
                        <div class="summary-item" style="background-color: ${ratingInfo.color}; color: white;">
                            <span class="value">${ratingInfo.text}</span>
                            <span class="label">Rating</span>
                        </div>
                        <div class="summary-item">
                            <span class="value">${s.ratedItemsCount}/${s.totalItemsCount}</span>
                            <span class="label">Items Inspected (Rated/Total)</span>
                        </div>
                    </div>
                    
                    <!-- Charts section -->
                    <div class="dashboard-charts-top">
                        ${includeRatingChart ? `
                        <div class="chart-container">
                            <h4>Performance by Rating</h4>
                            ${chartImg1 ? `<img src="${chartImg1}" class="chart-image">` : '<p>Chart not available</p>'}
                        </div>
                        ` : ''}
                        
                        ${includeDistributionChart ? `
                        <div class="chart-container">
                            <h4>Score Distribution</h4>
                            ${chartImg2 ? `<img src="${chartImg2}" class="chart-image">` : '<p>Chart not available</p>'}
                        </div>
                        ` : ''}
                    </div>
                    
                    ${includeManagementChart ? `
                    <div class="dashboard-charts-bottom">
                        <div class="chart-container full-width">
                            <h4>Performance by Audit Type</h4>
                            ${chartImg3 ? `<img src="${chartImg3}" class="chart-image">` : '<p>Chart not available</p>'}
                        </div>
                    </div>
                    ` : ''}
                </div>
            `;
            
            // Section 2: Executive Summary
            html += `
                <div class="report-section executive-summary">
                    <h3>2. Executive Summary</h3>
                    <div style="padding: 15px; background: #f8f9ff; border: 1px solid #ddd; border-radius: 8px; line-height: 1.5;">
                        ${generateExecutiveSummary(reportScope === 'all' ? null : (reportScope === 'management' ? null : reportScope), 
                            reportScope !== 'management', 
                            reportScope !== 'management').replace(/\n/g, '<br>').replace(/•/g, '&bull;')}
                    </div>
                </div>
            `;
            
            // Section 3: Automatic Recommendations
            const recommendationsHtml = generateRecommendationsSectionHtml(reportScope, reportScope === 'all' ? null : (reportScope === 'management' ? null : reportScope));
            html += recommendationsHtml;
            
            // Section 4: Key Observations & Corrective Actions
            html += `<div class="report-section"><h3>4. Key Observations & Corrective Actions</h3>`;
            
            // Collect actions based on report scope
            let actions = [];
            
            const project = app.getCurrentProject();
            if (!project) {
                html += `<p>Error: No project data available.</p></div>`;
                return html;
            }
            
            if (reportScope === 'management') {
                // Add management system actions only
                for (const sec in project.managementSystemAudit) {
                    project.managementSystemAudit[sec].forEach(i => {
                        if (i.score < 4) actions.push({ 
                            site: "Management System", 
                            type: 'Mgmt', 
                            sec, 
                            item: i.name, 
                            score: i.score, 
                            scoreLabel: app.scoreLabels[i.score],
                            comment: i.comment 
                        });
                    });
                }
            } else if (reportScope === 'all') {
                // Add management system actions
                for (const sec in project.managementSystemAudit) {
                    project.managementSystemAudit[sec].forEach(i => {
                        if (i.score < 4) actions.push({ 
                            site: "Management System", 
                            type: 'Mgmt', 
                            sec, 
                            item: i.name, 
                            score: i.score,
                            scoreLabel: app.scoreLabels[i.score],
                            comment: i.comment 
                        });
                    });
                }
                
                // Add site-specific actions
                for (const siteName in project.sites) {
                    const siteData = project.sites[siteName];
                    
                    for (const sec in siteData) {
                        siteData[sec].forEach(i => {
                            if (i.score < 4) actions.push({ 
                                site: siteName, 
                                type: 'Site', 
                                sec, 
                                item: i.name, 
                                score: i.score,
                                scoreLabel: app.scoreLabels[i.score],
                                comment: i.comment 
                            });
                        });
                    }
                }
            } else {
                // Add management system actions for current site report
                for (const sec in project.managementSystemAudit) {
                    project.managementSystemAudit[sec].forEach(i => {
                        if (i.score < 4) actions.push({ 
                            site: "Management System", 
                            type: 'Mgmt', 
                            sec, 
                            item: i.name, 
                            score: i.score,
                            scoreLabel: app.scoreLabels[i.score],
                            comment: i.comment 
                        });
                    });
                }
                
                // Add site-specific actions for current site
                if (reportScope && project.sites[reportScope]) {
                    const siteData = project.sites[reportScope];
                    
                    for (const sec in siteData) {
                        siteData[sec].forEach(i => {
                            if (i.score < 4) actions.push({ 
                                site: reportScope, 
                                type: 'Site', 
                                sec, 
                                item: i.name, 
                                score: i.score,
                                scoreLabel: app.scoreLabels[i.score],
                                comment: i.comment 
                            });
                        });
                    }
                }
            }
            
            if (actions.length) {
                html += `<table><thead><tr><th>Site/System</th><th>Type</th><th>Section</th><th>Item</th><th>Score</th><th>Action Required</th></tr></thead><tbody>`;
                actions.forEach(a => {
                    html += `<tr><td>${a.site}</td><td>${a.type}</td><td>${a.sec}</td><td>${a.item}</td><td>${a.scoreLabel}</td><td>${a.comment}</td></tr>`;
                });
                html += `</tbody></table>`;
            } else {
                html += `<p>All items scored 4 or 5. No critical issues found.</p>`;
            }
            html += `</div>`;
            
            // Section 5: Sign-off & Audit Details
            if (document.getElementById('includeSignatures')?.checked !== false) {
                html += `
                    <div class="report-section sign-off-section">
                        <h3>5. Sign-off & Audit Details</h3>
                        <p>This report confirms the completion of the OHS audit for ${document.getElementById('projectName').value} at ${reportScope === 'all' ? 'all sites' : (reportScope === 'management' ? 'management system' : reportScope)} on ${document.getElementById('inspectionDate').value}.</p>
                        <div class="signature-box">
                            <div class="signature-line"><p>Lead Auditor</p><p>${document.getElementById('leadAuditor').value}</p></div>
                            <div class="signature-line"><p>Project Director</p><p>${document.getElementById('projectDirector').value}</p></div>
                        </div>
                    </div>
                `;
            }
            
            // Close the first page content wrapper
            html += `</div>`;
            
            // Section 6: Detailed Audit Findings (starts on new page)
            html += `<div class="report-section"><h3>6. Detailed Audit Findings</h3>`;
            
            if (reportScope === 'management') {
                // Management System Audit only
                html += `<h4>Management System Audit (Project-wide)</h4>`;
                for (const sec in project.managementSystemAudit) {
                    html += `<h5>${sec}</h5><table><tr><th>Item</th><th>Score</th><th>Comments</th></tr>`;
                    project.managementSystemAudit[sec].forEach(i => {
                        html += `<tr><td>${i.name}</td><td>${app.scoreLabels[i.score]}</td><td>${i.comment}</td></tr>`;
                    });
                    html += `</table>`;
                }
            } else if (reportScope === 'all') {
                // Management System Audit (once for all sites)
                html += `<h4>Management System Audit (Project-wide)</h4>`;
                for (const sec in project.managementSystemAudit) {
                    html += `<h5>${sec}</h5><table><tr><th>Item</th><th>Score</th><th>Comments</th></tr>`;
                    project.managementSystemAudit[sec].forEach(i => {
                        html += `<tr><td>${i.name}</td><td>${app.scoreLabels[i.score]}</td><td>${i.comment}</td></tr>`;
                    });
                    html += `</table>`;
                }
                
                // Site-specific findings
                html += `<h4>Site Performance Audits</h4>`;
                for (const siteName in project.sites) {
                    html += `<h5>Site: ${siteName}</h5>`;
                    const siteData = project.sites[siteName];
                    
                    for (const sec in siteData) {
                        html += `<h6>${sec}</h6><table><tr><th>Item</th><th>Score</th><th>Comments</th></tr>`;
                        siteData[sec].forEach(i => {
                            html += `<tr><td>${i.name}</td><td>${app.scoreLabels[i.score]}</td><td>${i.comment}</td></tr>`;
                        });
                        html += `</table>`;
                    }
                }
            } else {
                // Management System Audit
                html += `<h4>Management System Audit (Project-wide)</h4>`;
                for (const sec in project.managementSystemAudit) {
                    html += `<h5>${sec}</h5><table><tr><th>Item</th><th>Score</th><th>Comments</th></tr>`;
                    project.managementSystemAudit[sec].forEach(i => {
                        html += `<tr><td>${i.name}</td><td>${app.scoreLabels[i.score]}</td><td>${i.comment}</td></tr>`;
                    });
                    html += `</table>`;
                }
                
                // Site-specific findings for the selected site
                if (reportScope && project.sites[reportScope]) {
                    html += `<h4>Site Performance Audit: ${reportScope}</h4>`;
                    const siteData = project.sites[reportScope];
                    
                    for (const sec in siteData) {
                        html += `<h5>${sec}</h5><table><tr><th>Item</th><th>Score</th><th>Comments</th></tr>`;
                        siteData[sec].forEach(i => {
                            html += `<tr><td>${i.name}</td><td>${app.scoreLabels[i.score]}</td><td>${i.comment}</td></tr>`;
                        });
                        html += `</table>`;
                    }
                }
            }
            
            html += `</div>`;
            
            return html;
        } catch (error) {
            console.error('Error generating executive report HTML:', error);
            return '<div>Error generating report. Please check the console for details.</div>';
        }
    }
    
    // Generate report
    function generateReport(reportType) {
        try {
            const prevTab = document.querySelector('.tab.active')?.dataset.tabName;
            showTab('dashboard');
            
            setTimeout(() => {
                const reportScope = document.getElementById('reportSiteSelector').value;
                let header;
                let siteName = null;
                
                if (reportScope === 'all') {
                    header = generateReportHeader("All Sites", 'all');
                } else if (reportScope === 'management') {
                    header = generateReportHeader(null, 'management');
                } else {
                    siteName = reportScope;
                    header = generateReportHeader(siteName);
                }
                
                // Get summary data using the unified function
                const summaryData = getReportSummaryData(reportScope);
                
                // Set the chart scope to match the report scope before generating charts
                let chartScope = 'all';
                if (reportScope === 'management') {
                    chartScope = 'management';
                } else if (reportScope === 'all') {
                    chartScope = 'all-sites';
                } else {
                    chartScope = 'all';
                }
                
                // Temporarily set the chart scope to match the report
                const originalScope = app.currentChartScope;
                app.currentChartScope = chartScope;
                
                // Generate report-specific chart images based on report scope
                generateReportChartImages(reportScope, siteName).then(chartImages => {
                    const reportHtml = generateExecutiveReportHtml(header, reportScope, chartImages, summaryData);
                    showModal(reportHtml);
                    
                    // Restore the original chart scope
                    app.currentChartScope = originalScope;
                    updateOverallSummary();
                    renderCharts();
                    
                    if (prevTab && prevTab !== 'dashboard') {
                        setTimeout(() => showTab(prevTab), 250);
                    }
                });
            }, 1000);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error generating report. Please check the console for details.');
        }
    }
    
    // Show modal
    function showModal(content) {
        try {
            const modal = document.getElementById('reportModal');
            const contentDiv = document.getElementById('reportContent');
            contentDiv.innerHTML = `<div contenteditable="true" class="editable-report" style="padding:20px;">${content}</div>`;
            modal.style.display = 'block';
            
            setTimeout(() => {
                document.querySelectorAll('img[data-chart]').forEach(img => {
                    const chartId = img.dataset.chart;
                    const chart = app.charts[chartId];
                    if (chart && chart.canvas) {
                        img.src = chart.canvas.toDataURL('image/png');
                    } else {
                        console.warn(`Chart ${chartId} not found or not rendered.`);
                        img.src = '';
                        img.alt = `Chart ${chartId} failed to render`;
                    }
                });
            }, 1500);
        } catch (error) {
            console.error('Error showing modal:', error);
        }
    }
    
    // Print report with charts
    function printReportWithCharts() {
        try {
            const projectName = document.getElementById('projectName').value || 'Not Specified';
            const reportScope = document.getElementById('reportSiteSelector').value;
            const siteName = reportScope === 'all' ? 'All Sites' : (reportScope === 'management' ? 'Management System' : (app.getCurrentProject()?.currentSite || 'Not Specified'));
            const date = document.getElementById('inspectionDate').value || 'Not Specified';
            
            document.getElementById('print-footer').innerHTML = `Project: ${projectName} | Site: ${siteName} | Date: ${date}`;
            
            const currentTabEl = document.querySelector('.tab.active');
            const previousTab = currentTabEl?.dataset.tabName || null;
            
            const modal = document.getElementById('reportModal');
            if (modal.style.display !== 'block') {
                generateReport('detailed');
            }
            
            showTab('dashboard');
            
            setTimeout(() => {
                // Generate report-specific chart images
                let siteNameForReport = null;
                if (reportScope !== 'all' && reportScope !== 'management') {
                    siteNameForReport = reportScope;
                }
                
                generateReportChartImages(reportScope, siteNameForReport).then(chartImages => {
                    // Update the report content with the correct chart images
                    const reportContent = document.getElementById('reportContent');
                    if (!reportContent.innerHTML) {
                        const reportScope = document.getElementById('reportSiteSelector').value;
                        let header;
                        
                        if (reportScope === 'all') {
                            header = generateReportHeader("All Sites", 'all');
                        } else if (reportScope === 'management') {
                            header = generateReportHeader(null, 'management');
                        } else {
                            header = generateReportHeader();
                        }
                        
                        const summaryData = getReportSummaryData(reportScope);
                        reportContent.innerHTML = `<div contenteditable="true" class="editable-report" style="padding:20px;">${generateExecutiveReportHtml(header, reportScope, chartImages, summaryData)}</div>`;
                    } else {
                        // Update existing chart images in the report
                        const editableReport = reportContent.querySelector('.editable-report');
                        if (editableReport) {
                            const chartContainers = editableReport.querySelectorAll('.chart-container img');
                            if (chartContainers.length >= 3) {
                                chartContainers[0].src = chartImages.ratingChart;
                                chartContainers[1].src = chartImages.distributionChart;
                                chartContainers[2].src = chartImages.managementChart;
                            }
                        }
                    }
                    
                    window.print();
                    
                    if (previousTab && previousTab !== 'dashboard') {
                        setTimeout(() => showTab(previousTab), 300);
                    }
                });
            }, 1500);
        } catch (error) {
            console.error('Error printing report with charts:', error);
            alert('Error printing report. Please check the console for details.');
        }
    }
    
    // Export report as HTML
    function exportReportAsHTML() {
        try {
            // Generate the report content
            const reportScope = document.getElementById('reportSiteSelector').value;
            let header;
            
            if (reportScope === 'all') {
                header = generateReportHeader("All Sites", 'all');
            } else if (reportScope === 'management') {
                header = generateReportHeader(null, 'management');
            } else {
                header = generateReportHeader();
            }
            
            // Generate report-specific chart images based on report scope
            let siteName = null;
            if (reportScope !== 'all' && reportScope !== 'management') {
                siteName = reportScope;
            }
            
            generateReportChartImages(reportScope, siteName).then(chartImages => {
                const summaryData = getReportSummaryData(reportScope);
                const reportHtml = generateExecutiveReportHtml(header, reportScope, chartImages, summaryData);
                
                // Create a complete HTML document with styles
                const htmlDoc = `<!DOCTYPE html>
<html>
<head>
    <title>OHS Audit Report - ${document.getElementById('projectName').value}</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        /* Chart layout styles for HTML export - matching dashboard */
        .dashboard-charts-top {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .dashboard-charts-bottom {
            margin-bottom: 30px;
        }
        
        .chart-container {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            height: 400px;
        }
        
        .chart-container.full-width {
            height: 450px;
        }
        
        .chart-container h4 {
            color: #2c3e50;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .chart-image {
            width: 100%;
            height: 300px;
            object-fit: contain;
            margin-top: 10px;
        }
        
        .chart-container.full-width .chart-image {
            height: 350px;
        }
        
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e0e6ed;
            border-radius: 10px;
        }
        
        .report-header > div:first-child {
            order: 2;
            margin-left: auto;
            flex-shrink: 0;
        }
        
        .report-logo {
            max-width: 150px;
            height: auto;
            object-fit: contain;
        }
        
        .report-header-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 0;
        }
        
        .report-title {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .report-subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 15px;
        }
        
        .report-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 14px;
        }
        
        .report-detail-label {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .report-section {
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .report-section h3 {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .summary-item {
            background: #f8f9ff;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }
        
        .summary-item .value {
            font-size: 2.5rem;
            font-weight: bold;
            display: block;
        }
        
        .summary-item .label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .colored-value {
            font-weight: bold;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        
        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        
        th {
            background: #f0f4f8;
            font-weight: bold;
        }
        
        .signature-box {
            display: flex;
            justify-content: space-around;
            gap: 40px;
            margin-top: 30px;
        }
        
        .signature-line {
            flex: 1;
            padding-top: 20px;
            border-top: 1px solid #333;
            text-align: center;
        }
        
        .executive-summary {
            margin-top: 40px;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .executive-summary h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            text-align: center;
        }
        
        /* Recommendations section styles */
        .recommendations-section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .recommendations-section h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .recommendations-section h4 {
            color: #4c51bf;
            margin: 15px 0 10px 0;
            border-bottom: 1px solid #e0e6ed;
            padding-bottom: 5px;
        }
        
        .recommendations-section ul {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        
        .recommendations-section li {
            margin-bottom: 8px;
            line-height: 1.5;
        }
        
        .recommendations-section table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .recommendations-section th, .recommendations-section td {
            border: 1px solid #e0e6ed;
            padding: 10px;
            text-align: left;
        }
        
        .recommendations-section th {
            background: #f8f9ff;
            font-weight: 600;
        }
        
        .recommendations-section select, .recommendations-section input {
            width: 100%;
            padding: 8px;
            border: 1px solid #e0e6ed;
            border-radius: 5px;
            font-family: inherit;
        }
        
        @media (max-width: 992px) {
            .dashboard-charts-top {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    ${reportHtml}
</body>
</html>`;
                
                // Create download link
                const blob = new Blob([htmlDoc], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `OHS_Audit_Report_${document.getElementById('projectName').value.replace(/\s+/g, '_')}_${reportScope === 'all' ? 'All_Sites' : (reportScope === 'management' ? 'Management_System' : (app.getCurrentProject()?.currentSite || 'Site'))}_${new Date().toISOString().split('T')[0]}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        } catch (error) {
            console.error('Error exporting report as HTML:', error);
            alert('Error exporting report as HTML. Please check the console for details.');
        }
    }
    
    // Expose functions to global scope
    window.initializeLogoUpload = initializeLogoUpload;
    window.generateReportHeader = generateReportHeader;
    window.generateReportChartImages = generateReportChartImages;
    window.generateExecutiveReportHtml = generateExecutiveReportHtml;
    window.generateReport = generateReport;
    window.showModal = showModal;
    window.printReportWithCharts = printReportWithCharts;
    window.exportReportAsHTML = exportReportAsHTML;
})();