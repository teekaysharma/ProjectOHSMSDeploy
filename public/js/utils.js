// Utility functions
const app = {
    // Global variables
    inspectionData: {
        projects: {
            "Default Project": {
                managementSystemAudit: {},
                sites: {
                    "Default Site": {}
                },
                currentSite: "Default Site"
            }
        },
        currentProject: "Default Project"
    },
    
    charts: {
        managementChart: null,
        ratingChart: null,
        distributionChart: null,
        siteComparisonChart: null
    },
    
    currentChartScope: 'all',
    companyLogo: null,
    customRecommendations: null,
    
    // Score labels mapping
    scoreLabels: {
        0: "0 - Not Applicable/Not Observed",
        1: "1 - Major Non-Conformance",
        2: "2 - Minor Non-Conformance",
        3: "3 - Observation/Improvement Opportunity",
        4: "4 - Conformance",
        5: "5 - Best Practice"
    },
    
    // Rating details mapping
    ratingDetails: {
        'E': { text: 'Excellent', color: '#00b894' },
        'G': { text: 'Good', color: '#38a169' },
        'S': { text: 'Satisfactory', color: '#d69e2e' },
        'L': { text: 'Low', color: '#dd6b20' },
        'U': { text: 'Unacceptable', color: '#c53030' }
    },
    
    // Master configuration - START EMPTY
    masterConfig: {
        management: {},
        site: {}
    },
    
    // Site colors for charts
    siteColors: [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
        '#fad0c4', '#ffd1ff', '#c2e9fb', '#a1c4fd'
    ],
    
    // Helper function to get current project
    getCurrentProject() {
        try {
            if (!app.inspectionData || !app.inspectionData.currentProject) {
                console.warn('No current project set');
                return null;
            }
            return app.inspectionData.projects[app.inspectionData.currentProject] || null;
        } catch (error) {
            console.error('Error getting current project:', error);
            return null;
        }
    },
    
    // Helper function to get current site data
    getCurrentSiteData() {
        try {
            const project = app.getCurrentProject();
            if (!project || !project.currentSite || !project.sites || !project.sites[project.currentSite]) {
                console.warn('No current site set or site data missing');
                return { management: {}, site: {} };
            }
            return {
                management: project.managementSystemAudit || {},
                site: project.sites[project.currentSite] || {}
            };
        } catch (error) {
            console.error('Error getting current site data:', error);
            return { management: {}, site: {} };
        }
    },
    
    // Helper function to get rating details based on percentage
    getRatingDetails(percentage) {
        try {
            if (percentage > 90) return { text: 'Excellent', color: '#00b894' };
            else if (percentage > 80) return { text: 'Good', color: '#38a169' };
            else if (percentage > 70) return { text: 'Satisfactory', color: '#d69e2e' };
            else if (percentage > 50) return { text: 'Low', color: '#dd6b20' };
            else return { text: 'Unacceptable', color: '#c53030' };
        } catch (error) {
            console.error('Error getting rating details:', error);
            return { text: 'Unknown', color: '#718096' };
        }
    },
    
    // Function to check if questions have been imported
    hasQuestions() {
        try {
            // Check if masterConfig exists
            if (!app.masterConfig) {
                console.warn('Master configuration not found');
                return false;
            }
            
            // Check management questions
            let hasManagementQuestions = false;
            if (app.masterConfig.management) {
                const managementSections = Object.keys(app.masterConfig.management);
                hasManagementQuestions = managementSections.length > 0 && 
                                        managementSections.some(section => 
                                            Array.isArray(app.masterConfig.management[section]) && 
                                            app.masterConfig.management[section].length > 0
                                        );
            }
            
            // Check site questions
            let hasSiteQuestions = false;
            if (app.masterConfig.site) {
                const siteSections = Object.keys(app.masterConfig.site);
                hasSiteQuestions = siteSections.length > 0 && 
                                 siteSections.some(section => 
                                     Array.isArray(app.masterConfig.site[section]) && 
                                     app.masterConfig.site[section].length > 0
                                 );
            }
            
            const result = hasManagementQuestions || hasSiteQuestions;
            console.log('hasQuestions check result:', { 
                hasManagementQuestions, 
                hasSiteQuestions, 
                result,
                managementSections: Object.keys(app.masterConfig.management || {}),
                siteSections: Object.keys(app.masterConfig.site || {})
            });
            
            return result;
        } catch (error) {
            console.error('Error checking if questions exist:', error);
            return false;
        }
    },
    
    // Function to get question counts
    getQuestionCounts() {
        try {
            let managementCount = 0;
            let siteCount = 0;
            
            if (app.masterConfig && app.masterConfig.management) {
                for (const section in app.masterConfig.management) {
                    if (Array.isArray(app.masterConfig.management[section])) {
                        managementCount += app.masterConfig.management[section].length;
                    }
                }
            }
            
            if (app.masterConfig && app.masterConfig.site) {
                for (const section in app.masterConfig.site) {
                    if (Array.isArray(app.masterConfig.site[section])) {
                        siteCount += app.masterConfig.site[section].length;
                    }
                }
            }
            
            return { management: managementCount, site: siteCount };
        } catch (error) {
            console.error('Error getting question counts:', error);
            return { management: 0, site: 0 };
        }
    },
    
    // Function to reset master configuration
    resetMasterConfig() {
        try {
            console.log('Resetting master configuration');
            app.masterConfig = {
                management: {},
                site: {}
            };
            console.log('Master configuration reset successfully');
        } catch (error) {
            console.error('Error resetting master configuration:', error);
        }
    }
};

