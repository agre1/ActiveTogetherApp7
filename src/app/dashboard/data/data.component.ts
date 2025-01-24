import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  loading: { [key: string]: boolean } = {};
  sortDirection: 'asc' | 'desc' = 'asc';
  filterPublicTransport: string = 'all';
  filteredCourses: any[] = [];

  constructor(public storeService: StoreService, private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getRegistrations(this.storeService.currentPage);
  }

  applyFilter(){
    if (this.filterPublicTransport == 'all') {
      this.filteredCourses = this.storeService.courses;
    } else {
      const isPublicTransport = this.filterPublicTransport == 'true';
      this.filteredCourses = this.storeService.courses.filter(course => course.eventLocation.venueByPublicTansport === isPublicTransport);
  }
}

  public page: number = 0;

  selectPage(i: any) {
    let currentPage = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(currentPage);
  }

  public returnAllPages() {
    var pagesCount = Math.ceil(this.storeService.registrationTotalCount / 25);
    let res = [];
    for (let i = 0; i < pagesCount; i++) {
        res.push(i + 1);
      }
    return res;
  }

  onDeleteRegistration(registrationId: string) {
    this.loading[registrationId] = true;
    this.backendService.deleteRegistration(registrationId, this.storeService.currentPage).subscribe({
      next: () => {
        this.loading[registrationId] = false;
        this.storeService.registrations = this.storeService.registrations.filter(reg => reg.id !== registrationId);
      },
      error: () => {
        this.loading[registrationId] = false;
      }
    });
  }

  sortRegistrations(column: string) {
    this.storeService.registrations.sort((a: any, b: any) => {
      const valueA = new Date(a[column]).getTime();
      const valueB = new Date(b[column]).getTime();
      return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
}
