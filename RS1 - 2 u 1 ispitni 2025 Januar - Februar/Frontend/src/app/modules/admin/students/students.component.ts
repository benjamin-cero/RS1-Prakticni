import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentGetAllResponse } from '../../../endpoints/student-endpoints/student-get-all-endpoint.service';
import { StudentGetAllEndpointService } from '../../../endpoints/student-endpoints/student-get-all-endpoint.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {debounceTime, distinctUntilChanged, filter, Subject} from 'rxjs';
import { MyDialogConfirmComponent } from '../../shared/dialogs/my-dialog-confirm/my-dialog-confirm.component';
import {MySnackbarHelperService} from '../../shared/snackbars/my-snackbar-helper.service';
import {MyDialogSimpleComponent} from '../../shared/dialogs/my-dialog-simple/my-dialog-simple.component';
import {StudentRestoreEndpointService} from '../../../endpoints/student-endpoints/student-restore-endpoint.service';
import {map, tap} from 'rxjs/operators';
import {
  StudentDeleteEndpoint,
  StudentDeleteRequest
} from '../../../endpoints/student-endpoints/student-delete-endpoint.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: false
})

export class StudentsComponent implements OnInit, AfterViewInit {
  private searchSubject: Subject<string> = new Subject();
  displayedColumns: string[] = ['firstName', 'lastName', 'studentNumber','timeDeleted','deletedBy', 'actions'];
  dataSource: MatTableDataSource<StudentGetAllResponse> = new MatTableDataSource<StudentGetAllResponse>();
  students: StudentGetAllResponse[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userEmail: string = "";


  constructor(
    private studentGetService: StudentGetAllEndpointService,
    private studentDeleteService: StudentDeleteEndpoint,
    private snackbar: MySnackbarHelperService,
    private router: Router,
    private dialog: MatDialog,
    private StudentRestoreEndpointService:StudentRestoreEndpointService,
  ) {}

  ngOnInit(): void {
    this.initSearchListener();
    this.fetchStudents();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const filterValue = this.dataSource.filter || '';
      this.fetchStudents(filterValue, this.paginator.pageIndex + 1, this.paginator.pageSize);
    });
  }
  initSearchListener(): void {


    this.searchSubject.pipe(
      debounceTime(300), // Vrijeme čekanja (300ms)
      map((x=> x.toLowerCase())),
      filter((x=> x.length > 3)),
      tap(q=> console.log(this.dataSource.data.length ))




    ).subscribe((filterValue) => {
      this.fetchStudents(filterValue, this.paginator.pageIndex + 1, this.paginator.pageSize);
    });



  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchSubject.next(filterValue); // Prosljeđuje vrijednost Subject-u


  }

  fetchStudents(filter: string = '', page: number = 1, pageSize: number = 5): void {
    this.studentGetService.handleAsync({
      q: filter,
      pageNumber: page,
      pageSize: pageSize
    }).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<StudentGetAllResponse>(
          this.Prikazi?data.dataItems:data.dataItems.filter(x=> !x.isDeleted),



        );


        this.paginator.length = data.totalCount;
      },
      error: (err) => {
        this.snackbar.showMessage('Error fetching students. Please try again.', 5000);
        console.error('Error fetching students:', err);
      }
    });
  }

  editStudent(id: number): void {
    this.router.navigate(['/admin/students/edit', id]);
  }

  deleteStudent(id: number): void {

    const AuthData = localStorage.getItem('my-auth-token');

 if(AuthData) {

   const JSONAuth = JSON.parse(AuthData);

   this.userEmail = JSONAuth.myAuthInfo.email;

 }





    const deleteRequest : StudentDeleteRequest = {
      id: id,
      deletedByUsername : this.userEmail
    };


    this.studentDeleteService.handleAsync(deleteRequest).subscribe({
      next: () => {
        this.snackbar.showMessage('Student successfully deleted.');
        this.fetchStudents(); // Refresh the list after deletion
      }

    });
  }

  openMyConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(MyDialogConfirmComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this student?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed deletion');
        this.deleteStudent(id);
      } else {
        console.log('User cancelled deletion');
      }
    });
  }

  openStudentSemesters(id:number) {
    this.router.navigate(['/admin/student/semester', id]);
  }
Prikazi:boolean=false;
  PrikaziSakrijStudenta() {
    this.Prikazi = !this.Prikazi;
    this.fetchStudents();
  }

  openMyRestoreDialog(id:any) {
    const dialogRef = this.dialog.open(MyDialogConfirmComponent, {
      width: '350px',
      data: {
        title: 'Confirm Restore',
        message: 'Are you sure you want to restore this student?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed restoration');
        this.restoreStudent(id);
      } else {
        console.log('User cancelled restoration');
      }
    });
  }

  private restoreStudent(id: any) {
    this.StudentRestoreEndpointService.handleAsync(id).subscribe({
      next: () => {
        this.snackbar.showMessage('Student successfully restored.');
        this.fetchStudents(); // Refresh the list after deletion
      },
      error: (err) => {
        this.snackbar.showMessage('Error restoring student. Please try again.', 5000);
        console.error('Error restoring student:', err);
      }
    });
  }
}
