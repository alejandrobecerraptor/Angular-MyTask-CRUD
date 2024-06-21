import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../services/tasks.service';
import { Task } from '../interfaces/task.interface';

@Component({
  selector: 'app-new-task-component',
  templateUrl: './new-task-component.component.html',
  styleUrl: './new-task-component.component.scss',
})
export class NewTaskComponentComponent {
  @Output() taskCreated = new EventEmitter<Task>();

  public taskForm: FormGroup;

  constructor(private taskService: TaskService) {
    this.taskForm = new FormGroup({
      createdAt: new FormControl(new Date()),
      title: new FormControl('', [Validators.required]),
      state: new FormControl(false, [Validators.required]),
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value;
      this.taskService.createTask(newTask).subscribe(() => {
        this.taskForm.reset({
          createdAt: new Date(),
          title: '',
          state: false,
        });
      });
    }
  }
}
