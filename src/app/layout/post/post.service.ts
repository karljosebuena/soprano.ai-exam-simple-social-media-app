import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Post } from 'src/app/common/interfaces/post.interface';
import { AuthService } from 'src/app/common/services/auth.service';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PostService extends HttpService {

  constructor(
    httpClient: HttpClient,
    authService: AuthService
  ) {
    super(httpClient, authService);
  }

  createPost(post: Post): Observable<any> {
    return this.httpClient
      .post(`${this.REST_API_SERVER}/api/posts`, post, this.getHeader())
      .pipe(retry(3), catchError(this.errorHandler));
  }

  getAllPosts(search: string): Observable<any> {
    const queryParam = search ? `?search=${search}` : '';
    return this.httpClient
      .get(`${this.REST_API_SERVER}/api/posts${queryParam}`, this.getHeader())
      .pipe(retry(3), catchError(this.errorHandler));
  }

  deletePost(id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.REST_API_SERVER}/api/posts/${id}`, this.getHeader())
      .pipe(retry(3), catchError(this.errorHandler));
  }

  updatePost(id: string, post: Post): Observable<any> {
    return this.httpClient
      .put(`${this.REST_API_SERVER}/api/posts/${id}`, post, this.getHeader())
      .pipe(retry(3), catchError(this.errorHandler));
  }
}
