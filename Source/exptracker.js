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
let transactions = [];
let vSno = 0
transactions = JSON.parse(localStorage.getItem('Transactions')) || [];


function init(){
    UI();
    balanceEnquiry();
}


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

    vSno = transactions.length > 0 ? Math.max(...transactions.map(e => e.vSno)) + 1 : 1;

    getFormValueWithValidation();
    saveData();
    UI();
    balanceEnquiry();
});


function getFormValueWithValidation() {

    if (discreptionEl.value.trim() != "" && amountEl.value.trim() != "" && vType != "") {
        let discreptionValue = discreptionEl.value;
        let amountValue = amountEl.value;
        let vCurrDate = new Date();
        let currFormData = { vSno , discreptionValue, amountValue, vType, vCurrDate };
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
                <span> ${e.vCurrDate}</span> <button onclick="DeleteRow(${e.vSno})" id="deleteBtn">X</button>  <br>`
    }).join("")
    
    
};


function DeleteRow(deletedNo){
    transactions = transactions.filter((e)=>{
        return deletedNo !== e.vSno;
    })
    
    saveData();
    UI();
    balanceEnquiry();
    filterData();
    
}

function saveData() {
    localStorage.setItem("Transactions", JSON.stringify(transactions));
    discreptionEl.value = "";
    amountEl.value = "";
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



//For Balance Enquiry
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


function filterData(){
        let vfilterInput = document.getElementById("filter-input");
    let vfilterType = document.getElementById("filter-type");
    let vFilterInputValue = new Date(vfilterInput.value);
    let vfilterTypeValue = vfilterType.value;

        let filDate = transactions.filter((e) => {
            let vCurrDate1 = new Date(e.vCurrDate);

            return vFilterInputValue <= vCurrDate1 && vfilterTypeValue == "A" ?
                vFilterInputValue <= vCurrDate1 :
                vFilterInputValue <= vCurrDate1 && vfilterTypeValue == e.vType;
        });

        let filteredData = document.getElementById("filterd-data");
        filteredData.innerHTML = filDate.map((e) => {
            return `
            <span>${e.vSno}</span>
            <span>${e.discreptionValue}</span>
            <span>${e.amountValue}</span>
            <span>${e.vType}</span>
            <span>${e.vCurrDate}</span><br>`
        }).join("")
  
    };

//For Filter Record
vfilterClick.addEventListener('click', function () {  
    filterData();
});

//Run When Application Load
init();