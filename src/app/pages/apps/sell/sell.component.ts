import { Component, OnInit, ViewChild, HostListener, TemplateRef, ElementRef, Input, } from '@angular/core';
import {
  NgbModal, NgbTypeahead, NgbCalendar, NgbDate, NgbModalConfig, NgbDateParserFormatter,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ElectronService } from 'ngx-electron';
import * as moment from 'moment';
import { WaiterService } from 'src/app/services/waiter/waiter.service';
import { PrintService } from 'src/app/services/print/print.service';
import { EventService } from 'src/app/services/event/event.service';
import { fromEvent, merge, Observable, Observer, Subject, timer } from 'rxjs'
import { OrderService } from 'src/app/services/order/order.service';
// import { SignalRService } from 'src/app/services/signal-r/signal-r.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators'
// import { SyncService } from 'src/app/services/sync/sync.service';
import { SyncfbService } from 'src/app/services/sync/syncfb.service';
import {
  OrderModule, OrderItemModule, CurrentItemModule, KOTModule, Transaction,
  AdditionalCharge,
} from './sell.module';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { types } from 'util';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss'],
  inputs: ['Sellpageid', 'sectionid'],
})
export class SellComponent implements OnInit {
  @ViewChild('quantityref', { static: false }) private QuantityRef: ElementRef
  @ViewChild('saveref', { static: false }) private SaveRef: ElementRef

  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  @ViewChild('au', { static: true }) autocompleteref: ElementRef
  @ViewChild('viewordermodal', { static: true }) viewordermodal: ElementRef
  @ViewChild('split_payment_modal', { static: true }) split_payment_modal: ElementRef
  @ViewChild('tableorderswapmodal', { static: true }) Tableorderswapmodal: ElementRef
  @HostListener('window:keydown', ['$event'])
  // buffer = ''
  // isuppercase: boolean = false

  keyEvent(event: KeyboardEvent) {
    let spl_keys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F9', 'F111', 'Escape', 'F2', 'ArrowDown', 'ArrowUp', 'Enter', 'F10', 'F10', 'ArrowRight', 'ArrowLeft', 'Space']
    if (spl_keys.includes(event.key))
      event.preventDefault()
    console.log(event.key)
    if (event.key == 'F1') {
      this.createorder(5)
      this.orderpageid = 5
    } else if (event.key == 'F2') {
      this.vieworderlist(1)
      this.orderpageid = 1
    } else if (event.key == 'F3') {
      this.vieworderlist(2)
      this.orderpageid = 2
    } else if (event.key == 'F4') {
      this.vieworderlist(3)
      this.orderpageid = 3
    } else if (event.key == 'F5') {
      this.vieworderlist(4)
      this.orderpageid = 4
    }
    else if (event.key == 'F9') {
      var order = JSON.parse(localStorage.getItem('lastorder'))
      if (order && order.InvoiceNo) this.printreceiptbyorder(order)
    } else if (
      this.order &&
      this.order.OrderTypeId == 5 &&
      this.order.BillAmount > 0
    ) {
      let last_ind = this.storePaymentTypes.length - 1
      let current_ind = this.storePaymentTypes.findIndex(x => x.Id == this.order.StorePaymentTypeId)
      let new_ind = current_ind == last_ind ? (current_ind = 0) : current_ind + 1
      this.order.StorePaymentTypeId = this.storePaymentTypes[new_ind].Id
      this.order.machine_id = this.storePaymentTypes[new_ind].MachineId
    } else if (
      this.order &&
      this.order.OrderTypeId == 5 &&
      this.order.Items.length > 0 &&
      event.key == "F10"
    ) if (event.key == "F10") {

    }
    let modaled = document.getElementById("Draft")
    if (event.key == "F10") {
      if (modaled) {
        this.draftOrder()

      }
    }

    //////////////////Popup up down event/////////////////////////////////////////////////
    let bp_modal = document.getElementById("batchProduct")
    if (event.key == "ArrowDown") {
      if (bp_modal) {
        let index = this.batchproduct.findIndex(x => x.focus == true)
        if (index < (this.batchproduct.length - 1)) {
          this.batchproduct[index].focus = false
          this.batchproduct[index + 1].focus = true
        }
      }
    } else if (event.key == "ArrowUp") {
      if (bp_modal) {
        let index = this.batchproduct.findIndex(x => x.focus == true)
        if (index > 0) {
          this.batchproduct[index].focus = false
          this.batchproduct[index - 1].focus = true
        }
      }
    } else if (event.key == "Enter") {
      if (bp_modal) {
        let product = this.batchproduct.filter(x => x.focus == true)[0]
        this.selectedproduct(product)
      }

    }

    /////////////////storepaymenttype left right event////////////////////////////////////////////
    let pay = document.getElementById("PayType")
    if (event.key == "ArrowRight") {

      if (pay) {
        let index = this.storePaymentTypes.findIndex(x => x.focus == true)
        if (index < (this.storePaymentTypes.length - 1)) {
          this.storePaymentTypes[index].focus = false
          this.storePaymentTypes[index + 1].focus = true

        }

        let types = this.storePaymentTypes.filter(x => x.focus == true)[0]
        this.setpayment(types.id)
        console.log(types.id)

      }
    } else if (event.key == "ArrowLeft") {
      if (pay) {
        let index = this.storePaymentTypes.findIndex(x => x.focus == true)
        if (index > 0) {
          this.storePaymentTypes[index].focus = false
          this.storePaymentTypes[index - 1].focus = true
        }
        let types = this.storePaymentTypes.filter(x => x.focus == true)[0]

        this.setpayment(types.id)
        console.log(types.id)
      }
    }
    let edit = document.getElementById("Edit")
    if (event.key == "Enter") {
      if (edit) {
        this.addcurrentitem()
      }
    }

    let cust = document.getElementById("Custm")
    if (event.key == "F8") {
      if (cust) {
        this.customerdetaildrawer = true

      }
    } else if (event.key == "Enter") {
      this.customerdetaildrawer = false
    }
    else if ((event.ctrlKey || event.metaKey) && event.keyCode == 68) {
      console.log('CTRL + D')
      this.draftorderdrawer = true

    } else if ((event.ctrlKey || event.metaKey) && event.keyCode == 83) {
      console.log('CTRL + S')
      this.opensplitpaymentmodal()
    }


    let ordedt = document.getElementById("ordedt")
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 69) {
      console.log('CTRL + E')
      if (ordedt) {
      }
    } else if (event.key == "Enter") {
      this.confirmsplitpayment()
    }
    else if (
      this.order &&
      this.order.OrderTypeId == 5 &&
      this.order.StorePaymentTypeId != 0 &&
      event.key == 'Escape'
    ) {
      console.log('save counter order')
      this.saveorder()

    }
    // else if (event.key == "Escape") {
    //   if (this.order.OrderTypeId == 5 &&
    //     this.order.StorePaymentTypeId != -1) {
    //     this.saveorder()
    //     console.log('save counter order')
    //   }
    // }

    else if (
      this.order &&
      this.order.OrderTypeId == 5 &&
      this.order.Items.length > 0 &&
      event.key == 'F2'
    ) {
    } else if (
      this.order.PaidAmount == this.splitpaymenttotal &&
      event.key == "Enter"
    ) {
    }
    else if ((event.ctrlKey || event.metaKey) && event.keyCode == 67) {
      console.log('CTRL + C')
      this.visible = true

    }
    // else if (
    //   this.order &&
    //   this.order.OrderTypeId == 2 &&
    //   this.order.StorePaymentTypeId != 0 &&
    //   event.key == 'Escape'
    // ) {
    //   this.saveorder()
    // } 
    // else if (
    //   this.order &&
    //   this.order.OrderTypeId == 3 &&
    //   this.order.StorePaymentTypeId != 0 &&
    //   event.key == 'Escape'
    // ) {
    //   this.saveorder()
    // }
    // else if (
    //   this.order &&
    //   this.order.OrderTypeId == 4 &&
    //   this.order.StorePaymentTypeId != 0 &&
    //   event.key == 'Escape'
    // ) {
    //   this.saveorder()
    // } 
    else if ((event.ctrlKey || event.metaKey) && event.keyCode == 80) {
      console.log('CTRL + P')
      this.generatekot()
    }
    // else if ((event.ctrlKey || event.metaKey) && event.keyCode == 85) {
    //   console.log('CTRL + U')
    //   this.order.PaidAmount = 0 &&
    //     this.order.StorePaymentTypeId == 0 &&
    //     order.OrderTypeId != 1
    // }
    else if (event.key == "ArrowLeft") {
      (this.tablefilterid--)[0]

    } else if (event.key == "ArrowRight") {
      (this.tablefilterid++)[0]
    }
    let Dine = document.getElementById("Dine")
    // console.log(Dine)
    if (event.key == "Enter") {
      if (Dine) {
        this.order = new OrderModule(1)
        this.createtableorder(this.order.DiningTableId, this.order.diningtablekey)
      }
    }
    else if (event.key == "a") {
      this.orderstatusfilterid = -5
      // this.orderstatusfilterid = 5
      // this.orderstatusfilterid = -1
      // this.orderstatusfilterid = 2
    } if (event.key == "b") {
      this.orderstatusfilterid = 5
    }
    if (event.key == "c") {
      this.orderstatusfilterid = -1
    }
    if (event.key == "d") {
      this.orderstatusfilterid = 2
    }

    // console.log(event.key, this.order)
    if (event.key == 'Enter' && this.sectionid != 2) {
      this.createorder(2)
    } else if (event.key == 'Enter' && this.sectionid != 2) {
      this.createorder(3)
    } else if (event.key == 'Enter' && this.sectionid != 2) {
      this.createorder(4)
    }


    if (event.key == 'Enter' && this.sectionid == 2) {
      this.addItem(this.user)
      this.productinput['nativeElement'].focus()
    }

    if ((event.ctrlKey || event.metaKey) && event.keyCode == 69) {
      console.log('CTRL + E')
      let product = document.getElementById("item")

      this.itemdetails(product)

      this.currentitem = new CurrentItemModule(JSON.parse(JSON.stringify(product)))

      console.log(this.currentitem)
    }


