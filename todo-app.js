(function toDo() {
  function addToStorage(key, todos) {
    localStorage.setItem(key, JSON.stringify(todos));
  }

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создание формы ввода задачи
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary', 'disabled');
    button.textContent = 'Добавить дело';

    input.oninput = function activateBtn() {
      button.classList.remove('disabled');
      if (input.value === '') button.classList.add('disabled');
    };

    form.onsubmit = function doneBtn() {
      button.classList.add('done', 'disabled');
    };

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // создание списка элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создание задачи
  function createTodoItem(todo) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = todo.name;
    buttonGroup.classList.add('btn-group', 'button-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // добавление задачи в список и выведение её на экран
  function addTodoItem(todos, todoList, todo, key) {
    let todoItem = createTodoItem(todo);
    todoItem.doneButton.addEventListener('click', () => {
      todoItem.item.classList.toggle('list-group-item-success');
      todo.isDone = !(todo.isDone);
      addToStorage(key, todos);
    });
    todoItem.deleteButton.addEventListener('click', () => {
      if (window.confirm('Вы уверены?')) {
        todoItem.item.remove();
        todos.splice(todos.indexOf(todo), 1);
        addToStorage(key, todos);
      }
    });
    todoList.append(todoItem.item);
    if (todo.isDone) {
      todoItem.item.classList.add('list-group-item-success');
    }
  }

  function initialState(key, todosInit, todoList) {
    let todosFromLS = JSON.parse(localStorage.getItem(key));
    let todos = todosFromLS || addToStorage(key, todosInit);
    for (let todo of todos) {
      addTodoItem(todos, todoList, todo, key);
    }
    return todos;
  }

  // создать приложение
  function createTodoApp(container, title = 'Список дел', key, deals) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // добавить дела по умолчанию
    let todos = initialState(key, deals, todoList);
    // создание события submit на форме
    todoItemForm.form.addEventListener('submit', (e) => {
      // предовратить стандартное действие браузера - перезагружку страницы при отправке формы
      e.preventDefault();

      // игнорировать создание элемента, если в imput пусто
      if (!todoItemForm.input.value) {
        return;
      }
      // создать и добавить в список новое дело
      // todoList.append(createTodoItem(todoItemForm.input.value).item);
      let todoNew = {
        name: todoItemForm.input.value,
        isDone: false,
      };
      todos.push(todoNew);
      addToStorage(key, todos);
      addTodoItem(todos, todoList, todoNew, key);

      todoItemForm.input.value = '';
    });
  }

  window.createTodoApp = createTodoApp;
}());
