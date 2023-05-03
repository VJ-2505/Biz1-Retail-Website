import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core'
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, observable, Observable, Subject } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router'
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators'
import {
  DelModule,
  OrderItemModule,
  OrderModule,
  OrdModule,
  OrderItemDetailModule,
  OrderstatusDetails,
} from './internal-transfer.module'
import { Location } from '@angular/common'
import { StateObservable } from '@ngrx/store'
import { log } from 'console'

@Component({
  selector: 'app-internal-transfer',
  templateUrl: './internal-transfer.component.html',
  styleUrls: ['./internal-transfer.component.scss'],
})
export class InternalTransferComponent implements OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any>
  @ViewChild('enterproduct', { static: false }) public enterproduct: TemplateRef<any>
  //productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef
  @ViewChild('stock', { static: false }) public stockmodel: TemplateRef<any>;//productinput

  model: any = 'QWERTY'
  order: OrderModule
  RecData: DelModule
  inputValue: string = ''
  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.products
            .filter(
              v =>
                v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                v.barCode?.toLowerCase().indexOf(term.toLowerCase()) > -1,
            )
            .slice(0, 10),
      ),
    )

  formatter = (x: { name: string }) => x.name

  searchstore = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.stores.storeList
            .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10),
      ),
    )

  //  searchsupplier = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200), 
  //     map(term =>
  //       term === ''
  //         ? []
  //         : this.stores.storeList
  //           .filter(
  //             v => 
  //             (v.name.toLowerCase().indexOf(term.toLowerCase()) > -1) 
  //             )
  //           .slice(0, 10),
  //     ),
  //   )




  // Master
  // 14-06-2022
  // selectedreceiveritem(item) { 
  //   console.log('item', item)
  //   this.OrderedById = item.id
  // }

  // searchreceiver = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     map(term =>
  //       term === ''
  //         ? []
  //         : this.stores.storeList
  //             .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
  //             .slice(0, 10),
  //     ),
  //   )

  // formatterreceiver = (x: { name: string }) => x.name

  // @ViewChild('cardnumber', { static: false }) cardnumber: ElementRef;
  buffer = ''
  paymenttypeid = 1
  isuppercase: boolean = false
  WaiterId = null
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let data = this.buffer || ''
    if (event.key !== 'Enter' && event.key !== 'Shift') {
      // barcode ends with enter -key
      if (this.isuppercase) {
        data += event.key.toUpperCase()
        this.isuppercase = false
      } else {
        data += event.key
      }
      this.buffer = data
    } else if (event.key === 'Shift') {
      this.isuppercase = true
    } else {
      this.buffer = ''
      this.setproductbybarcode(data)
    }
    console.log(this.isuppercase);
    // console.log(event)  
  }


  draft = false
  dispatchStatus = 1
  scrollContainer: any
  products: any = []
  OrdData: any = []
  popupData: any = []
  stores: any = []
  filteredvalues = []
  barcValue: string = ''
  cartitems: any = []
  subtotal = 0
  searchTerm = ''
  tax = 0
  discount = 0
  isVisible = false
  batchno = 5
  isShown = true
  isTable = false
  ordNo = 0
  storeId: any
  orderDate = ''
  CustomerAddressId = null
  CompanyId: any
  CustomerId = null
  InvoiceNo = 0
  sourceId = 0
  DiningTableId = null
  Price = 0
  refamt = 0
  Tax1 = 0
  Tax2 = 0
  Tax3 = 0
  CancelStatus = 0
  ProdStatus = ''
  DispatchStatus = 0
  ReceiveStatus = 0
  OrderStatusId = 1
  OrderedById = 0
  SuppliedById = 0
  FoodReady = true
  OrderType = 2
  UserId = null
  SpecialOrder = false
  Charges
  OrderDiscount = 0
  OrderTaxDisc = 0
  OrderTotDisc = 0
  AllItemDisc = 0
  AllItemTaxDisc = 0
  AllItemTotalDisc = 0
  DiscAmount = 0
  DiscPercent = 0
  SplitTableId = 0
  PreviousStatusId = 0
  AutoOrderId = 0
  isRxve = true
  isNRxve = false
  closeResult = ''
  ordId = null
  TotalProductSale = 0
  TotalPrdQty = 0
  streId = 0
  isDisp = false
  numRecordsStr = 50
  // orders: any = []
  // companyId = 1
  numRecords = 50
  NewArr: any = []
  show = true

  tableData = [
    {
      key: '1',
      actionName: 'New Users',
      progress: { value: 60, color: 'bg-success' },
      value: '+3,125',
    },
    {
      key: '2',
      actionName: 'New Reports',
      progress: { value: 15, color: 'bg-orange' },
      value: '+643',
    },
    {
      key: '3',
      actionName: 'Quote Submits',
      progress: { value: 25, color: 'bg-primary' },
      value: '+982',
    },
  ]
  temporaryItem: any = { DiscAmount: 0, Quantity: 0 }
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0 }
  barcodemode: boolean = false
  customerdetails = { data_state: '', name: '', PhoneNo: '', email: '', address: '', companyId: 0 }
  customers: any = []
  users = []
  Ordprd: any = []
  orderType = 'Receiver'
  // orderStatus = 3 
  // quantityfc = new FormControl('', [Validators.required, Validators.min(1)]);

  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    public location: Location,
  ) {
    this.users = JSON.parse(localStorage.getItem('users'))
  }
  // getErrorMessage() {
  //   if (this.quantityfc.hasError('required')) {
  //     return "Quantity can't be Empty";
  //   }

  //   return this.quantityfc.hasError('min') ? 'Quantity should be greater than 0' : '';
  // }
  loginfo
  StoreId: any

  Items: Array<OrderItemModule> = []
  storename: any

  storeid: any

  ngOnInit(): void {

    this.Auth.getdbdata(['loginfo']).subscribe(
      data => {
        this.loginfo = data['loginfo'][0]
        this.CompanyId = this.loginfo.companyId
        this.StoreId = this.loginfo.storeId
        this.Getorderlist()
      })
    const user = JSON.parse(localStorage.getItem('user'))
    const store = JSON.parse(localStorage.getItem('store'))
    this.CompanyId = user.companyId
    this.StoreId = user.storeid
    console.log('test', this.StoreId);
    this.storeid = user.name
    console.log(this.storeid);

    this.order = new OrderModule(2)
    this.products = []
    this.getBarcodeProduct()
    this.getStoreList()
    this.Getorderlist()
    // this.getallprod()
    // this.getstore()
    this.products.forEach(product => {
      product.OrderQuantity = null
      product.tax = 0
      product.amount = 0
    })
    // Queen 31-01-2022
    this.orderkey = localStorage.getItem('orderkey')
      ? JSON.parse(localStorage.getItem('orderkey'))
      : { orderno: 1, timestamp: 0, GSTno: '' }

  }
  // this.location.back()

  getBarcodeProduct() {
    this.Auth.getBarcodeProduct(this.CompanyId, this.StoreId).subscribe(data => {
      console.log('data', data)
      this.products = data['products']
      this.batchno = data['lastbatchno'] + 1
      this.ordNo = data['lastorderNo'] + 1
    })
  }
  receiveStk(id) {
    console.log(id)
    this.Auth.editInternalord(id).subscribe(data => {
      console.log(data)
    })
    // this.isRxve = ! this.isRxve; 
    // this.isNRxve =!this.isNRxve;
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      },
    )
  }
  dispatch(data) {
    console.log('data', data)
    this.dispatch = data
    this.isDisp = !this.isDisp
    this.isShown = this.isShown
    this.isTable = this.isTable
    // this.router.navigateByUrl("/apps/dispatch/this.dispatch");
    // {
    //   orderId:this.ordId
    // });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC'
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop'
    } else {
      return `with: ${reason}`
    }
  }
  orderstatus = 1
  // OrderQuantity = 1
  saveOrder() {
    console.log(this.order)
    this.updateorderno()
    this.order.OrderNo = this.orderkey.orderno
    this.order.StoreId = this.StoreId
    this.order.BatchNo = this.batchno
    this.order.BillDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.CreatedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.BillDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.OrderedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.OrderedDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.DeliveryDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.ModifiedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.CompanyId = this.CompanyId
    this.order.InvoiceNo = this.InvoiceNo
    this.order.RefundAmount = this.refamt
    this.order.ProdStatus = '1'
    this.order.WipStatus = '1'
    this.order.OrderStatusId = this.OrderStatusId
    this.order.OrderedById = this.StoreId
    this.order.SuppliedById = this.SuppliedById
    this.order.OrderType = this.OrderType
    this.order.SpecialOrder = this.SpecialOrder
    this.order.DiscAmount = this.DiscAmount
    this.order.DiscPercent = this.DiscPercent
    this.order.PreviousStatusId = this.PreviousStatusId
    this.order.OrderStatus = this.orderstatus
    //this.Items.OrderQuantity = this.OrderQuantity
    //this.order.Quantity = this.Quantity
    //this.Items.OrderQuantity = this.order.Items.OrderQuantity

    this.order.Items.forEach(item => {
      item.CompanyId = this.CompanyId
    })
    this.order.OrderDetail.forEach(Od => {
      Od.CompanyId = this.CompanyId
    })
    console.log(this.Items)

    // this.order.OrderStatusDetails = new OrderstatusDetails()
    console.log('save', this.order)
    this.RecData = new DelModule(
      this.CompanyId,
      this.order.Items,
      this.draft,
      this.order,
      this.order.OrderDetail,
    )
    console.log('finalarray', this.RecData)
    // this.Auth.savestock(this.RecData).subscribe(data => {
    //   console.log(data)

    //   this.isShown = !this.isShown
    //   this.isTable = !this.isTable
    //   this.Getorderlist()
    //   this.order = new OrderModule(2)
    // })


  }
  internal() {
    this.isShown = !this.isShown
    this.isTable = !this.isTable
  }

 

  goback() {
    this.router.navigateByUrl('internaltransfer')
  }

  back() {
    this.isTable = !this.isTable
    this.isShown = !this.isShown
    this.temporaryItem = { Quantity: '', price: '', tax1: '', tax2: '' }
    this.model = { model: '' }
    this.order = new OrderModule(2)
  }

  locback() {
    this.isTable = !this.isTable
    this.isShown = !this.isShown
  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data
      console.log(this.stores)
    })
  }
  getOrderList() {
    this.Ordprd.push({
      companyId: this.CompanyId,
      searchId: this.ordId,
      numRecordsStr: this.numRecordsStr,
    })
    // this.Auth.getorder(this.Ordprd).subscribe(data => {
    //   this.OrdData = data
    //   console.log('OrdData', this.OrdData)
    // }) 
  }
  setproductbybarcode(code) {
  }
  savedata() {
    if (this.customerdetails.data_state == 'new') {
      this.addcustomer()
    } else if (this.customerdetails.data_state == 'old') {
      this.updatecustomer()
    }
  }
  updatecustomer() {
    this.Auth.updateCustomer(this.customerdetails).subscribe(
      data => {
        console.log(data)
        this.notification.success(
          'Customer Updated!',
          `${this.customerdetails.name} updated successfully.`,
        )
      },
      error => {
        console.log(error)
      },
      () => {
        // this.getcustomers();
      },
    )
  }
  addcustomer() {
    this.Auth.addCustomers(this.customerdetails).subscribe(
      data => {
        console.log(data)
        this.notification.success(
          'Customer Added!',
          `${this.customerdetails.name} added successfully.`,
        )
        this.customerdetails.data_state = 'old'
      },
      error => {
        console.log(error)
      },
      () => {
        // this.getcustomers();
      },
    )
  }
  private async getCustomer() {
    // Sleep thread for 3 seconds
    console.log(this.customerdetails.PhoneNo)
    console.log(this.customers)
    this.customerdetails.data_state = 'loading'
    // await this.delay(3000);

    if (this.customers.some(x => x.PhoneNo == this.customerdetails.PhoneNo)) {
      var obj = this.customers.filter(x => x.PhoneNo == this.customerdetails.PhoneNo)[0]
      Object.keys(obj).forEach(element => {
        this.customerdetails[element] = obj[element]
      })
      this.customerdetails.data_state = 'old'
    } else {
      this.customerdetails.data_state = 'new'
    }
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  submitted: boolean = false
  addItem() {
    console.log('temporaryItem', this.temporaryItem)
    this.submitted = true
    console.log(this.validation())
    if (this.validation()) {
      this.order.addproduct(this.temporaryItem)
      this.temporaryItem = { DiscAmount: 0, Quantity: 0 }
      this.productinput['nativeElement'].focus()
      this.model = ''
      this.filteredvalues = []
      this.submitted = false
      console.log('cvcv', this.order)
    }
    return
  }

  barcodereaded(event) {
    console.log(event)
    console.log(event.element.nativeElement.id)
    var product = this.products.filter(x => x.Id == +event.element.nativeElement.id)[0]
    this.inputValue = product.Product
    this.barcodeItem = product
    this.barcodeItem.quantity = 1
    if (this.cartitems.some(x => x.Id == this.barcodeItem['Id'])) {
      this.cartitems.filter(
        x => x.Id == this.barcodeItem['Id'],
      )[0].quantity += this.barcodeItem.quantity
    } else {
      this.cartitems.push(Object.assign({}, this.barcodeItem))
    }
    this.calculate()
    this.barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0 }
    this.barcValue = ''
  }

  //06-01-2023   
  delete(index) {
    this.selectedprod.forEach(prod => {
      if (prod.batchId == this.order.Items[index].batchId) {
        prod.quantity += this.order.Items[index].OrderQuantity
        prod.OrderQuantity = null
        // console.log(prod.OrderQuantity);
      }
      prod.OrderQuantity = null
    })
    this.order.Items.splice(index, 1)
    this.order.OrderDetail.splice(index, 1)
    this.order.setbillamount()
  }

  deleteOrder(Id) {
    console.log('delete', Id)
    console.log(this.NewArr)
    this.Auth.deleteItem({ companyId: this.CompanyId, orderId: Id }).subscribe(data => {
      this.getorderedList = data
      console.log('delete', data)
      this.Getorderlist()
    })
  }

  settotalprice(i, qty) {
    this.cartitems[i].amount = this.cartitems[i].Price * this.cartitems[i].Quantity
    this.cartitems[i].tax =
      (this.cartitems[i].amount * (this.cartitems[i].Tax1 + this.cartitems[i].Tax2)) / 100
    console.log(
      i,
      this.cartitems[i].Price,
      this.cartitems[i].Quantity,
      this.cartitems[i].amount,
      qty,
    )
    this.cartitems[i].amount = +this.cartitems[i].amount.toFixed(2)
    this.calculate()
  }

  calculate() {
    this.subtotal = 0
    this.tax = 0
    this.discount = 0
    this.cartitems.forEach(item => {
      console.log(item)
      item.amount = item.price * item.quantity
      item.tax = (item.taxpercent * item.amount) / 100
      item.amount = +item.amount.toFixed(2) - item.disc
      this.subtotal += item.price * item.quantity
      this.tax += item.tax
      this.discount += item.disc
    })
    this.subtotal = +this.subtotal.toFixed(2)
    this.tax = +this.tax.toFixed(2)
    this.discount = +this.discount.toFixed(2)
    // console.log(this.tax)
  }
  date = new Date()
  onChange(e) {
    console.log('date', e)
    this.orderDate = e
  }
  showModal(): void {
    this.isVisible = true
  }

  handleOk(): void {
    console.log('Button ok clicked!')
    this.isVisible = false
  }

  handleCancel(): void {
    console.log('Button cancel clicked!')
    this.isVisible = false
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true })
  }
  opensplit(content) {
    this.modalService.open(content, { centered: true })
  }
  //////////////////////////////////////////rough////////////////////////////////////////////////////////

  selectedstoreitem(item) {
    console.log('item', item)
    // this.StoreId = item.id
  }
  productbybarcode = []
  barcode = ''
  searchbybarcode() {
    this.productbybarcode = this.products.filter(x => x.barCode == this.barcode)[0]
    console.log(this.barcode, this.productbybarcode, this.products)
    this.model = this.productbybarcode['product']
  }
  validation() {
    var isvalid = true
    // if (!this.temporaryItem.productId) isvalid = false
    // if(this.temporaryItem.Quantity <= 0) isvalid = false
    if (this.temporaryItem.OrderQuantity <= 0) isvalid = false
    // if (this.temporaryItem.OrderQuantity > this.temporaryItem.quantity) isvalid = false
    if (this.temporaryItem.Price <= 0) isvalid = false;
    return isvalid
  }
  reloadPage() {
    window.location.reload()
  }

  OrdId: number = 0
  OrderDetail: any = null
  ts: any
  getorderid(OrdId, modalRef) {
    this.Auth.getOrderIdinternal(OrdId).subscribe(data => {
      this.popupData = data
      this.popupData.receipts.forEach(rec => {
        // rec.itemDetails = JSON.parse(rec.orderJson)
        // console.log(JSON.parse(rec.orderJson))
        rec.itemDetails = JSON.parse(rec.itemJson)
        console.log(JSON.parse(rec.itemJson))
      })
      this.OrderDetail = this.popupData.receipts[0]
      this.ts = this.OrderDetail.itemDetails
      console.log(this.ts)
      console.log(this.popupData)
      this.openDetailpopup(modalRef)
    })
  }

  orders: any = null

  parseOrder(json_string, modalRef) {
    this.orders = JSON.parse(json_string)
    console.log(this.orders)
    this.openDetailpopup(modalRef)
  }

  openDetailpopup(contentdetail) {
    const modalRef = this.modalService
      .open(contentdetail, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        result => { },
        reason => { },
      )
  }

  storeIdByInt: any
  getorderedList: any = []
  Getorderlist() {
    this.Auth.getorderlist(this.loginfo.storeId).subscribe(data => {
      console.log(data)
      this.getorderedList = data["order"]
      this.tabledata = this.getorderedList
      console.log(this.getorderedList)
      // this.StoreByIdInternal(0)
    })
  }


  tabledata: []
  term: string = ''
  filtersearch(): void {
    this.tabledata = this.term
      ? this.getorderedList.filter(x =>
        x.supplier.toLowerCase().includes(this.term.toLowerCase()),
      )
      : this.getorderedList
    console.log(this.tabledata)
  }


  compid: any
  StoreByIdInternal(storeId) {
    this.Auth.getstoreIdInternal(this.CompanyId, storeId).subscribe(data => {
      const stores = data['storeList']
      this.getorderedList.forEach(order => {
        order.supplier = stores.filter(x => x.id == order.SuppliedById)[0]?.name
        order.receiver = stores.filter(x => x.id == order.OrderedById)[0]?.name
      })
    })
  }

  orderkey = { orderno: 1, timestamp: 0, GSTno: '' }

  updateorderno() {
    this.orderkey.orderno++
    localStorage.setItem('orderkey', JSON.stringify(this.orderkey))
    // this.Auth.updateorderkey(this.orderkey).subscribe(data => { })
    console.log(this.orderkey)
  }
  orderlogging(eventname) {
    var logdata = {
      event: eventname,
      orderjson: JSON.stringify(this.order),
      orderno: this.orderkey.orderno,
      timestamp: new Date().getTime(),
    }
    this.Auth.logorderevent(logdata).subscribe(data => { })
  }

  getintordId: any = []
  editinternalord(id) {
    console.log(id)
  }

  // SuppliedById: any
  formatterstore = (x: { name: string }) => x.name
  selectedsupplieritem(item) {
    console.log('item', item)
    this.SuppliedById = item.id
    console.log(this.SuppliedById)
    this.getallprod()
  }

  selectproduct() {
    console.log('selected product', this.model)
  }

  crossclick() {
    this.modalService.dismissAll()
  }

  isDisabled: Boolean = false
  test: any
  booltest: boolean = false
  gprod: any = []

  changefilters(bool) {
    this.booltest = bool
    this.gprod.batchprod = true
    console.log('Checkbox', this.booltest)
    this.getallprod()
    this.isDisabled = !this.isDisabled
    this.temporaryItem = { Quantity: '', price: '', tax1: '', tax2: '' }
    this.model = { model: '' }
  }

  batchprd: any = []
  product: any

  getallprod() {
    console.log(this.CompanyId, this.SuppliedById, this.booltest)
    this.Auth.getintprod(this.CompanyId, this.SuppliedById, this.booltest).subscribe(data => {
      this.gprod = data
      console.log(this.gprod)
      this.batchprd = this.gprod['batchprod']
      console.log(this.batchprd)
      this.product = this.gprod['product']
      console.log(this.product)

      this.gprod.batchprod.forEach(prod => {
        // console.log(prod);
        prod.maxqty = prod.quantity
        prod.OrderQuantity = null
      })
      this.enterproduct['nativeElement'].focus()
      this.groupProducts()
    })
  }

  sname: any
  // getstore() {
  //   this.Auth.getstoreslist(this.CompanyId, this.StoreId).subscribe(data => {
  //     this.sname = data
  //     console.log(this.sname);
  //   })
  // }

  searchsupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          // : this.sname
            : this.stores.storelist 
            .filter(
              v =>
                (v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
            )
            .slice(0, 10),
      ),
    )
  formattersupplier = (x: { name: string }) => x.name

  groupedProduct = []
  groupProduct() {
    var helper = {}
    this.groupedProducts = this.gprod.batchprod || this.gprod.product.reduce((r, o) => {
      console.log(this.groupedProducts)
      var key = o.barcodeId + '-'
      if (!helper[key]) {
        helper[key] = Object.assign({}, o)
        r.push(helper[key])
      }
      return r
    }, [])
    console.log('grouped', this.groupedProducts)
  }

  groupedProducts = []
  groupProducts() {
    var helper = {}
    this.groupedProducts = this.gprod.batchprod.reduce((r, o) => {
      //console.log('1', this.groupedProducts)
      var key = o.barcodeId + '-'
      if (!helper[key]) {
        helper[key] = Object.assign({}, o)
        r.push(helper[key])
      }
      return r
    }, [])
    this.groupedProducts = this.gprod.product.reduce((r, o) => {
      //console.log('2', this.groupedProducts);
      var key = o.barcodeId + '_'
      if (!helper[key]) {
        helper[key] = Object.assign({}, o)
        r.push(helper[key])
      }
      return r
    }, [])
    console.log('grouped', this.groupedProducts)
  }

  searchproduct = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.groupedProducts
            // : (this.gprod.product
            //   || this.groupedProducts)
            .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 &&
              ((v.batchId && v.quantity > 0) || (!v.batchId)))
            // && !v.ishidden && this.order.Items.some(oi => oi.ProductId == v.ProductId)
            .slice(0, 10),
      ),
    )

  selectedprod: any = []
  selectedItem(item, selectedprod) {
    console.log(item)
    if (item.hasOwnProperty('product')) {
      this.selectedprod = this.gprod.batchprod.filter(x => x.barcodeId == item.barcodeId && x.quantity > 0)
      console.log(this.selectedprod);
      this.addItem()
    } else {
      this.selectedprod = this.gprod.batchprod.filter(x => x.barcodeId == item.barcodeId && x.quantity > 0)
      console.log(selectedprod)
      this.selectedproduct(item)
      if (this.selectedprod.length > 0) {
        this.modalService.open(this.stockmodel, { centered: true, size: 'lg' })
      } else {
        this.selectedprod = this.gprod.product.filter(x => x.id == item.id)
        console.log(selectedprod)
        this.selectedproduct(this.selectedprod[0])
      }
      this.quantityel['nativeElement'].focus()
      // this.orderqty['nativeElement'].focus()
    }
  }

  selectedproduct(product) {
    console.log(product)
    Object.keys(product).forEach(key => {
      this.temporaryItem[key] = product[key]
    })
    product.OrderQuantity = null
    // console.log(product.OrderQuantity);
    this.modalService.dismissAll()
  }

  // selectprod: Array<any> = [];
  // onChanges(item: string, ischecked: boolean) {
  //   this.submitted = true;
  //   this.valid()
  //   if (this.stockmodalvalid) {
  //     // var array = this.selectedprod.filter(x => x.selected)
  //     // console.log(array);
  //     // array.forEach(item => {
  //     console.log(item);
  //     if (ischecked) {
  //       this.selectprod.push(item);
  //       console.log(this.selectprod);
  //     } 
  //     else {
  //       let index = this.selectprod.indexOf(item);
  //       this.selectprod.splice(index, 1)
  //     }
  //     // })
  //     this.submitted = false
  //   }
  //   //this.selectedItem(item, ischecked)
  // } 

  quantitychange(Items: OrderItemModule, event) {
    console.log(Items, event);
    var prod = this.gprod.batchprod.filter(x => x.batchId == Items.batchId)[0]
    console.log(Items.OrderQuantity)
    const prod_key = prod.productId + "_" + prod.batchId
    let orderedQty = 0
    if (this.order.Items.some(x => x.Productkey == prod_key)) {
      orderedQty = this.order.Items.filter(x => x.Productkey == prod_key)[0].OrderQuantity
    }
    console.log(this.gprod.batchprod)
    if (Items.OrderQuantity && Items.OrderQuantity <= prod.maxqty) {
      console.log('%c GOOD! ', 'color: #bada55')
      console.log(prod.maxqty, prod.quantity, this.order.Items)
      this.gprod.batchprod.filter(x => x.batchId == Items.batchId)[0].quantity =
        prod.maxqty - (Items.OrderQuantity + orderedQty)
      this.order.setbillamount()
    }
    else if (Items.OrderQuantity == 0 || Items.OrderQuantity == null) {
      event.preventDefault()
      console.log('%c VERY LOW! ', 'color: orange')
      Items.OrderQuantity = null
      this.gprod.batchprod.filter(x => x.batchId == Items.batchId)[0].quantity = prod.maxqty - 1
      this.order.setbillamount()
    }
    else {
      event.preventDefault()
      console.log('%c EXCEED! ', 'color: red')
      Items.OrderQuantity = null
      this.gprod.batchprod.filter(x => x.batchId == Items.batchId)[0].quantity = prod.maxqty - 1
      this.order.setbillamount()
    }
    console.log(Items.OrderQuantity)
  }





