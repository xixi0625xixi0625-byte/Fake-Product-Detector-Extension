const RULES = {
    "PAYMENT RED FLAG": { score: 35, keywords: ["zelle", "venmo", "cashapp", "paypal friends", "crypto", "bitcoin"] },
    "COMMUNICATION HIJACK": { score: 30, keywords: ["whatsapp", "text me", "gmail", "@outlook", "phone number"] },
    "URGENCY PRESSURE": { score: 20, keywords: ["moving tomorrow", "urgent", "emergency", "must sell today", "leaving country"] },
    "LOGISTICS FRAUD": { score: 25, keywords: ["shipping only", "no local pickup", "courier", "fedex agent"] }
};

async function runAnalysis(text, source = "Textual") {
    const report = document.getElementById('report');
    const scoreEl = document.getElementById('risk-score');
    const content = text.toLowerCase();
    
    let score = 0;
    let detections = [];

    for (const [category, rule] of Object.entries(RULES)) {
        for (const word of rule.keywords) {
            if (content.includes(word)) {
                score += rule.score;
                detections.push(`[${category}] Detected keyword: ${word.toUpperCase()}`);
                break; // Only count each category once
            }
        }
    }

    // AI Image Analysis Flag
    if (source === "Image" && (content.includes("void") || content.includes("sample"))) {
        score += 50;
        detections.push(`[FORGERY] Fake receipt watermark detected!`);
    }

    const finalScore = Math.min(score, 100);
    scoreEl.innerText = `${finalScore}%`;
    scoreEl.style.color = finalScore > 50 ? "#f87171" : "#10b981";
    
    report.innerHTML = detections.length > 0 
        ? detections.map(d => `<div class="finding-item">${d}</div>`).join('')
        : `<div style="color: #10b981">Analysis complete: No high-risk red flags found in ${source} scan.</div>`;
}

// Button and File Input handlers...
document.getElementById('manualFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('file-name').innerText = "Analyzing: " + file.name;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const worker = await Tesseract.createWorker('eng');
            const { data: { text } } = await worker.recognize(event.target.result);
            await worker.terminate();
            runAnalysis(text, "Image");
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('scanBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText
    }, (results) => {
        runAnalysis(results[0].result, "Textual");
    });
});
