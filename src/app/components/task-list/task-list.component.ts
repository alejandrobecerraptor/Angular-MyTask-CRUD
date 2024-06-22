import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Task } from '../interfaces/task.interface';
import { TaskService } from '../services/tasks.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  public tasks: Task[] = [];
  public searchInput = new FormControl('');
  public filteredTasks: Task[] = [];

  public pagedTasks: Task[] = [];

  public currentPage = 1;
  public itemsPerPage = 5; // Número de elementos por página
  public totalPages = 0; // Número total de páginas

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTask().subscribe((tasks) => {
      this.tasks = tasks.reverse();
      this.filteredTasks = [...this.tasks];
      this.updateTotalPages();
      this.setPage(1);
      console.log('totalpagees', this.totalPages);
    });

    this.taskService.taskCreated$.subscribe((newTask: Task) => {
      this.tasks.push(newTask);
      this.filteredTasks.unshift(newTask);
      this.updateTotalPages();
      this.setPage(1);
    });
  }

  //-------------------

  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedTasks = this.filteredTasks.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.filteredTasks.length) {
      this.currentPage++;
      this.setPage(this.currentPage);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPage(this.currentPage);
    }
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredTasks.length / this.itemsPerPage);
  }

  //------------------------

  searchTask2() {
    const value: string = this.searchInput.value || '';
    console.log('value>', value);
    console.log('>> filteredTask', this.filteredTasks);
    this.filteredTasks = this.tasks.filter((task) =>
      task.title.toLowerCase().includes(value.toLowerCase())
    );
  }

  searchTask(): void {
    const value: string = this.searchInput.value!.trim().toLowerCase();
    this.filteredTasks = this.tasks.filter((task) =>
      task.title.toLowerCase().includes(value)
    );
    this.updateTotalPages();
    this.setPage(1); // Actualiza la paginación después de la búsqueda
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.filteredTasks = this.filteredTasks.filter((task) => task.id !== id);
      this.updateTotalPages();
      this.setPage(this.currentPage);
    });
  }

  updateTask(task: Task): void {
    task.state = !task.state;
    this.taskService.updateTask(task).subscribe();
  }
}
