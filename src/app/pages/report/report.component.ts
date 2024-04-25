import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{

  ngOnInit(): void {
      
  }

  change(type: string){
    
  }

}
