import { Injectable } from '@angular/core';
import { Exam } from '../model/exam';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExamService extends GenericService<Exam> {

  private specialtyChange: Subject<Exam[]> = new Subject<Exam[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/exams`);
  }

   ////////////////////////
   setExamChange(data: Exam[]){
    this.specialtyChange.next(data);
  }

  getExamChange(){
    return this.specialtyChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}


