async function loadTransactions(userId, month = "") {
  const res = await fetch(`http://localhost:5000/transactions/${userId}`);
  const data = await res.json();

  let income = 0, expenses = 0;
  const table = document.getElementById("transactionTable");
  table.innerHTML = "";

  data.filter(t => {
    return month === "" || t.date.slice(5, 7) === month;
  }).forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.amount}</td>
      <td>${t.description}</td>
      <td>${t.category}</td>
      <td>
        <button onclick="deleteTransaction(${t.id})">Delete</button>
      </td>
    `;
    table.appendChild(row);

    if (t.amount > 0) income += t.amount;
    else expenses += Math.abs(t.amount);
  });

  document.getElementById("income").innerText = income.toFixed(2);
  document.getElementById("expenses").innerText = expenses.toFixed(2);
  document.getElementById("balance").innerText = (income - expenses).toFixed(2);
}

// Delete transaction
async function deleteTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    const res = await fetch(`http://localhost:5000/transactions/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message);
    loadTransactions(localStorage.getItem('userId'));
  }
}

document.getElementById("monthFilter").addEventListener("change", (e) => {
  loadTransactions(localStorage.getItem('userId'), e.target.value);
});
