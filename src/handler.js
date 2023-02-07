const books = require('./books');
const Book = require('./books-info-template');
// =======================================================

const addBookHandler = (request, h) => {
  try {
    const { payload } = request;
    if (payload.name === undefined) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
        .code(400);
    }

    if (payload.readPage > payload.pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
        .code(400);
    }

    const addedBook = new Book(payload);
    books.push(addedBook);
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: addedBook.id,
      },
    })
      .code(201);
  } catch (error) {
    return h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    })
      .code(500);
  }
};

// =======================================================================
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let bookByQuery = books;

  if (name !== undefined) {
    bookByQuery = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    bookByQuery = books.filter((b) => b.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    bookByQuery = books.filter((b) => b.finished === (finished === '1'));
  }

  const booksData = bookByQuery.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher }));
  return h.response({
    status: 'success',
    data: {
      books: booksData,
    },
  })
    .code(200);
};

// ===================================================================
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book === undefined) {
    return h.response(
      {
        status: 'fail',
        message: 'Buku tidak ditemukan',
      },
    )
      .code(404);
  }

  return h.response(
    {
      status: 'success',
      data: {
        book,
      },
    },
  )
    .code(200);
};

// ===============================================================
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const index = books.findIndex((b) => b.id === bookId);

  if (name === undefined) {
    return h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      },
    )
      .code(400);
  }

  if (readPage > pageCount) {
    return h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      },
    )
      .code(400);
  }

  if (index === -1) {
    return h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      },
    )
      .code(404);
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };

  return h.response(
    {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    },
  )
    .code(200);
};

// ================================================================
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return h.response(
      {
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      },
    )
      .code(404);
  }

  books.splice(index, 1);
  return h.response(
    {
      status: 'success',
      message: 'Buku berhasil dihapus',
    },
  )
    .code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};