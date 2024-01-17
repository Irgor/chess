import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getMove(body: any): Observable<any> {
    return this.http.post('http://localhost:3000/chess/move', body);
  }
}
