document.addEventListener("DOMContentLoaded", () => {

    const analyzeBtn = document.getElementById("analyzeBtn");
    const resultDiv = document.getElementById("result");

    analyzeBtn.addEventListener("click", async () => {

        const resumeFile = document.getElementById("resumeFile").files[0];
        const jobDescription = document.getElementById("jobDescription").value.trim();

        // Validation
        if (!resumeFile) {
            alert("Please upload your resume.");
            return;
        }

        if (!jobDescription) {
            alert("Please paste the Job Description.");
            return;
        }

        // Loading UI
        resultDiv.innerHTML = `
            <div class="loader">
                <div class="spinner"></div>
                <h2>Analyzing Your Resume...</h2>
                <p>Please wait while AI compares your resume with the Job Description.</p>
            </div>
        `;

        // Form Data
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jobDescription", jobDescription);

        try {

            const response = await fetch(
                "https://priyanshusaini87.app.n8n.cloud/webhook/resume-analyzer",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Server Error");
            }

            const result = await response.json();
            const data = result.output;

            console.log("AI Response:", data);

            // 👇 Part 2 yahin se start hoga

           resultDiv.innerHTML = `

<div class="candidate-card">
    <h2>${data.candidate_name}</h2>
    <p>AI Resume Analysis Report</p>
</div>

<div class="score-container">

    <div class="score-card">
        <h3>Resume Score</h3>
        <h1>${data.resume_score}%</h1>
    </div>

    <div class="score-card">
        <h3>ATS Score</h3>
        <h1>${data.ats_score}%</h1>
    </div>

    <div class="score-card">
        <h3>Skills Match</h3>
        <h1>${data.skills_match_percentage}%</h1>
    </div>

</div>

<div class="result-card">
    <h3>✅ Matching Skills</h3>
    <div>
        ${data.matching_skills.map(skill =>
        `<span class="badge">${skill}</span>`).join("")}
    </div>
</div>

<div class="result-card">
    <h3>❌ Missing Skills</h3>
    <div>
        ${data.missing_skills.map(skill =>
        `<span class="badge-red">${skill}</span>`).join("")}
    </div>
</div>

<div class="result-card">
    <h3>💪 Strengths</h3>
    <ul>
        ${data.strengths.map(item => `<li>${item}</li>`).join("")}
    </ul>
</div>

<div class="result-card">
    <h3>⚠️ Weaknesses</h3>
    <ul>
        ${data.weaknesses.map(item => `<li>${item}</li>`).join("")}
    </ul>
</div>

<div class="result-card">
    <h3>🚀 Improvement Suggestions</h3>
    <ul>
        ${data.improvement_suggestions.map(item => `<li>${item}</li>`).join("")}
    </ul>
</div>

<div class="result-card">
    <h3>🔑 Recommended Keywords</h3>
    <div>
        ${data.recommended_keywords.map(item =>
        `<span class="badge">${item}</span>`).join("")}
    </div>
</div>

<div class="result-card">
    <h3>Experience Level</h3>
    <span class="experience-badge">
        ${data.experience_level}
    </span>
</div>

<div class="result-card">
    <h3>📄 Summary</h3>
    <p>${data.summary}</p>
</div>

<hr style="margin:30px 0;">

<div class="result-card">
    <h3>📊 Skills Analysis</h3>
    <canvas id="skillsChart"></canvas>
</div>

<button id="downloadPdf">
📄 Download PDF Report
</button>

`; 
const ctx = document.getElementById("skillsChart");

new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: [
            "Resume Score",
            "ATS Score",
            "Skills Match"
        ],
        datasets: [{
            data: [
                data.resume_score,
                data.ats_score,
                data.skills_match_percentage
            ],
            backgroundColor: [
                "#2563EB",
                "#22C55E",
                "#F59E0B"
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom"
            }
        }
    }
});
const pdfBtn = document.getElementById("downloadPdf");

pdfBtn.addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("AI Resume Analysis Report",20,20);

    doc.setFontSize(14);

    doc.text(`Candidate: ${data.candidate_name}`,20,40);

    doc.text(`Resume Score: ${data.resume_score}%`,20,50);

    doc.text(`ATS Score: ${data.ats_score}%`,20,60);

    doc.text(`Skills Match: ${data.skills_match_percentage}%`,20,70);

    doc.text(`Experience: ${data.experience_level}`,20,80);

    doc.text("Summary:",20,95);

    const summary = doc.splitTextToSize(data.summary,170);

    doc.text(summary,20,105);

    doc.save("Resume_Report.pdf");

});
        } catch (error) {

            console.error(error);

            resultDiv.innerHTML = `
        
                <div class="result-card">
                    <h2>❌ Something went wrong</h2>
                    <p>Unable to connect to AI Resume Analyzer.</p>
                </div>
            `;

        }

    });

});