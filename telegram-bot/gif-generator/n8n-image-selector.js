// Add this code to your n8n "prepare web app data" node
// This will select the appropriate BS meter image based on the calculated score

const overallScore = $('calculate final score code').first().json.score;
const scorePercent = Math.round(overallScore * 100);

// Function to select the right image based on score percentage
function selectBSMeterImage(scorePercent) {
    // Clamp score between 0-100
    const clampedScore = Math.max(0, Math.min(100, scorePercent));
    
    // Calculate which 5% range this score falls into
    const rangeIndex = Math.floor(clampedScore / 5);
    
    // Handle edge case for 100% (would give index 20, but we only have 0-19)
    const safeRangeIndex = Math.min(rangeIndex, 19);
    
    // Calculate the range bounds
    const rangeStart = safeRangeIndex * 5;
    const rangeEnd = Math.min(rangeStart + 5, 100);
    
    // Create filename with zero-padded numbers
    const filename = `bs-meter-${rangeStart.toString().padStart(2, '0')}-${rangeEnd.toString().padStart(2, '0')}.png`;
    
    // Return the full GitHub Pages URL
    return `https://molotov1056.github.io/bsmeter-ts/gifs/${filename}`;
}

// Get the image URL for this score
const imageUrl = selectBSMeterImage(scorePercent);

// Get existing web app data
const existingData = {
    overall_score: overallScore,
    categories: {} // ... existing categories logic
};

// Build categories object (your existing logic)
const allItems = $items("parse pplx output");
const parsedData = allItems.map(item => item.json);

function getCategoryData(categoryName) {
    const categoryItem = parsedData.find(item => item.category === categoryName);
    return categoryItem ? {
        score: categoryItem.score,
        reasoning: categoryItem.reasoning
    } : {
        score: 0,
        reasoning: "No data available"
    };
}

existingData.categories = {
    overall_credibility_and_reputation: getCategoryData('overall_credibility_and_reputation'),
    factual_accuracy: getCategoryData('factual_accuracy'),
    distinction_between_fact_and_opinion: getCategoryData('distinction_between_fact_and_opinion'),
    language_analysis: getCategoryData('language_analysis'),
    logical_consistency_and_absence_of_fallacies: getCategoryData('logical_consistency_and_absence_of_fallacies'),
    headline_accuracy: getCategoryData('headline_accuracy'),
    historical_context_of_the_topic: getCategoryData('historical_context_of_the_topic')
};

// Create web app URL
const jsonString = JSON.stringify(existingData);
const base64Data = Buffer.from(jsonString).toString('base64');
const webAppUrl = `https://molotov1056.github.io/bsmeter-ts/?startapp=${base64Data}`;

// Return both the web app URL and the image URL
return [{ 
    json: { 
        webAppUrl: webAppUrl,
        imageUrl: imageUrl,
        scorePercent: scorePercent
    } 
}];
