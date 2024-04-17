import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Exam } from '../../model/exam';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css'
})
export class ExamComponent implements OnInit {

  dataSource: MatTableDataSource<Exam>;
  columnDefinitions = [
    { def: 'idExam', label: 'idExam', hide: true},
    { def: 'nameExam', label: 'nameExam', hide: false},
    { def: 'descriptionExam', label: 'descriptionExam', hide: false},
  ]


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private examService:ExamService,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    this.examService.findAll().subscribe((data) => {
      this.createTable(data);
    });

    this.examService.getExamChange().subscribe((data) => {
      this.createTable(data);
    });

    this.examService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'right'});
    })
  }

  delete(idExam: number){
    this.examService.delete(idExam)
    .pipe(switchMap( ()=> this.examService.findAll() ))
    .subscribe(data => {
      this.examService.setExamChange(data);
      this.examService.setMessageChange('DELETED!');
    })
  }

  createTable(data: Exam[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns():string[] {
    return this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
    //this.dataSource.filterPredicate = () => { };
  }
}
