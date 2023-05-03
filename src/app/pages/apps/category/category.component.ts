import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core'
import { AuthService } from 'src/app/auth.service'
import { Location } from '@angular/common'
import { NzNotificationService } from 'ng-zorro-antd'
import { ActivatedRoute } from '@angular/router'
import { merge, observable, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators'


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})

export class CategoryComponent implements OnInit {
  @ViewChild('saves', { static: false }) public saves: TemplateRef<any>


  CompanyId: any
  categories: any = []
  categoryact: any = []
  term: string = ''
  show = true
  pcategories: any = []
  categorys: any
  category: any = {
    id: 0,
    parentCategoryId: null,
    description: '',
    isactive: true,
    sortOrder: -1,
    companyId: 1,
    variantgroupids: [],
  }
  catid = 0
  variantgroups: any = []
  variantgroupids: any = []
  size = 'default'
  submitted: boolean = false
  units: any
  kotgroups: any
  isvisible: boolean
  visible = false
  checked: Boolean = true
  taxgroups: any
  id: any
  catactive: any
  mapOfSort: { [key: string]: any } = {
    id: null,
    name: null,
    description: null,
    category: null,
    tax: null,
    price: null,
    quantity: null,
    status: null,
  }
  sortName: string | null = null
  sortValue: string | null = null
  loginfo: any
  cat: any
  categoryid: any = []
  companyid: number
  Category: any
  StoreId: any

  constructor(
    private Auth: AuthService,
    public location: Location,
    private notification: NzNotificationService,
    private _avRoute: ActivatedRoute,
  ) {
    this.catid = +this._avRoute.snapshot.params['id']
    // if (this.catid != 0) {
    //   this.getcategorybyid();
    // }
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'))
    const store = JSON.parse(localStorage.getItem('store'))
    this.CompanyId = user.companyId
    this.StoreId = user.storeid
    this.getCategory()
    this.getpcategories()
    this.getvariantgroups()
    this.getcatactive()
  }

  getCategory() {
    this.Auth.getcategories(1, 'A').subscribe(data => {
      this.categories = data
      console.log(this.categories)
      this.show = true
    })
  }

  getpcategories() {
    this.Auth.getcategories(1, 'P').subscribe(data => {
      this.pcategories = data
      console.log(this.pcategories)
      this.getcatactive()
    })
  }

