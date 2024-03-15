(() => {
    let books = [];
  
    function addBook(event) {
      event.preventDefault();
  
      const titleInput = document.querySelector("#inputBookTitle");
      const authorInput = document.querySelector("#inputBookAuthor");
      const yearInput = document.querySelector("#inputBookYear");
      const isCompleteCheckbox = document.querySelector("#inputBookIsComplete");
  
      // Mengonversi variabel yearInput dari string ke integer dgn metode Number()
      const yearValue = Number(yearInput.value);
  
      const newBook = {
        id: +new Date(),
        title: titleInput.value,
        author: authorInput.value,
        year: yearValue,
        isComplete: isCompleteCheckbox.checked,
      };
  
      console.log(newBook);
  
      books.push(newBook);
      document.dispatchEvent(new Event("bookChanged"));
      displayBooks(books);
  
      // Reset input values after adding a book
      titleInput.value = "";
      authorInput.value = "";
      yearInput.value = "";
      isCompleteCheckbox.checked = false;
    }
  
    function searchBooks(event) {
      event.preventDefault();
  
      const searchTitleInput = document.querySelector("#searchBookTitle");
      const query = searchTitleInput.value.toLowerCase();
  
      const filteredBooks = query
        ? books.filter((book) => book.title.toLowerCase().includes(query))
        : books;
  
      displayBooks(filteredBooks);
      // Reset input value after searching
      searchTitleInput.value = "";
    }
  
    function markAsComplete(event) {
      const bookId = Number(event.target.id);
      updateBookStatus(bookId, true);
    }
  
    function markAsIncomplete(event) {
      const bookId = Number(event.target.id);
      updateBookStatus(bookId, false);
    }
  
    function updateBookStatus(bookId, isComplete) {
      const bookIndex = books.findIndex((book) => book.id === bookId);
  
      if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], isComplete };
        document.dispatchEvent(new Event("bookChanged"));
        displayBooks(books);
      }
    }
  
    function removeBook(event) {
      const bookId = Number(event.target.id);
      const bookIndex = books.findIndex((book) => book.id === bookId);
  
      if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event("bookChanged"));
        displayBooks(books);
      }
    }
  
    function editBook(event) {
      const bookId = Number(event.target.id);
      const bookToEdit = books.find((book) => book.id === bookId);
  
      if (bookToEdit) {
        const editedTitle = prompt("Edit Title:", bookToEdit.title);
        const editedAuthor = prompt("Edit Author:", bookToEdit.author);
        const editedYear = prompt("Edit Year:", bookToEdit.year);
  
        const editedBook = {
          ...bookToEdit,
          title: editedTitle || bookToEdit.title,
          author: editedAuthor || bookToEdit.author,
          year: editedYear || bookToEdit.year,
        };
  
        const bookIndex = books.findIndex((book) => book.id === bookId);
        if (bookIndex !== -1) {
          books[bookIndex] = editedBook;
          document.dispatchEvent(new Event("bookChanged"));
          displayBooks(books);
        }
      }
    }
  
    function displayBooks(booksToShow) {
      const incompleteBookshelfList = document.querySelector(
        "#incompleteBookshelfList"
      );
      const completeBookshelfList = document.querySelector(
        "#completeBookshelfList"
      );
  
      incompleteBookshelfList.innerHTML = "";
      completeBookshelfList.innerHTML = "";
  
      for (const book of booksToShow) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
  
        const titleElement = document.createElement("h2");
        titleElement.innerText = `Judul: ${book.title}`;
  
        const authorElement = document.createElement("p");
        authorElement.innerText = `Penulis: ${book.author}`;
  
        const yearElement = document.createElement("p");
        yearElement.innerText = `Tahun: ${book.year}`;
  
        bookItem.appendChild(titleElement);
        bookItem.appendChild(authorElement);
        bookItem.appendChild(yearElement);
  
        const actionContainer = document.createElement("div");
        actionContainer.classList.add("action");
  
        const actionButton = document.createElement("button");
        actionButton.id = book.id;
  
        if (book.isComplete) {
          actionButton.innerText = "Belum Selesai dibaca";
          actionButton.classList.add("green");
          actionButton.addEventListener("click", markAsIncomplete);
        } else {
          actionButton.innerText = "Selesai dibaca";
          actionButton.classList.add("green");
          actionButton.addEventListener("click", markAsComplete);
        }
  
        const editButton = document.createElement("button");
        editButton.id = book.id;
        editButton.innerText = "Edit";
        editButton.classList.add("blue");
        editButton.addEventListener("click", editBook);
  
        const deleteButton = document.createElement("button");
        deleteButton.id = book.id;
        deleteButton.innerText = "Hapus buku";
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", removeBook);
  
        actionContainer.appendChild(actionButton);
        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);
        bookItem.appendChild(actionContainer);
  
        if (book.isComplete) {
          completeBookshelfList.appendChild(bookItem);
        } else {
          incompleteBookshelfList.appendChild(bookItem);
        }
      }
    }
  
    function saveBooksToLocalStorage() {
      localStorage.setItem("books", JSON.stringify(books));
    }
  
    function loadBooksFromLocalStorage() {
      books = JSON.parse(localStorage.getItem("books")) || [];
      displayBooks(books);
    }
  
    window.addEventListener("load", () => {
      loadBooksFromLocalStorage();
  
      const inputBookForm = document.querySelector("#inputBook");
      const searchBookForm = document.querySelector("#searchBook");
  
      inputBookForm.addEventListener("submit", addBook);
      searchBookForm.addEventListener("submit", searchBooks);
      document.addEventListener("bookChanged", saveBooksToLocalStorage);
    });
  })();