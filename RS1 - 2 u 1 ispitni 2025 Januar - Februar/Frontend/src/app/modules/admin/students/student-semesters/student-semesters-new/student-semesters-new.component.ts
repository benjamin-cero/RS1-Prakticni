import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SemesterGetByIdEndpoint} from '../../../../../endpoints/semester-endpoints/semester-get-by-id-endpoint.service';
import {
  StudentGetByIdEndpointService
} from '../../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  AcademicYearGetAllEndpoint
} from '../../../../../endpoints/academicYear-endpoints/academicYear-get-all-endpoint.service';
import {
  StudentUpdateOrInsertRequest
} from '../../../../../endpoints/student-endpoints/student-update-or-insert-endpoint.service';
import {
  SemesterUpdateOrInsertEndpoint, SemesterUpdateOrInsertRequest
} from '../../../../../endpoints/semester-endpoints/semester-update-or-insert-endpoint.service';

@Component({
  selector: 'app-student-semesters-new',
  standalone: false,

  templateUrl: './student-semesters-new.component.html',
  styleUrl: './student-semesters-new.component.css'
})
export class StudentSemestersNewComponent implements OnInit {
  StudentId:number=0;
  StudentInfo:any;
  SemesterInfo:any;
  semesterForm: FormGroup;
  AcademicYearInfo:any;
  constructor(
    route: ActivatedRoute,
    private StudentGetByIdEndpointService:StudentGetByIdEndpointService,
    private SemesterGetByIdEndpointService:SemesterGetByIdEndpoint,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private AcademicYearGetAllEndpoint:AcademicYearGetAllEndpoint,
    private SemesterUpdateOrInsertEndpoint:SemesterUpdateOrInsertEndpoint

  ) {
    this.StudentId = route.snapshot.params['id'];

    this.semesterForm = this.fb.group({
      dateOfEnrollment: [new Date, [Validators.required]],
      yearOfStudy: [null, [Validators.required]],
      academicYearId: [1, [Validators.required  ]],
      price: [{value: null , disabled: true }, [Validators.required, Validators.min(50), Validators.max(2000)]],
      renewal: [ {value: false , disabled: true } , Validators.required],
      StudentId: [this.StudentId, Validators.required],
      MyAppUserId: [1, Validators.required],
    });
  }

    ngOnInit(): void {
      this.AddStudentInfo();
      this.AddSemesterInfo();
      this.AllAcademicYears();

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

  saveSemester() {
    if (this.semesterForm.invalid) return;

    const studentData: SemesterUpdateOrInsertRequest = {
      ...this.semesterForm.value,
      price : this.semesterForm.get('price')?.value,
      renewal : this.semesterForm.get('renewal')?.value,
    };

    this.SemesterUpdateOrInsertEndpoint.handleAsync(studentData).subscribe({
      next: () => {
        this.snackBar.open('Student saved successfully!', 'Close', { duration: 5000 });
        this.router.navigate(['/admin/student/semester',this.StudentId]);
      },
      error: (error) => {
        this.snackBar.open('Academic Year already is use.', 'Close', { duration: 5000 });
        console.error('Error saving semester', error);
      },
    });
  }

  private AllAcademicYears() {
    this.AcademicYearGetAllEndpoint.handleAsync().subscribe({
      next: (ay) => {
        this.AcademicYearInfo=ay;
      },
    });
  }

  YearChanged($event: any) {

    const YearOfStudy: number =  parseInt($event.target.value);

    if(this.SemesterInfo.some((x:any)=> x.yearOfStudy == YearOfStudy ))
    {

        this.semesterForm.patchValue({

          price: 400,
          renewal : true,

        })

    }else{

      this.semesterForm.patchValue({

        price: 1800,
        renewal : false,

      })


    }



  }
}
