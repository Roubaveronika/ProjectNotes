const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    YELLOW: 'yellow',
    PURPLE: 'purple',
    RED: 'red',
};

// Тестовый массив заметок
const MOCK_NOTES = [
    { id: 1, title: 'Flexbox (CSS)', text: 'Lorem ipsum dolor sit amet...', color: colors.GREEN, favorited: false },
    { id: 2, title: 'JavaScript', text: 'Sed ut perspiciatis unde omnis...', color: colors.BLUE, favorited: true },
    { id: 3, title: 'React.js', text: 'Nemo enim ipsam voluptatem...', color: colors.YELLOW, favorited: false },
    { id: 4, title: 'Node.js', text: 'Neque porro quisquam est...', color: colors.PURPLE, favorited: true },
    { id: 5, title: 'MongoDB', text: 'At vero eos et accusamus...', color: colors.RED, favorited: false }
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
            noteElement.style.backgroundColor = note.color;
            noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.text}</p>
            <div class="note-buttons">
              <button class="favorite-button">
                <img src="images/icons/${note.favorited ? 'heart-active.svg' : 'heart-inactive.svg'}" alt="Favorite" width="24">
              </button>
              <button class="delete-button">
                <img src="images/icons/trash.svg" alt="Delete" width="24">
              </button>
            </div>
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
            const selectedColor = document.querySelector('input[name="color"]:checked').value; // сохраняем состояние фильтра

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

            model.addNote(title, content, selectedColor);
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
    message.textContent = text;
    message.classList.add('message', type);
    messageBox.appendChild(message);
    setTimeout(() => {
        message.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    controller.init();
    // Устанавливаем желтый цвет по умолчанию при загрузке
    document.querySelector('input[name="color"][value="yellow"]').checked = true;
});