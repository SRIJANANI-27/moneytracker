document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const tasksBody = document.getElementById('tasksBody');
    const totalAmountElem = document.getElementById('totalAmount');

    // Function to move focus to the next field
    const moveToNextField = (currentInput, nextInput) => {
        currentInput.addEventListener('change', () => {
            if (currentInput.value) {
                nextInput.focus();
            }
        });
    };

    // Automatically move cursor to the next field when the current one is completed
    moveToNextField(titleInput, descriptionInput);
    moveToNextField(descriptionInput, amountInput);
    moveToNextField(amountInput, dateInput);

    // Function to get tasks from localStorage or initialize as an empty array
    const getTasksFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    };

    // Function to save tasks to localStorage
    const saveTasksToLocalStorage = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to format amount with commas
    const formatAmount = (value) => {
        const cleanValue = value.replace(/[^0-9.]/g, '');
        return parseFloat(cleanValue).toLocaleString();
    };

    // Function to parse amount by removing commas
    const parseAmount = (value) => {
        return parseFloat(value.replace(/,/g, '')) || 0;
    };

    // Function to format date as 12-Feb-2024
    const formatDate = (dateString) => {
        if (!dateString) return "No Date";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Function to render tasks in the table
    const renderTasks = () => {
        const tasks = getTasksFromLocalStorage();
        tasksBody.innerHTML = '';
        tasks.forEach((task, index) => {
            const rowClass = task.title === 'income' ? 'income' : 'expense';
            const row = `<tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${parseFloat(task.amount).toLocaleString()}</td>
                <td>${formatDate(task.date)}</td>
                <td><button class="btn btn-delete" data-index="${index}"></button></td>
            </tr>`;
            tasksBody.insertAdjacentHTML('beforeend', row);
        });

        const totalAmount = tasks.reduce((total, task) => total + parseFloat(task.amount || 0), 0);
        totalAmountElem.textContent = totalAmount.toLocaleString();
    };

    // Handle amount input change to format value with commas
    const handleAmountInputChange = (e) => {
        const value = e.target.value;
        e.target.value = formatAmount(value);
    };

    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = titleInput.value;
        const description = descriptionInput.value;
        const amount = parseAmount(amountInput.value);
        const date = dateInput.value;

        if (!title || !description || isNaN(amount)) {
            alert('Please fill in all required fields.');
            return;
        }

        const tasks = getTasksFromLocalStorage();
        tasks.push({ title, description, amount, date });
        saveTasksToLocalStorage(tasks);
        renderTasks();

        // Reset form fields
        taskForm.reset();
        titleInput.focus();
    });

    // Handle delete button click
    tasksBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const index = e.target.getAttribute('data-index');
            let tasks = getTasksFromLocalStorage();
            tasks.splice(index, 1);
            saveTasksToLocalStorage(tasks);
            renderTasks();
        }
    });

    // Format amount input with commas as user types
    amountInput.addEventListener('input', handleAmountInputChange);

    // Render tasks on page load
    renderTasks();
});
