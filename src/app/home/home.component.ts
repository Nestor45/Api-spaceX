import { Component, OnInit, HostListener  } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  data: any = {};
  dataArray: any[] = [];
  currentPage = 1;
  itemsPerScroll = 6;
  searchTerm: string = '';
  filteredDataArray: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMoreData();
  }

  private loadData(): void {
    this.apiService.getData().subscribe(data => {
      console.log("dataload",data);
      const newData = data.slice(0, this.itemsPerScroll);
      this.dataArray = this.dataArray.concat(newData);
      this.filteredDataArray = this.dataArray;
      console.log(this.dataArray, this.currentPage);
    });
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (this.shouldLoadMoreData()) {
      this.loadMoreData();
    }
  }
  
  private loadMoreData(): void {
    this.loadData();
  }
  
  private shouldLoadMoreData(): boolean {
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    const scrollPosition = window.scrollY;
    const isEndOfPage = (windowHeight + scrollPosition) + 1 >= documentHeight;
    
    // Solo carga más datos si el usuario ha llegado al final de la página
    return isEndOfPage;
  }

  onInputChange(): void {
    if (this.searchTerm.length !== 0) {
      this.filteredDataArray = this._filter(this.searchTerm.toLowerCase());
      this.dataArray = this.filteredDataArray;
    } else {
      this.dataArray = [];
      this.ngOnInit()
    }
  }

  private _filter(value: string): any[] {
    console.log("🚀 ~ file: home.component.ts:66 ~ HomeComponent ~ _filter ~ this.dataArray:", (this.dataArray))
    return this.dataArray.filter(option => 
      option.name.toLowerCase().includes(value)
    );
  }
}