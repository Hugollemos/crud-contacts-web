import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule
  ],
  template: `
    <div class="card">
      <h2>Task Manager</h2>
      
      <p-button label="Add New Task" icon="pi pi-plus" (onClick)="showAddDialog()"></p-button>

      <p-table [value]="tasks" [paginator]="true" [rows]="10" styleClass="p-datatable-striped">
        <ng-template pTemplate="header">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-task>
          <tr>
            <td>{{task.title}}</td>
            <td>{{task.description}}</td>
            <td>{{task.status}}</td>
            <td>{{task.priority}}</td>
            <td>{{task.dueDate | date}}</td>
            <td>
              <p-button icon="pi pi-pencil" (onClick)="editTask(task)" styleClass="p-button-rounded p-button-text"></p-button>
              <p-button icon="pi pi-trash" (onClick)="deleteTask(task.id)" styleClass="p-button-rounded p-button-text p-button-danger"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog [(visible)]="dialogVisible" [header]="isEditing ? 'Edit Task' : 'Add New Task'" [modal]="true" [style]="{width: '450px'}">
      <div class="p-fluid">
        <div class="field">
          <label for="title">Title</label>
          <input id="title" type="text" pInputText [(ngModel)]="taskForm.title" required>
        </div>
        
        <div class="field">
          <label for="description">Description</label>
          <textarea id="description" pInputTextarea [(ngModel)]="taskForm.description" rows="3"></textarea>
        </div>

        <div class="field">
          <label for="status">Status</label>
          <p-dropdown id="status" [options]="statusOptions" [(ngModel)]="taskForm.status"></p-dropdown>
        </div>

        <div class="field">
          <label for="priority">Priority</label>
          <p-dropdown id="priority" [options]="priorityOptions" [(ngModel)]="taskForm.priority"></p-dropdown>
        </div>

        <div class="field">
          <label for="dueDate">Due Date</label>
          <p-calendar id="dueDate" [(ngModel)]="taskForm.dueDate" [showIcon]="true"></p-calendar>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button icon="pi pi-times" label="Cancel" (onClick)="hideDialog()" styleClass="p-button-text"></p-button>
        <p-button icon="pi pi-check" label="Save" (onClick)="saveTask()"></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .card {
      padding: 2rem;
    }
    .field {
      margin-bottom: 1rem;
    }
    .field label {
      display: block;
      margin-bottom: 0.5rem;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  dialogVisible = false;
  isEditing = false;
  editingTaskId: number | null = null;

  taskForm = {
    title: '',
    description: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: new Date()
  };

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
  ];

  priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  showAddDialog() {
    this.isEditing = false;
    this.editingTaskId = null;
    this.resetForm();
    this.dialogVisible = true;
  }

  editTask(task: Task) {
    this.isEditing = true;
    this.editingTaskId = task.id;
    this.taskForm = { ...task };
    this.dialogVisible = true;
  }

  hideDialog() {
    this.dialogVisible = false;
    this.resetForm();
  }

  saveTask() {
    if (this.isEditing && this.editingTaskId) {
      this.taskService.updateTask(this.editingTaskId, this.taskForm);
    } else {
      this.taskService.addTask(this.taskForm);
    }
    this.hideDialog();
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }

  private resetForm() {
    this.taskForm = {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date()
    };
  }
} 