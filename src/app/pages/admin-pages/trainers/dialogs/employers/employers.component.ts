import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Employer } from '../../../../../shared/models/employer.model';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-employers',
  imports: [TabsModule,TableModule,ButtonModule,FormsModule,InputTextModule,DividerModule
    ,DropdownModule
  ],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.scss'
})
export class EmployersComponent {
  employers: Employer[] = [];
  gender = ['FEMALE', 'MALE'];

}
