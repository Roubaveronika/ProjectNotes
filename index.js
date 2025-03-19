const colors = {
        GREEN: '#A8E6A1',  // Пастельный зеленый
        BLUE: '#A0C4FF',   // Пастельный синий
        YELLOW: '#FFEC99',  // Пастельный желтый
        PURPLE: '#D4A5D9',  // Пастельный фиолетовый
        RED: '#FFABAB',
};

// Тестовый массив заметок
const MOCK_NOTES = [
    { id: 1, title: 'Flexbox (CSS)', text: 'Cascading Style Sheets (CSS) is a stylesheet language used to describe the presentation of a document written in HTML or XML (including XML dialects such as SVG, MathML or XHTML). CSS describes how elements should be rendered on screen, on paper, in speech, or on other media..', color: colors.GREEN, favorited: false },
    { id: 2, title: 'JavaScript', text: 'JavaScript is the Programming Language for the Web. JavaScript can update and change both HTML and CSS. JavaScript can calculate, manipulate and validate data.', color: colors.BLUE, favorited: true },
    { id: 3, title: 'React.js', text: 'HTML is a markup language while React is a JavaScript library. Both are used in front-end development and you might have heard about them while designing websites or web apps.', color: colors.YELLOW, favorited: false },
    { id: 4, title: 'Node.js', text: 'The primary difference between React and Node is where they are used. Nodejs is used to develop the server-side of an application, and Reactjs is used in building the user interfaces. Nodejs is easier to learn, However it is difficult to implement web applications with it.', color: colors.PURPLE, favorited: true },
    { id: 5, title: 'MongoDB', text: 'MongoDB is a tool that can manage document-oriented information, store or retrieve information. MongoDB is used for high-volume data storage, helping organizations store large amounts of data while still performing rapidly.', color: colors.RED, favorited: false }
];

// Модель – только данные (без вызова render внутри)
const model = {
    notes: MOCK_NOTES,
    addNote(title, content, color) {
        const note = {
            id: Date.now(),
            title: title,
            text: content,
            color: color,
            favorited: false
        };
        this.notes.unshift(note);
    },
    toggleFavorites(noteId) {
        const note = this.notes.find(note => note.id === noteId);
        if (note) {
            note.favorited = !note.favorited;
        }
    },
    deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId);
    },
    getFavoriteNotes() {
        return this.notes.filter(note => note.favorited);
    }
};

// View – отвечает за отрисовку
const view = {
    renderNotes(notes) {
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = ''; // Очищаем список заметок
        this.updateNotesCount();
        if (notes.length === 0) {
            notesList.innerHTML = '<p>У вас нет еще ни одной заметки. Заполните поля выше и создайте свою первую заметку!</p>';
            return;
        }
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
<div class="note-header" style="background-color:${note.color};">
            <h3 class="note-title">${note.title}</h3>
            <div class="note-icons">
         <button class="favorite-button">
                    <img src="images/icons/${note.favorited ? 'heart-active.svg' : 'heart-inactive.svg'}" alt="Favorite" width="16">
                </button>
                <button class="delete-button">
                    <img src="images/icons/trash.svg" alt="Delete" width="16">
                </button>
            </div>
        </div>
            <p class="note-text">${note.text}</p>
          `;
            noteElement.querySelector('.favorite-button').addEventListener('click', () => {
                controller.toggleFavorites(note.id);
            });
            noteElement.querySelector('.delete-button').addEventListener('click', () => {
                controller.deleteNote(note.id);
            });
            notesList.appendChild(noteElement);
        });
    },
    updateNotesCount() {
        const isFiltered = document.getElementById('filter-favorites').checked;
        const notesToCount = isFiltered ? model.getFavoriteNotes() : model.notes;
        const countNotes = document.getElementById('count-notes');
        countNotes.textContent = `Всего заметок: ${notesToCount.length}`;
    }
};

// Контроллер – отвечает за логику, обновление данных и отрисовку с учетом фильтра
const controller = {
    render() {
        const isFiltered = document.getElementById('filter-favorites').checked;
        const notesToRender = isFiltered ? model.getFavoriteNotes() : model.notes;
        view.renderNotes(notesToRender);
    },
    init() {
        this.render();

        // Обработчик для добавления новой заметки
        document.getElementById('add-note-button').addEventListener('click', () => {
            const titleInput=document.querySelector('.note-title');
            const contentInput=document.querySelector('#note-text');
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            const selectedColor = document.querySelector('input[name="color"]:checked').value;
            const color = colors[selectedColor];
            if (!title || !content) {
                showMessage("Заполните все поля", "error");
                return;
            }
            if (title.length > 50) {
                showMessage("Максимальная длина заголовка - 50 символов", "error");
                return;
            }
            const isFiltered=document.getElementById('filter-favorites').checked;
            if (isFiltered) {
                view.renderNotes(model.getFavoriteNotes());
            } else {
                controller.render()
            }

            model.addNote(title, content, color);
            showMessage("Заметка добавлена", "success");

            titleInput.value = '';
            contentInput.value = '';
           document.querySelector('input[name="color"][value="yellow"]').checked = true; // устанавливаем желтый цвет по умолчанию

            // Сброс формы: очищаем поля и устанавливаем желтый цвет по умолчанию
            document.querySelector('.note-title').value = '';
            document.querySelector('#note-text').value = '';
            document.querySelector('input[name="color"][value="yellow"]').checked = true;

            // Обновляем отображение с учетом состояния фильтра
            if (isFiltered) {
                view.renderNotes(model.getFavoriteNotes());
            } else {
                this.render();
            }
        });

        // Обработчик изменения фильтра
        document.getElementById('filter-favorites').addEventListener('change', () => {
            this.render();
        });
    },
    toggleFavorites(noteId) {
        model.toggleFavorites(noteId);
        this.render();
    },
    deleteNote(noteId) {
        model.deleteNote(noteId);
        showMessage("Заметка удалена", "success");
        this.render();
    }
};

// Функция для вывода сообщений (с анимацией)
function showMessage(text, type) {
    const messageBox = document.querySelector('.messages-box');
    const message = document.createElement('div');
    message.classList.add('message', type);

    // Создаем иконку
    const icon = document.createElement('img');
    icon.src = type === "error" ? "images/icons/warning.svg" : "images/icons/done.svg";
    icon.alt = type === "error" ? "Ошибка" : "Успешно";
    icon.width = 24;
    icon.height = 24;

    // Создаем текстовое содержимое
    const messageText = document.createElement('span');
    messageText.textContent = text;

    // Добавляем иконку и текст внутрь сообщения
    message.appendChild(icon);
    message.appendChild(messageText);

    // Добавляем сообщение в контейнер
    messageBox.appendChild(message);

    // Удаляем сообщение через 3 секунды
    setTimeout(() => {
        message.remove();
    }, 3000);
}
document.addEventListener('DOMContentLoaded', () => {
    controller.init();
    // Устанавливаем желтый цвет по умолчанию при загрузке
    document.querySelector('input[name="color"][value="yellow"]').checked = true;
});