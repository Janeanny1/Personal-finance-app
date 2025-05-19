async function loadCategories() {
  const res = await fetch("http://localhost:5000/categories");
  const data = await res.json();
  const select = document.getElementById("category");
  data.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.innerText = cat.name;
    select.appendChild(option);
  });
}

document.getElementById("transactionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost:5000/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: localStorage.getItem("userId"),
      category_id: document.getElementById("category").value,
      amount: parseFloat(document.getElementById("amount").value),
      description: document.getElementById("description").value,
      date: document.getElementById("date").value
    })
  });
  const data = await res.json();
  alert(data.message);
  loadTransactions(localStorage.getItem('userId'));
});

document.getElementById("budgetForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost:5000/budget", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: localStorage.getItem("userId"),
      category_id: document.getElementById("budgetCategory").value,
      amount: parseFloat(document.getElementById("budgetAmount").value)
    })
  });
  const data = await res.json();
  alert(data.message);
});

async function loadBudgetOverview() {
  const res = await fetch(`http://localhost:5000/budget-usage/${localStorage.getItem('userId')}`);
  const data = await res.json();
  const container = document.getElementById("budgetOverview");
  container.innerHTML = "";

  data.forEach(b => {
    const percent = Math.min((b.spent / b.budget) * 100, 100);
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${b.category}</strong> - Spent: ${b.spent} / ${b.budget}
      <div style="background:#ccc; border-radius:6px; overflow:hidden; margin-bottom:10px;">
        <div style="width:${percent}%; background:${percent >= 100 ? '#e74c3c' : '#2ecc71'}; height:20px;"></div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Initially load categories and transactions
loadCategories();
loadTransactions(localStorage.getItem('userId'));
loadBudgetOverview();
