
const supabaseUrl = 'https://orldomgmamcwxjstmvdp.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ybGRvbWdtYW1jd3hqc3RtdmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Mjc5NjAsImV4cCI6MjA1ODUwMzk2MH0.X57ES0JZ3LOC_zCVhJn8rP4ShuFVXG2eLOUKxxTvBRk';
const supabase = createClient(supabaseUrl, supabaseKey);


async function checkUserLoggedIn() {
    const user = supabase.auth.user();
    if (!user) {
        
        window.location.href = 'index.html';
    }
    return user;
}


document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Erro no login: ' + error.message);
    } else {
        window.location.href = 'todolist.html';  
    }
});


document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }

    const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        document.getElementById('message').innerText = 'Erro: ' + error.message;
    } else {
        
        await supabase
            .from('users') 
            .insert([{ name, email, user_id: user.id }]);

        document.getElementById('message').innerText = 'Cadastro realizado com sucesso!';
        setTimeout(() => window.location.href = 'index.html', 2000); 
    }
});


async function loadTasks() {
    const user = await checkUserLoggedIn();
    const { data: tasks, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);

    if (error) {
        console.error('Erro ao carregar tarefas: ', error.message);
        return;
    }

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';  
    
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


async function saveTask(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const user = await checkUserLoggedIn();

    const { data, error } = await supabase
        .from('tasks')
        .insert([{
            title,
            description,
            due_date: dueDate,
            user_id: user.id
        }]);

    if (error) {
        alert('Erro ao adicionar tarefa: ' + error.message);
    } else {
        loadTasks();  
        closeModal();  
    }
}


async function deleteTask(taskId) {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

    if (error) {
        alert('Erro ao excluir tarefa: ' + error.message);
    } else {
        loadTasks();  
    }
}

async function markAsCompleted(taskId) {
    const { error } = await supabase
        .from('tasks')
        .update({ completed: true })
        .eq('id', taskId);

    if (error) {
        alert('Erro ao marcar tarefa como concluída: ' + error.message);
    } else {
        loadTasks();  
    }
}


function openModal() {
    document.getElementById('taskModal').style.display = 'flex';
}


function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', loadTasks);