///Edit


//   ordPrdDetails: any = []
//   updataprod: any
//   array: any = []

//   prodts: any = {
//     name: '',
//     orderQuantity: '',
//     price: '',
//     tax1: '',
//     tax2: ''
//   }
//   SuppliedBy = ''
//   Idorder = 0
//   OrderedBy = ''
//   EdtTabe = false
//   isEditting: boolean
//   orderStatus = 3
//   ContainWgt: null
//   StockContainerId: null
//   StkContainerName = ''
//   createby: ''
//   DispatchById = null
  

// editinternal() {
//      this.isShown = !this.isShown

//      this.EdtTabe = !this.EdtTabe
//   }
//   selecteditem(item) {
//     console.log(item, Object.assign({}, this.temporaryItem))
//     Object.keys(item).forEach(key => {
//       this.temporaryItem[key] = item[key]
//     })
//     console.log(this.temporaryItem)
  
//   }

//   selectitem(item) {
//     console.log('item', item)
  
//     this.ContainWgt = item.containerWight
//     this.StockContainerId = item.stockContainerId
//     this.StkContainerName = item.stockContainerName
//     this.createby = item.createdBy
//     this.additem()
//   }
//   selecteddispatchitem(item) {
//     console.log('item', item)
//     this.DispatchById = item.id
//     // this.order.push({OrdNo:item.id})
//   }
//   Search = (text$: Observable<string>) =>
//     text$.pipe(
//       debounceTime(200),
//       map(term =>
//         term === ''
//           ? []
//           : this.products
//             .filter(
//               v =>
//                 v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
//                 v.barCode?.toLowerCase().indexOf(term.toLowerCase()) > -1,
//             )
//             .slice(0, 10),
//       ),
//     )
//     Formatter = (x: { product: string }) => x.product

