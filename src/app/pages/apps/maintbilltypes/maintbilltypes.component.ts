import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Location } from '@angular/common';

@Component({
  selector: 'app-maintbilltypes',
  templateUrl: './maintbilltypes.component.html',
  styleUrls: ['./maintbilltypes.component.scss']
})
export class MaintbilltypesComponent implements OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  @ViewChild('vendorautocomplete', { static: false }) public vendorinput: TemplateRef<any>
  @ViewChild('assetautocomplete', { static: false }) public assetinput: TemplateRef<any>
  @ViewChild('vendor', { static: false }) public vendorinputs: TemplateRef<any>
  @ViewChild('asstext', { static: false }) public asstext: TemplateRef<any>
  @ViewChild('frqty', { static: false }) public frqty: TemplateRef<any>
  @ViewChild('famount', { static: false }) public famount: TemplateRef<any>
  @ViewChild('upto', { static: false }) public upto: TemplateRef<any>


  isShown = true
  isCreate = false
  isNon = true
  isRecurg = false

  focus$ = new Subject<string>()

  choovalue: boolean = false
  dateRange = []

  CompanyId: 0
  StoreId: 0
  userId: 0
  mainttypeId = 2
  expectedamount = ''
  frequencytypeid = 1
  contTypeId = null
  IsRecurring: boolean
  //maintbill
  maintbill: any = {
    ExpectedAmount: 0,
    IsRecurring: false,
    MaintBillTypeId: 0,
    VendorId: 0,
    LiabilityId: 0,
    FrequencyTypeId: 1,
    CreatedBy: 0,
    ContactId: 0,
    CompanyId: 0,
    CreatedDate: '',
    ModifiedDate: ''

  }

  mapOfSort: { [key: string]: any } = {
    maintid: null,
    assetName: null,
    location: null,
    payfor: null,
    payto: null,
    ExpectedAmount: null,
    Quantity: null,
    reference: null,
    createdDate: null,
    action: null,
    isactive: null,
    lastgenerated: null,

  }

  sortName: string | null = null
  sortValue: string | null = null
  keywordsInput: any

  sort(sortName: string, value: string): void {
    this.sortName = sortName
    this.sortValue = value
    for (const key in this.mapOfSort) {
      if (this.mapOfSort.hasOwnProperty(key)) {
        this.mapOfSort[key] = key === sortName ? value : null
      }
    }
    //this.search(this.recurring)

  }

  date = new Date()
  time = new Date()

  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    public location: Location,
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'))
    const store = JSON.parse(localStorage.getItem('store'))
    // console.log(user)
    this.userId = user.id
    this.CompanyId = user.companyId
    this.StoreId = user.storeid
    // this.getBillData()
    // this.getmainttypes()
    // // this.getvendors()
    // this.getconttype()
    // this.getstore()
    // this.getstores(this.StoreId)
    // this.getmaintbillrec()
    // this.getfrequency()
    // this.getasset()
  }

  PurchaseDatatest: any
  tabledata: any
  billstatusid: any

  ord: any = {
    payto: '',
    Quantity: '',
    reference: '',
    locname: '',
    CompanyId: 1,
  }

  billmaint = []

  store: any = []
  getstores(storeId) {
    this.Auth.getstoreIdInternal(this.CompanyId, storeId).subscribe(data => {
      this.store = data['storeList']
      console.log('new', this.store);

      this.ord.locname = this.store[0].name
      console.log('location', this.ord.locname);

    })
  }

  testinput: any
  // getBillData() {
  //   this.Auth.getmaintbillIndex(this.CompanyId, this.StoreId).subscribe(data => {
  //     this.PurchaseDatatest = data
  //     console.log('maint', this.PurchaseDatatest)
  //     this.famount['nativeElement'].focus()
  //     this.upto['nativeElement'].focus()
  //     // this.tabledata = this.PurchaseDatatest['maintks']
  //     // console.log(this.tabledata)
  //     // this.isShown = true
  //   })
  // };

  active(bool) {
    this.ord = this.PurchaseDatatest.filter(x => x.isactive)
    console.log(this.ord);
    // this.ord = this.store[0].name
    // console.log('loc', this.ord);
    this.choovalue = bool
    console.log('Choose', this.choovalue)
  }

  onChange(e) {
    console.log(e, moment(e), this.date)
  }

  //MaintBillTypes
  mainttype: any
  getmainttypes() {
    this.Auth.getmaintbill(this.CompanyId).subscribe(data => {
      this.mainttype = data
      console.log(this.mainttype)
    })
  }

  //Maintbill Type
  maintbilltypeid: 0
  liabilityid: any
  selectedItem(item) {
    console.log(item)
    this.maintbilltypeid = item.id
    this.liabilityid = item.liabilityTypeId
    console.log('maintbilltypeid', this.maintbilltypeid)
    console.log('liabilityTypeid', this.liabilityid)
    // this.getasset()
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.mainttype
            .filter(
              v =>
                v.description.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10),
      ),
    )

  formatter = (x: { description: string }) => x.description

  //Get Asset
  asset: any
  // getasset() {
  //   this.Auth.getliabilitybyId(this.CompanyId, this.liabilityid).subscribe(data => {
  //     this.asset = data
  //     console.log('asset', this.asset)
  //     this.vendorinputs['nativeElement'].focus()
  //     this.asstext['nativeElement'].focus()
  //   })
  // }

  //Asset Name
  assetid: any
  assetselectedItem(item) {
    console.log(item)
    this.assetid = item.id
    console.log(this.assetid)
  }

  assetsearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.asset
            .filter(
              v =>
                v.assetName.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10),
      ),
    )

  assetformatter = (x: { assetName: string }) => x.assetName

  //get vendors
  vendors: any
  // getvendors() {
  //   this.Auth.getvendorsmaint(this.CompanyId).subscribe(data => {
  //     this.vendors = data
  //     console.log(this.vendors)
  //     this.assetinput['nativeElement'].focus()
  //   })
  // }
  vendorid: any
  venselectedItem(item) {
    console.log(item)
    this.vendorid = item.id
    console.log(this.vendorid)
  }

  vensearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.vendors
            .filter(
              v =>
                v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10),
      ),
    )
  venformatter = (x: { name: string }) => x.name

  //ContactType
  conttype: any
  // getconttype() {
  //   this.Auth.getcontType(this.CompanyId).subscribe(data => {
  //     this.conttype = data
  //     console.log(this.conttype)
  //   })
  // }

  // contTypeId: null
  // selectedcontType() {
  //   console.log('ContactType', this.contTypeId)
  //   this.getcontact()
  // }

  //Contact
  Contact: any
  // getcontact() {
  //   this.Auth.getcontact(this.CompanyId, this.contTypeId).subscribe(data => {
  //     this.Contact = data
  //     console.log('Contact', this.Contact)
  //   })
  // }

  contactId: 0
  getcontactid() {
    console.log('ContactId', this.contactId)
  }

  selectedcontact(item) {
    this.contactId = item.id
    console.log('contactId', this.contactId)
  }
  searchcontact = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.Contact
            .filter(s => s.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10),
      ),
    )

  formattercontact = (x: { name: string }) => x.name

  savemaintbill() {
    this.maintbill.ExpectedAmount = this.expectedamount
    if (this.mainttypeId == 1) {
      this.maintbill.IsRecurring == true
    } else {
      this.maintbill.IsRecurring == false
    }
    // this.maintbill.IsRecurring = this.mainttypeId
    this.maintbill.IsActive = true
    console.log(this.maintbill.IsActive);

    this.maintbill.MaintBillTypeId = this.maintbilltypeid
    console.log(this.maintbill.MaintBillTypeId);

    this.maintbill.VendorId = this.vendorid
    console.log(this.maintbill.VendorId);

    this.maintbill.LiabilityId = this.assetid
    console.log(this.maintbill.LiabilityId);

    this.maintbill.FrequencyTypeId = this.frequencytypeid
    console.log(this.maintbill.FrequencyTypeId);

    this.maintbill.CreatedBy = this.userId
    console.log(this.maintbill.FrequencyTypeId);

    this.maintbill.ContactId = this.contactId
    console.log(this.maintbill.contactId);

    this.maintbill.CompanyId = this.CompanyId
    this.maintbill.CreatedDate = moment().format('YYYY-MM-DD HH:MM A'),
      this.maintbill.ModifiedDate = moment().format('YYYY-MM-DD HH:MM A')
    console.log(this.maintbill)

    // this.Auth.Savemaintenbill(this.maintbill).subscribe(data => {
    //   console.log(data)
    // })
  }

  // Create New btn 
  create() {
    this.isShown = !this.isShown
    this.isNon = !this.isNon
    this.isCreate = !this.isCreate
    this.isRecurg = !this.isRecurg
  }

  addback() {
    this.isShown = !this.isShown
    this.isNon = !this.isNon
    this.isCreate = !this.isCreate
    this.isRecurg = !this.isRecurg
  }

  value = '0'
  changerad(bool, value) {
    console.log(bool, value)
    if (value == 0) {
      this.isNon = true
      this.isRecurg = false
    }
    else if (value == 1) {
      this.isNon = false
      this.isRecurg = true
    }
  }


  



  radiocli() {
    this.isShown = !this.isShown
    this.isRecurg = !this.isRecurg
  }

  Radio() {
    this.isShown = !this.isShown;
    if (this.isShown)
      this.isRecurg = false;
    else
      this.isRecurg = true;
  }


  add = true
  isadd = false
  testid: any
  getmaintTypeid(value) {
    this.mainttypeId = value
    console.log(value)
    console.log(this.mainttypeId)
    // this.mainttypeId = value
    // console.log("MaintType", this.mainttypeId)
    this.add = !this.add
    this.isadd = !this.isadd
  }

  visible = -1
  shows(ind) {
    if (this.visible === ind) {
      this.visible = -1
    } else {
      this.visible = ind
    }
  }

  storename: any
  sname: any
  names: any
  // getstore() {
  //   this.Auth.getstoreslist(this.CompanyId, this.StoreId).subscribe(data => {
  //     this.sname = data
  //     this.storename = this.sname[0].id
  //     console.log('555', this.storename);
  //     this.names = this.sname[0].name
  //     console.log(this.names);

  //     console.log('stores', this.sname);
  //   })
  // }

  generatebill() {
    // this.billmaint = this.ord
    // this.billmaint.CompanyId = this.CompanyId
    this.billmaint.push({
      ord: this.ord,
      companyId: this.CompanyId,
      ContactId: this.maintbill.ContactId,
      FrequencyTypeId: this.maintbill.frequencytypeid,
      LiabilityId: this.maintbill.liabilityid,
      VendorId: this.maintbill.vendorid
    })
    console.log('tttt', this.billmaint);

  }

  recurring: any
  // getmaintbillrec() {
  //   this.Auth.getmaintbillIndexRec(this.CompanyId, this.StoreId).subscribe(data => {
  //     this.recurring = data
  //     console.log('test', this.recurring);

  //   })
  // }

  FrequencyType() {
    console.log("enter value", this.maintbill.FrequencyTypeId);
  }

  fqtys = null;
  frequencytype: any
  // getfrequency() {
  //   this.Auth.getfrequency(this.CompanyId).subscribe(data => {
  //     this.frequencytype = data
  //     console.log('fqty', this.frequencytype);
  //     this.frqty['nativeElement'].focus()
  //   })
  // }

  //AdvanceSearch
  visibletable = -1
  advancesearch(show) {
    if (this.visibletable === show) {
      this.visibletable = -1
    } else {
      this.visibletable = show
    }
  }
}
