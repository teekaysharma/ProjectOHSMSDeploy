// Chart management functions
(function() {
    // Helper function to get filtered data (excluding score 0 for calculations)
    function getFilteredDataForCalculations(data) {
        return data.filter(item => item.score > 0);
    }

    // Helper function to get complete data (including score 0 for visualization)
    function getCompleteDataForVisualization(data) {
        return data;
    }

    // Helper function to get rating from percentage
    function getRatingFromPercentage(percentage) {
        if (percentage > 90) return 'E';
        else if (percentage > 80) return 'G';
        else if (percentage > 70) return 'S';
        else if (percentage > 50) return 'L';
        else return 'U';
    }

    // Helper function to get data based on scope
    function getDataByScope(scope) {
        let data = [];
        
        if (scope === 'management') {
            // Get management data
            const project = app.getCurrentProject();
            if (project && project.managementSystemAudit) {
                for (const section in project.managementSystemAudit) {
                    data = data.concat(project.managementSystemAudit[section]);
                }
            }
        } else if (scope === 'all-sites') {
            // Get all sites data
            const project = app.getCurrentProject();
            if (project && project.sites) {
                for (const siteName in project.sites) {
                    const site = project.sites[siteName];
                    for (const section in site) {
                        data = data.concat(site[section]);
                    }
                }
            }
        } else {
            // Get current site data (default)
            const project = app.getCurrentProject();
            if (project && project.currentSite && project.sites[project.currentSite]) {
                const site = project.sites[project.currentSite];
                for (const section in site) {
                    data = data.concat(site[section]);
                }
            }
        }
        
        return data;
    }

    // Calculate overall score
    function calculateOverallScore(scope = 'all') {
        try {
            // Get data based on scope
            const data = getDataByScope(scope);
            
            // Filter out score 0 for calculations
            const filteredData = getFilteredDataForCalculations(data);
            
            if (filteredData.length === 0) {
                return {
                    score: 0,
                    percentage: 0,
                    rating: 'Unacceptable',
                    totalItems: 0,
                    totalQuestions: data.length
                };
            }
            
            // Calculate total score
            const totalScore = filteredData.reduce((sum, item) => sum + item.score, 0);
            const maxPossibleScore = filteredData.length * 5;
            const averageScore = totalScore / filteredData.length;
            const percentage = (averageScore / 5) * 100;
            
            // Get rating based on percentage
            let rating = 'Unacceptable';
            if (percentage > 90) rating = 'Excellent';
            else if (percentage > 80) rating = 'Good';
            else if (percentage > 70) rating = 'Satisfactory';
            else if (percentage > 50) rating = 'Low';
            
            return {
                score: parseFloat(averageScore.toFixed(1)),
                percentage: Math.round(percentage),
                rating,
                totalItems: filteredData.length,
                totalQuestions: data.length
            };
        } catch (error) {
            console.error('Error calculating overall score:', error);
            return {
                score: 0,
                percentage: 0,
                rating: 'Unacceptable',
                totalItems: 0,
                totalQuestions: 0
            };
        }
    }

    // Render rating chart
    function renderRatingChart(scope = 'all') {
        try {
            // Get data based on scope
            const data = getDataByScope(scope);
            
            // For calculations, filter out score 0
            const filteredData = getFilteredDataForCalculations(data);
            
            // For visualization, use complete data
            const visualizationData = getCompleteDataForVisualization(data);
            
            // Count ratings from filtered data (for accurate performance metrics)
            const ratingCounts = {
                'E': 0, 'G': 0, 'S': 0, 'L': 0, 'U': 0, 'NA': 0
            };
            
            // Calculate percentage for each item
            filteredData.forEach(item => {
                const percentage = (item.score / 5) * 100;
                const rating = getRatingFromPercentage(percentage);
                ratingCounts[rating]++;
            });
            
            // Count NA items from complete data (for visualization)
            visualizationData.forEach(item => {
                if (item.score === 0) {
                    ratingCounts['NA']++;
                }
            });
            
            // Create or update chart
            const ctx = document.getElementById('ratingChart').getContext('2d');
            
            if (app.charts.ratingChart) {
                app.charts.ratingChart.destroy();
            }
            
            app.charts.ratingChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Excellent', 'Good', 'Satisfactory', 'Low', 'Unacceptable', 'Not Applicable'],
                    datasets: [{
                        data: [
                            ratingCounts['E'],
                            ratingCounts['G'],
                            ratingCounts['S'],
                            ratingCounts['L'],
                            ratingCounts['U'],
                            ratingCounts['NA']
                        ],
                        backgroundColor: [
                            '#00b894', // Excellent - Green
                            '#38a169', // Good - Light Green
                            '#d69e2e', // Satisfactory - Yellow
                            '#dd6b20', // Low - Orange
                            '#c53030', // Unacceptable - Red
                            '#a0aec0'  // Not Applicable - Grey
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                        return data.labels.map((label, i) => {
                                            const value = data.datasets[0].data[i];
                                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                            
                                            return {
                                                text: `${label}: ${value} (${percentage}%)`,
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
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                    
                                    if (label === 'Not Applicable') {
                                        return `${label}: ${value} questions (${percentage}%) - Not included in performance calculations`;
                                    }
                                    return `${label}: ${value} questions (${percentage}%)`;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Performance Distribution (Not Applicable items shown in grey)',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            });
            
            console.log('Rating chart rendered successfully');
        } catch (error) {
            console.error('Error rendering rating chart:', error);
        }
    }

    // Render distribution chart
    function renderDistributionChart(scope = 'all') {
        try {
            // Get data based on scope
            const data = getDataByScope(scope);
            
            // For calculations, filter out score 0
            const filteredData = getFilteredDataForCalculations(data);
            
            // For visualization, use complete data
            const visualizationData = getCompleteDataForVisualization(data);
            
            // Count scores from filtered data (for accurate performance metrics)
            const scoreCounts = {
                '5': 0, '4': 0, '3': 0, '2': 0, '1': 0, '0': 0
            };
            
            filteredData.forEach(item => {
                scoreCounts[item.score]++;
            });
            
            // Count score 0 items from complete data (for visualization)
            visualizationData.forEach(item => {
                if (item.score === 0) {
                    scoreCounts['0']++;
                }
            });
            
            // Create or update chart
            const ctx = document.getElementById('distributionChart').getContext('2d');
            
            if (app.charts.distributionChart) {
                app.charts.distributionChart.destroy();
            }
            
            app.charts.distributionChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Best Practice (5)', 'Conformance (4)', 'Improvement (3)', 'Minor NC (2)', 'Major NC (1)', 'Not Applicable (0)'],
                    datasets: [{
                        label: 'Number of Questions',
                        data: [
                            scoreCounts['5'],
                            scoreCounts['4'],
                            scoreCounts['3'],
                            scoreCounts['2'],
                            scoreCounts['1'],
                            scoreCounts['0']
                        ],
                        backgroundColor: [
                            '#00b894', // Best Practice - Green
                            '#38a169', // Conformance - Light Green
                            '#d69e2e', // Improvement - Yellow
                            '#dd6b20', // Minor NC - Orange
                            '#c53030', // Major NC - Red
                            '#a0aec0'  // Not Applicable - Grey
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Questions'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.raw || 0;
                                    const index = context.dataIndex;
                                    
                                    if (index === 5) { // Not Applicable
                                        return `${label}: ${value} questions - Not included in performance calculations`;
                                    }
                                    return `${label}: ${value} questions`;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Score Distribution (Not Applicable items shown in grey)',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            });
            
            console.log('Distribution chart rendered successfully');
        } catch (error) {
            console.error('Error rendering distribution chart:', error);
        }
    }

    // Render management chart
    function renderManagementChart(scope = 'all') {
        try {
            // Get data based on scope
            const data = getDataByScope(scope);
            
            // For calculations, filter out score 0
            const filteredData = getFilteredDataForCalculations(data);
            
            // For visualization, use complete data
            const visualizationData = getCompleteDataForVisualization(data);
            
            // Group data by audit type (management vs site)
            const auditTypes = {
                'Management System': [],
                'Site Performance': []
            };
            
            // This is a simplified approach - you may need to adjust based on your data structure
            // For now, we'll assume all data is from the current scope
            if (scope === 'management') {
                auditTypes['Management System'] = visualizationData;
            } else {
                auditTypes['Site Performance'] = visualizationData;
            }
            
            // Calculate average scores for each audit type (excluding score 0)
            const auditTypeScores = {};
            for (const type in auditTypes) {
                const typeData = getFilteredDataForCalculations(auditTypes[type]);
                if (typeData.length > 0) {
                    const totalScore = typeData.reduce((sum, item) => sum + item.score, 0);
                    const averageScore = totalScore / typeData.length;
                    auditTypeScores[type] = parseFloat(averageScore.toFixed(1));
                } else {
                    auditTypeScores[type] = 0;
                }
            }
            
            // Create or update chart
            const ctx = document.getElementById('managementChart').getContext('2d');
            
            if (app.charts.managementChart) {
                app.charts.managementChart.destroy();
            }
            
            app.charts.managementChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(auditTypeScores),
                    datasets: [{
                        label: 'Average Score',
                        data: Object.values(auditTypeScores),
                        backgroundColor: [
                            '#4299e1', // Management System - Blue
                            '#48bb78'  // Site Performance - Green
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            title: {
                                display: true,
                                text: 'Average Score'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value} out of 5`;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Performance by Audit Type (excluding Not Applicable items)',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            });
            
            console.log('Management chart rendered successfully');
        } catch (error) {
            console.error('Error rendering management chart:', error);
        }
    }

    // Render site comparison chart
    function renderSiteComparisonChart() {
        try {
            const comparisonSiteSelector = document.getElementById('comparisonSiteSelector');
            const includeManagementAudit = document.getElementById('includeManagementAudit');
            const chartType = document.querySelector('.chart-type-selector button.active')?.dataset.chartType || 'stacked';
            
            if (!comparisonSiteSelector) return;
            
            const selectedSites = Array.from(comparisonSiteSelector.selectedOptions).map(option => option.value);
            
            if (selectedSites.length < 2) {
                document.getElementById('noSiteComparisonData').style.display = 'block';
                if (app.charts.siteComparisonChart) {
                    app.charts.siteComparisonChart.destroy();
                }
                return;
            }
            
            document.getElementById('noSiteComparisonData').style.display = 'none';
            
            const project = app.getCurrentProject();
            if (!project || !project.sites) return;
            
            const labels = [];
            const datasets = [];
            const colors = app.siteColors || [];
            
            // Get all unique sections from all sites
            const allSections = new Set();
            for (const siteName in project.sites) {
                if (selectedSites.includes(siteName)) {
                    const site = project.sites[siteName];
                    for (const section in site) {
                        allSections.add(section);
                    }
                }
            }
            
            // Convert to array and sort
            const sectionArray = Array.from(allSections).sort();
            
            // Create labels
            labels.push(...sectionArray);
            
            // Include management audit if checked
            if (includeManagementAudit && includeManagementAudit.checked) {
                labels.unshift('Management System');
            }
            
            // Create datasets for each site
            selectedSites.forEach((siteName, index) => {
                const site = project.sites[siteName];
                const data = [];
                
                // Add management audit data if included
                if (includeManagementAudit && includeManagementAudit.checked) {
                    const managementData = getFilteredDataForCalculations(
                        Object.values(project.managementSystemAudit || {}).flat()
                    );
                    if (managementData.length > 0) {
                        const totalScore = managementData.reduce((sum, item) => sum + item.score, 0);
                        const averageScore = totalScore / managementData.length;
                        data.push(parseFloat(averageScore.toFixed(1)));
                    } else {
                        data.push(0);
                    }
                }
                
                // Add site data for each section
                sectionArray.forEach(section => {
                    const sectionData = getFilteredDataForCalculations(site[section] || []);
                    if (sectionData.length > 0) {
                        const totalScore = sectionData.reduce((sum, item) => sum + item.score, 0);
                        const averageScore = totalScore / sectionData.length;
                        data.push(parseFloat(averageScore.toFixed(1)));
                    } else {
                        data.push(0);
                    }
                });
                
                datasets.push({
                    label: siteName,
                    data: data,
                    backgroundColor: colors[index % colors.length] + '80', // Add transparency
                    borderColor: colors[index % colors.length],
                    borderWidth: 1
                });
            });
            
            // Create or update chart
            const ctx = document.getElementById('siteComparisonChart').getContext('2d');
            
            if (app.charts.siteComparisonChart) {
                app.charts.siteComparisonChart.destroy();
            }
            
            const chartConfig = {
                type: chartType === 'radar' ? 'radar' : 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: chartType === 'radar' ? {
                        r: {
                            beginAtZero: true,
                            max: 5
                        }
                    } : {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            title: {
                                display: true,
                                text: 'Average Score'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Site Performance Comparison (excluding Not Applicable items)',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            };
            
            if (chartType === 'stacked') {
                chartConfig.options.scales.x = { stacked: true };
                chartConfig.options.scales.y = { 
                    stacked: true, 
                    beginAtZero: true, 
                    max: 5,
                    title: {
                        display: true,
                        text: 'Average Score'
                    }
                };
            }
            
            app.charts.siteComparisonChart = new Chart(ctx, chartConfig);
            
            console.log('Site comparison chart rendered successfully');
        } catch (error) {
            console.error('Error rendering site comparison chart:', error);
        }
    }

    // Update dashboard
    function updateDashboard() {
        try {
            // Get current chart scope
            const scope = app.currentChartScope || 'all';
            
            // Calculate overall score using filtered data
            const overallScore = calculateOverallScore(scope);
            
            // Update dashboard summary
            const overallScoreElement = document.getElementById('overallScore');
            const overallPercentageElement = document.getElementById('overallPercentage');
            const overallRatingElement = document.getElementById('overallRating');
            const totalItemsElement = document.getElementById('totalItemsInspected');
            
            if (overallScoreElement) overallScoreElement.textContent = overallScore.score;
            if (overallPercentageElement) overallPercentageElement.textContent = `${overallScore.percentage}%`;
            if (overallRatingElement) {
                overallRatingElement.textContent = overallScore.rating;
                const ratingDetails = app.getRatingDetails(overallScore.percentage);
                overallRatingElement.style.color = ratingDetails.color;
            }
            if (totalItemsElement) {
                totalItemsElement.textContent = `${overallScore.totalItems} of ${overallScore.totalQuestions}`;
            }
            
            // Render charts
            renderRatingChart(scope);
            renderDistributionChart(scope);
            renderManagementChart(scope);
            
            // Update audit status indicators
            updateAuditStatusIndicators();
            
            console.log('Dashboard updated successfully');
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    // Update audit status indicators
    function updateAuditStatusIndicators() {
        try {
            const project = app.getCurrentProject();
            if (!project) return;
            
            // Update management audit status
            const managementStatus = document.getElementById('managementAuditStatus');
            if (managementStatus) {
                const managementData = Object.values(project.managementSystemAudit || {}).flat();
                const filteredManagementData = getFilteredDataForCalculations(managementData);
                
                if (filteredManagementData.length === 0) {
                    managementStatus.className = 'audit-status-indicator not-started';
                    managementStatus.title = 'Management audit not started';
                } else {
                    const totalScore = filteredManagementData.reduce((sum, item) => sum + item.score, 0);
                    const maxPossibleScore = filteredManagementData.length * 5;
                    const percentage = (totalScore / maxPossibleScore) * 100;
                    const rating = app.getRatingDetails(percentage);
                    
                    managementStatus.className = `audit-status-indicator ${rating.text.toLowerCase()}`;
                    managementStatus.title = `Management audit: ${rating.text} (${Math.round(percentage)}%)`;
                }
            }
            
            // Update site audit status
            const siteStatus = document.getElementById('siteAuditStatus');
            if (siteStatus && project.currentSite && project.sites[project.currentSite]) {
                const siteData = Object.values(project.sites[project.currentSite]).flat();
                const filteredSiteData = getFilteredDataForCalculations(siteData);
                
                if (filteredSiteData.length === 0) {
                    siteStatus.className = 'audit-status-indicator not-started';
                    siteStatus.title = 'Site audit not started';
                } else {
                    const totalScore = filteredSiteData.reduce((sum, item) => sum + item.score, 0);
                    const maxPossibleScore = filteredSiteData.length * 5;
                    const percentage = (totalScore / maxPossibleScore) * 100;
                    const rating = app.getRatingDetails(percentage);
                    
                    siteStatus.className = `audit-status-indicator ${rating.text.toLowerCase()}`;
                    siteStatus.title = `Site audit: ${rating.text} (${Math.round(percentage)}%)`;
                }
            }
            
            console.log('Audit status indicators updated successfully');
        } catch (error) {
            console.error('Error updating audit status indicators:', error);
        }
    }

    // Set chart scope
    function setChartScope(scope) {
        app.currentChartScope = scope;
        updateDashboard();
    }

    // Initialize event listeners for chart scope buttons
    function initializeChartScopeListeners() {
        try {
            // Rating chart scope buttons
            const ratingScopeButtons = [
                'ratingChartScopeAll',
                'ratingChartScopeManagement',
                'ratingChartScopeAllSites'
            ];
            
            ratingScopeButtons.forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.addEventListener('click', () => {
                        // Update active state
                        ratingScopeButtons.forEach(id => {
                            const btn = document.getElementById(id);
                            if (btn) btn.classList.remove('active');
                        });
                        button.classList.add('active');
                        
                        // Set scope and update dashboard
                        if (buttonId.includes('All')) {
                            setChartScope('all');
                        } else if (buttonId.includes('Management')) {
                            setChartScope('management');
                        } else if (buttonId.includes('AllSites')) {
                            setChartScope('all-sites');
                        }
                    });
                }
            });
            
            // Distribution chart scope buttons
            const distributionScopeButtons = [
                'distributionChartScopeAll',
                'distributionChartScopeManagement',
                'distributionChartScopeAllSites'
            ];
            
            distributionScopeButtons.forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.addEventListener('click', () => {
                        // Update active state
                        distributionScopeButtons.forEach(id => {
                            const btn = document.getElementById(id);
                            if (btn) btn.classList.remove('active');
                        });
                        button.classList.add('active');
                        
                        // Set scope and update dashboard
                        if (buttonId.includes('All')) {
                            setChartScope('all');
                        } else if (buttonId.includes('Management')) {
                            setChartScope('management');
                        } else if (buttonId.includes('AllSites')) {
                            setChartScope('all-sites');
                        }
                    });
                }
            });
            
            // Management chart scope buttons
            const managementScopeButtons = [
                'chartScopeAll',
                'chartScopeManagement',
                'chartScopeAllSites'
            ];
            
            managementScopeButtons.forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.addEventListener('click', () => {
                        // Update active state
                        managementScopeButtons.forEach(id => {
                            const btn = document.getElementById(id);
                            if (btn) btn.classList.remove('active');
                        });
                        button.classList.add('active');
                        
                        // Set scope and update dashboard
                        if (buttonId.includes('All')) {
                            setChartScope('all');
                        } else if (buttonId.includes('Management')) {
                            setChartScope('management');
                        } else if (buttonId.includes('AllSites')) {
                            setChartScope('all-sites');
                        }
                    });
                }
            });
            
            console.log('Chart scope listeners initialized successfully');
        } catch (error) {
            console.error('Error initializing chart scope listeners:', error);
        }
    }

    // Initialize chart management
    function initializeChartManagement() {
        try {
            // Initialize event listeners
            initializeChartScopeListeners();
            
            // Set default scope
            app.currentChartScope = 'all';
            
            // Update dashboard
            updateDashboard();
            
            console.log('Chart management initialized successfully');
        } catch (error) {
            console.error('Error initializing chart management:', error);
        }
    }

    // Expose functions to global scope
    window.renderRatingChart = renderRatingChart;
    window.renderDistributionChart = renderDistributionChart;
    window.renderManagementChart = renderManagementChart;
    window.renderSiteComparisonChart = renderSiteComparisonChart;
    window.updateDashboard = updateDashboard;
    window.setChartScope = setChartScope;
    window.initializeChartManagement = initializeChartManagement;
})();