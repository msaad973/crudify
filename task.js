document.addEventListener('DOMContentLoaded', () => {
    fetch('navbar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));
});

const userTodoItems = document.querySelector('.todo-list');
document.addEventListener('DOMContentLoaded', function () {
    displayTasks();
});

const getData = async () => {
    console.log('Fetching user todos...');
    const res = await fetch(`https://dummyjson.com/users/${localStorage.getItem('userId')}/todos`);
    const data = await res.json();

    // Merge local todos with fetched todos
    const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
    const mergedTodos = [...data.todos, ...localTodos];

    return { todos: mergedTodos };
};

const displayTasks = async () => {
    userTodoItems.innerHTML = null;
    const payload = await getData();
    const dataDisplay = payload.todos.map((task) => {
        const { todo, completed } = task;
        const completedClass = completed ? 'completed' : '';

        return `
            <div class="todo ${completedClass}">
                <li class="todo-item">${todo}</li>
                <span class="complete-btn">
                    <i class="fa-solid fa-check" style="font-size: 1.8rem;"></i>
                </span>
                <span class="trash-btn">
                    <i class="fa-regular fa-trash-can" style="font-size: 1.5rem;"></i>
                </span>
            </div>
        `;
    }).join("");

    userTodoItems.innerHTML = dataDisplay;
};

const todoInputs = document.querySelector(".todo-inputs");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");

document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodos);
todoList.addEventListener("click", deleteCheck);

function addTodos(e) {
    e.preventDefault();

    const todoText = todoInputs.value.trim();
    if (todoText === "") return;

    const newTodo = {
        id: Date.now(),
        todo: todoText,
        completed: false,
        userId: localStorage.getItem('userId')
    };

    const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
    localTodos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(localTodos));

    displayTasks();
    todoInputs.value = "";
    showToast('success', 'Task added successfully.');
}

function deleteCheck(e) {
    const items = e.target;

    if (items.closest(".trash-btn")) {
        const todo = items.closest('.todo');
        const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
        const todoText = todo.querySelector('.todo-item').textContent;

        const updatedTodos = localTodos.filter(item => item.todo !== todoText);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));

        todo.classList.add("fall");
        todo.addEventListener("transitionend", function () {
            todo.remove();
        });
    }

    if (items.closest(".complete-btn")) {
        const todo = items.closest('.todo');
        const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
        const todoText = todo.querySelector('.todo-item').textContent;

        const updatedTodos = localTodos.map(item => {
            if (item.todo === todoText) {
                item.completed = !item.completed;
            }
            return item;
        });

        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        todo.classList.toggle("completed");
    }
}


function getTodos() {
    const localTodos = JSON.parse(localStorage.getItem('todos')) || [];

    localTodos.forEach(function (todo) {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        if (todo.completed) todoDiv.classList.add("completed");

        const newTodo = document.createElement("li");
        newTodo.classList.add("todo-item");
        newTodo.innerText = todo.todo;
        todoDiv.appendChild(newTodo);

        const completedButton = document.createElement("span");
        completedButton.innerHTML = '<i class="fa-solid fa-check" style="font-size: 1.8rem;"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        const trashButton = document.createElement("span");
        trashButton.innerHTML = '<i class="fa-regular fa-trash-can" style="font-size: 1.5rem;"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);
    });
}
