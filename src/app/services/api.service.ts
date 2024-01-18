import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'https://irgor-chess-api.onrender.com/';

  constructor(private http: HttpClient) { }

  getMove(body: any): Observable<any> {
    return this.http.post(this.url + 'chess/move', body);
  }
}
