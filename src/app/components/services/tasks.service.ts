import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from './../interfaces/task.interface';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class TaskService {
  private baseUrl: string =
    'https://608adc0d737e470017b7410f.mockapi.io/api/v1/todos';

  private taskCreatedSubject = new Subject<Task>();

  taskCreated$ = this.taskCreatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTask(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap((newTask: Task) => {
        this.taskCreatedSubject.next(newTask);
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${task.id}`, task);
  }
}