  getcategorybyid(id) {
    this.Auth.getcategorybyid(id).subscribe(data => {
      this.category = data
      console.log(this.category)
      this.show = !this.show
    })
  }


  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }

  arrayBuffer: any
  file: File
  incomingfile(event) {
    this.file = event.target.files[0]
    console.log(this.file)
  }

  sort(sortName: string, value: string): void {
    this.sortName = sortName
    this.sortValue = value
    for (const key in this.mapOfSort) {
      if (this.mapOfSort.hasOwnProperty(key)) {
        this.mapOfSort[key] = key === sortName ? value : null
      }
    }
  }

  gettax() {
    this.Auth.GetTaxGrp(this.CompanyId).subscribe(data => {
      this.taxgroups = data
      console.log(this.taxgroups)
    })
  }

  getUnits() {
    this.Auth.getUnits().subscribe(data => {
      this.units = data
      console.log(data)
    })
  }

  getKotGroups() {
    this.Auth.getKotgroups().subscribe(data => {
      this.kotgroups = data
      console.log(data)
    })
  }

  getvariantgroups() {
    this.Auth.getvariantgroups_l(1).subscribe(data => {
      this.variantgroups = data
      console.log(this.variantgroups)
    })
  }



  Category1: any
  isdisable: Boolean = false
  showInactive: Boolean = false
  changefilter(bool) {
    this.showInactive = bool
    console.log(bool)
    if (bool) {
      this.Category = this.categoryact.filter(x => !x.isactive);
      this.Category1 = this.categoryact.filter(x => !x.isactive)
    } else {
      this.Category = this.categoryact.filter(x => x.isactive);
      this.Category1 = this.categoryact.filter(x => x.isactive)
    }
    this.isdisable = !this.isdisable

    console.log(this.categoryact.length)
  }

  // Active in active
  catehide: Boolean = false
  categ: Boolean = false
  allactive : Boolean = false
  allcategory(bool) {
    this.categ = bool
    console.log(this.categ);
    if (bool) {
      this.Category = this.categoryact
      //  console.log('activeall', this.Category1);
      console.log('activeall', this.Category);
    }
    else {
      // this.Category1 = this.categoryact
      this.Category = this.categoryact.filter(x => x.isactive)
      console.log('activeonly', this.Category1);

    }
    this.catehide = !this.catehide
    this.allactive = !this.allactive
    // console.log('allcat', this.Category1);
    console.log('activeall', this.Category);
  }

  getcatactive() {
    this.Auth.catactive((this.companyid = 1)).subscribe(data => {
      this.categoryact = data
      console.log(this.categoryact)

      this.Category1 = this.categoryact
      console.log('active inact', this.Category1);

      this.Category = this.categoryact.filter(x => x.isactive == !this.showInactive)
      this.Category1 = this.categoryact.filter(x => x.isactive == !this.categ)
      this.show = true
    })
  }

  active(id, act) {
    console.log(id, act)
    this.Auth.Categoryupdate(id, act, (this.companyid = 1)).subscribe(data => {
      console.log(data)
      this.getcatactive()
    });
  }

  // 20-04-2023
  // filteredvalues = [];
  // filtersearch(): void {
  //   this.Category = this.term
  //     ? this.Category1.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
  //     : this.Category1;
  //   //:this.getcatactive()
  //   console.log(this.Category)
  // }


  filteredvalues = [];
  
  // term1: string = ''
  filtersearch1(): void {
    this.Category = this.term
      ? this.categories.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
      : this.categories;
    console.log(this.Category)
  }
 
  filtersearch(): void {
    this.Category = this.term
    // this.categories = this.term
      // this.Category || this.categories != this.term
      ? (this.Category || this.Category1).filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
      : (this.Category1 || this.Category);
    // ? this.Category || this.Category1.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
    // : this.Category || this.Category1;
    // : (this.Category || this.Category1);
    //:this.getcatactive()
    console.log(this.Category) 
  }
 
  validation() {
    var isvalid = true
    if (this.category.description == '') isvalid = false
    return isvalid
  }

  save() {
    console.log(this.category.variantgroupids)
    if (this.category.id > 0) this.addcategory()
    else this.addcategory()
    this.getCategory()
  }

  //  Add Category
  addcategory() {
    this.submitted = true
    if (this.validation()) {
      if (this.category.id == 0) {
        this.Auth.addcategories(this.category).subscribe(data => {
          console.log(data)
          //  this.show = !this.show
          this.notification.success('Updated', 'Category Added Successfully')
          this.getcatactive()
          this.getpcategories()
          //this.getCategory()
        })
      } else if (this.category.id > 0) {
        this.Auth.updatecategory(this.category).subscribe(data1 => {
          console.log(data1)
          // this.show = !this.show
          this.notification.success('Updated', 'Category Added Successfully')
          this.getcatactive()
          this.getpcategories()
          //this.getCategory()
        })
      }
      this.saves['nativeElement'].focus()
      this.back()
    }
    else {
      this.notification.error('Error', 'Category Added Unsuccessfully')
    }
  }

  updateCategory() {
    this.submitted = true
    if (this.validation()) {
      this.Auth.updatecategory(this.category).subscribe(data => {
        this.notification.success('Category Updated', 'Category Updated Successfully')
        this.back()
        console.log(data)
      })
    } else {
      this.notification.error('Error', 'Category Added UnSuccessfully')
    }
  }


  back() {
    this.show = !this.show
    this.category = {
      id: 0,
      parentCategoryId: null,
      description: '',
      isactive: true,
      sortOrder: -1,
      companyId: 1,
      variantgroupids: [],
    }
    this.submitted = false
  }


  // disableField(checked) {
  //   Object.keys(this.category).forEach(key => {
  //     if (!checked) {
  //       this.category[key].disable();
  //     } else {
  //       this.category[key].enable();
  //     }
  //   });
  // }
}
