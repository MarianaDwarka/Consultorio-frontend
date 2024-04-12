import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { NgFor } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit {

  //patients: Patient[];
  dataSource: MatTableDataSource<Patient>;
  displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni'];

  constructor(private patientService: PatientService){}

  ngOnInit(): void {
      this.patientService.findAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
  }

}
