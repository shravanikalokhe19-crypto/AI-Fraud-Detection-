let transactions = [];

document.getElementById("transactionForm").addEventListener("submit", function(e){
    e.preventDefault();

    let amount = parseFloat(document.getElementById("amount").value);
    let time = parseInt(document.getElementById("time").value);
    let location = document.getElementById("location").value;
    let type = document.getElementById("type").value;

    let score = 0;
    if(amount > 1000) score += 30;
    if(location === "International") score += 25;
    if(type === "Online") score += 20;
    if(time < 6 || time > 22) score += 25;

    let status = "", color = "";
    if(score >= 60){
        status = "⚠️ FRAUD";
        color = "#e57373";   // soft red
        alert("⚠️ ALERT: Fraudulent transaction detected!");
        let msg = new SpeechSynthesisUtterance("Alert! Fraudulent transaction detected!");
        window.speechSynthesis.speak(msg);
    }
    else if(score >= 30){
        status = "⚡ Suspicious";
        color = "#ffb74d";   // soft orange
    }
    else{
        status = "✅ Safe";
        color = "#81c784";   // soft green
    }

    transactions.push({amount, time, location, type, score, status, color});
    updateTable();
    updateSummary();

    document.getElementById("transactionForm").reset();
});

function updateTable(){
    let tbody = document.getElementById("transactionTable");
    tbody.innerHTML = "";
    transactions.forEach((t,i)=>{
        let row = document.createElement("tr");
        row.style.backgroundColor = t.color;
        row.style.borderRadius = "8px";
        row.style.border = "1px solid #ccc";
        row.innerHTML = `
            <td>${i+1}</td>
            <td>${t.amount}</td>
            <td>${t.time}</td>
            <td>${t.location}</td>
            <td>${t.type}</td>
            <td>${t.score}</td>
            <td>${t.status}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateSummary(){
    document.getElementById("totalTransactions").textContent = transactions.length;
    document.getElementById("totalSafe").textContent = transactions.filter(t=>t.status==="✅ Safe").length;
    document.getElementById("totalSuspicious").textContent = transactions.filter(t=>t.status==="⚡ Suspicious").length;
    document.getElementById("totalFraud").textContent = transactions.filter(t=>t.status==="⚠️ FRAUD").length;
}

// Export CSV
document.getElementById("downloadBtn").addEventListener("click", function(){
    let csv = "No,Amount,Time,Location,Type,Risk Score,Status\n";
    transactions.forEach((t,i)=>{
        csv += `${i+1},${t.amount},${t.time},${t.location},${t.type},${t.score},${t.status}\n`;
    });
    let blob = new Blob([csv], {type: "text/csv"});
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "AI_Fraud_Report.csv";
    link.click();
});