//   additem() {
//     console.log('temporaryItem', this.temporaryItem)
//     this.temporaryItem.ContainerCount = this.ContainWgt
//     this.temporaryItem.ContainerId = this.StockContainerId
//     this.temporaryItem.ContainerName = this.StkContainerName
//     this.temporaryItem.StorageStoreId = this.StoreId
//     this.submitted = true
//     if (this.validation()) {
//       if (this.order.Items.some(x => x.BarcodeId == this.temporaryItem['barcodeId'])) {
//         this.order.Items.filter(
//           x => x.BarcodeId == this.temporaryItem['barcodeId'],
//         )[0].OrderQuantity += this.temporaryItem.Quantity
//         this.order.Items.filter(
//           x => x.BarcodeId == this.temporaryItem['barcodeId'],
//         )[0].OrderQuantity += this.temporaryItem.Quantity
//         this.order.setbillamount()
//       } else {
//         this.order.OrderType = this.OrderType
//         this.order.SpecialOrder = this.SpecialOrder
//         this.order.DiscAmount = this.DiscAmount
//         this.order.DiscPercent = this.DiscPercent
//         this.order.PreviousStatusId = this.PreviousStatusId
//         this.order.ProdStatus = '1'
//         this.order.WipStatus = '1'
//         this.order.Id = this.OrdId
//         this.order.SuppliedById = this.SuppliedById
//         this.order.OrderedById = this.OrderedById
//         this.order.StoreId = this.StoreId
//         this.order.CompanyId = this.CompanyId
//         this.order.OrderedDateTime = moment().format('YYYY-MM-DD HH:MM A')
//         this.order.OrderedDate = moment().format('YYYY-MM-DD HH:MM A')
//         this.order.CreatedDate = moment().format('YYYY-MM-DD HH:MM A')
//         this.order.BillDate = moment().format('YYYY-MM-DD HH:MM A')
//         this.order.BillDateTime = moment().format('YYYY-MM-DD HH:MM A')
      
