// Site Management Module
// Handles site-specific audit functionality

let currentSites = [];
let currentSiteIndex = 0;

// Initialize site management
function initializeSiteManagement() {
    setupSiteEventListeners();
    loadSitesFromStorage();
}

// Setup event listeners for site management
function setupSiteEventListeners() {
    // Add site button
    const addSiteBtn = document.getElementById('addSiteBtn');
    if (addSiteBtn) {
        addSiteBtn.addEventListener('click', addNewSite);
    }

    // Site navigation buttons
    const prevSiteBtn = document.getElementById('prevSite');
    const nextSiteBtn = document.getElementById('nextSite');
    
    if (prevSiteBtn) {
        prevSiteBtn.addEventListener('click', () => navigateSite(-1));
    }
    
    if (nextSiteBtn) {
        nextSiteBtn.addEventListener('click', () => navigateSite(1));
    }

    // Delete site button
    const deleteSiteBtn = document.getElementById('deleteSiteBtn');
    if (deleteSiteBtn) {
        deleteSiteBtn.addEventListener('click', deleteCurrentSite);
    }
}

// Add new site
function addNewSite() {
    const siteName = prompt('Enter site name:');
    if (siteName && siteName.trim()) {
        const newSite = {
            id: Date.now(),
            name: siteName.trim(),
            questions: [],
            completed: false,
            score: 0,
            createdDate: new Date().toISOString()
        };
        
        currentSites.push(newSite);
        currentSiteIndex = currentSites.length - 1;
        
        saveSitesToStorage();
        updateSiteDisplay();
        loadSiteQuestions();
    }
}

// Navigate between sites
function navigateSite(direction) {
    if (currentSites.length === 0) return;
    
    currentSiteIndex += direction;
    
    if (currentSiteIndex < 0) {
        currentSiteIndex = currentSites.length - 1;
    } else if (currentSiteIndex >= currentSites.length) {
        currentSiteIndex = 0;
    }
    
    updateSiteDisplay();
    loadSiteQuestions();
}

// Delete current site
function deleteCurrentSite() {
    if (currentSites.length === 0) return;
    
    if (confirm('Are you sure you want to delete this site?')) {
        currentSites.splice(currentSiteIndex, 1);
        
        if (currentSites.length === 0) {
            currentSiteIndex = 0;
        } else if (currentSiteIndex >= currentSites.length) {
            currentSiteIndex = currentSites.length - 1;
        }
        
        saveSitesToStorage();
        updateSiteDisplay();
        loadSiteQuestions();
    }
}

// Update site display
function updateSiteDisplay() {
    const siteNameElement = document.getElementById('currentSiteName');
    const siteCountElement = document.getElementById('siteCount');
    
    if (currentSites.length === 0) {
        if (siteNameElement) siteNameElement.textContent = 'No sites added';
        if (siteCountElement) siteCountElement.textContent = '0 / 0';
        return;
    }
    
    const currentSite = currentSites[currentSiteIndex];
    if (siteNameElement) {
        siteNameElement.textContent = currentSite.name;
    }
    
    if (siteCountElement) {
        siteCountElement.textContent = `${currentSiteIndex + 1} / ${currentSites.length}`;
    }
}

// Load site questions
function loadSiteQuestions() {
    if (currentSites.length === 0) {
        clearSiteQuestions();
        return;
    }
    
    const currentSite = currentSites[currentSiteIndex];
    const questionsContainer = document.getElementById('siteQuestionsContainer');
    
    if (!questionsContainer) return;
    
    // Load questions from template or current site data
    if (window.dataManagement && window.dataManagement.getCurrentTemplate) {
        const template = window.dataManagement.getCurrentTemplate();
        if (template && template.siteQuestions) {
            displaySiteQuestions(template.siteQuestions, currentSite);
        }
    }
}

// Display site questions
function displaySiteQuestions(questions, site) {
    const container = document.getElementById('siteQuestionsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <h4>${question.text}</h4>
            <div class="question-options">
                <label><input type="radio" name="site_q${index}" value="4"> Excellent (4)</label>
                <label><input type="radio" name="site_q${index}" value="3"> Good (3)</label>
                <label><input type="radio" name="site_q${index}" value="2"> Fair (2)</label>
                <label><input type="radio" name="site_q${index}" value="1"> Poor (1)</label>
                <label><input type="radio" name="site_q${index}" value="0"> N/A (0)</label>
            </div>
            <textarea placeholder="Comments..." class="question-comment" data-question="${index}"></textarea>
        `;
        
        container.appendChild(questionDiv);
        
        // Set existing values if available
        const existingAnswer = site.questions.find(q => q.index === index);
        if (existingAnswer) {
            const radio = questionDiv.querySelector(`input[value="${existingAnswer.score}"]`);
            if (radio) radio.checked = true;
            
            const comment = questionDiv.querySelector('.question-comment');
            if (comment) comment.value = existingAnswer.comment || '';
        }
    });
    
    // Add event listeners for changes
    container.addEventListener('change', saveSiteAnswers);
    container.addEventListener('input', saveSiteAnswers);
}

// Save site answers
function saveSiteAnswers() {
    if (currentSites.length === 0) return;
    
    const currentSite = currentSites[currentSiteIndex];
    const container = document.getElementById('siteQuestionsContainer');
    
    if (!container) return;
    
    currentSite.questions = [];
    let totalScore = 0;
    let answeredQuestions = 0;
    
    const questionItems = container.querySelectorAll('.question-item');
    questionItems.forEach((item, index) => {
        const checkedRadio = item.querySelector('input[type="radio"]:checked');
        const comment = item.querySelector('.question-comment').value;
        
        if (checkedRadio) {
            const score = parseInt(checkedRadio.value);
            currentSite.questions.push({
                index,
                score,
                comment
            });
            
            if (score > 0) { // Don't count N/A in scoring
                totalScore += score;
                answeredQuestions++;
            }
        }
    });
    
    // Calculate percentage score
    currentSite.score = answeredQuestions > 0 ? Math.round((totalScore / (answeredQuestions * 4)) * 100) : 0;
    currentSite.completed = currentSite.questions.length > 0;
    
    saveSitesToStorage();
}

// Clear site questions
function clearSiteQuestions() {
    const container = document.getElementById('siteQuestionsContainer');
    if (container) {
        container.innerHTML = '<p>No sites available. Add a site to begin the audit.</p>';
    }
}

// Save sites to storage
function saveSitesToStorage() {
    try {
        localStorage.setItem('ohsAuditSites', JSON.stringify(currentSites));
    } catch (error) {
        console.error('Error saving sites to storage:', error);
    }
}

// Load sites from storage
function loadSitesFromStorage() {
    try {
        const saved = localStorage.getItem('ohsAuditSites');
        if (saved) {
            currentSites = JSON.parse(saved);
            updateSiteDisplay();
        }
    } catch (error) {
        console.error('Error loading sites from storage:', error);
        currentSites = [];
    }
}

// Get current sites data
function getCurrentSites() {
    return currentSites;
}

// Export functions for use in other modules
window.siteManagement = {
    initializeSiteManagement,
    getCurrentSites,
    addNewSite,
    navigateSite,
    deleteCurrentSite
};