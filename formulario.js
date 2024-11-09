document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const filterButton = document.getElementById('filterButton');
    let tasks = [];
    let filterStatus = 'all';

    // Função para adicionar uma nova tarefa ao array
    taskForm.addEventListener('submit', event => {
        event.preventDefault();

        const taskName = document.getElementById('taskName').value;
        const taskDate = document.getElementById('taskDate').value;
        const taskPriority = document.getElementById('taskPriority').value;

        const newTask = {
            name: taskName,
            date: taskDate,
            completed: false,
            priority: taskPriority
        };

        tasks.push(newTask);
        renderTasks();
        taskForm.reset();
    });

    // Função para renderizar as tarefas na lista
    function renderTasks() {
        taskList.innerHTML = '';

        // Filtro de tarefas
        const filteredTasks = tasks.filter(task => {
            if (filterStatus === 'all') return true;
            return filterStatus === 'completed' ? task.completed : !task.completed;
        });

        // Ordena as tarefas por prioridade e data
        filteredTasks.sort((a, b) => {
            const priorities = { alta: 1, media: 2, baixa: 3 };
            if (priorities[a.priority] === priorities[b.priority]) {
                return new Date(a.date) - new Date(b.date);
            }
            return priorities[a.priority] - priorities[b.priority];
        });

        // Encontra a tarefa mais urgente
        const today = new Date();
        const urgentTask = filteredTasks.reduce((closest, task) => {
            const taskDate = new Date(task.date);
            if (!task.completed && taskDate >= today && (!closest || taskDate < new Date(closest.date))) {
                return task;
            }
            return closest;
        }, null);

        filteredTasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.toggle('completed', task.completed);
            listItem.classList.toggle('urgent', urgentTask && task === urgentTask);

            listItem.innerHTML = `
                <span>${task.name} - ${task.date} - Prioridade: ${task.priority}</span>
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <button class="edit">Editar</button>
            `;

            const checkbox = listItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                renderTasks();
            });

            const editButton = listItem.querySelector('.edit');
            editButton.addEventListener('click', () => editTask(task));

            taskList.appendChild(listItem);
        });
    }

    // Função para alternar entre as tarefas concluídas, pendentes ou todas
    filterButton.addEventListener('click', () => {
        filterStatus = filterStatus === 'all' ? 'completed' : filterStatus === 'completed' ? 'pending' : 'all';
        filterButton.innerText = filterStatus === 'completed' ? 'Mostrar Pendentes' : filterStatus === 'pending' ? 'Mostrar Todas' : 'Filtrar Concluídas';
        renderTasks();
    });

    // Função para editar uma tarefa existente
    function editTask(task) {
        document.getElementById('taskName').value = task.name;
        document.getElementById('taskDate').value = task.date;
        document.getElementById('taskPriority').value = task.priority;
        
        taskForm.removeEventListener('submit', handleAddTask);
        taskForm.addEventListener('submit', handleEditTask);

        function handleEditTask(event) {
            event.preventDefault();
            task.name = document.getElementById('taskName').value;
            task.date = document.getElementById('taskDate').value;
            task.priority = document.getElementById('taskPriority').value;

            renderTasks();
            taskForm.reset();

            taskForm.removeEventListener('submit', handleEditTask);
            taskForm.addEventListener('submit', handleAddTask);
        }
    }

    function handleAddTask(event) {
        event.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskDate = document.getElementById('taskDate').value;
        const taskPriority = document.getElementById('taskPriority').value;

        tasks.push({ name: taskName, date: taskDate, completed: false, priority: taskPriority });
        renderTasks();
        taskForm.reset();
    }
    
    taskForm.addEventListener('submit', handleAddTask);
});