//       }
//       this.products.forEach(prod => {
//         if (prod.barcodeId == this.temporaryItem['barcodeId']) {
//           prod.quantity -= this.temporaryItem.DispatchQty
//           prod.ContainerCount = this.ContainWgt
//           prod.ContainerId = this.StockContainerId
//           prod.ContainerName = this.StkContainerName
//         }
//       })
//       this.temporaryItem = { DiscAmount: 0, DispatchQty: null, DiscPercent: 0 }
//       this.productinput['nativeElement'].focus()
//       this.model = ''
//       this.filteredvalues = []
//       this.submitted = false
//       return
//     }
//   }
//   getord() {
//     {
//       this.Ordprd.push({
//         companyId: this.CompanyId,
//         searchId: this.OrdId,
//         UserID: this.users[0].id,
//         orderType: this.orderType,
//         orderStatus: this.orderStatus,
//         numRecordsStr: this.numRecordsStr,
//         dispatchStatus: this.dispatchStatus,
//       })
//     }
//   }

//   addQty(qty, item) {
//     console.log('addQty', qty, item)
//     this.ordPrdDetails.dispatchList.forEach(element => {
//       if (element.id == item.id) {
//         console.log('Qty', qty, item.id)
//         element.openQuantity = qty
//       }
//       return element
//     })
//     this.getord()
//   }
//   addPrice(price, item) {
//     console.log('addprice', price, item)
//     this.ordPrdDetails.dispatchList.forEach(element => {
//       if (element.id == item.id) {
//         console.log('price', price, item.id)
//         element.Price = price
//       }
//       return element
//     })
//     this.getord()
//   }
//   addTax1(Tax, item) {
//     console.log('addprice', Tax, item)
//     this.ordPrdDetails.dispatchList.forEach(element => {
//       if (element.id == item.id) {
//         console.log('Tax', Tax, item.id)
//         element.Tax1 = Tax
//       }
//       return element
//     })
//     this.getord()
//   }
//   addTax2(Tax, item) {
//     console.log('addprice', Tax, item)
//     this.ordPrdDetails.dispatchList.forEach(element => {
//       if (element.id == item.id) {
//         console.log('price', Tax, item.id)
//         element.Tax2 = Tax
//       }
//       return element
//     })
//     this.getord()
//   }
//   addTax3(Tax, item) {
//     console.log('Tax', Tax, item)
//     this.ordPrdDetails.dispatchList.forEach(element => {
//       if (element.id == item.id) {
//         console.log('price', Tax, item.id)
//         element.Tax3 = Tax
//       }
//       return element
//     })
//     this.getord()
//   }
//   addBatch(price, item) {
//     console.log('addprice', price, item)
//     this.ordPrdDetails.dispatchList.forEach(element => {
//       if (element.id == item.id) {
//         console.log('price', price, item.id)
//         element.Price = price
//       }
//       return element
//     })
//     this.getord()
//   }