    let del = document.getElementById("del")
    console.log(del)
    if (event.key == "Delete") {

      if (del) {
        this.order = new OrderModule(1)
        this.clearorder(order.OrderType)
        console.log(order.OrderType)
      }
    }

    let DINE = document.getElementById("DINE")
    if (event.key == "Tab") {
      if (DINE) {
        let index = this.diningtables.findIndex(x => x.focus == true)
        console.log(this.diningtables)
        if (index < (this.diningtables.length - 1)) {
          this.diningtables[index].focus = false
          this.diningtables[index + 1].focus = true
          console.log(this.diningtables)
        }
      }
    }
    console.log(this.storePaymentTypes.length, "focus index: " + this.storePaymentTypes.findIndex(x => x.focus == true))
    console.log(this.batchproduct.length, "focus index: " + this.batchproduct.findIndex(x => x.focus == true))
  }



  pagination = false

  pendOrderSales: any = {}
  orderid: any;
  draftOrders = []
  showDraft: boolean = false
  selectedDraftIndex: number = -1
  cashrecieved = 0
  balance = 0
  focus$ = new Subject<string>()
  click$ = new Subject<string>()
  isOnlineserv: Observable<boolean>
  isOnline: boolean
  @Input() orderpageid: number = 0
  @Input() sectionid: number = 0
  stores = []
  paymentTypes: any = []
  categories: any = []
  parentcategories = []
  childcategories = []
  charges = []
  diningareas = []
  diningtables = []
  loginfo
  deliverydate
  tempkotobj = null
  deliverytime
  preorders: any = []
  products: any = []
  order: OrderModule
  onlineorders: any = []
  onlineorderscount = {
    placed: 0,
    inprogress: 0,
    completed: 0,
    cancelled: 0,
  }
  ordercount = {
    '2': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
    '3': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
    '4': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
  }

  orderstatus = {
    '-1': { name: 'Cancelled' },
    '0': { name: 'Placed' },
    '1': { name: 'Accepted' },
    '2': { name: 'Preparing' },
    '3': { name: 'Food Ready' },
    '4': { name: 'Dispatched' },
    '5': { name: 'Delivered' },
  }
  listOfOption: Array<{ label: string; value: string }> = []
  size = 'default'
  selectedValue = 'gf'

  public model: any = ''
  public show: boolean = false
  public buttonName: any = 'Back'
  autocompleteproducts = []
  hide = true
  cards = [
    { name: 'Quick Order', ordertypeid: 5, class: 'bg-success', icon: 'fe fe-zap' },
    { name: 'Dine In', ordertypeid: 1, class: 'bg-primary', icon: 'fa fa-cutlery' },
    { name: 'Take Away', ordertypeid: 2, class: 'bg-warning', icon: 'fe fe-briefcase' },
    { name: 'Delivery', ordertypeid: 3, class: 'bg-gray-6', icon: 'fa fa-send-o' },
    { name: 'Pick Up', ordertypeid: 4, class: 'bg-red', icon: 'fa fa-truck' },
    { name: 'Online Orders', ordertypeid: 6, class: 'bg-dark', icon: 'fe fe-globe' },
  ]

  // customerdetails = {
  //   id: 0,
  //   name: '',
  //   phoneNo: '',
  //   email: '',
  //   address: '',
  //   storeId: 0,
  //   companyId: 0,
  //   datastatus: ''
  // }
  tablefilterid = -1
  checked = true;
  currentDiningArea = { Id: 0, DiningArea: 'Loading...' }
  currenttimestamp: number = new Date().getTime()
  orderstatusfilterid: number = -5
  ordersearchterm: string = ''
  activeKey = 0
  printersettings = { receiptprinter: '', kotprinter: '' }
  user: any
  statusbtns = []
  preptimecheck = 0
  tableorders: Array<OrderModule> = []
  hoveredDate: NgbDate | null = null
  fromDate: NgbDate | null = null
  toDate: NgbDate | null = null
  daterangeshow: string = ''
  datefilterfield = ''
  customerdetaildrawer = false
  draftorderdrawer = false
  // issplitpaymentdrawer = false
  selectedcategoryid = 0
  closeorder: boolean = false
  onlinestatusid = [-1]
  sortstatus = {
    OrderNo: 0,
    customer: 0,
    OrderedDateTime: 0,
    DeliveryDateTime: 0,
    BillAmount: 0,
    OrderStatusId: 0,
  }
  refreshlist = true
  private filteredonlineorders: any = []
  temporaryItem: any = { DiscAmount: 0, Quantity: null, DiscPercent: 0 };
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: 0, Tax1: 0, Tax2: 0 };
  barcodemode: boolean = false;
  // customerdetails = { id: 0, name: '', phoneNo: '', email: '', address: '', companyId: 0, datastatus: '' }
  customers: any = [];
  orderkey = { orderno: 1, timestamp: 0, GSTno: '' }
  visible = false
  // Auto complete+
  inputValue: string
  options: string[] = []
  isVisible = false
  variantgroups: any = [];
  variantgroupids: any = [];
  category: any = { id: 0, parentCategoryId: '', description: '', isactive: true, sortOrder: -1, companyId: 1, variantgroupids: [] };
  pcategories: any = [];
  nodesFiles = [
    {
      title: 'All',
      key: '100',
      expanded: false,
    },
  ]
  variants: any = [];
  // variantgroups: any = [];
  autocompletevalidation: boolean = true
  typeheadSelected: any




  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private notification: NzNotificationService,
    private modalService1: NzModalService,
    private electronservice: ElectronService,
    private calendar: NgbCalendar,
    public dFormatter: NgbDateParserFormatter,
    public ordservice: OrderService,
    private waiterS: WaiterService,
    private printservice: PrintService,
    private event: EventService,
    // private sync: SyncService,
    private sync: SyncfbService,
    config: NgbModalConfig,
    // private signal_r: SignalRService,


  ) {


    // config.backdrop = 'static';
    // config.keyboard = false;
  }


  printhtmlstyle = `
  <style>
    #printelement {
      width: 270px;
    }
    .header {
        text-align: center;
    }
    .item-table {
        width: 100%;
    }
    .text-right {
      text-align: right!important;
    }
    .text-left {
      text-align: left!important;
    }
    .text-center {
      text-align: center!important;
    }
    tr.nb, thead.nb {
        border-top: 0px;
        border-bottom: 0px;
    }
    table, p, h3 {
      empty-cells: inherit;
      font-family: Helvetica;
      font-size: small;
      width: 290px;
      padding-left: 0px;
      border-collapse: collapse;
    }
    table, tr, td {
      border-bottom: 0;
    }
    hr {
      border-top: 1px dashed black;
    }
    tr.bt {
      border-top: 1px dashed black;
      border-bottom: 0px;
    }
    tr {
      padding-top: -5px;
    }
  </style>`

  printtemporderkot(kot: KOTModule) {
    // // console.log(moment().format('DD-MM-YYYY hh:mm A'))
    // // console.log(moment(kot.ModifiedDate).format('DD-MM-YYYY hh:mm A'))
    // console.log(this.order.OrderName)
    var kottemplate = `
    <div id="printelement">
      <div class="header">
          <h3>ORDER TICKET #${kot.KOTNo}</h3>
          <table class="item-table">
              <tbody>
                  <tr class="nb">
                      <td class="text-left">${this.temporder.InvoiceNo}</td>
                      <td class="text-right">${this.temporder.OrderName}</td>
                  </tr>
                  <tr class="nb">
                      <td class="text-left">Date/Time</td>
                      <td class="text-right">${moment(kot.ModifiedDate).format(
      'DD-MM-YYYY / hh:mm A',
    )}</td>
                  </tr>
              </tbody>
          </table>
      </div>
      <hr>`
    if (kot.added.length > 0) {
      kottemplate += `
      <div class="text-center">ADDED ITEMS</div>
      <table class="item-table">
          <thead class="nb">
              <th class="text-left">ITEM</th>
              <th class="text-right">QTY</th>
          </thead>
          <tbody>
      `
      kot.added.forEach(ai => {
        // // console.log('ADDED ITEMS',ai.Quantity,ai.showname)
        kottemplate += `
        <tr class="nb">
            <td class="text-left">${ai.showname}</td>
            <td class="text-right">+${ai.Quantity}</td>
        </tr>
      `
      })
      kottemplate += `
        </tbody>
      </table>
      <hr>
      `
    }
    if (kot.removed.length > 0) {
      kottemplate += `
      <div class="text-center">REMOVED ITEMS</div>
      <table class="item-table">
          <thead class="nb">
              <th class="text-left">ITEM</th>
              <th class="text-right">QTY</th>
          </thead>
          <tbody>
      `
      kot.removed.forEach(ri => {
        // // console.log('REMOV ITEMS',ri.Quantity,ri.showname)
        kottemplate += `
        <tr class="nb">
            <td class="text-left">${ri.showname}</td>
            <td class="text-right">(${ri.Quantity})</td>
        </tr>
      `
      })
      kottemplate += `
        </tbody>
      </table>
      <hr>
      `
    }
    kottemplate += `
      <hr ${this.temporder.Note ? '' : 'hidden'}>
      <div class="text-center" ${this.temporder.Note ? '' : 'hidden'}>
          <p>Note: ${this.temporder.Note}</p>
      </div>
    `
    kottemplate += `
      <div class="text-center">
          <p>Powered By Biz1Book.</p>
      </div>
    </div>
    `
    kottemplate += this.printhtmlstyle
    // console.log(kottemplate)
    var printers = []
    if (this.printersettings) {
      if (this.printersettings['kotgroups'].some(x => x.KOTGroupId == kot.KOTGroupId)) {
        printers = this.printersettings['kotgroups'].filter(x => x.KOTGroupId == kot.KOTGroupId)[0]
          .Printers
      } else {
        printers = [this.printersettings.kotprinter]
      }
      this.printservice.print(kottemplate, printers)
    }
  }
  timer(timestamp) { }
  onDateSelection(date: NgbDate, datepopup) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date
    } else if (
      this.fromDate &&
      !this.toDate &&
      (date == this.fromDate || date.after(this.fromDate))
    ) {
      this.toDate = date
      datepopup.toggle()
    } else {
      this.toDate = null
      this.fromDate = date
    }
    this.daterangeshow = ''
    if (this.fromDate)
      this.daterangeshow =
        moment(`${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`).format(
          'Do MMM YYYY',
        ) + ' - '
    if (this.toDate)
      this.daterangeshow += moment(
        `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`,
      ).format('Do MMM YYYY')
  }
  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    )
  }
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate)
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    )
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.dFormatter.parse(input)
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue
  }
  cleardatefilter(e) {
    this.datefilterfield = ''
    this.fromDate = null
    this.toDate = null
    this.daterangeshow = ''
  }
  errorlo_g(num) {
    var numbr: number = 0
    numbr = 8 / num
  }
  isvalid_delivery_date: boolean = true
  datevalidation() {
    var min_timestamp = 0
    var max_timestamp = 95649033600000
    var delivery_timestamp = new Date(this.deliverydate).getTime()
    var isvalid = false
    if (delivery_timestamp >= min_timestamp && delivery_timestamp <= max_timestamp) {
      // console.log('valid date')
      isvalid = true
    } else {
      // console.log('invalid date')
      isvalid = false
    }
    this.isvalid_delivery_date = isvalid
    return isvalid
  }
  getpendOrderSales() {
    this.auth.getPendOrderSales().subscribe(data => {
      console.log(data)
      this.pendOrderSales = data
    })
  }

  ReadMore: boolean = true

  //hiding info box
  // visible:boolean = false

  log(value) {
    console.log(value);
    this.checked
    console.log(this.checked)
  }

  // onclick() {
  //   this.ReadMore = !this.ReadMore
  //   this.visible = !this.visible
  // }


  ngOnInit(): void {

    // document.getElementById("focusButton").addEventListener("click", () => {
    //   document.getElementById("typeahead-template").focus();
    // });


    // console.log(document.getElementById("typeahead-template"))
    // document.getElementById("typeahead-template").focus()

    this.auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.order = new OrderModule(6)
      this.sync.sync()
      this.getdata();
      this.getCategory();
      this.getvariantgroups();
      this.products = [];
      this.getproducts();
      this.GetStorePaymentType();
      this.temporaryItem.Quantity = null;
      this.products.forEach(product => {
        product.Quantity = null;
        product.tax = 0;
        product.amount = 0;
      })

    })
    this.eventConfig()
    const numbers = timer(3000, 1000)
    numbers.subscribe(x => {
      this.currenttimestamp = new Date().getTime()
    })
    if (localStorage.getItem('draftOrders')) {
      this.draftOrders = JSON.parse(localStorage.getItem('draftOrders'))
    } else {
      localStorage.setItem('draftOrders', '[]')
    }




  }

  ngOnChanges(changes) {
    console.log(document.getElementById("typeahead-template"))
    console.log(changes)
  }

  changeKey(key) {
    this.activeKey = key
  }


  nzClick(event) {
    // console.log(event)
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true, windowClass: 'modal-holder' })
  }

  clearallorders() {
    this.order = new OrderModule(6)
  }

  async eventConfig() {
    this.event.notify().subscribe(data => {
      console.log('EVENT SERVICE TRIGGER', data)
      if (data.hasOwnProperty('newerrororder')) {
        this.getpreorders()
      } else if (data.waiterorder == 'PREORDER') {
        this.getpreorders()
      } else if (data.waiterorder == 'TABLEORDER') {
        this.gettables()
        // this.gettblorders()
      }
    })
  }


  temponlineorder
  cancelonlineorder(orderid) {
    this.temponlineorder = this.onlineorders.filter(x => x.uPOrderId == orderid)[0]
    this.modalService.open(this.cancelreason_modal, { centered: true })
  }

  viewonlineorder(orderid) {
    // console.log(orderid)
    this.temponlineorder = this.onlineorders.filter(x => x.uPOrderId == orderid)[0]
    this.temponlineorder.invoiceno =
      this.temponlineorder.json.order.details.channel.charAt(0).toUpperCase() +
      this.temponlineorder.json.order.details.ext_platforms[0].id
    this.temponlineorder.json.order.items.forEach(item => {
      item.baseprice = item.price
      item.showname = item.title
      item.options_to_add.forEach(option => {
        item.baseprice += option.price
        item.showname += '/' + option.title
      })
    })

    this.modalService.open(this.viewonlineorder_modal, { centered: true, size: 'xl' })
    localStorage.setItem('testonlineorder', JSON.stringify(this.temponlineorder))
  }

  receivetableorder() {
    // this.generatekot()
    this.printreceipt()
  }

  sortpreorders(field) {
    Object.keys(this.sortstatus).forEach(key => {
      if (key == field) {
        this.sortstatus[field] == 0
          ? (this.sortstatus[field] = 1)
          : this.sortstatus[field] == 1
            ? (this.sortstatus[field] = -1)
            : (this.sortstatus[field] = 1)
      } else {
        this.sortstatus[key] = 0
      }
    })
    console.log(field, this.sortstatus[field])
    if (this.sortstatus[field] == 1) {
      this.preorders = this.preorders.sort((a, b) =>
        a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0,
      )
    } else if (this.sortstatus[field] == -1) {
      this.preorders = this.preorders.sort((a, b) =>
        a[field] > b[field] ? -1 : b[field] > a[field] ? 1 : 0,
      )
    }
    this.refreshlist = !this.refreshlist
    console.log(this.preorders[0].orderNo)
  }

  CompanyId: any
  StoreId: any
  tabledata = []
  getdata() {
    this.auth.getdbdata(['additionalchargesdb', 'stores', 'loginfo', 'orderkeydb', 'diningtabledb', 'tableordersdb', 'diningareadb', 'preorders']).subscribe(data => {
      console.log(data)
      this.loginfo = data['loginfo'][0]
      this.orderkey = data["orderkeydb"][0]
      this.charges = data['additionalchargesdb']
      this.diningareas = data['diningareadb']
      this.diningtables = data['diningtabledb']
      this.preorders = data['preorders']
      this.stores = data['stores']
      console.log(this.stores)
      console.log(this.preorders)
      console.log(this.diningtables)
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      localStorage.setItem('orderkey', JSON.stringify(this.orderkey))
      this.orderkeyValidation()
      console.log(data)
      console.log(this.charges)
      // return
      this.stores = data['stores'].sort((a, b) => (a.name > b.name ? 1 : -1))
      console.log(this.stores)
      this.diningareas = this.diningareas.sort((a, b) => (a.Id > b.Id ? 1 : b.Id > a.Id ? -1 : 0))
      this.diningtables = this.diningtables.sort((a, b) =>
        a.TableKey > b.TableKey ? 1 : b.TableKey > a.TableKey ? -1 : 0,
      )
      this.currentDiningArea = this.diningareas[0]
      console.log(this.currentDiningArea)
      this.tableorders = data['tableordersdb'] ? data['tableordersdb'] : []
      this.diningtables.forEach(tbl => {
        if (this.tableorders.some(x => x.diningtablekey == tbl.TableKey)) {
          console.log(tbl.TableName)
          tbl.TableStatusId = 1
        } else {
          tbl.TableStatusId = 0
        }
      })

      this.preptimecheck = 1 / (this.loginfo.FoodPrepTime * 10)
      // this.ordservice.getData()

      this.ordercount = {
        '2': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
        '3': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
        '4': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
      }
      this.preorders.forEach(order => {
        console.log(order)
        order.status_name = this.orderstatus[order.OrderStatusId]?.name
        order.deliverytimestamp = order.DeliveryDateTime
          ? new Date(order.DeliveryDateTime).getTime()
          : 0
        if (
          order.OrderStatusId == 5 &&
          (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
        )
          this.ordercount[order.OrderTypeId.toString()]['5']++
        else if (
          order.OrderStatusId == -1 &&
          (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
        )
          this.ordercount[order.OrderTypeId.toString()]['-1']++
        else if (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
          this.ordercount[order.OrderTypeId.toString()]['-5']++
        else if (order.DeliveryStoreId && order.StoreId != order.DeliveryStoreId)
          this.ordercount[order.OrderTypeId.toString()]['-2']++
        console.log(this.orderstatus[order.OrderStatusId].name)
      })
      this.preorders.sort((a, b) => {
        return new Date(a.DeliveryDateTime).getTime() - new Date(b.DeliveryDateTime).getTime()
      })
      // this.parentcategories = this.category.filter(x => x.parentCategoryId == null)
      // this.childcategories = this.category.filter(x => x.parentCategoryId != null)

      // console.log(this.parentcategories)
      // console.log(this.childcategories)
    })
  }


  splittable(tableid) {
    var lastsplittableid = +this.getavailablesplitid(tableid)
    var parentTable = this.diningtables.filter(x => x.Id == tableid)[0]
    var table = {
      Id: parentTable.Id,
      DiningAreaId: parentTable.DiningAreaId,
      TableKey: parentTable.TableKey + '_' + (lastsplittableid + 1),
      TableName: '',
      TableStatusId: 0,
    }
    table.TableName = parentTable.TableName + '/' + String.fromCharCode(65 + lastsplittableid)
    parentTable.LastSplitTableId = lastsplittableid + 1
    this.auth.splitTable({ parenttable: parentTable, splittable: table }).subscribe(data => {
      console.log(data)
      if (this.waiterS.waiterSocket)
        this.waiterS.waiterSocket.emit('tableorder:update', parentTable.TableKey)
      this.gettables()
      this.ordservice.getData()
    })
  }




  removeplittable(splitetablekey) {
    var parentTable = this.diningtables.filter(x => x.Id == +splitetablekey.split('_')[0])[0]
    parentTable.LastSplitTableId -= 1
    this.auth.deletesplittable(splitetablekey).subscribe(data => {
      if (this.waiterS.waiterSocket)
        this.waiterS.waiterSocket.emit('tableorder:update', parentTable.TableKey)
      this.gettables()
      this.ordservice.getData()
    })
  }

  gettables() {
    this.auth.getdbdata(['diningtabledb', 'tableordersdb']).subscribe(data => {
      this.diningtables = data['diningtabledb']
      console.log(this.diningtables)
      this.diningtables.forEach((element, i) => {
        element.focus = (i == 0) ? true : false
      });
      this.diningtables = this.diningtables.sort((a, b) =>
        a.TableKey > b.TableKey ? 1 : b.TableKey > a.TableKey ? -1 : 0,
      )
      this.tableorders = data['tableordersdb']
      this.diningtables.forEach(tbl => {
        if (this.tableorders.some(x => x.diningtablekey == tbl.TableKey)) {
          console.log(tbl.TableName, tbl.TableStatusId + '_')
          tbl.TableStatusId = 1

        } else {
          tbl.TableStatusId = 0
        }
      })
    })
  }

  getUnfinishedOrders() {
    this.auth.getUnfinishedOrders(this.loginfo.storeId).subscribe(data => {
      console.log(data)
      var storedata = { preorders: [] }
      data['forEach']((oj, index) => {
        console.log(oj.id, index, oj.orderNo)
        if (oj.orderJson) {
          var json = JSON.parse(oj.orderJson)
          console.log(json)
          console.log(json.InvoiceNo, oj.orderNo)
          json.datastatus = ''
          json.status = 'S'
          delete json._id
          storedata['preorders'].push(json)
        } else {
          console.log(oj.orderJson)
        }
      })

      this.auth.storeselect(storedata).subscribe(data1 => {
        console.log(data1)
        this.getpreorders()
      })
    })
  }






  getavailablesplitid(tableid) {
    var availablesplitid = 0
    var result = this.diningtables
      .filter(x => x.TableKey.includes('_') && x.TableKey.includes(tableid.toString()))
      .map(function (a) {
        return +a.TableKey.split('_')[1]
      })
    var missedarr = []
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i + 1] - result[i] > 1) {
          for (let j = 1; j < result[i + 1] - result[i]; j++) {
            missedarr.push(result[i] + j)
          }
        }
      }
      if (missedarr.length > 0) {
        availablesplitid = missedarr[0] - 1
      } else {
        availablesplitid = result[result.length - 1]
      }
    }
    return +availablesplitid
    // this.diningtables.filter(x => x.TableKey.includes('_') && x.TableKey.includes(tableid.toString()))
  }
  filteronlineorders() {
    this.onlineorderscount = {
      placed: 0,
      inprogress: 0,
      completed: 0,
      cancelled: 0,
    }
    this.onlineorders.forEach((order, index) => {
      // order.json = JSON.parse(order.json)
      // order.rider_details = JSON.parse(order.riderDetails)
      // order.status_details = JSON.parse(order.acceptedTimeStamp)
      if (order.orderStatusId == 0) this.onlineorderscount.placed++
      if ([1, 3, 4].includes(order.orderStatusId)) this.onlineorderscount.inprogress++
      if (order.orderStatusId == 5) this.onlineorderscount.completed++
      if (order.orderStatusId == -1) this.onlineorderscount.cancelled++
    })
    this.filteredonlineorders = this.onlineorders.filter(x =>
      this.onlinestatusid.includes(x.orderStatusId),
    )
  }

  syncorderbyid() {
    if (this.temporder.OrderId > 0) {
      this.temporder['loading'] = true
      this.preorders.filter(
        x =>
          x.InvoiceNo == this.temporder.InvoiceNo &&
          x.createdtimestamp == this.temporder.createdtimestamp,
      )[0]['loading'] = true
    }
    this.modalService.dismissAll()
  }

  currstsbtns = []
  customstsbtn = false
  vieworderlist(type) {
    console.log(this.currstsbtns)
    this.sectionid = 1
    this.orderpageid = type
    if (type == 6) {
      this.getstoreuporders()
    }
  }
  preventobjcpy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  vieworder(order) {
    console.log(order)
    this.temporder = this.preventobjcpy(order)
    this.deliverydate = this.temporder.DeliveryDateTime.split(' ')[0]
    this.deliverytime = this.temporder.DeliveryDateTime.split(' ')[1]
    this.modalService.open(this.viewordermodal, { size: 'xl', backdrop: 'static' })
  }
  storePaymentTypes: any = []
  GetStorePaymentType() {
    this.auth.getstorepaymentType(this.loginfo.storeId).subscribe(data => {
      console.log(data)
      this.storePaymentTypes = data
      if (this.storePaymentTypes.length > 1) {
        this.storePaymentTypes.forEach((element, i) => {
          element.focus = (i == 0) ? true : false
        });
      }

    })
  }

  paidamountinputevent() {
    if (!this.order.PaidAmount) {
      this.order.PaidAmount = 0
      this.order.StorePaymentTypeId = 0
    }
  }

  getOrderById(order) {
    order.loading = true
    this.auth.getOrderById(order.OrderId).subscribe(data => {
      console.log(data, JSON.parse(data["orderJson"]))
      var orderjson = JSON.parse(data['orderJson'])
      console.log(orderjson)
      orderjson._id = order._id
      orderjson.status = 'S'
      this.auth.updatepreorders(orderjson).subscribe(ldata => {
        this.getpreorders()
      })
    })
  }

  createtableorder(tableid, tablekey) {
    this.order = new OrderModule(1)
    // this.order.UserId = this.user.UserId
    // this.order.UserName = this.user.Name
    console.log(tablekey, this.tableorders)
    if (this.tableorders.some(x => x.diningtablekey == tablekey)) {
      this.orderlogging('edit_table_order')
      var tableorder = this.tableorders.filter(x => x.diningtablekey == tablekey)[0]
      for (var k in tableorder) this.order[k] = tableorder[k]
      console.log(this.order)
    } else {
      this.orderlogging('create_table_order')
      this.order.OrderName =
        `DI/${this.currentDiningArea.DiningArea}/` +
        this.diningtables.filter(x => x.TableKey == tablekey)[0].TableName
      this.order.DiningTableId = tableid
      this.order.diningtablekey = tablekey
      // this.savetblorder()
    }
    this.show = false
    this.sectionid = 2
    // this.waiterS.waiterSocket.emit("table:lock", { id: this.diningtables.filter(x => x.TableKey == tablekey)[0].Id, tableKey: tablekey, timestamp: new Date().getTime() })
  }


  editorder(order: OrderModule) {
    this.order = new OrderModule(order.OrderTypeId)
    for (var k in order) this.order[k] = order[k]
    this.orderlogging('edit_order')
    this.auth.getpreorderby_id(order['_id']).subscribe(data => {
      this.order.OrderId = data['OrderId']
      console.log(order.OrderId)
      this.show = false
      this.sectionid = 2
      console.log(this.order)
    })
  }

  toggle() {
    this.show = !this.show
    if (this.show) this.buttonName = 'Back'
    else this.buttonName = 'Back'
  }

  orderlogging(eventname) {
    var logdata = {
      event: eventname,
      orderjson: JSON.stringify(this.order),
      ordertypeid: this.order.OrderTypeId,
      orderno: this.orderkey.orderno,
      // kotno: this.orderkey.kotno,
      timestamp: new Date().getTime(),
    }
    this.auth.logorderevent(logdata).subscribe(data => {
      console.log(data)
    })
  }

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


  modalclose() {
    this.modalService.dismissAll()
  }
  // Online Order page BUtton text change function
  onlineusers: Array<any> = [
    {
      onlineactive: false,
    },
  ]

  onlineclick(onlineuser) {
    // var qq: string = 'ggg'
    // qq.startsWith()
    onlineuser.onlineactive = !onlineuser.onlineactive
  }
  // selectedDraftIndex: number = -1
  createorder(ordertypeid) {
    console.log(ordertypeid)
    this.selectedDraftIndex = -1
    this.order = new OrderModule(ordertypeid)
    this.order.createdtimestamp = new Date().getTime()
    this.charges.forEach(charge => {
      this.order.additionalchargearray.push(new AdditionalCharge(charge))
    })
    console.log(this.order.additionalchargearray, this.charges)

    if (![2, 3, 4].includes(this.order.OrderTypeId)) {
      this.order.additionalchargearray.forEach(charge => {
        console.log(this.charges)
        charge.selected = false
      })
    }
    // this.order.StoreId = this.loginfo.storeId
    console.log(this.order.StoreId)
    console.log(this.loginfo.storeId)
    // this.order.DeliveryStoreId = this.loginfo.StoreId
    this.orderlogging('create_order')
    this.show = false
    this.sectionid = 2
    if (this.order.IsAdvanceOrder || this.order.OrderTypeId == 2) {
      this.deliverydate = moment().format('YYYY-MM-DD')
      this.deliverytime = moment().format('HH:MM')
    }
  }
  // Take Away Button Text CHange Function
  users: Array<any> = [
    {
      active: false,
    },
  ]

  click(user) {
    user.active = !user.active
  }

  addfreequantity(key) {
    console.log(this.order.Items)
    this.order.Items.forEach(item => {
      if (item.ProductKey == key) {
        if (item.Quantity > 0) {
          item.Quantity--
          item.ComplementryQty++

        }
      }
    })
    this.orderlogging('freequantity_add')
    this.order.setbillamount()
  }

  // Get Customers
  // private async getCustomer() {
  //   this.order.CustomerDetails.datastatus = 'loading'
  //   if (this.customers.some(x => x.phoneNo == this.order.CustomerDetails.PhoneNo)) {
  //     var obj = this.customers.filter(x => x.phoneNo == this.order.CustomerDetails.PhoneNo)[0]
  //     console.log(obj)
  //     this.order.CustomerId = obj.id
  //     Object.keys(this.order.CustomerDetails).forEach(key => {
  //       this.order.CustomerDetails[key] = obj[key.charAt(0).toLowerCase() + key.slice(1)]
  //     })
  //     console.log(this.order.CustomerDetails)
  //     this.order.CustomerDetails.datastatus = 'old'
  //   } else {
  //     this.order.CustomerDetails.datastatus = 'new'
  //   }
  // }

  getcustomer() {
    this.auth.getCustomerByPhone(this.order.CustomerDetails.PhoneNo).subscribe(data => {
      console.log(data)
      var customer: any = data[0]
      if (customer) {
        for (var key in this.order.CustomerDetails) this.order.CustomerDetails[key] = customer[key.charAt(0).toLowerCase() + key.slice(1)]
        console.log(customer, this.order.CustomerDetails)
        this.savetblorder()
      }
    })
  }
  savetblorder() {
    if (this.order.OrderTypeId == 1) {
      this.auth.savetblorder(this.order).subscribe(data => {
        if (this.waiterS.waiterSocket)
          this.waiterS.waiterSocket.emit('tableorder:update', this.order.diningtablekey)
        this.gettblorders()
      })
    }
  }

  gettblorders() {
    this.auth.getdbdata(['tableordersdb']).subscribe(data => {
      this.tableorders = data['tableordersdb']
      this.diningtables.forEach(tbl => {
        if (this.tableorders.some(x => x.diningtablekey == tbl.TableKey)) {
          tbl.TableStatusId = 1
        } else {
          tbl.TableStatusId = 0
        }
      })
    })
  }
  getcustomerhtml() {
    var html = ''
    // console.log(this.order.CustomerDetails.PhoneNo ? true : false)
    // console.log(this.order.CustomerDetails.Name ? true : false)
    // console.log(this.order.CustomerDetails.Address ? true : false)
    // console.log(this.order.CustomerDetails.City ? true : false)
    if (this.order.CustomerDetails.PhoneNo) {
      html = `<div ${this.order.CustomerDetails.PhoneNo ? '' : 'hidden'} class="header">
          <h3 ${this.order.CustomerDetails.Name ? '' : 'hidden'}>${this.order.CustomerDetails.Name
        }</h3>
          <p>${this.order.CustomerDetails.Address ? this.order.CustomerDetails.Address + '<br>' : ''
        }${this.order.CustomerDetails.City ? this.order.CustomerDetails.City + ',' : ''}${this.order.CustomerDetails.PhoneNo
        }</p>
      </div>
      <hr>`
    }
    return html
  }

  getCategory() {
    this.auth.getcategories(1, "A").subscribe(data => {
      this.categories = data;
      this.category = this.categories.filter(x => x.isactive);
      console.log(this.categories)
      this.show = true
      this.parentcategories = this.category.filter(x => x.parentCategoryId == null)
      this.childcategories = this.category.filter(x => x.parentCategoryId != null)

      console.log(this.parentcategories)
      console.log(this.childcategories)
    })
  }

  // Autocomplete
  acselectedpd: any
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => {
        if (term == '') return []
        if (term.includes('*')) {
          term = term.replace('*', '')
          return this.groupedProducts.filter(
            x => x.BarCode?.toLowerCase() == term.toLowerCase() && term != '' && !x.ishidden,
          )
        }
        if (term.includes(' ')) {
          var subterms = term.split(' ').filter(st => st != '')
          return this.groupedProducts.filter(x => {
            if (x.ishidden || this.order.Items.some(oi => oi.ProductId == x.productId)) return false
            var name_substring = x.product.split(' ').filter(st => st != '')
            var match = true
            if (subterms.length > name_substring.length) match = false
            name_substring.forEach((ns, i) => {
              if (match && i < subterms.length)
                if (!ns.toLowerCase().startsWith(subterms[i].toLowerCase())) match = false
            })
            return match
          })
        } else {
          return this.groupedProducts.filter(v => (v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
            v.BarCode?.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
            v.ProductCode?.toLowerCase().indexOf(term.toLowerCase()) > -1)
            //&& !v.ishidden && !this.order.Items.some(oi => oi.ProductId == v.productId)
          )
        }
      }),
    )


  // Auto Compelete
  onInput(value: string): void {
    this.autocompleteproducts = value
      ? this.products.filter(x => x.product.toLowerCase().includes(value.toLowerCase()))
      : []
  }

  fieldselect(event) {
    // alert('hi');
    // console.log(event)
    // console.log(event.element.nativeElement.id)
    var Products = this.products.filter(x => x.productId == +event.element.nativeElement.id)[0]
  }
  getproducts() {
    this.auth.getproducts().subscribe(data => {
      console.log(data)
      this.products = data;
      console.log(this.products)
      this.products.forEach(prod => {
        prod.maxqty = prod.quantity
        if (typeof prod.OptionGroup == "string") {
          prod.OptionGroup = JSON.parse(prod.OptionGroup)
        }
      });
      this.groupProduct()
    })
  }
  groupedProducts = []
  groupProduct() {
    console.log("group products")
    var helper = {};
    this.groupedProducts = this.products.reduce((r, o) => {

      var key = o.barcodeId + '-'

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        r.push(helper[key]);
      }

      return r;
    }, []);

    console.log(this.groupedProducts);
  }
  barcodeMode: boolean = false
  setproductbybarcode(code) {
    this.barcodeMode = false
    console.log(code, this.products.filter(x => x.barCode == code));
    var product = this.products.filter(x => x.barCode == code && x.quantity > 0)[0];
    if (product) {
      console.log(product);
      this.temporaryItem = product;
      this.temporaryItem.Quantity = 1;
      this.temporaryItem.DiscAmount = 0
      this.addItem("barcodereader")
    }
  }


  validation() {
    var isvalid = true
    if (this.temporaryItem.Quantity <= 0) isvalid = false
    if (this.temporaryItem.Quantity > this.temporaryItem.Quantity) isvalid = false
    return isvalid
  }
  submitted: boolean = false

  // options : any



  filteredvalues = []

  crossclick() {
    this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 }
    this.productinput['nativeElement'].focus()
    this.model = ''
    this.filteredvalues = []
    this.submitted = false
  }

  // Option Group payment_modal
  @ViewChild('prod_details', { static: false }) public prod_detail_modal: TemplateRef<any>
  @ViewChild('cancelreason_modal', { static: false }) public cancelreason_modal: TemplateRef<any>
  @ViewChild('viewonlineorder_modal', { static: false }) public viewonlineorder_modal: TemplateRef<any>
  @ViewChild('payment_modal', { static: false }) public payment_modal: TemplateRef<any>
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>



  currentitem: OrderItemModule = null
  addProduct(product) {
    console.log(product)
    var options = {
      quantity: this.temporaryItem.Quantity || 1,

      key: '',
    }
    if (product.OptionGroup && product.OptionGroup.length > 0) {
      console.log(product.OptionGroup)
      this.currentitem = new CurrentItemModule(product)
      console.log(product)
      console.log(this.currentitem)
      this.modalService.open(this.prod_detail_modal, {
        windowClass: 'modal-holder',
        centered: true,
      })
      this.orderlogging('item_with_option_add')

    } else {
      this.order.additem(product, options)
      console.log(options)
      this.model = ''
      console.log(this.model)
      // this.QuantityRef['nativeElement'].value = ''
      // this.orderlogging('item_add')

    }



    if (this.order.OrderTypeId == 1) {
      this.savetblorder()
    }
  }

  addItem(from) {
    this.submitted = true
    this.barcodeMode = false
    if (this.validation()) {
      var options = {
        quantity: 1,
        key: '',
      }
      this.addProduct(this.temporaryItem)
      console.log(this.temporaryItem)
      console.log("add item")
      this.products.forEach(product => {
        if (product.stockBatchId == this.temporaryItem['stockBatchId']) {
          product.quantity -= this.temporaryItem.Quantity
          Object.keys(product).forEach(key => {
            this.temporaryItem[key] = product[key]
          })
        }
      })
      this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 }
      if (from == "user")
        this.productinput['nativeElement'].focus()
      this.model = ''
      this.filteredvalues = []
      this.submitted = false
      this.groupProduct()

      return
    }
  }

  itemdetails(product) {
    console.log(product)
    this.currentitem = new CurrentItemModule(JSON.parse(JSON.stringify(product)))

    console.log(this.currentitem)
    this.modalService.open(this.prod_detail_modal, { centered: true })
  }



  setvariantvalue(optiongroup, Option) {
    optiongroup.Option.forEach(element => {
      element.selected = false
    })
    if (optiongroup.selected != Option.Id) {
      optiongroup.selected = Option.Id
      Option.selected = true
    } else {
      optiongroup.selected = false
      Option.selected = false
    }
    this.setcurrentitemprice()
  }
  setcurrentitemprice() {
    var singleqtyoptionprice = 0
    this.currentitem.TotalAmount = 0
    this.currentitem.OptionGroup.forEach(opg => {
      if (opg.selected) {
        opg.Option.forEach(option => {
          if (option.selected) {
            if (option.IsSingleQtyOption) {
              singleqtyoptionprice += option.Price
            } else {
              this.currentitem.TotalAmount += option.Price
            }
          }
        })
      }
    })
    this.currentitem.TotalAmount += this.currentitem.Price
    this.currentitem.TotalAmount *= this.currentitem.Quantity
    this.currentitem.TotalAmount += singleqtyoptionprice
    if (this.currentitem.DiscType == 1) {
      this.currentitem.TotalAmount -= this.currentitem.DiscAmount
    } else if (this.currentitem.DiscType == 2) {
      this.currentitem.TotalAmount -=
        (this.currentitem.TotalAmount * this.currentitem.DiscPercent) / 100
    }
  }
  SetAddonValue(optiongroup, Option, check) {
    if (check) {
      Option.selected = true
    } else {
      Option.selected = false
    }
    if (optiongroup.Option.some(x => x.selected == true)) {
      optiongroup.selected = true
    } else {
      optiongroup.selected = false
    }
    this.setcurrentitemprice()
  }


  formatter = (x: { product: string }) => x.product

  batchproduct: any = []
  selectedItem(item, batchproduct, barcodeId) {
    console.log(item)
    if (item.hasOwnProperty('OptionGroup')) {
      this.addProduct(item)
    } else {
      this.batchproduct = this.products.filter(x => x.barcodeId == barcodeId && x.quantity > 0)
      console.log(batchproduct)
      if (this.batchproduct.length > 1) {
        this.batchproduct.forEach((element, i) => {
          element.focus = (i == 0) ? true : false
        });
        this.modalService.open(batchproduct, { centered: true })
      } else {
        this.selectedproduct(this.batchproduct[0])
      }
      this.QuantityRef['nativeElement'].focus()
    }

  }

  selectedproduct(product) {
    console.log(product)
    Object.keys(product).forEach(key => {
      this.temporaryItem[key] = product[key]
    })
    this.modalService.dismissAll()
  }

  deletepreorder(order) {
    this.auth.deletepreorders(order._id).subscribe(data => {
      this.getpreorders()
    })
  }



  getpreorders() {
    this.auth.getdbdata(['preorders']).subscribe(dbdata => {
      console.log(dbdata)
      this.preorders = dbdata['preorders']
      this.ordercount = {
        '2': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
        '3': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
        '4': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
      }
      this.preorders.forEach(order => {
        console.log(order)
        order.status_name = this.orderstatus[order.OrderStatusId]?.name
        console.log(order.status_name)
        console.log(order.OrderStatusId)
        console.log(order.OrderTypeId)
        order.deliverytimestamp = order.DeliveryDateTime
          ? new Date(order.DeliveryDateTime).getTime()
          : 0
        if (
          order.OrderStatusId == 5 &&
          (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
        )
          this.ordercount[order.OrderTypeId.toString()]['5']++
        else if (
          order.OrderStatusId == -1 &&
          (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
        )
          this.ordercount[order.OrderTypeId.toString()]['-1']++
        else if (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
          this.ordercount[order.OrderTypeId.toString()]['-5']++
        else if (order.DeliveryStoreId && order.StoreId != order.DeliveryStoreId)
          this.ordercount[order.OrderTypeId.toString()]['-2']++
        console.log(this.orderstatus[order.OrderStatusId].name, order.OrderTypeId, this.ordercount)
      })
      this.preorders.sort((a, b) => {
        return new Date(a.DeliveryDateTime).getTime() - new Date(b.DeliveryDateTime).getTime()
      })
      // this.waiterS.waiterSocket.emit("preorder:update", "0")
      // if (this.orderpageid != 0)
      //   this.vieworderlist(this.orderpageid)
      if (this.sectionid == 2) {
        this.editorder(this.preorders.filter(x => x.InvoiceNo == this.order.InvoiceNo)[0])
      }
    })
  }

  draftOrder() {
    let draftOrders = JSON.parse(localStorage.getItem('draftOrders'))
    console.log(this.draftOrder);

    let draftOrder = {
      order: this.order,
      draftIndex: draftOrders.length,
      draftName: '₹ ' + this.order.BillAmount + ' /-',
    }
    if (this.selectedDraftIndex == -1) {
      draftOrders.push(draftOrder)
    } else {
      draftOrder.draftIndex = this.selectedDraftIndex
      draftOrders[this.selectedDraftIndex] = draftOrder
    }
    this.draftOrders = draftOrders
    localStorage.setItem('draftOrders', JSON.stringify(draftOrders))
    this.selectedDraftIndex = -1
    this.clearorder(this.order.OrderTypeId)
    console.log(draftOrder);

  }
  loadDraftOrder(dorder) {
    this.selectedDraftIndex = dorder.draftIndex
    for (var k in dorder.order) this.order[k] = dorder.order[k]
    console.log(dorder, this.order)
  }


  temporder: OrderModule = null
  transaction: Transaction
  savetemporder() {
    this.temporder.status = 'P'
    this.temporder.datastatus = 'edit_order'
    this.temporder.DeliveryDateTime = moment(this.deliverydate + ' ' + this.deliverytime).format(
      'YYYY-MM-DD HH:mm',
    )
    this.deliverydate = ''
    this.deliverytime = ''
    this.auth.updatepreorders(this.temporder).subscribe(data => {
      console.log(data)
      this.sync.sync()
      this.getpreorders()
    })
    this.modalService.dismissAll()
  }

  cleardiscount() {
    this.order.DiscAmount = 0
    this.order.DiscAmount = 0
    this.order.Items.forEach(item => {
      item.DiscAmount = 0
      item.DiscPercent = 0
    })
    this.order.setbillamount()
    this.orderlogging('discount_clear')
    this.savetblorder()
  }

  setpayment(paymenttypeid) {
    console.log(paymenttypeid)
    this.order.StorePaymentTypeId = paymenttypeid
    this.order.PaidAmount = this.order.BillAmount
    console.log(this.order.StorePaymentTypeName)

    // console.log(this.deliverydate, this.deliverytime)
    // console.log(moment(this.deliverydate + ' ' + this.deliverytime).format('YYYY-MM-DD HH:MM A'))
  }
  advanceordervalidate() {
    var valid = true
    if (!this.order.CustomerDetails.PhoneNo) valid = false
    if (!this.deliverydate || !this.deliverytime) valid = false
    // if(!this.datevalidation()) valid = false
    return valid
  }


  // isvalid_delivery_date: boolean = true
  // datevalidation() {
  //   var min_timestamp = 0
  //   var max_timestamp = 95649033600000
  //   var delivery_timestamp = new Date(this.deliverydate).getTime()
  //   var isvalid = false
  //   if (delivery_timestamp >= min_timestamp && delivery_timestamp <= max_timestamp) {
  //     console.log('valid date')
  //     isvalid = true
  //   } else {
  //     console.log('invalid date')
  //     isvalid = false
  //   }
  //   this.isvalid_delivery_date = isvalid

  //   return isvalid
  // }

  generatekot() {
    // var groupeditems = _.mapValues(
    //   _.groupBy(
    //     this.order.Items.filter(x => x.Quantity + x.ComplementryQty - x.kotquantity != 0),
    //     'KOTGroupId',
    //   ),
    // )
    // Object.keys(groupeditems).forEach(key => {
    //   this.order.addkot(groupeditems[key], this.ordservice.orderkey.kotno)
    //   this.updatekotno()
    // })
    if (this.order.OrderNo == 0) {
      this.order.OrderNo = this.orderkey.orderno
      this.order.InvoiceNo =
        this.loginfo.storeId + moment().format('YYYYMMDD') + '/' + this.order.OrderNo
      console.log(this.order.InvoiceNo)
      this.updateorderno()
    } else {
      if (!this.order.changeditems.includes('kot')) this.order.changeditems.push('kot')
    }
    this.order.Items = this.order.Items.filter(x => x.Quantity + x.ComplementryQty != 0)
    // localStorage.setItem("testorder", JSON.stringify(this.order))
    this.order.KOTS.forEach(kot => {
      kot.CreatedDate = moment().format('YYYY-MM-DD hh:mm A')
      kot.ModifiedDate = moment().format('YYYY-MM-DD hh:mm A')
      kot.invoiceno = this.order.InvoiceNo
      kot.ordertypeid = this.order.OrderTypeId
      if (!kot.isprinted) {
        // this.savekot(kot)
        // console.log("new kot")
        this.orderlogging('new_kot')
        kot.isprinted = true
        // if (this.order.OrderTypeId != 5) this.printkot(kot)
      }
    })
    this.order.setkotquantity()
    if (this.order.OrderTypeId == 1) {
      this.savetblorder()
    }
    // console.log(this.order.KOTS)
  }

  saveorder() {
    this.order.OrderNo = this.orderkey.orderno
    this.order.DiscAmount = null
    this.placeorderclicked = true
    if (this.order.IsAdvanceOrder) {
      if (!this.advanceordervalidate() || !this.datevalidation()) return
    }
    //  this.generatekot()
    this.order.BillDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    this.order.BillDate = moment().format('YYYY-MM-DD')
    this.order.OrderedDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    this.order.OrderedDate = moment().format('YYYY-MM-DD')
    // this.order.UserId = this.user.UserId
    this.updateorderno()
    this.order.StoreId = this.loginfo.storeId
    this.order.Closed = false
    this.order.CompanyId = this.loginfo.companyId
    this.order.OrderStatusId = 5
    this.order.OrderedById = this.loginfo.storeId
    this.order.SuppliedById = this.loginfo.storeId
    this.order.InvoiceNo =
      this.loginfo.storeId + moment().format('YYYYMMDD') + '/' + this.order.OrderNo
    console.log(this.order.InvoiceNo)
    this.order.CustomerDetails.CompanyId = this.loginfo.companyId
    this.order.CustomerDetails.StoreId = this.loginfo.storeId
    this.order.CustomerId = this.order.CustomerDetails.Id

    this.printreceipt()
    this.order.setrefid()
    // this.transaction = null
    this.order.Transactions = []
    console.log(this.order.Transactions)
    this.order.deliverytimestamp = this.order.DeliveryDateTime
      ? new Date(this.order.DeliveryDateTime).getTime()
      : 0
    if (this.order.PaidAmount > 0) {
      if (this.order.StorePaymentTypeId != -1) {
        var transaction = new Transaction()
        console.log(transaction)
        transaction.Amount = this.order.PaidAmount
        transaction.OrderId = this.order.OrderId
        transaction.CustomerId = this.order.CustomerId
        transaction.StorePaymentTypeId = this.order.StorePaymentTypeId
        transaction.TranstypeId = 1
        transaction.PaymentStatusId = 0
        transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
        transaction.TransDate = moment().format('YYYY-MM-DD')
        transaction.UserId = this.order.UserId
        transaction.CompanyId = this.loginfo.companyId
        transaction.StoreId = this.loginfo.storeId
        // transaction.Notes = null
        transaction.InvoiceNo = this.order.InvoiceNo
        transaction.saved = true
        this.transaction = transaction
        this.order.Transactions.push(this.transaction)
      } else if (this.order.StorePaymentTypeId == -1) {
        this.transactionlist = this.transactionlist.filter(x => x.Amount > 0)
        this.transactionlist.forEach(trxn => {
          trxn.InvoiceNo = this.order.InvoiceNo
          trxn.CompanyId = this.order.CompanyId
          trxn.StoreId = this.loginfo.storeId
          trxn.saved = true
          this.order.Transactions.push(trxn)
        })
      }
    }
    this.order.alltransactions = [...this.order.Transactions]
    // return

    if (this.order.IsAdvanceOrder || this.order.OrderTypeId == 2) {
      this.order.isordersaved = true
      this.order.events.push({ name: 'order_placed', time: new Date().getTime() })
      this.order.OrderStatusId = 1
      this.order.DeliveryDateTime = moment(this.deliverydate + ' ' + this.deliverytime).format(
        'YYYY-MM-DD HH:mm',
      )
      localStorage.setItem('lastorder', JSON.stringify(this.order))
      this.auth.savepreorders(this.order).subscribe(data => {
        console.log(data)
        this.sync.sync()
        console.log(this.order)
        this.getpreorders()
        this.clearorder(this.order.OrderTypeId)
      })
    } else {
      this.orderlogging('saving_order')
      localStorage.setItem('lastorder', JSON.stringify(this.order))
      this.auth.saveorderfbdb(this.order).subscribe(data => {
        console.log(data)
        this.sync.sync()
        console.log(this.order)
        this.clearorder(this.order.OrderTypeId)
      })
    }
  }



  updateorderno() {
    this.orderkey.orderno++
    localStorage.setItem('orderkey', JSON.stringify(this.orderkey))
    this.auth.updateorderkey(this.orderkey).subscribe(data => {
      console.log(data)
    })
    console.log(this.orderkey)
  }

  orderkeyValidation() {
    var todate = new Date().getDate()
    var orderkeydate = new Date(this.orderkey.timestamp).getDate()
    var ls_orderkey = JSON.parse(localStorage.getItem('orderkey'))
    if (ls_orderkey) var ls_orderkeydate = new Date(ls_orderkey.timestamp).getDate()
    var orderkey_obj: any = {}
    if (ls_orderkey && ls_orderkey.timestamp > this.orderkey.timestamp) {
      orderkey_obj = ls_orderkey
    } else {
      orderkey_obj = this.orderkey
    }
    if (new Date(orderkey_obj.timestamp).getDate() != todate) {
      orderkey_obj.orderno = 1
    }
    orderkey_obj.timestamp = new Date().getTime()
    this.orderkey = orderkey_obj
    localStorage.setItem('orderkey', JSON.stringify(this.orderkey))
    this.auth.updateorderkey(this.orderkey).subscribe(d => { })
  }

  placeorderclicked = false
  updateorder() {
    // this.generatekot() 
    this.order.status = 'P'
    this.order.datastatus = 'edit_order'
    this.order.setrefid()
    this.auth.updatepreorders(this.order).subscribe(data => {
      this.sync.sync()
      this.clearorder(this.order.OrderTypeId)
    })
  }

  clearDraftOrder(typeid) {
    console.log(typeid)
    // typeid = 5

    if (this.selectedDraftIndex > -1) {
      this.draftOrders.splice(this.selectedDraftIndex, 1)
      this.draftOrders.forEach((dorder, ind) => {
        dorder.draftIndex = ind
      })
      localStorage.setItem('draftOrders', JSON.stringify(this.draftOrders))
      this.selectedDraftIndex = -1
    }

  }

  clearallDraftOrder() {

    if (this.draftOrder) {
      this.draftOrders.splice(0)
      console.log(this.draftOrders)
      localStorage.setItem('draftOrders', JSON.stringify(this.draftOrders))
      this.selectedDraftIndex
    }

  }

  clearorder(typeid) {
    this.orderlogging('delete')
    this.clearDraftOrder(typeid)
    this.orderlogging('clearing_order')
    // this.visible = false
    this.placeorderclicked = false
    if (typeid == 5) {
      this.order = null
      this.createorder(typeid)
    } else if (typeid == 1) {
      var tablekey = this.order.diningtablekey
      this.auth.deletetblorder(this.order.diningtablekey).subscribe(data => {
        if (tablekey.includes('_')) {
          this.removeplittable(tablekey)
        } else {
          if (this.waiterS.waiterSocket)
            this.waiterS.waiterSocket.emit('tableorder:update', tablekey)
          this.gettblorders()
        }
      })
      var table = this.diningtables.filter(x => x.Id == this.order.DiningTableId)[0]
      this.order = null
      this.sectionid = 1
      this.orderpageid = typeid
      // this.waiterS.waiterSocket.emit("table:release", { id: table.Id, tableKey: table.TableKey, timestamp: new Date().getTime() })
    } else {
      this.order = null
      this.sectionid = 1
      this.orderpageid = typeid
    }
  }
  openpaymentmodal(order: OrderModule) {
    this.issplitpayment = false
    this.temporder = order
    this.transaction = new Transaction()
    this.transaction.Remaining = this.temporder.BillAmount - this.temporder.PaidAmount
    this.transaction.Amount = this.transaction.Remaining
    this.transaction.OrderId = order.OrderId
    this.transaction.StoreId = this.loginfo.storeId
    this.transaction.TransDate = moment().format('YYYY-MM-DD')
    this.transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
    this.transaction.TranstypeId = 1
    this.transaction.UserId = order.UserId
    this.transaction.CompanyId = order.CompanyId
    this.transaction.CustomerId = order.CustomerId
    console.log(this.transaction)
    const modalref = this.modalService.open(this.payment_modal, { size: 'xl', backdrop: 'static' })
    modalref.result.then(
      result => {
        console.log('result', result)
      },
      reason => {
        console.log('reason', reason)
        if (reason == 'Back' && order.deliveryclicked && order.OrderTypeId == 4) {
          this.orderstatuschange(order, 5)
        } else if (!order.deliveryclicked && order.OrderTypeId == 4) {
          order.deliveryclicked = false
        }
      },
    )
  }
  openrefundmodal(order: OrderModule) {
    this.issplitpayment = false
    this.temporder = order
    this.transaction = new Transaction()
    this.transaction.Remaining = this.temporder.PaidAmount - this.temporder.BillAmount
    this.transaction.Amount = this.transaction.Remaining
    this.transaction.OrderId = order.OrderId
    this.transaction.StoreId = this.loginfo.storeId
    this.transaction.TransDate = moment().format('YYYY-MM-DD')
    this.transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
    this.transaction.TranstypeId = 2
    this.transaction.UserId = order.UserId
    this.transaction.CompanyId = order.CompanyId
    this.transaction.CustomerId = order.CustomerId
    this.transaction.InvoiceNo = order.InvoiceNo
    // console.log(this.transaction)
    this.modalService.open(this.payment_modal, { size: 'xl', backdrop: 'static' })
  }
  makepayment() {
    console.log(this.temporder)
    if (!this.temporder.Transactions) this.temporder.Transactions = []
    if (this.transaction.TranstypeId == 1) this.temporder.PaidAmount += this.transaction.Amount
    else if (this.transaction.TranstypeId == 2) this.temporder.PaidAmount -= this.transaction.Amount
    this.temporder.status = 'P'

    if (this.temporder.OrderId > 0) {
      this.temporder.datastatus = 'edit_order'
    } else {
      this.temporder.datastatus = 'new_order'
    }
    this.auth.getpreorderby_id(this.temporder['_id']).subscribe(data => {
      this.temporder.OrderId = data['OrderId']
      if (this.temporder.OrderId > 0) {
        this.temporder.datastatus = 'edit_order'
      } else {
        this.temporder.datastatus = 'new_order'
      }
      this.transaction.OrderId = this.temporder.OrderId
      this.transaction.InvoiceNo = this.temporder.InvoiceNo
      this.auth.savetransactiontonedb(this.transaction).subscribe(trdt => {
        if (this.temporder.deliveryclicked && this.temporder.OrderTypeId == 4) {
          this.orderstatuschange(this.temporder, 5)
        } else {
          this.auth.updatepreorders(this.temporder).subscribe(data => {
            this.getpreorders()
            this.sync.sync()
          })
        }
      })
    })
    this.modalService.dismissAll()
  }

  transactionlist: Array<Transaction> = []
  issplitpayment: boolean = false
  splitpaymenttotal = 0
  splitpayment() {
    this.transactionlist = []
    this.issplitpayment = true
    this.storePaymentTypes.forEach(pt => {
      console.log(pt)
      var transaction = new Transaction()
      transaction = new Transaction()
      transaction.Remaining = this.temporder.BillAmount - this.temporder.PaidAmount
      transaction.Amount = 0
      transaction.OrderId = this.temporder.OrderId
      transaction.StoreId = this.loginfo.storeId
      transaction.TransDate = moment().format('YYYY-MM-DD')
      transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
      transaction.TranstypeId = 1
      transaction.UserId = this.temporder.UserId
      transaction.CompanyId = this.temporder.CompanyId
      transaction.CustomerId = this.temporder.CustomerDetails.Id
      transaction.StorePaymentTypeName = pt.name
      transaction.StorePaymentTypeId = pt.id
      this.transactionlist.push(transaction)
    })
  }
  calculatesplitpaymenttotal() {
    this.splitpaymenttotal = 0
    this.storePaymentTypes.forEach(tr => {
      console.log(tr)
      this.splitpaymenttotal += tr.Amount ? tr.Amount : 0
    })
    console.log(this.splitpaymenttotal, this.storePaymentTypes)
  }
  makesplitpayment() {
    var transactionarray = this.transactionlist.filter(x => x.Amount > 0)
    this.auth.getpreorderby_id(this.temporder['_id']).subscribe(data => {
      this.temporder.status = 'P'
      this.temporder.OrderId = data['OrderId']
      if (this.temporder.OrderId > 0) {
        this.temporder.datastatus = 'edit_order'
      } else {
        this.temporder.datastatus = 'new_order'
      }
      transactionarray.forEach(tr => {
        if (tr.TranstypeId == 1) this.temporder.PaidAmount += tr.Amount
        else if (tr.TranstypeId == 2) this.temporder.PaidAmount -= tr.Amount
        tr.OrderId = this.temporder.OrderId
        tr.InvoiceNo = this.temporder.InvoiceNo
      })

      if (this.temporder.PaidAmount == this.temporder.BillAmount && this.temporder.OrderTypeId == 4)
        this.temporder.OrderStatusId = 4

      this.auth.savetransactiontonedb(transactionarray).subscribe(trdt => {
        if (this.temporder.deliveryclicked && this.temporder.OrderTypeId == 4) {
          this.orderstatuschange(this.temporder, 5)
        } else {
          this.auth.updatepreorders(this.temporder).subscribe(data => {
            this.getpreorders()
            this.sync.sync()
          })
        }
      })
      this.modalService.dismissAll()
    })
  }
  issplitpaymentdrawer: boolean = false
  opensplitpaymentmodal() {
    this.issplitpaymentdrawer = true
    if (this.order.StorePaymentTypeId != -1) {
      this.order.StorePaymentTypeId = -1
      this.resetsplitpayment()
    }
  }

  open(content) {
    this.modalService.open(content)
  }

  resetsplitpayment() {
    this.transactionlist = []
    this.storePaymentTypes.forEach(pt => {
      var transaction = new Transaction()
      transaction = new Transaction()
      transaction.Remaining = this.order.BillAmount
      transaction.Amount = 0
      transaction.OrderId = this.order.OrderId
      transaction.StoreId = this.loginfo.storeId
      transaction.TransDate = moment().format('YYYY-MM-DD')
      transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
      transaction.TranstypeId = 1
      transaction.UserId = this.order.UserId
      transaction.CompanyId = this.order.CompanyId
      transaction.CustomerId = this.order.CustomerDetails.Id
      transaction.StorePaymentTypeName = pt.name
      transaction.StorePaymentTypeId = pt.id
      this.transactionlist.push(transaction)
    })
  }
  cancelsplitpayment() {
    this.order.PaidAmount = 0
    this.order.StorePaymentTypeId = 0
    this.transactionlist = []
    this.issplitpaymentdrawer = false
    this.calculatesplitpaymenttotal()
  }
  confirmsplitpayment() {
    this.order.PaidAmount = this.splitpaymenttotal
    this.issplitpaymentdrawer = false
  }

  orderstatuschange(order, statusid) {
    // console.log(order)
    if (order.PaidAmount != order.BillAmount && !order.deliveryclicked) {
      order.deliveryclicked = true
      var diff = order.BillAmount - order.PaidAmount
      if (diff > 0) {
        this.openpaymentmodal(order)
      } else {
        this.openrefundmodal(order)
      }
      return
    }
    var obj = { name: '', time: new Date().getTime() }
    if (statusid == 1) obj.name = 'accepted'
    if (statusid == 3) obj.name = 'food_ready'
    if (statusid == 4) obj.name = 'dispatched'
    if (statusid == 5) obj.name = 'delivered'
    if (statusid == -1) obj.name = 'cancelled'
    order.OrderStatusId = statusid
    order.status = 'P'
    if (!order.changeditems) order.changeditems = []
    if (!order.changeditems.includes('orderstatus')) {
      order.changeditems.push('orderstatus')
    }
    if (order.events) order.events.push(obj)
    else {
      order.events = []
      order.events.push(obj)
    }
    this.auth.getpreorderby_id(order._id).subscribe(data => {
      order.OrderId = data['OrderId']
      if (order.OrderId > 0) {
        order.datastatus = 'edit_order'
      } else {
        order.datastatus = 'new_order'
      }
      this.auth.updatepreorders(order).subscribe(data => {
        this.sync.sync()
        this.getpreorders()
      })
    })
  }


  getstoreuporders() {
    this.auth.getstoreuporders(this.StoreId).subscribe(data => {
      var orders = []
      var newordercount = 0
      data['orders'].forEach(element => {
        var obj = {}

        Object.keys(element).forEach(key => {
          obj[key.charAt(0).toLowerCase() + key.slice(1)] = element[key]
        })
        orders.push(obj)
      })
      orders.forEach((element, index) => {
        if (element.orderStatusId == 0) newordercount++

        if (typeof element.json == 'string') {
          element.json = JSON.parse(element.json)
        }

        if (
          element.riderDetails != null &&
          element.riderDetails != '' &&
          typeof element.riderDetails == 'string'
        ) {
          element.riderDetails = JSON.parse(element.riderDetails)
        }
      })
      // this.signal_r.startBot(data['orders'])
      this.onlineorders = orders
      // console.log(this.onlineorders)
      if (this.onlineorders.some(x => x.orderStatusId == 0)) {
        // this.notification.startnotificationsound()
      }
      // if (this.onlineorders.some(x => x.orderStatusId == 0)) {
      this.onlinestatusid = [0]
      this.event.emitNotif({ newordercount: newordercount })
      // }
      this.filteronlineorders()
    })
  }

  getvariants() {
    this.auth.getvariants(this.CompanyId).subscribe(data => {
      this.variants = data;
      console.log(this.variants)
      this.show = true
      // this.variantgroups.forEach(vg => {
      //   vg.count = this.variants.filter(x => x.variantGroupId = vg.id).length
      // });
      this.variants.forEach(v => {
        v.variantGroup = this.variantgroups.filter(x => x.Id == v.variantGroupId)[0]
      });
      console.log(this.variants)
    })
  }

  getvariantgroups() {
    this.auth.getvariantgroups(this.CompanyId).subscribe(data => {
      this.variantgroups = data;
      // this.variantgroups = this.variantgroups.filter(x => x.id == 0);
      this.show = true;
      console.log(this.variantgroups)
      this.getvariants();
    })
  }
  addcurrentitem() {
    var options = {
      // quantity: this.currentitem.Quantity,
      Quantity: this.currentitem.Quantity,
      key: '',
    }
    this.order.additem(this.currentitem, options)
    console.log(this.currentitem)
    console.log(this.options)
    this.model = ''
    this.QuantityRef['nativeElement'].value = ''
    this.modalService.dismissAll()
    this.orderlogging('current_item_add_save')
    if (this.order.OrderTypeId == 1) {
      this.savetblorder()
    }
  }

  quantitychange(Items: OrderItemModule) {

    console.log(Items)

    var prod = this.products.filter(x => x.stockBatchId == Items.stockBatchId)[0]
    console.log(Items.Quantity, Items.ComplementryQty, prod.maxqty)
    console.log(this.products)
    if (Items.Quantity && Items.Quantity <= prod.maxqty) {
      console.log('%c GOOD! ', 'color: #bada55')
      this.products.filter(x => x.stockBatchId == Items.stockBatchId)[0].quantity = prod.maxqty - Items.Quantity - Items.ComplementryQty
      this.order.setbillamount()

    } else if (Items.Quantity == 0 || Items.Quantity == null) {
      // event.preventDefault()
      console.log('%c VERY LOW! ', 'color: orange')
      Items.Quantity = 1
      this.products.filter(x => x.stockBatchId == Items.stockBatchId)[0].quantity = prod.maxqty - 1
      this.order.setbillamount()
    } else {
      // event.preventDefault()
      console.log('%c EXCEED! ', 'color: red')
      Items.Quantity = 1
      this.products.filter(x => x.stockBatchId == Items.stockBatchId)[0].quantity = prod.maxqty - 1
      this.order.setbillamount()
    }

    console.log(Items.Quantity)
  }
  freetables: any



  swapConfig = {
    fromTableKey: '',
    toTableKey: '',
  }

  handleTableSwap(tableId) {
    console.log("handleTableSwap", tableId)
    this.freetables = this.diningtables
    this.swapConfig.fromTableKey = tableId
    this.modalService.open(this.Tableorderswapmodal, { centered: true, size: 'lg' })
  }

  swapTblOrder() {
    this.modalService.dismissAll()
    this.auth.swapTableOrders(this.swapConfig.fromTableKey, this.swapConfig.toTableKey).subscribe(data => {
      console.log(data)
      this.gettblorders()
    })
  }


  // Custom menu
  isDisplayContextMenu: boolean
  rightClickMenuItems: Array<ContextMenuModel> = []
  rightClickMenuPositionX: number
  rightClickMenuPositionY: number


  // custom menu
  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`,
    }
  }
  displayContextMenu(event, tablekey) {
    this.isDisplayContextMenu = true

    this.rightClickMenuItems = [
      {
        menuText: 'Hide',
        menuEvent: 'table_hide',
        icon: 'fe fe-trash',
        extraData: tablekey,
      },
    ]

    this.rightClickMenuPositionX = event.clientX
    this.rightClickMenuPositionY = event.clientY
  }


  handleMenuItemClick(event) {
    console.log(event)
    switch (event.data.menuEvent) {
      case this.rightClickMenuItems[0].menuEvent:
        console.log(event.data)
        break
      case this.rightClickMenuItems[1].menuEvent:
        console.log('To handle formatting')
    }
  }



  printreceipt() {
    this.orderlogging('receipt_print')
    if (this.printersettings) {
      this.printservice.posReceipt(this.order, [this.printersettings.receiptprinter], 'POS')
    }
    return

  }
  printreceiptbyorder(order) {
    if (this.printersettings) {
      this.printservice.posReceipt(order, [this.printersettings.receiptprinter], 'POS')
    }
    return

  }

  delete(index) {
    this.batchproduct.forEach(prod => {
      console.log(prod)
      if (prod.stockBatchId[0] == this.order.Items[index].stockBatchId[0]) {
        prod.quantity += this.order.Items[index].Quantity
        console.log(prod.quantity)

      }
    })
    this.order.Items.splice(index, 1)
    this.order.setbillamount()
    this.orderlogging('delete')
  }
}



interface ContextMenuModel {
  menuText: string
  menuEvent: string
  icon: string
  extraData: any
}