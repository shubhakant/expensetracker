// State
let expenses = [];

// DOM Elements
const form = document.getElementById('expense-form');
const nameInput = document.getElementById('expense-name');
const amountInput = document.getElementById('expense-amount');
const dateInput = document.getElementById('expense-date');
const categoryInput = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list-items');
const totalAmountDisplay = document.getElementById('total-amount');

// Initialize App
function init() {
    // Set default date to today
    dateInput.valueAsDate = new Date();

    // Load data from LocalStorage
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    }

    // Render initial data
    renderExpenses();
    updateTotal();
}

// Generate Random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add New Expense
function addExpense(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const category = categoryInput.value;

    if (name === '' || isNaN(amount) || amount <= 0 || date === '' || category === '') {
        alert('Please fill out all fields with valid information.');
        return;
    }

    const expense = {
        id: generateID(),
        name,
        amount,
        date,
        category
    };

    expenses.push(expense);

    // Update UI and Storage
    renderExpenses();
    updateTotal();
    saveToLocalStorage();

    // Reset Form fields except date
    nameInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';
    nameInput.focus();
}

// Delete Expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);

    // Update UI and Storage
    renderExpenses();
    updateTotal();
    saveToLocalStorage();
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Sanitize HTML inputs to prevent XSS
function sanitizeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[^\w. ]/gi, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}

// Render Expenses to DOM
function renderExpenses() {
    const startTime = performance.now();

    expenseList.innerHTML = '';

    if (expenses.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No expenses added yet.';
        expenseList.appendChild(emptyState);
        const endTime = performance.now();
        console.log(`Rendered 0 items in ${(endTime - startTime).toFixed(2)}ms`);
        return;
    }

    // Sort by date descending
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Optimize DOM insertion using a DocumentFragment
    const fragment = document.createDocumentFragment();

    sortedExpenses.forEach(expense => {
        const li = document.createElement('li');

        // Securely sanitize user-provided text
        const safeName = sanitizeHTML(expense.name);
        const safeCategory = sanitizeHTML(expense.category);

        li.innerHTML = `
            <div class="expense-info">
                <span class="expense-name-display">${safeName}</span>
                <div class="expense-meta">
                    <span>${formatDate(expense.date)}</span>
                    <span class="expense-category-badge">${safeCategory}</span>
                </div>
            </div>
            <div class="expense-actions">
                <span class="expense-amount-display">₹${expense.amount.toFixed(2)}</span>
                <button class="btn-delete" onclick="deleteExpense(${expense.id})" title="Delete Expense">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `;

        fragment.appendChild(li);
    });

    // Single DOM update
    expenseList.appendChild(fragment);

    const endTime = performance.now();
    const renderTimeMs = parseFloat((endTime - startTime).toFixed(2));
    console.log(`Rendered ${sortedExpenses.length} items. Render time: ${renderTimeMs}ms`);

    // Store latest benchmark for UI testing comparison
    window._lastRenderBenchmark = renderTimeMs;
}

// Calculate and Update Total
function updateTotal() {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    totalAmountDisplay.textContent = `₹${total.toFixed(2)}`;
}

// Save to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Event Listeners
form.addEventListener('submit', addExpense);

// Function for performance testing (accessible via browser console)
window.generateMockData = function (count = 1000) {
    console.log(`Generating ${count} mock expenses for performance testing...`);
    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other'];
    const startTime = performance.now();

    for (let i = 0; i < count; i++) {
        expenses.push({
            id: generateID(),
            name: `Test Item ${i}`,
            amount: +(Math.random() * 100).toFixed(2),
            date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
            category: categories[Math.floor(Math.random() * categories.length)]
        });
    }

    console.log(`Data generation took ${(performance.now() - startTime).toFixed(2)}ms`);

    renderExpenses();
    updateTotal();
    // Intentionally skipping saveToLocalStorage() to avoid blooming storage during tests
}

// Start Application
init();