//   deletenew(index) {
//     this.order.Items.splice(index, 1)
//     this.order.setbillamount()
//   }

// getorderPrd() {

//   if (this.OrdId != 0) {
//     this.Auth.getorderPrd(this.CompanyId, this.OrdId).subscribe(data => {
//       this.ordPrdDetails = data
//       console.log(this.ordPrdDetails);


//       this.updataprod = this.ordPrdDetails['orderItem']
//       console.log(this.updataprod);

//       this.prodts.name = this.updataprod[0].name
//       console.log(this.prodts.name);

//       this.prodts.orderQuantity = this.updataprod[0].orderQuantity
//       console.log(this.prodts.orderQuantity);

//       this.prodts.price = this.updataprod[0].price
//       console.log(this.prodts.price);

//       this.prodts.tax1 = this.updataprod[0].tax1
//       console.log(this.prodts.tax1);

//       this.prodts.tax2 = this.updataprod[0].tax2
//       console.log(this.prodts.tax2);

//       this.prodts.name = this.updataprod[0].name
//       console.log(this.prodts.name);

//       console.log('hhrtughggg', this.ordPrdDetails)
//       this.ordPrdDetails.orderItem.forEach(element => {
//         element.Action = 'Chk'
//         element['Price'] = element.price
//         this.array.push({
//           CompanyId: element['companyId'],
//           ContainerId: element['containerId'],
//           ContainerWeight: element['containerWeight'],
//           OpenQty: element['orderQuantity'],
//           GrossQty: element['orderQuantity'],
//           DispatchQty: element['orderQuantity'],
//           OrderQuantity: element['orderQuantity'],
//           DispatchProductId: element['productId'],
//           ProductId: element['productId'],
//           Dispatchprd: element['name'],
//           ProductName: element['name'],
//           Price: element['Price'],
//           Tax1: element['tax1'],
//           Tax2: element['tax2'],
//           Tax3: element['tax2'],
//           Tax4: element['tax2'],
//           Action: element['Action'],
//           OrderItemId: element['orderItemId'],
//           OrderId: element['orderId'],
//           Updated: element['updated'],
//           OrdItemDetailId: element['id'],
//           barcodeId: element['barcodeId'],
//           OrderItemType: element['orderItemType'],
//           OrderItemRefId: element['orderItemRefId'],
//           RefId: element['refId'],
//         })
//       })
//       this.SuppliedById = this.ordPrdDetails.order[0].suppliedById
//       this.OrderedById = this.ordPrdDetails.order[0].orderedById
//       this.SuppliedBy = this.ordPrdDetails.order[0].supplier
//       this.OrderedBy = this.ordPrdDetails.order[0].receiver
//       this.Idorder = this.ordPrdDetails.order[0].id
//       console.log('array2', this.array)
//     })
//   }
// }

