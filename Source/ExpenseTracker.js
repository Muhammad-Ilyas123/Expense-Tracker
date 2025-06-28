console.log("ilyas");


let formEl = document.getElementById('form');
let btnIncome = document.getElementById('btnIncome');
let btnExpese = document.getElementById('btnExpese');
let discreptionEl = document.getElementById('discreption');
let amountEl = document.getElementById('amount');
let transactionListEl = document.getElementById('transaction-list');
let vBalEnquiry = document.getElementById('Balance-Enquiry');
let vfilterClick = document.getElementById('filter-click');
let vBalance = 0;
let vType = "";
let vSno = 0;
let transactions = [];


transactions = JSON.parse(localStorage.getItem('Transactions')) || [];
console.log(transactions);


btnIncome.addEventListener('click', function () {
    vType = 'Y';

    discreptionEl.disabled = false;
    amountEl.disabled = false;

    if (vType) {
        discreptionEl.focus();
    };
})


btnExpese.addEventListener('click', function () {
    vType = 'N';

    discreptionEl.disabled = false;
    amountEl.disabled = false;

    if (vType) {
        discreptionEl.focus();
    };
});

formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    if (transactions.length === 0) {
        vSno = 1;
    }
    else {
        let d = transactions.map((e)=>{
            return e.vSno;
            
        })
        console.log(d);
        
        
        vSno = transactions.length + 1;
    }
    getFormValueWithValidation();
    saveData();
    UI();
    balanceEnquiry();
});


let b = transactions.map((e)=>{
    return e.vSno;
});
console.log(b);


function getFormValueWithValidation() {

    if (discreptionEl.value.trim() != "" && amountEl.value.trim() != "" && vType != "") {
        let discreptionValue = discreptionEl.value;
        let amountValue = amountEl.value;
        let vCurrDate = new Date();
        let currFormData = { vSno, discreptionValue, amountValue, vType, vCurrDate };
        transactions.push(currFormData);

    }
    else {
        alert("Kindly Fill Empty Field");
    }
};

function UI() {
    transactionListEl.innerHTML = transactions.map((e) => {
        return `<span> ${e.vSno} </span>
                <span> ${e.discreptionValue} </span>
                <span> ${e.amountValue} </span>
                <span> ${e.vType} </span>
                <span> ${e.vCurrDate} </span><br>`
    }).join("")

    console.log();
    
}

function saveData() {
    localStorage.setItem("Transactions", JSON.stringify(transactions));
    discreptionEl.value = "";
    amountEl.value = "";
    console.log(transactions);

}

function drawPieChart(income, expense) {
    const ctx = document.getElementById('myPieChart').getContext('2d');

    // ✅ Safe destroy check
    if (window.myPieChart && typeof window.myPieChart.destroy === "function") {
        window.myPieChart.destroy();
    }

    window.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#4CAF50', '#F44336'],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            let value = context.raw || 0;
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        }
    });
}




function balanceEnquiry() {
    let vTotIncome = 0;
    let vTotExpence = 0;
    let htmlOutput = transactions.reduce((acc, currVal) => {
        if (currVal.vType === "Y") {
            vTotIncome += Number(currVal.amountValue);
            return acc + `<h3> Income: ${currVal.amountValue} </h3>`;
        } else {
            vTotExpence += Number(currVal.amountValue);
            return acc + `<h3> Expense: ${currVal.amountValue} </h3>`;
        }
    }, ""); // Start with empty string

    let vBalance = vTotIncome - vTotExpence;

    vBalEnquiry.innerHTML = `
        
        <h3>Total Income: ${vTotIncome}</h3>
        <h3>Total Expense: ${vTotExpence}</h3>
        <h3>Balance: ${vBalance}</h3>
    `;

    drawPieChart(vTotIncome, vTotExpence);
}


vfilterClick.addEventListener('click', function () {
    let vfilterInput = document.getElementById("filter-input");
    let vFilterInputValue = new Date(vfilterInput.value);

    function filterData() {
        let filDate = transactions.filter((e) => {
            let vCurrDate1 = new Date(e.vCurrDate);
            return vFilterInputValue <=  vCurrDate1;
        });

    let filteredData = document.getElementById("filterd-data");
    filteredData.innerHTML = filDate.map((e)=>{
        return `
            <span>${e.vSno}</span>
            <span>${e.discreptionValue}</span>
            <span>${e.amountValue}</span>
            <span>${e.vType}</span>
            <span>${e.vCurrDate}</span><br>`
    }).join("")   
    }

    filterData();
});

UI();
balanceEnquiry();