// Add this helper function to utils.js
function createScoreDropdown(selectedValue = '') {
    const scoreOptions = [
        { value: '0', text: '0 - Not Applicable/Not Observed: Item does not apply or was not observed during audit' },
        { value: '1', text: '1 - Major Non-Conformance: Serious deficiency requiring immediate corrective action' },
        { value: '2', text: '2 - Minor Non-Conformance: Deficiency requiring corrective action in specified timeframe' },
        { value: '3', text: '3 - Observation/Improvement Opportunity: Area for improvement but not a non-conformance' },
        { value: '4', text: '4 - Conformance: Meets requirements' },
        { value: '5', text: '5 - Best Practice: Exceeds requirements and demonstrates excellence' }
    ];
    
    const select = document.createElement('select');
    select.className = 'score-select';
    
    scoreOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.value === selectedValue) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });
    
    return select;
}

// DOM helper functions
const domHelpers = {
    // Check if element exists
    elementExists(id) {
        try {
            return document.getElementById(id) !== null;
        } catch (error) {
            console.error(`Error checking if element "${id}" exists:`, error);
            return false;
        }
    },
    
    // Get element safely
    getElement(id) {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.error(`Error getting element "${id}":`, error);
            return null;
        }
    },
    
    // Add event listener safely
    addEventListener(elementId, eventType, handler) {
        try {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener(eventType, handler);
                return true;
            }
            console.warn(`Element with id "${elementId}" not found`);
            return false;
        } catch (error) {
            console.error(`Error adding event listener to element "${elementId}":`, error);
            return false;
        }
    },
    
    // Create element safely
    createElement(tagName, attributes = {}, content = '') {
        try {
            const element = document.createElement(tagName);
            
            // Set attributes
            for (const attr in attributes) {
                if (attr === 'className') {
                    element.className = attributes[attr];
                } else if (attr === 'innerHTML') {
                    element.innerHTML = attributes[attr];
                } else {
                    element.setAttribute(attr, attributes[attr]);
                }
            }
            
            // Set content if provided
            if (content) {
                element.textContent = content;
            }
            
            return element;
        } catch (error) {
            console.error(`Error creating element "${tagName}":`, error);
            return null;
        }
    }
};

// Expose app and domHelpers to global scope
window.app = app;
window.domHelpers = domHelpers;