// Recommendations Module
// Generates recommendations based on audit results

// Generate recommendations based on scores
function generateRecommendations(projectData, sitesData) {
    const recommendations = [];
    
    // Analyze project-level issues
    if (projectData && projectData.questions) {
        const lowScoreQuestions = projectData.questions.filter(q => q.score <= 2 && q.score > 0);
        
        lowScoreQuestions.forEach(question => {
            const template = window.dataManagement?.getCurrentTemplate();
            if (template && template.managementQuestions[question.index]) {
                const questionText = template.managementQuestions[question.index].text;
                recommendations.push({
                    type: 'Management System',
                    priority: question.score === 1 ? 'High' : 'Medium',
                    issue: questionText,
                    recommendation: getRecommendationForQuestion(questionText, question.score),
                    score: question.score
                });
            }
        });
    }
    
    // Analyze site-level issues
    if (sitesData && sitesData.length > 0) {
        sitesData.forEach(site => {
            if (site.questions) {
                const lowScoreQuestions = site.questions.filter(q => q.score <= 2 && q.score > 0);
                
                lowScoreQuestions.forEach(question => {
                    const template = window.dataManagement?.getCurrentTemplate();
                    if (template && template.siteQuestions[question.index]) {
                        const questionText = template.siteQuestions[question.index].text;
                        recommendations.push({
                            type: 'Site Performance',
                            site: site.name,
                            priority: question.score === 1 ? 'High' : 'Medium',
                            issue: questionText,
                            recommendation: getRecommendationForQuestion(questionText, question.score),
                            score: question.score
                        });
                    }
                });
            }
        });
    }
    
    // Sort by priority and score
    recommendations.sort((a, b) => {
        if (a.priority === 'High' && b.priority !== 'High') return -1;
        if (b.priority === 'High' && a.priority !== 'High') return 1;
        return a.score - b.score;
    });
    
    return recommendations;
}

// Get specific recommendation based on question content and score
function getRecommendationForQuestion(questionText, score) {
    const lowerQuestion = questionText.toLowerCase();
    
    // Policy and documentation recommendations
    if (lowerQuestion.includes('policy') || lowerQuestion.includes('procedure')) {
        if (score === 1) {
            return 'Immediately develop and implement comprehensive policies and procedures. Ensure all staff are trained and documentation is easily accessible.';
        } else {
            return 'Review and update existing policies and procedures. Ensure they are current, comprehensive, and properly communicated to all staff.';
        }
    }
    
    // Training recommendations
    if (lowerQuestion.includes('training') || lowerQuestion.includes('competency')) {
        if (score === 1) {
            return 'Establish a comprehensive training program immediately. Document all training activities and ensure competency assessments are conducted.';
        } else {
            return 'Enhance existing training programs. Implement regular refresher training and improve competency assessment processes.';
        }
    }
    
    // Risk management recommendations
    if (lowerQuestion.includes('risk') || lowerQuestion.includes('hazard')) {
        if (score === 1) {
            return 'Implement a formal risk management system immediately. Conduct comprehensive risk assessments and establish control measures.';
        } else {
            return 'Improve risk identification and assessment processes. Ensure all identified risks have appropriate control measures in place.';
        }
    }
    
    // Incident management recommendations
    if (lowerQuestion.includes('incident') || lowerQuestion.includes('accident')) {
        if (score === 1) {
            return 'Establish formal incident reporting and investigation procedures immediately. Ensure all incidents are properly documented and investigated.';
        } else {
            return 'Enhance incident management processes. Improve investigation quality and ensure corrective actions are effectively implemented.';
        }
    }
    
    // Emergency preparedness recommendations
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('evacuation')) {
        if (score === 1) {
            return 'Develop comprehensive emergency response procedures immediately. Conduct regular drills and ensure all staff know their roles.';
        } else {
            return 'Review and update emergency procedures. Increase frequency of drills and improve emergency communication systems.';
        }
    }
    
    // PPE recommendations
    if (lowerQuestion.includes('ppe') || lowerQuestion.includes('personal protective')) {
        if (score === 1) {
            return 'Implement comprehensive PPE program immediately. Ensure proper selection, training, and maintenance of all PPE.';
        } else {
            return 'Improve PPE management processes. Enhance training on proper use and ensure regular inspection and replacement schedules.';
        }
    }
    
    // Generic recommendations based on score
    if (score === 1) {
        return 'This area requires immediate attention and significant improvement. Develop and implement comprehensive measures to address this critical issue.';
    } else {
        return 'This area needs improvement. Review current practices and implement enhanced measures to achieve better performance.';
    }
}

// Display recommendations in the UI
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsContent');
    if (!container) {
        console.warn('Recommendations container not found');
        return;
    }
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p>No specific recommendations at this time. Continue monitoring and maintaining current standards.</p>';
        return;
    }
    
    let html = '<div class="recommendations-list">';
    
    recommendations.forEach((rec, index) => {
        const priorityClass = rec.priority.toLowerCase();
        html += `
            <div class="recommendation-item priority-${priorityClass}">
                <div class="recommendation-header">
                    <span class="recommendation-type">${rec.type}</span>
                    ${rec.site ? `<span class="recommendation-site">${rec.site}</span>` : ''}
                    <span class="recommendation-priority priority-${priorityClass}">${rec.priority} Priority</span>
                </div>
                <div class="recommendation-issue">
                    <strong>Issue:</strong> ${rec.issue}
                </div>
                <div class="recommendation-action">
                    <strong>Recommendation:</strong> ${rec.recommendation}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Generate action plan based on recommendations
function generateActionPlan(recommendations) {
    const actionPlan = {
        immediate: [],
        shortTerm: [],
        longTerm: []
    };
    
    recommendations.forEach(rec => {
        const action = {
            description: rec.recommendation,
            area: rec.type,
            site: rec.site || 'All Sites',
            priority: rec.priority
        };
        
        if (rec.priority === 'High') {
            actionPlan.immediate.push(action);
        } else if (rec.priority === 'Medium') {
            actionPlan.shortTerm.push(action);
        } else {
            actionPlan.longTerm.push(action);
        }
    });
    
    return actionPlan;
}

// Export functions for use in other modules
window.recommendations = {
    generateRecommendations,
    displayRecommendations,
    generateActionPlan
};