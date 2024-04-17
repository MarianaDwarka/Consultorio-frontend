import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { SpecialtyService } from '../../services/specialty.service';
import { Specialty } from '../../model/specialty';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { ConsultDetail } from '../../model/consultDetail';
import { Exam } from '../../model/exam';
import { ExamService } from '../../services/exam.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Medic } from '../../model/medic';
import { MedicService } from '../../services/medic.service';
import { FlexLayoutModule } from 'ngx-flexible-layout';

@Component({
  selector: 'app-consult-wizard',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe, FlexLayoutModule, NgClass],
  templateUrl: './consult-wizard.component.html',
  styleUrl: './consult-wizard.component.css'
})
export class ConsultWizardComponent implements OnInit{

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  patients: Patient[];
  exams: Exam[];
  medics: Medic[];
  specialties$: Observable<Specialty[]>;
  examsFiltered$: Observable<Exam[]>

  minDate: Date = new Date();
  details: ConsultDetail[] = [];
  examsSelected: Exam[] = [];

  examControl: FormControl = new FormControl();

  medicSelected: Medic;
  
  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private specialtyService: SpecialtyService,
    private examService: ExamService,
    private medicService: MedicService,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
      this.firstFormGroup = this.formBuilder.group({
        patient: [new FormControl(), Validators.required],
        specialty: [new FormControl(), Validators.required],
        consultDate: [new FormControl(new Date()), Validators.required],
        exam: [this.examControl, Validators.required],
        diagnosis: new FormControl('', Validators.required),
        treatment: new FormControl('', Validators.required),
      });

      this.secondFormGroup = this.formBuilder.group({});

      this.loadInitialData();

      this.examsFiltered$ = this.examControl.valueChanges.pipe(map(val => this.filterExams(val)));
  }

  loadInitialData(){
    this.patientService.findAll().subscribe(data => this.patients = data);
    this.specialties$ = this.specialtyService.findAll();
    this.examService.findAll().subscribe(data => this.exams = data);
    this.medicService.findAll().subscribe(data => this.medics = data);
  }

  filterExams(val: any){
    if(val?.idExam > 0){
      return this.exams.filter(el => 
        el.nameExam.toLowerCase().includes(val.nameExam.toLowerCase()) || el.descriptionExam.toLowerCase().includes(val.descriptionExam.toLowerCase())
      )
    }else{
      return this.exams.filter(el => 
        el.nameExam.toLowerCase().includes(val?.toLowerCase()) || el.descriptionExam.toLowerCase().includes(val?.toLowerCase())
      )
    }    
  }

  showExam(val: any){
    return val ? `${val.nameExam}` : val;
  }

  getDate(e: any){
    console.log(e.value);
  }

  addDetail(){
    const det = new ConsultDetail();
    det.diagnosis = this.firstFormGroup.value['diagnosis'];
    det.treatment = this.firstFormGroup.value['treatment'];

    this.details.push(det);
  }

  removeDetail(index: number){
    this.details.splice(index, 1);
  }

  addExam(){
    const tmpExam = this.firstFormGroup.value['exam'].value;

    if(tmpExam != null){
      this.examsSelected.push(tmpExam);
    }else{
      this._snackBar.open('Please select an exam', 'INFO', {duration: 2000});
    }
  }

  selectMedic(m: Medic){
    this.medicSelected = m;
  }
}
