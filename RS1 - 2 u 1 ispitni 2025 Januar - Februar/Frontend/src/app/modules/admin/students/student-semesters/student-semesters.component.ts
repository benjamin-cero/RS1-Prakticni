import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  StudentGetByIdEndpointService
} from '../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';
import {SemesterGetByIdEndpoint} from '../../../../endpoints/semester-endpoints/semester-get-by-id-endpoint.service';

@Component({
  selector: 'app-student-semesters',
  standalone: false,

  templateUrl: './student-semesters.component.html',
  styleUrl: './student-semesters.component.css'
})
export class StudentSemestersComponent implements OnInit {
  StudentId:number=0;
  StudentInfo:any;
  SemesterInfo:any;
  displayedColumns: string[] = ['ID', 'AcademicYear', 'YearOfStudy', 'Renewal','WinterSemester','RecordedBy'];
  constructor(
    route: ActivatedRoute,
    private StudentGetByIdEndpointService:StudentGetByIdEndpointService,
    private SemesterGetByIdEndpointService:SemesterGetByIdEndpoint,
    private router: Router,

  ) {
    this.StudentId = route.snapshot.params['id'];

  }


    ngOnInit(): void {
        this.AddStudentInfo();
        this.AddSemesterInfo();
    }

  private AddStudentInfo() {
    this.StudentGetByIdEndpointService.handleAsync(this.StudentId).subscribe({
      next: (Student) => {
        this.StudentInfo = Student;
      },

    });
  }

  private AddSemesterInfo() {
    this.SemesterGetByIdEndpointService.handleAsync(this.StudentId).subscribe({
      next: (Semester) => {
        this.SemesterInfo = Semester;
      },
    });
  }

  AddWinterSemester() {
    this.router.navigate(['/admin/student/semester/new', this.StudentId]);

  }
}
