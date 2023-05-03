import { Component, OnInit, HostListener, ElementRef, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core'
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker'
import { NzNotificationService } from 'ng-zorro-antd'
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { Location } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@Component({
  selector: 'app-batch-entry',
  templateUrl: './batch-entry.component.html',
  styleUrls: ['./batch-entry.component.scss'],
  providers: [NgbModalConfig, NgbModal],
  encapsulation: ViewEncapsulation.None
})

export class BatchEntryComponent implements OnInit {

  @ViewChild('barcodeel', { static: false }) public barcodeel: TemplateRef<any> //productinput
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any> //productinput
  @ViewChild('priceel', { static: false }) public priceel: TemplateRef<any> //productinput
  @ViewChild('expdateel', { static: false }) public expdateel: NzDatePickerComponent;//productinput
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>


  scrollContainer: any
  show = true
  dynamicRows: any = []
  CompanyId: any
  StoreId: any
  products: any = []
  filterproduct = []
  inputValue: string = ''
  filterstores = []
  batchentry = {
    barCode: null,
    code: '',
    barcodeId: null,
    quantity: null,
    price: null,
    expiarydate: '',
    companyid: 0,
    storeid: 0,
    productId: 0,
    product: null,
    batchno: 0,
    entrydatetime: '',
  }
  product: any = {
    id: 0,
    name: '',
    barCode: null,
    description: '',
    taxGroupId: 0,
    price: null,
    CompanyId: 1,
    action: '',
  }
  batchno = 0
  batchdate = new Date()
  batches: any = []
  date = new Date()
  time = new Date()
  loginfo = null
  stores: any = []
  inputvalue: string = ''
  size = 'default'
  checked = true;
  yesterday = new Date()
  public disabledDate = (current: Date): boolean => current < this.yesterday;
  showInactive: Boolean = false

  constructor(private Auth: AuthService,
    private notification: NzNotificationService,
    private modalService: NgbModal,
    public location: Location,
    private multiSelect: NgMultiSelectDropDownModule) { }

  ngOnInit(): void {
    this.yesterday.setDate(this.yesterday.getDate() - 0)
    const user = JSON.parse(localStorage.getItem('user'))
    const store = JSON.parse(localStorage.getItem('store'))
    this.CompanyId = user.companyId
    this.StoreId = user.storeid
    this.getBatchProduct()
    this.batchentry = {
      barCode: null,
      code: '',
      barcodeId: null,
      quantity: null,
      price: null,
      expiarydate: '',
      companyid: this.CompanyId,
      storeid: this.StoreId,
      productId: 0,
      product: null,
      batchno: 0,
      entrydatetime: '',
    }
  }

  changefilter(bool) {
    this.showInactive = bool
    console.log(bool)
    if (bool) {
      this.product = this.batches.products.filter(x => !x.isactive)
    } else {
      this.product = this.batches.products.filter(x => x.isactive)
    }
    console.log(this.product.length)
  }

  active(id, act) {
    this.Auth.prdactive(id, act).subscribe(data => {
      console.log(id, act)
      this.getBatchProduct()
    })
  }

  getBatchProduct() {
    this.Auth.getBarcodeProduct(this.CompanyId, this.StoreId).subscribe(data => {
      this.products = data['products']
      console.log(this.products)
      this.batchno = data['lastbatchno'] + 1
    })
  }

  now() {
    this.batchdate = new Date()
  }

  // onInputAutocomplete() {
  //   console.log(this.products)
  //   this.filterproduct = this.products.filter(x =>x.product.toLowerCase().includes(this.inputValue),
      
  //   ).slice(0, 5)
  // }

  
  onInputAutocomplete() {
    console.log(this.products)
    if (!this.inputValue) {
      this.filterproduct = []
      return;
    }
    this.filterproduct = this.products.filter(x => x.product.toLowerCase().includes(this.inputValue) 
    //&& !x.ishidden && !this.batches.some(oi => oi.productId == x.productId)
    ).slice(0, 5)
  }

  onChange(e) {
    console.log(e, moment(e), this.date)
  }

  searchbybarcode() {
    var product = this.products.filter(x => x.barCode == this.batchentry.barCode)[0]
    console.log(this.batchentry.barCode, this.products, product)
    this.batchentry.product = product
    this.batchentry.productId = product.productId
    this.batchentry.barcodeId = product.barcodeId
    this.batchentry.expiarydate = product.expiarydate
    this.inputValue = product.product
    this.quantityel['nativeElement'].focus()
  }
 
  batchproduct = []
  submitted: boolean = false
  pushintobatch() {
    this.submitted = true
    if (this.validation()) {
      this.batchentry.batchno = this.batchno
      this.batchentry.code = this.batchentry.barCode
      this.batchentry.quantity = this.batchentry.quantity
      this.batchentry.barCode = null
      this.batchentry.entrydatetime = moment(this.batchdate).format('YYYY-MM-DD HH:MM A')
      this.batches.push(this.batchentry)
      this.batchentry = { 
        barCode: null,
        code: '',
        barcodeId: null,
        quantity: null,
        price: null,
        expiarydate: '',
        companyid: this.CompanyId,
        storeid: this.StoreId,
        productId: 0,
        product: null,
        batchno: 0,
        entrydatetime: '',
      }
      this.inputValue = ''
      this.submitted = false
      //console.log(this.barcodeel)
      this.batches.batchno = null;
      this.barcodeel['nativeElement'].focus()
      console.log(this.batches)
    }

    if (!this.inputValue) {
      this.filterproduct = []
      return;
    }
  }

  delete(index) {
    this.batches.splice(index, 1)
  }

  searchbyproduct(event) {
    console.log(event.element.nativeElement.id)
    var product = this.products.filter(x => x.barcodeId == +event.element.nativeElement.id )[0]
    this.inputValue = product.product
    this.batchentry.product = product
    this.batchentry.productId = product.productId
    this.batchentry.barcodeId = product.barcodeId
    this.batchentry.barCode = product.barCode
    this.quantityel['nativeElement'].focus()
  }
  
  validation() {
    var isvalid = true
    if (this.batchentry.barCode <= 0) isvalid = false
    if (this.batchentry.quantity <= 0) isvalid = false
    if (this.batchentry.price <= 0) isvalid = false
    if (this.batchno == 0) isvalid = false
    if (this.batchdate == null) isvalid = false
    return isvalid
  }

  // saveBatch() {
  //   this.Auth.getbatchEntry(this.batches, 20).subscribe(data => {
  //     console.log(data)
  //     this.batches = []
  //     this.notification.success('Batch Added', 'Batch Added Successfully')
  //     this.batchno = data['lastbatchno'] + 1
  //   })
  // }


  saveBatch() {
    this.Auth.getbatchEntry(this.batches, 20).subscribe(data => {
      console.log(data)
      this.Auth.batchproductdb(data["products"]).subscribe(data1 => {
        console.log(data1)
        this.batches = [];
        this.notification.success("Batch Added", "Batch Added Successfully")
        this.batchno = data["lastbatchno"] + 1;
      })
    })
  }

}
