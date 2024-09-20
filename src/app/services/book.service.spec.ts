import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { BookDto } from '../Model/book.model';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService]
    });

    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a book', () => {
    const newBook: BookDto = {
      title: '1984',
      isbn: '978-0-452-28423-4',
      registrationDate: new Date(),
      status: true,
      image_url: 'https://example.com/images/1984.jpg'
    };

    service.createBook(newBook).subscribe((response) => {
      expect(response).toEqual(newBook);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/books/');
    expect(req.request.method).toBe('POST');
    req.flush(newBook);
  });

  it('should retrieve all books', () => {
    const dummyBooks: BookDto[] = [
      { title: '1984', isbn: '978-0-452-28423-4', registrationDate: new Date(), status: true, image_url: '' },
      { title: 'Brave New World', isbn: '978-0-06-085052-4', registrationDate: new Date(), status: true, image_url: '' }
    ];

    service.getAllBooks().subscribe((books) => {
      expect(books.length).toBe(2);
      expect(books).toEqual(dummyBooks);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/books/');
    expect(req.request.method).toBe('GET');
    req.flush(dummyBooks);
  });

  it('should retrieve a book by ISBN', () => {
    const dummyBook: BookDto = {
      title: '1984',
      isbn: '978-0-452-28423-4',
      registrationDate: new Date(),
      status: true,
      image_url: 'https://example.com/images/1984.jpg'
    };

    service.getBookByIsbn('978-0-452-28423-4').subscribe((book) => {
      expect(book).toEqual(dummyBook);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/books/978-0-452-28423-4');
    expect(req.request.method).toBe('GET');
    req.flush(dummyBook);
  });
});
