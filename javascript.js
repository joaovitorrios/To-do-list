
function openModal() {
    document.getElementById('taskModal').style.display = 'flex';
}


function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}


document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;

    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <div>
            <h3>${title}</h3>
            <p>${description}</p>
            <p><strong>Data de Vencimento:</strong> ${dueDate ? dueDate : 'Não definida'}</p>
        </div>
        <button onclick="deleteTask(this)">Excluir</button>
    `;

    document.getElementById('task-list').appendChild(taskItem);
    closeModal(); 
});


function deleteTask(button) {
    const task = button.closest('li');
    task.remove();
}
