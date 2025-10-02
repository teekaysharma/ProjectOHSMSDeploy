// UI management functions
(function() {
    // Initialize UI Management
    function initializeUI() {
        console.log('Initializing UI Management...');
        
        // Initialize tab functionality
        initializeTabs();
        
        // Initialize scoring category tabs
        initializeScoringCategories();
        
        // Initialize question type tabs
        initializeQuestionTabs();
        
        // Initialize modal functionality
        initializeModal();
        
        // Initialize recommendations editing
        initializeRecommendationsEditing();
        
        // Show dashboard by default
        showTab('dashboard');
        
        console.log('UI Management initialized successfully');
    }
    
    // Initialize tab functionality
    function initializeTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tabName;
                if (tabName) {
                    showTab(tabName);
                }
            });
        });
    }
    
    // Initialize scoring category tabs
    function initializeScoringCategories() {
        const categoryTabs = document.querySelectorAll('.scoring-category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                if (category) {
                    showScoringCategory(category);
                }
            });
        });
    }
    
    // Initialize question type tabs
    function initializeQuestionTabs() {
        // This will be called when question management is rendered
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('question-tab')) {
                const questionType = e.target.dataset.questionType;
                if (questionType) {
                    showQuestionType(questionType);
                }
            }
        });
    }
    
    // Initialize modal functionality
    function initializeModal() {
        const modal = document.getElementById('reportModal');
        const closeBtn = document.getElementById('closeModalBtn');
        const printBtn = document.getElementById('printReportBtn');
        const resetBtn = document.getElementById('resetReportBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });
        }
        
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                if (typeof printReportWithCharts === 'function') {
                    printReportWithCharts();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (typeof generateReport === 'function') {
                    generateReport('detailed');
                }
            });
        }
        
        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    // Initialize recommendations editing
    function initializeRecommendationsEditing() {
        const editBtn = document.getElementById('editRecommendationsBtn');
        const saveBtn = document.getElementById('saveRecommendationsBtn');
        const cancelBtn = document.getElementById('cancelEditRecommendationsBtn');
        const regenerateBtn = document.getElementById('regenerateRecommendationsBtn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                if (typeof enableRecommendationsEdit === 'function') {
                    enableRecommendationsEdit();
                }
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                if (typeof saveRecommendationsEdit === 'function') {
                    saveRecommendationsEdit();
                }
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (typeof cancelRecommendationsEdit === 'function') {
                    cancelRecommendationsEdit();
                }
            });
        }
        
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => {
                if (typeof regenerateRecommendations === 'function') {
                    regenerateRecommendations();
                }
            });
        }
    }
    
    // Show tab function
    function showTab(tabName) {
        try {
            console.log(`Showing tab: ${tabName}`);
            
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            const selectedContent = document.getElementById(tabName);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            // Add active class to selected tab
            const selectedTab = document.querySelector(`[data-tab-name="${tabName}"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Render tab-specific content
            switch (tabName) {
                case 'dashboard':
                    if (typeof updateDashboard === 'function') {
                        updateDashboard();
                    }
                    if (typeof loadCustomRecommendations === 'function') {
                        loadCustomRecommendations();
                    }
                    if (typeof updateDashboardExecutiveSummary === 'function') {
                        updateDashboardExecutiveSummary();
                    }
                    break;
                case 'management':
                    if (typeof renderManagementTab === 'function') {
                        renderManagementTab();
                    }
                    break;
                case 'site-performance':
                    if (typeof renderSitePerformanceTab === 'function') {
                        renderSitePerformanceTab();
                    }
                    break;
                case 'reports':
                    if (typeof updateReportSiteSelector === 'function') {
                        updateReportSiteSelector();
                    }
                    if (typeof updateComparisonSiteSelector === 'function') {
                        updateComparisonSiteSelector();
                    }
                    break;
                case 'master':
                    if (typeof renderMasterConfigTab === 'function') {
                        renderMasterConfigTab();
                    }
                    if (typeof renderQuestionManagement === 'function') {
                        renderQuestionManagement();
                    }
                    if (typeof renderSiteList === 'function') {
                        renderSiteList();
                    }
                    // Force re-render of question management after loading data
                    setTimeout(() => renderQuestionManagement(), 100);
                    break;
            }
            
            console.log(`Tab ${tabName} shown successfully`);
        } catch (error) {
            console.error(`Error showing tab ${tabName}:`, error);
        }
    }
    
    // Show scoring category
    function showScoringCategory(category) {
        try {
            // Remove active class from all category tabs
            const categoryTabs = document.querySelectorAll('.scoring-category-tab');
            categoryTabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Hide all category contents
            const categoryContents = document.querySelectorAll('.scoring-category-content');
            categoryContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to selected category tab
            const selectedTab = document.querySelector(`[data-category="${category}"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Show selected category content
            const selectedContent = document.getElementById(category);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            console.log(`Scoring category ${category} shown successfully`);
        } catch (error) {
            console.error(`Error showing scoring category ${category}:`, error);
        }
    }
    
    // Show question type
    function showQuestionType(questionType) {
        try {
            // Remove active class from all question tabs
            const questionTabs = document.querySelectorAll('.question-tab');
            questionTabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Hide all question contents
            const questionContents = document.querySelectorAll('.question-content');
            questionContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to selected question tab
            const selectedTab = document.querySelector(`[data-question-type="${questionType}"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Show selected question content
            const selectedContent = document.getElementById(`${questionType}Questions`);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            console.log(`Question type ${questionType} shown successfully`);
        } catch (error) {
            console.error(`Error showing question type ${questionType}:`, error);
        }
    }
    
    // Render management tab
    function renderManagementTab() {
        try {
            console.log('Rendering management tab...');
            const container = document.getElementById('managementElements');
            if (!container) return;
            
            container.innerHTML = '';
            
            const project = app.getCurrentProject();
            console.log('Current project:', project);
            console.log('Master config management sections:', Object.keys(app.masterConfig.management || {}));
            console.log('Has questions:', app.hasQuestions());
            
            if (!project) {
                console.log('No project found, creating default project...');
                // Create default project if none exists
                if (!app.inspectionData.projects['Default Project']) {
                    app.inspectionData.projects['Default Project'] = {
                        managementSystemAudit: {},
                        sites: { 'Default Site': {} },
                        currentSite: 'Default Site'
                    };
                    app.inspectionData.currentProject = 'Default Project';
                    if (typeof saveData === 'function') saveData();
                }
                return;
            }
            
            // Check if there are management questions
            if (!app.masterConfig.management || Object.keys(app.masterConfig.management).length === 0) {
                console.log('No management questions found in master config');
                container.innerHTML = /* html */ `
                    <div class="no-questions-notice">
                        <div class="notice-icon">📋</div>
                        <h4>No Management Questions Available</h4>
                        <p>To get started, please go to the System Settings tab and either:</p>
                        <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                            <li>Load the default template</li>
                            <li>Import a custom configuration</li>
                            <li>Add questions manually</li>
                        </ul>
                        <button class="btn btn-green" onclick="showTab('master')">Go to System Settings</button>
                    </div>
                `;
                return;
            }
            
            console.log('Found management sections:', Object.keys(app.masterConfig.management));
            
            // Render management system audit sections
            for (const section in app.masterConfig.management) {
                console.log(`Processing section: ${section} with questions:`, app.masterConfig.management[section]);
                
                const focusElement = document.createElement('div');
                focusElement.className = 'focus-element';
                
                const sectionHeader = document.createElement('h3');
                sectionHeader.textContent = section;
                focusElement.appendChild(sectionHeader);
                
                // Get or initialize section data
                if (!project.managementSystemAudit[section]) {
                    console.log(`Initializing section data for: ${section}`);
                    project.managementSystemAudit[section] = app.masterConfig.management[section].map(name => ({
                        name, 
                        score: 0, 
                        comment: ''
                    }));
                }
                
                // Render items in this section
                project.managementSystemAudit[section].forEach((item, index) => {
                    console.log(`Rendering item: ${item.name} with score: ${item.score}`);
                    
                    const inspectionItem = document.createElement('div');
                    inspectionItem.className = 'inspection-item';
                    
                    const itemHeader = document.createElement('div');
                    itemHeader.className = 'item-header';
                    
                    const itemName = document.createElement('div');
                    itemName.className = 'item-name';
                    itemName.textContent = item.name;
                    
                    const scoreInput = document.createElement('div');
                    scoreInput.className = 'score-input';
                    
                    const scoreSelect = document.createElement('select');
                    scoreSelect.className = `score-select score-${item.score}`;
                    
                    const scoreOptions = [
                        { value: '0', text: '0 - Not Applicable/Not Observed' },
                        { value: '1', text: '1 - Major Non-Conformance' },
                        { value: '2', text: '2 - Minor Non-Conformance' },
                        { value: '3', text: '3 - Observation/Improvement Opportunity' },
                        { value: '4', text: '4 - Conformance' },
                        { value: '5', text: '5 - Best Practice' }
                    ];
                    
                    scoreOptions.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.value;
                        optionElement.textContent = option.text;
                        if (option.value === item.score.toString()) {
                            optionElement.selected = true;
                        }
                        scoreSelect.appendChild(optionElement);
                    });
                    
                    scoreSelect.addEventListener('change', (e) => {
                        const newScore = parseInt(e.target.value);
                        project.managementSystemAudit[section][index].score = newScore;
                        
                        // Update score class
                        scoreSelect.className = `score-select score-${newScore}`;
                        
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        // Update dashboard, charts, and recommendations after score change
                        updateAllDashboardComponents();
                    });
                    
                    scoreInput.appendChild(scoreSelect);
                    
                    itemHeader.appendChild(itemName);
                    itemHeader.appendChild(scoreInput);
                    
                    const commentsInput = document.createElement('textarea');
                    commentsInput.className = 'comments-input';
                    commentsInput.placeholder = 'Add comments or observations...';
                    commentsInput.value = item.comment || '';
                    commentsInput.addEventListener('input', (e) => {
                        project.managementSystemAudit[section][index].comment = e.target.value;
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        // Update recommendations when comments change
                        if (typeof renderDashboardRecommendations === 'function') {
                            renderDashboardRecommendations();
                        }
                    });
                    
                    inspectionItem.appendChild(itemHeader);
                    inspectionItem.appendChild(commentsInput);
                    focusElement.appendChild(inspectionItem);
                });
                
                container.appendChild(focusElement);
            }
            
            console.log('Management tab rendered successfully');
        } catch (error) {
            console.error('Error rendering management tab:', error);
        }
    }
    
    // Render site performance tab
    function renderSitePerformanceTab() {
        try {
            console.log('Rendering site performance tab...');
            const container = document.getElementById('sitePerformanceAudit');
            if (!container) return;
            
            container.innerHTML = '';
            
            const project = app.getCurrentProject();
            console.log('Current project:', project);
            console.log('Master config site sections:', Object.keys(app.masterConfig.site || {}));
            console.log('Current site:', project?.currentSite);
            
            if (!project) {
                console.log('No project found for site performance');
                container.innerHTML = '<p>No project selected. Please select or create a project first.</p>';
                return;
            }
            
            if (!project.currentSite) {
                console.log('No current site selected');
                container.innerHTML = '<p>Please select a site to begin the audit.</p>';
                return;
            }
            
            // Check if there are site questions
            if (!app.masterConfig.site || Object.keys(app.masterConfig.site).length === 0) {
                console.log('No site questions found in master config');
                container.innerHTML = /* html */ `
                    <div class="no-questions-notice">
                        <div class="notice-icon">🏗️</div>
                        <h4>No Site Performance Questions Available</h4>
                        <p>To get started, please go to the System Settings tab and either:</p>
                        <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                            <li>Load the default template</li>
                            <li>Import a custom configuration</li>
                            <li>Add questions manually</li>
                        </ul>
                        <button class="btn btn-green" onclick="showTab('master')">Go to System Settings</button>
                    </div>
                `;
                return;
            }
            
            console.log('Found site sections:', Object.keys(app.masterConfig.site));
            
            // Initialize site data if it doesn't exist
            if (!project.sites[project.currentSite]) {
                console.log(`Initializing site data for: ${project.currentSite}`);
                project.sites[project.currentSite] = {};
            }
            
            // Render site performance audit sections
            for (const section in app.masterConfig.site) {
                console.log(`Processing site section: ${section} with questions:`, app.masterConfig.site[section]);
                
                const focusElement = document.createElement('div');
                focusElement.className = 'focus-element';
                
                const sectionHeader = document.createElement('h3');
                sectionHeader.textContent = section;
                focusElement.appendChild(sectionHeader);
                
                // Get or initialize section data
                if (!project.sites[project.currentSite][section]) {
                    console.log(`Initializing site section data for: ${section}`);
                    project.sites[project.currentSite][section] = app.masterConfig.site[section].map(name => ({
                        name, 
                        score: 0, 
                        comment: ''
                    }));
                }
                
                // Render items in this section
                project.sites[project.currentSite][section].forEach((item, index) => {
                    console.log(`Rendering site item: ${item.name} with score: ${item.score}`);
                    
                    const inspectionItem = document.createElement('div');
                    inspectionItem.className = 'inspection-item';
                    
                    const itemHeader = document.createElement('div');
                    itemHeader.className = 'item-header';
                    
                    const itemName = document.createElement('div');
                    itemName.className = 'item-name';
                    itemName.textContent = item.name;
                    
                    const scoreInput = document.createElement('div');
                    scoreInput.className = 'score-input';
                    
                    const scoreSelect = document.createElement('select');
                    scoreSelect.className = `score-select score-${item.score}`;
                    
                    const scoreOptions = [
                        { value: '0', text: '0 - Not Applicable/Not Observed' },
                        { value: '1', text: '1 - Major Non-Conformance' },
                        { value: '2', text: '2 - Minor Non-Conformance' },
                        { value: '3', text: '3 - Observation/Improvement Opportunity' },
                        { value: '4', text: '4 - Conformance' },
                        { value: '5', text: '5 - Best Practice' }
                    ];
                    
                    scoreOptions.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.value;
                        optionElement.textContent = option.text;
                        if (option.value === item.score.toString()) {
                            optionElement.selected = true;
                        }
                        scoreSelect.appendChild(optionElement);
                    });
                    
                    scoreSelect.addEventListener('change', (e) => {
                        const newScore = parseInt(e.target.value);
                        project.sites[project.currentSite][section][index].score = newScore;
                        
                        // Update score class
                        scoreSelect.className = `score-select score-${newScore}`;
                        
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        // Update dashboard, charts, and recommendations after score change
                        updateAllDashboardComponents();
                    });
                    
                    scoreInput.appendChild(scoreSelect);
                    
                    itemHeader.appendChild(itemName);
                    itemHeader.appendChild(scoreInput);
                    
                    const commentsInput = document.createElement('textarea');
                    commentsInput.className = 'comments-input';
                    commentsInput.placeholder = 'Add comments or observations...';
                    commentsInput.value = item.comment || '';
                    commentsInput.addEventListener('input', (e) => {
                        project.sites[project.currentSite][section][index].comment = e.target.value;
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        // Update recommendations when comments change
                        if (typeof renderDashboardRecommendations === 'function') {
                            renderDashboardRecommendations();
                        }
                    });
                    
                    inspectionItem.appendChild(itemHeader);
                    inspectionItem.appendChild(commentsInput);
                    focusElement.appendChild(inspectionItem);
                });
                
                container.appendChild(focusElement);
            }
            
            console.log('Site performance tab rendered successfully');
        } catch (error) {
            console.error('Error rendering site performance tab:', error);
        }
    }
    
    // Render master config tab
    function renderMasterConfigTab() {
        try {
            console.log('Rendering master config tab...');
            // This function can be expanded to show configuration editing interface
            // For now, it's handled by the question management system
        } catch (error) {
            console.error('Error rendering master config tab:', error);
        }
    }
    
    // Render question management
    function renderQuestionManagement() {
        try {
            console.log('Rendering question management...');
            const container = document.getElementById('questionManagementContainer');
            if (!container) {
                console.warn('Question management container not found');
                return;
            }
            
            // Check if questions exist
            if (!app.hasQuestions()) {
                console.log('No questions found, showing no questions notice');
                container.innerHTML = `
                    <div class="no-questions-notice">
                        <div class="notice-icon">❓</div>
                        <h4>No Questions Available</h4>
                        <p>To get started with your audit system, you need to load questions. You can:</p>
                        <div style="margin: 20px 0;">
                            <button class="btn btn-green" onclick="loadDefaultTemplate()">Load Default Template</button>
                            <button class="btn btn-secondary" onclick="importConfiguration()">Import Custom Configuration</button>
                        </div>
                        <p style="font-size: 0.9rem; color: #888;">
                            The default template includes sample questions for both Management System and Site Performance audits.
                        </p>
                    </div>
                `;
                return;
            }
            
            // Questions exist, show the management interface
            console.log('Questions found, rendering question management interface');
            const questionCounts = app.getQuestionCounts();
            
            console.log('Rendering question management with counts:', questionCounts);
            
            container.innerHTML = `
                <div class="question-tabs">
                    <button class="question-tab active" data-question-type="management">Management Questions (${questionCounts.management})</button>
                    <button class="question-tab" data-question-type="site">Site Questions (${questionCounts.site})</button>
                </div>
                
                <div id="managementQuestions" class="question-content active">
                    ${renderQuestionSections('management')}
                </div>
                
                <div id="siteQuestions" class="question-content">
                    ${renderQuestionSections('site')}
                </div>
            `;
            
            // Add event listeners for question tabs
            const questionTabs = container.querySelectorAll('.question-tab');
            questionTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const questionType = e.target.dataset.questionType;
                    showQuestionType(questionType);
                });
            });
            
            console.log('Question management rendered successfully');
        } catch (error) {
            console.error('Error rendering question management:', error);
        }
    }
    
    // Render question sections
    function renderQuestionSections(type) {
        try {
            const config = app.masterConfig[type] || {};
            console.log(`Rendering question sections for ${type}:`, config);
            
            let html = '';
            
            for (const section in config) {
                html += `
                    <div class="question-section">
                        <h4>
                            ${section}
                            <button class="btn btn-green" onclick="addQuestion('${type}', '${section}')">Add Question</button>
                        </h4>
                        <div class="question-list">
                `;
                
                config[section].forEach((question, index) => {
                    html += `
                        <div class="question-item">
                            <span class="question-text">${question}</span>
                            <div class="question-actions">
                                <button class="btn btn-secondary" onclick="editQuestion('${type}', '${section}', ${index})">Edit</button>
                                <button class="btn btn-danger" onclick="deleteQuestion('${type}', '${section}', ${index})">Delete</button>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
            
            // Add section for adding new sections
            html += `
                <div class="question-section">
                    <h4>Add New Section</h4>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <input type="text" id="new${type}Section" placeholder="Enter section name" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <button class="btn btn-green" onclick="addSection('${type}')">Add Section</button>
                    </div>
                </div>
            `;
            
            return html;
        } catch (error) {
            console.error('Error rendering question sections:', error);
            return '<p>Error rendering questions</p>';
        }
    }
    
    // Add new section
    function addSection(type) {
        try {
            const input = document.getElementById(`new${type}Section`);
            const sectionName = input.value.trim();
            
            if (!sectionName) {
                alert('Please enter a section name');
                return;
            }
            
            if (app.masterConfig[type][sectionName]) {
                alert('A section with this name already exists');
                return;
            }
            
            // Add new section
            app.masterConfig[type][sectionName] = [];
            
            // Update all projects with the new section
            for (const projectName in app.inspectionData.projects) {
                const project = app.inspectionData.projects[projectName];
                
                if (type === 'management') {
                    project.managementSystemAudit[sectionName] = [];
                } else {
                    for (const siteName in project.sites) {
                        project.sites[siteName][sectionName] = [];
                    }
                }
            }
            
            input.value = '';
            if (typeof saveData === 'function') {
                saveData();
            }
            renderQuestionManagement();
            
            console.log(`Section "${sectionName}" added to ${type}`);
        } catch (error) {
            console.error('Error adding section:', error);
        }
    }
    
    // Add new question
    function addQuestion(type, section) {
        try {
            const questionText = prompt('Enter the question text:');
            if (!questionText) return;
            
            // Add to master config
            app.masterConfig[type][section].push(questionText);
            
            // Update all projects with the new question
            for (const projectName in app.inspectionData.projects) {
                const project = app.inspectionData.projects[projectName];
                
                if (type === 'management') {
                    if (!project.managementSystemAudit[section]) {
                        project.managementSystemAudit[section] = [];
                    }
                    project.managementSystemAudit[section].push({
                        name: questionText,
                        score: 0,
                        comment: ''
                    });
                } else {
                    for (const siteName in project.sites) {
                        if (!project.sites[siteName][section]) {
                            project.sites[siteName][section] = [];
                        }
                        project.sites[siteName][section].push({
                            name: questionText,
                            score: 0,
                            comment: ''
                        });
                    }
                }
            }
            
            if (typeof saveData === 'function') {
                saveData();
            }
            renderQuestionManagement();
            
            console.log(`Question added to ${type} - ${section}`);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    }
    
    // Edit question
    function editQuestion(type, section, index) {
        try {
            const currentText = app.masterConfig[type][section][index];
            const newText = prompt('Edit question text:', currentText);
            
            if (newText && newText !== currentText) {
                // Update master config
                app.masterConfig[type][section][index] = newText;
                
                // Update all projects with the new question text
                for (const projectName in app.inspectionData.projects) {
                    const project = app.inspectionData.projects[projectName];
                    
                    if (type === 'management') {
                        if (project.managementSystemAudit[section] && project.managementSystemAudit[section][index]) {
                            project.managementSystemAudit[section][index].name = newText;
                        }
                    } else {
                        for (const siteName in project.sites) {
                            if (project.sites[siteName][section] && project.sites[siteName][section][index]) {
                                project.sites[siteName][section][index].name = newText;
                            }
                        }
                    }
                }
                
                if (typeof saveData === 'function') {
                    saveData();
                }
                renderQuestionManagement();
                
                console.log(`Question edited in ${type} - ${section}`);
            }
        } catch (error) {
            console.error('Error editing question:', error);
        }
    }
    
    // Delete question
    function deleteQuestion(type, section, index) {
        try {
            const questionText = app.masterConfig[type][section][index];
            
            if (confirm(`Are you sure you want to delete this question?\n\n"${questionText}"\n\nThis will remove it from all projects and sites.`)) {
                // Remove from master config
                app.masterConfig[type][section].splice(index, 1);
                
                // Remove from all projects
                for (const projectName in app.inspectionData.projects) {
                    const project = app.inspectionData.projects[projectName];
                    
                    if (type === 'management') {
                        if (project.managementSystemAudit[section]) {
                            project.managementSystemAudit[section].splice(index, 1);
                        }
                    } else {
                        for (const siteName in project.sites) {
                            if (project.sites[siteName][section]) {
                                project.sites[siteName][section].splice(index, 1);
                            }
                        }
                    }
                }
                
                if (typeof saveData === 'function') {
                    saveData();
                }
                renderQuestionManagement();
                
                console.log(`Question deleted from ${type} - ${section}`);
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    }
    
    // Update all dashboard components
    function updateAllDashboardComponents() {
        try {
            console.log('Updating all dashboard components...');
            
            // Update dashboard summary and charts
            if (window.chartManagement && window.chartManagement.updateDashboard) {
                window.chartManagement.updateDashboard();
            } else if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            // Update recommendations
            if (window.recommendations && window.recommendations.renderDashboardRecommendations) {
                window.recommendations.renderDashboardRecommendations();
            } else if (typeof renderDashboardRecommendations === 'function') {
                renderDashboardRecommendations();
            }
            
            // Update executive summary
            if (window.projectManagement && window.projectManagement.updateDashboardExecutiveSummary) {
                window.projectManagement.updateDashboardExecutiveSummary();
            } else if (typeof updateDashboardExecutiveSummary === 'function') {
                updateDashboardExecutiveSummary();
            }
            
            console.log('All dashboard components updated successfully');
        } catch (error) {
            console.error('Error updating dashboard components:', error);
        }
    }
    
    // Expose functions to global scope
    window.initializeUI = initializeUI;
    window.showTab = showTab;
    window.showScoringCategory = showScoringCategory;
    window.showQuestionType = showQuestionType;
    window.renderManagementTab = renderManagementTab;
    window.renderSitePerformanceTab = renderSitePerformanceTab;
    window.renderMasterConfigTab = renderMasterConfigTab;
    window.renderQuestionManagement = renderQuestionManagement;
    window.addSection = addSection;
    window.addQuestion = addQuestion;
    window.editQuestion = editQuestion;
    window.deleteQuestion = deleteQuestion;
    window.updateAllDashboardComponents = updateAllDashboardComponents;
})();