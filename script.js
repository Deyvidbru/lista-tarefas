document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskTime = document.getElementById('task-time');
    const taskCategory = document.getElementById('task-category');
    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-list');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    let tasks = JSON.parse(localStorage.getItem('plannerTasks')) || [];

    function saveTasks() {
        localStorage.setItem('plannerTasks', JSON.stringify(tasks));
    }

    function renderTask(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.id = task.id;

        if (task.completed) {
            taskItem.classList.add('completed');
        }

        taskItem.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked disabled' : ''}>
            <div class="task-details">
                <p class="task-text-content">${task.description}</p>
                <div class="task-metadata">
                    <span class="category">${task.category}</span>
                    ${task.time ? `<span class="time">${task.time}</span>` : ''}
                </div>
            </div>
            <button class="delete-btn">🗑️</button>
        `;

        if (task.completed) {
            completedList.appendChild(taskItem);
        } else {
            todoList.appendChild(taskItem);
        }

        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks(); 
            taskItem.remove(); 
            updateProgress();
        });

        taskItem.querySelector('.complete-checkbox').addEventListener('change', (e) => {
            task.completed = true;
            saveTasks(); 
            
            taskItem.classList.add('completed');
            completedList.appendChild(taskItem);
            e.target.disabled = true;
            updateProgress();
        });
    }

    function updateProgress() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;

        if (totalTasks === 0) {
            progressBar.style.width = '0%';
            progressText.textContent = '0%';
            return;
        }

        const percentage = Math.round((completedTasks / totalTasks) * 100);
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = taskInput.value;
        const time = taskTime.value;
        const category = taskCategory.value;

        if (description.trim() === '') {
            alert('Por favor, insira uma descrição para a tarefa.');
            return;
        }

        const newTask = {
            id: Date.now(),
            description: description,
            time: time,
            category: category,
            completed: false
        };

        tasks.push(newTask); 
        saveTasks(); 
        renderTask(newTask); 

        taskForm.reset();
        taskInput.focus();
        updateProgress();
    });

    function initialize() {
        tasks.forEach(task => renderTask(task));
        updateProgress();
    }

    initialize(); 
});