// Update() {
//   this.order.Items.forEach(item => {
//     item.CompanyId = this.CompanyId
//     console.log(item);

//   })

//   this.Auth.Update(this.ordPrdDetails).subscribe(data => {
//     console.log('temporry', data)
//     this.additem()
//   })
//   this.isEditting = false
// }


// OpenDetailpopup(contentdetail, id) {
//   this.Ordprd.push({
//     companyId: this.CompanyId,
//     searchId: this.OrdId,
//     UserID: this.users[0].id,
//     orderType: this.orderType,
//     orderStatus: this.orderStatus,
//     numRecordsStr: this.numRecordsStr,
//     dispatchStatus: this.dispatchStatus,
//   })
 
//   this.TotalProductSale = 0
//   this.TotalPrdQty = 0

//   for (let i = 0; i < this.popupData.order.length; i++) {
//     this.TotalProductSale = this.TotalProductSale + this.popupData.order[i].totalsales
//     this.TotalPrdQty = this.TotalPrdQty + this.popupData.order[i].qty
//     this.TotalProductSale = +this.TotalProductSale.toFixed(2)
//     this.TotalPrdQty = +this.TotalPrdQty.toFixed(2)
//   }
//   const modalRef = this.modalService
//     .open(contentdetail, {
//       ariaLabelledBy: 'modal-basic-title',
//       centered: true,
//     })
//     .result.then(
//       result => { },
//       reason => { },
//     )
// }

// prod: any = {
//   name: ''
// }

// seleproduct() {
//   console.log('tedstr', this.prod.name);

//   console.log('product retype', this.products.name)
// }

// Qtychange(orderitems: OrderItemModule) {
//   console.log(orderitems);
// }
}


