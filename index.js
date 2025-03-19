const colors = {
    GREEN: '#A8E6A1',  // Пастельный зеленый
    BLUE: '#A0C4FF',   // Пастельный синий
    YELLOW: '#FFEC99',  // Пастельный желтый
    PURPLE: '#D4A5D9',  // Пастельный фиолетовый
    RED: '#FFABAB',
};

const MOCK_NOTES = [
    { id: 1, title: 'Flexbox (CSS)', text: 'CSS Flexible Box Layout, широко известный как Flexbox, представляет собой модель веб-макета CSS. Он находится на стадии рекомендации кандидата W3C. Гибкий макет позволяет автоматически располагать адаптивные элементы внутри контейнера в зависимости от размера области просмотра.', color: colors.GREEN, favorited: false },
    { id: 2, title: 'JavaScript', text: 'JavaScript — мультипарадигменный язык программирования. Поддерживает объектно-ориентированный, императивный и функциональный стили. Является реализацией спецификации ECMAScript. JavaScript обычно используется как встраиваемый язык для программного доступа к объектам приложений.', color: colors.BLUE, favorited: true },
    { id: 3, title: 'React.js', text: 'React — JavaScript-библиотека с открытым исходным кодом для разработки пользовательских интерфейсов. React разрабатывается и поддерживается Facebook, Instagram и сообществом отдельных разработчиков и корпораций. React может использоваться для разработки одностраничных и мобильных приложений.', color: colors.YELLOW, favorited: false },
    { id: 4, title: 'Node.js', text: 'Node или Node.js — программная платформа, основанная на движке V8, превращающая JavaScript из узкоспециализированного языка в язык общего назначения.', color: colors.PURPLE, favorited: true },
    { id: 5, title: 'MongoDB', text: 'MongoDB — документоориентированная система управления базами данных, не требующая описания схемы таблиц. Считается одним из классических примеров NoSQL-систем, использует JSON-подобные документы и схему базы данных. Написана на языке C++. Применяется в веб-разработке, в частности, в рамках JavaScript-ориентированного стека MEAN.', color: colors.RED, favorited: false }
];

const model = {
    notes: MOCK_NOTES,
    addNote(title, content, color) {
        const note = {
            id: Date.now(),
            title,
            text: content,
            color,
            favorited: false
        };
        this.notes.unshift(note);
    },
    toggleFavorites(noteId) {
        const note = this.notes.find(note => note.id === noteId);
        if (note) note.favorited = !note.favorited;
    },
    deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId);
    },
    getFavoriteNotes() {
        return this.notes.filter(note => note.favorited);
    }
};

const view = {
    renderNotes(notes) {
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';
        this.updateNotesCount();
        if (notes.length === 0) {
            notesList.innerHTML = '<p>Нет заметок.</p>';
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
        document.getElementById('count-notes').textContent = `Всего заметок: ${notesToCount.length}`;
    }
};

const controller = {
    render() {
        const isFiltered = document.getElementById('filter-favorites').checked;
        const notesToRender = isFiltered ? model.getFavoriteNotes() : model.notes;
        view.renderNotes(notesToRender);
    },
    init() {
        this.render();
        document.getElementById('add-note-button').addEventListener('click', () => {
            const titleInput = document.querySelector('.note-title');
            const contentInput = document.querySelector('#note-text');
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            const selectedColorKey = document.querySelector('input[name="color"]:checked').value.toUpperCase();
            const color = colors[selectedColorKey] || colors.YELLOW;

            if (!title || !content) {
                showMessage("Заполните все поля", "error");
                return;
            }
            if (title.length > 50) {
                showMessage("Максимальная длина заголовка - 50 символов", "error");
                return;
            }
            model.addNote(title, content, color);
            this.render();
            showMessage("Заметка добавлена", "success");
            titleInput.value = '';
            contentInput.value = '';
            document.querySelector('input[name="color"][value="yellow"]').checked = true;
        });
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

function showMessage(text, type) {
    const messageBox = document.querySelector('.messages-box');
    const message = document.createElement('div');
    message.classList.add('message', type);
    const icon = document.createElement('img');
    icon.src = type === "error" ? "images/icons/warning.svg" : "images/icons/done.svg";
    icon.alt = type === "error" ? "Ошибка" : "Успешно";
    icon.width = 24;
    icon.height = 24;
    const messageText = document.createElement('span');
    messageText.textContent = text;
    message.appendChild(icon);
    message.appendChild(messageText);
    messageBox.appendChild(message);
    setTimeout(() => {
        message.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    controller.init();
    document.querySelector('input[name="color"][value="yellow"]').checked = true;
});
