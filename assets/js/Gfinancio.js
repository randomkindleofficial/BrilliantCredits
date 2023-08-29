const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#form");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const cat = document.querySelector("#cat");
const meth = document.querySelector("#meth");
const date = document.querySelector("#date");

/*
const dummyData = [
  { id: 1, description: "Flower", amount: -20 },
  { id: 2, description: "Salary", amount: 35000 },
  { id: 3, description: "Book", amount: 10 },
  { id: 4, description: "Camera", amount: -150 },
  { id: 5, description: "Petrol", amount: -250 },
];

let transactions = dummyData;
*/

let transactions = [];

function loadTransactionDetails(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "exp" : "inc");
    item.innerHTML = `
    <span>${new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
    <span>${transaction.description}</span>
    <span style="margin-bottom:10px;">${sign} ${Math.abs(transaction.amount)}</span>
    <span style="font-size:13px; margin-right:5px; position: absolute; bottom: 0; right: 0;">${transaction.cat}:${transaction.meth}</span>
    <button class="btn-del" onclick="removeTrans(${transaction.id})">x</button>
`;
    trans.appendChild(item);
    //console.log(transaction);
}

function removeTrans(id) {
    if (confirm("Are you sure you want to delete transcation?")) {
        transactions = transactions.filter((transaction) => transaction.id != id);
        config();
        updateLocalStorage();
    } else {
        return;
    }
}

function updateAmount() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    balance.innerHTML = `₹  ${total}`;

    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    inc_amt.innerHTML = `₹  ${income}`;

    const expense = amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    exp_amt.innerHTML = `₹  ${Math.abs(expense)}`;
}
async function config() {
    await fetch('/Gfinancio/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(result => {
       localStorage.setItem('Gtrans',JSON.stringify(Object.values(result)))   
      })
      .catch(error => {
        console.log(error);
      });
    transactions = localStorage.getItem("Gtrans") !== null ? JSON.parse(localStorage.getItem("Gtrans")) : [];
    trans.innerHTML = "";
    transactions.sort((a, b) => b.date - a.date).forEach(loadTransactionDetails);
    updateAmount();
}

function addTransaction(e) {
    e.preventDefault();
    if (amount.value.trim() == "") {
        alert("Please Enter Description and amount");
    } else {
        const transaction = {
            id: Math.floor(Math.random() * 10000000),
            description: description.value,
            amount: +amount.value,
            cat: cat.value,
            meth: meth.value,
            date: new Date(date.value).getTime()
        };
        transactions.push(transaction);
        loadTransactionDetails(transaction);
        form.reset();
        updateAmount();
        updateLocalStorage();
    }
}

form.addEventListener("submit", addTransaction);

window.addEventListener("load", function () {
    config();
});

async function updateLocalStorage() {
    localStorage.setItem("Gtrans", JSON.stringify(transactions));
   
    var objectOfObjects = {};
    transactions.forEach(obj => {
        objectOfObjects[obj.id] = obj;
    });
    await fetch('/Gfinancio/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectOfObjects)
      })
      .catch(error => {
        console.log(error);
      });
}



const toggleFormButton = document.getElementById('toggleForm');
toggleFormButton.addEventListener('click', function () {
    const form = document.getElementById('form');
    const statbar = document.getElementById('statbar');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    statbar.style.display = statbar.style.display === 'block' ? 'none' : 'block';
});

const toggleDetails = document.getElementById('toggleDetails');
toggleDetails.addEventListener('click', function () {
    const ledger = document.getElementById('ledger');
    const transaction = document.getElementById('transaction');
    ledger.style.display = ledger.style.display === 'none' ? 'block' : 'none';
    transaction.style.display = transaction.style.display === 'block' ? 'none' : 'block';
});
const toggleDetails_ = document.getElementById('toggleDetails_');
toggleDetails_.addEventListener('click', function () {
    const ledger = document.getElementById('ledger');
    const transaction = document.getElementById('transaction');
    ledger.style.display = ledger.style.display === 'none' ? 'block' : 'none';
    transaction.style.display = transaction.style.display === 'block' ? 'none' : 'block';
});

function toggleDescriptionInput(x) {

    if (x.value !== "Other") {
        document.getElementById("desc").value = "~";
    } else {
        document.getElementById("desc").value = "";
    }
}


function convertMillisecondsToDate(milliseconds) {
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
