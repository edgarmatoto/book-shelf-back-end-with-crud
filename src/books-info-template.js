const { nanoid } = require('nanoid');

class Book {
  constructor(bio) {
    this.id = nanoid(16);
    this.name = bio.name;
    this.year = bio.year;
    this.author = bio.author;
    this.summary = bio.summary;
    this.publisher = bio.publisher;
    this.pageCount = bio.pageCount;
    this.readPage = bio.readPage;
    this.finished = bio.pageCount === bio.readPage;
    this.reading = bio.reading;
    this.insertedAt = new Date().toISOString();
    this.updatedAt = this.insertedAt;
  }

  getIdNameAndPublisher() {
    return { id: this.id, name: this.name, publisher: this.publisher };
  }
}

module.exports = Book;
