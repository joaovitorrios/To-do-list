// Inicializando o Supabase com a URL e a chave pública
const supabaseUrl = 'https://orldomgmamcwxjstmvdp.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ybGRvbWdtYW1jd3hqc3RtdmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Mjc5NjAsImV4cCI6MjA1ODUwMzk2MH0.X57ES0JZ3LOC_zCVhJn8rP4ShuFVXG2eLOUKxxTvBRk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para abrir o modal
function openModal() {
    document.getElementById('taskModal').style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}

// Carregar as tarefas do banco de dados
async function loadTasks() {
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', supabase.auth.user()?.id);  // Filtra as tarefas pelo ID do usuário logado

    if (error) {
        console.error(error.message);
        return;
    }

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpa a lista antes de adicionar novamente as tarefas

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p><strong>Data de Vencimento:</strong> ${task.due_date || 'Não especificada'}</p>
            </div>
            <button onclick="deleteTask(${task.id})">Excluir</button>
            <button onclick="markAsCompleted(${task.id})">${task.completed ? 'Concluída' : 'Marcar como Concluída'}</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Função para adicionar tarefa ao banco de dados
document.getElementById('task-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const userId = supabase.auth.user()?.id;  // Pega o ID do usuário logado

    // Insere a nova tarefa no banco de dados
    const { data, error } = await supabase
        .from('tasks')
        .insert([
            { title, description, due_date: dueDate, user_id: userId }
        ]);

    if (error) {
        alert(error.message);
    } else {
        loadTasks();  // Recarrega as tarefas na página
        closeModal();  // Fecha o modal
    }
});

// Função para excluir tarefa
async function deleteTask(taskId) {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);  // Exclui a tarefa com o ID correspondente

    if (error) {
        alert(error.message);
    } else {
        loadTasks();  // Recarrega as tarefas na página
    }
}

// Função para marcar tarefa como concluída
async function markAsCompleted(taskId) {
    const { error } = await supabase
        .from('tasks')
        .update({ completed: true })
        .eq('id', taskId);  // Marca a tarefa como concluída

    if (error) {
        alert(error.message);
    } else {
        loadTasks();  // Recarrega as tarefas na página
    }
}

// Função de login
async function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        alert(error.message);
    } else {
        window.location.href = 'todolist.html';  // Redireciona para a página de tarefas
    }
}

// Função de registro
async function registerUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert(error.message);
    } else {
        alert('Conta criada com sucesso!');
        window.location.href = 'index.html';  // Redireciona para a página de login
    }
}

// Carrega as tarefas ao abrir a página de tarefas
document.addEventListener('DOMContentLoaded', loadTasks);
