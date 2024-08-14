document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add');
    const taskList = document.getElementById('taskList');
    const clearAllBtn = document.getElementById('clear');
    const sortTasksBtn = document.getElementById('sort');

    let tasks = loadTasks();
    renderTasks();

    function addTask() {
        const task = taskInput.value.trim();
        if (task) {
            tasks.push({ text: task, completed: false });
            saveTask(task, false);
            renderTasks();
            taskInput.value = '';
        }
    }

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    clearAllBtn.addEventListener('click', () => {
        localStorage.clear();
        tasks = [];
        renderTasks();
    });

    sortTasksBtn.addEventListener('click', () => {
        tasks.sort((a, b) => a.text.localeCompare(b.text));
        renderTasks();
    });

    taskList.addEventListener('click', (e) => {
        const index = e.target.closest('li').dataset.index;

        if (e.target.classList.contains('delete-btn')) {
            tasks.splice(index, 1);
            removeTask(index);
            renderTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            const newText = prompt('Edit your task:', tasks[index].text);
            if (newText) {
                tasks[index].text = newText.trim();
                updateTask(index, newText.trim());
                renderTasks();
            }
        } else if (e.target.tagName === 'LI') {
            tasks[index].completed = !tasks[index].completed;
            updateTask(index, tasks[index].text, tasks[index].completed);
            renderTasks();
        }
    });

    function renderTasks() {
        taskList.innerHTML = tasks
            .map(
                (task, index) => `
                <li class="task-item ${task.completed ? 'completed' : ''}" data-index="${index}">
                    ${task.text}
                    <div>
                        <button class="edit-btn">&#9998;</button>
                        <button class="delete-btn">&times;</button>
                    </div>
                </li>
            `
            )
            .join('');
    }

    function saveTask(text, completed) {
        const index = tasks.length - 1;
        localStorage.setItem(`task_${index}`, text);
        localStorage.setItem(`completed_${index}`, completed);
    }

    function loadTasks() {
        const tasks = [];
        for (let i = 0; localStorage.getItem(`task_${i}`); i++) {
            tasks.push({
                text: localStorage.getItem(`task_${i}`),
                completed: localStorage.getItem(`completed_${i}`) === 'true',
            });
        }
        return tasks;
    }

    function removeTask(index) {
        localStorage.removeItem(`task_${index}`);
        localStorage.removeItem(`completed_${index}`);
        reindexTasks();
    }

    function updateTask(index, text, completed) {
        localStorage.setItem(`task_${index}`, text);
        localStorage.setItem(`completed_${index}`, completed);
    }

    function reindexTasks() {
        localStorage.clear();
        tasks.forEach((task, i) => {
            saveTask(task.text, task.completed);
        });
    }
});
