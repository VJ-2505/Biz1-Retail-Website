import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/auth.service'
import { Location } from '@angular/common'
import { FormBuilder, FormGroup, FormArray, FormControl, NgForm } from '@angular/forms';
import { Directive, HostListener, ElementRef, ViewChild } from '@angular/core';
import { element } from 'protractor';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { NzNotificationService } from 'ng-zorro-antd'
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PredefinedQuantityModule, ProductModule } from './productfb.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataService } from 'src/app/services/data.service';
import { toast, dangertoast } from 'src/assets/dist/js/toast-data';


@Component({
  selector: 'app-productfb',
  templateUrl: './productfb.component.html',
  styleUrls: ['./productfb.component.scss']
})
export class ProductfbComponent implements OnInit {

  cakeQuantities: any;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "Shift") this.shiftpressed = true
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key == "Shift") this.shiftpressed = false
  }
  // @ViewChild('optionGroups')
  @ViewChild("optionGroups", { static: false }) private optionGroup: ElementRef;

  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  shiftpressed: boolean = false
  prodId: number;
  errorMsg: any;
  productTypes: any;
  companyId: any;
  tabledata: any;
  CompanyId: any
  StoreId: any
  id: any
  taxgroups: any
  producttypes: any
  optiondata: any
  categories: any
  masterproduct: any = []
  show = true
  product: any = {
    id: 0,
    name: '',
    description: '',
    brand: '',
    categoryId: 0,
    taxGroupId: 0,
    productTypeId: 0,
    unitId: 0,
    price: null,
    productCode: null,
    CompanyId: 0,
    action: '',

  }
  isvisible: boolean
  visible = false
  checked: Boolean = true
  listOfSearchName: string[] = []
  listOfSearchAddress: string[] = []
  term: ''
  https = 0
  prod: any
  products: any
  barcodes: any = []
  variantcombinations: any = []
  categoryvariantgroups: any = []
  variantcombination: any
  barcodevariants: any = []
  datasavetype: string = '1'
  prodid = ''
  optionGroups: any = [];
  units: any = {
    id: 0,
    description: '',
    companyId: 0
  }

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
  products1: ProductModule;
  predefinedquantities: Array<PredefinedQuantityModule> = []
  newpdquantity: PredefinedQuantityModule = null
  selectedItems: any = [];
  opgp: any;
  image: any = null;
  blobimageurl: SafeUrl;
  producttype: number;
  Kot: any = [];
  taxGroup: any;
  categoryId: any;
  category: any;
  logInfo: any
  taxId: number;


  //edit tax
  // public uploader: FileUploader = new FileUploader({url: this.uploadAPI, itemAlias: 'file'});
  nullvalue: any = null;
  public settings = {};
  OptionGroupId1: number;
  statement: string;
  conditionString: any = "";
  optionArray: any = [];
  OptionGroupId: any;
  optionGroupId: any;
  produtForm: FormGroup

  constructor(private route: ActivatedRoute, private el: ElementRef,
    private router: Router, private data: DataService,
    private _avRoute: ActivatedRoute,
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private multiSelect: NgMultiSelectDropDownModule,
    public location: Location,
    private fb: FormBuilder,
    private http: HttpClient, private sanitizer: DomSanitizer

  ) {
    // this.prodId = Number(this._avRoute.snapshot.params["id"]);
    // var logInfo = JSON.parse(localStorage.getItem("loginInfo"));
    // this.CompanyId = logInfo.CompanyId;
    // this.StoreId = logInfo.storeId;
  }


  ngOnInit(): void {
    this.produtForm = this.fb.group({})
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      console.log(data)
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.getMasterproduct();
      this.getCategories();
      this.getproducttype();
      this.gettax();
      this.getUnits();
      // this.getoption();
      this.newpdquantity = new PredefinedQuantityModule({ companyid: this.CompanyId, productid: this.prodId })
      this.settings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        allowSearchFilter: true,
        limitSelection: -1,
        clearSearchFilter: true,
        maxHeight: 200,
        itemsShowLimit: 1,
        searchPlaceholderText: 'Search',
        noDataAvailablePlaceholderText: 'No Stores Found',
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        defaultOpen: false
      };
      // console.log(this.settings)
    })


  }
  prod1: any

  strdate: string
  enddate: string
  toAddProduct() {
    this.show = false
    let frm = document.getElementById("prodForm") as HTMLFormElement
    frm.reset()
  }
  getMasterproduct() {
    this.Auth.getProducts(this.prodId, this.loginfo.companyId,).subscribe(data => {
      this.products = data
      this.prod = this.products.products.filter(x => x.isactive == !this.showInactive)
      this.prod1 = this.products.products.filter(x => x.isactive == !this.showInactive)
      console.log(this.prod)
      console.log(this.prod1)
      this.predefinedquantities = data["PredefinedQuantities"]
      console.log(this.products);
      this.products1 = new ProductModule(data, this.loginfo.companyId);
      console.log(this.products1);
      console.log(this.products.ProductOptionGroups);
      this.category = this.products.category.filter(x => x.ParentCategoryId != null)
      this.taxGroup = this.products.taxGroup
      this.units = this.products.units
      this.productTypes = this.products.productType
      this.product = this.products.product[0];
      if (!this.product) {
        this.products1 = new ProductModule(data, this.loginfo.companyId);
        this.product = {
          id: 0,
          name: '',
          barCode: null,
          description: '',
          brand: '',
          barcode: '',
          categoryId: 0,
          taxGroupId: 0,
          productTypeId: 0,
          unitId: 0,
          price: null,
          productCode: null,
          CompanyId: 0,
          action: '',
        }
      }
      this.Kot = this.products.Kot;
      var response: any = data;
      if (response.status == 0) {
        this.errorMsg = response.msg;

      }
      this.selectedItems = [];
      console.log(this.products);

      this.products.productOptionGroups.forEach(element => {
        console.log(element)
        this.products1.ProductOptionGroups.push(element.optionGroupId);
        this.selectedItems.push(this.products.optionGroups.filter(x => x.id == element.optionGroupId)[0]);
        this.multiSelect
        console.log(this.selectedItems)
      });
    })
  }

  getCategories() {
    this.Auth.getcategories(this.loginfo.companyId, 'A').subscribe(data => {
      this.categories = data
      console.log(this.categories)
      this.product.categoryId = this.categories[0].id
      this.category = this.categories.filter(x => x.isactive);
      this.getMasterproduct()
    })
  }

  getproducttype() {
    this.Auth.getProductType().subscribe(data => {
      this.producttypes = data
      this.product.productTypeId = this.producttypes[0].id
    })
  }

  gettax() {
    this.Auth.GetTaxGrp(this.loginfo.companyId).subscribe(data => {
      this.taxgroups = data
      this.product.taxGroupId = this.taxgroups[0].id
      console.log(this.taxgroups);
    })
  }


  unit: any
  getUnits() {
    this.Auth.getUnits().subscribe(data => {
      this.units = data
      this.product.unitId = this.units[0].id
      console.log(this.product.unitId)
      console.log(this.units)
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

  active(id, act) {
    console.log(id, act)
    this.Auth.prdactive(id, act).subscribe(data => {
      this.getMasterproduct()
    })
  }

  showInactive: Boolean = false
  changefilter(bool) {
    this.showInactive = bool
    console.log(bool)
    if (bool) {
      this.prod = this.products.products.filter(x => !x.isactive)
      this.prod1 = this.products.products.filter(x => !x.isactive)
    } else {
      this.prod = this.products.products.filter(x => x.isactive)
      this.prod1 = this.products.products.filter(x => x.isactive)
    }
    console.log(this.prod.length)
  }


  getproduct(id) {
    console.log(id)
    this.prodId = id
    if (this.prodid != '0') {
      this.Auth.getproductbyid(id).subscribe(data => {
        this.product = data['product']
        console.log(this.product)
        this.barcodes = data['barcodes']
        this.barcodevariants = data['barcodevariants']
        this.barcodes.forEach(bc => {
          bc.vids = []
          bc.com_code = ''
          this.barcodevariants
            .filter(x => x.barcodeId == bc.id)
            .forEach(bcv => {
              bc.vids.push(bcv.variantId)
            })
          bc.com_code = bc.vids.sort().join('_')
        })
        this.getcategoryvariants()
        this.getCategories()

      })
    } else {
      this.getcategoryvariants()
    }
    this.getMasterproduct()
  }


  validation() {
    var isvalid = true
    if (this.products1.CategoryId == 0) isvalid = false
    if (this.products1.ProductTypeId == 0) isvalid = false
    if (this.products1.TaxGroupId == 0) isvalid = false
    if (this.products1.UnitId == 0) isvalid = false
    if (this.products1.Name == '') isvalid = false
    if (this.products1.Description == '') isvalid = false
    if (this.product.price == null) isvalid = false
    if (this.product.productCode == null) isvalid = false
    return isvalid
  }
  back() {
    console.log('Bact to TaxGrp Screen!')
    this.submitted = false;
    this.show = !this.show
    this.products1 = new ProductModule(this.product, this.loginfo.companyId);
    this.product = {
      id: 0,
      name: '',
      barCode: null,
      description: '',
      brand: '',
      categoryId: 0,
      taxGroupId: 0,
      productTypeId: 0,
      unitId: 0,
      price: null,
      productCode: null,
      CompanyId: 0,
      action: '',
    }
    this.focus()
  }

  setcombinationname() {
    this.combinations.forEach(cmb => {
      cmb.product = this.product.name
      console.log(this.product.name)
    })
  }

  variantgroupobj: any = {}
  getcategoryvariants() {
    this.variantcombination = null
    this.variantgroupobj = {}
    this.combinations = []
    this.Auth.getcategoryvariants(this.product.categoryId).subscribe(data => {
      this.categoryvariantgroups = data
      this.categoryvariantgroups.forEach(cvg => {
        this.variantgroupobj[cvg.variantGroupName] = cvg.variants
      })
      if (this.barcodes && this.barcodevariants) this.setcvselect()
    })
  }
  setcvselect() {
    if (this.variantcombination == (undefined || null)) this.variantcombination = {}
    this.categoryvariantgroups.forEach(cvg => {
      cvg.variants.forEach(v => {
        if (this.barcodevariants.some(x => x.variantId == v.id)) {
          cvg.selected = true
          v.selected = true
          if (!this.variantcombination[cvg.variantGroupId])
            this.variantcombination[cvg.variantGroupId] = []
          this.variantcombination[cvg.variantGroupId].push(v.id)
        }
      })
    })
    this.getallcombinations(Object.values(this.variantcombination))
  }
  combinations = []
  keys = []
  variantchecked(vgid, vid, e) {
    this.combinations = []
    if (this.variantcombination == (undefined || null)) this.variantcombination = {}

    if (e.target.checked) {
      if (this.variantcombination[vgid] == (undefined || null)) this.variantcombination[vgid] = []
      this.variantcombination[vgid].push(vid)
    } else {
      var index = this.variantcombination[vgid].indexOf(vid)
      this.variantcombination[vgid].splice(index, 1)
    }
    Object.keys(this.variantcombination).forEach(key => {
      if (this.variantcombination[key].length == 0) delete this.variantcombination[key]
    })
    this.getallcombinations(Object.values(this.variantcombination))
  }
  getallcombinations(args) {
    this.combinations = []
    this.variantcombinations = []
    var r = []
    var max = args.length - 1
    function helper(arr, i) {
      for (var j = 0, l = args[i].length; j < l; j++) {
        var a = arr.slice(0) // clone arr
        a.push(args[i][j])
        if (i == max) r.push(a)
        else helper(a, i + 1)
      }
    }
    if (args.length > 0) helper([], 0)
    else r = []
    this.variantcombinations = r
    this.keys = []
    this.categoryvariantgroups.forEach(cvg => {
      if (cvg.variants.some(x => x.selected == true)) {
        cvg.selected = true
        this.keys.push(cvg.variantGroupName)
      } else {
        cvg.selected = false
      }
    })
    var obj: any = {}
    this.variantcombinations.forEach(vcb => {
      obj.product = this.product.name
      this.keys.forEach(key => {
        obj[key] = this.getvariantname(vcb, key)
      })
      obj.barcode = this.getbarcode(vcb).barcode
      obj.variantids = vcb
      obj.id = this.getbarcode(vcb).id
      this.combinations.push(Object.assign({}, obj))
    })
  }
  getvariantname(arr, key) {
    var variantarray = this.variantgroupobj[key]
    var variantname = ''
    arr.forEach(id => {
      if (variantarray.some(x => x.id == id)) {
        variantname = variantarray.filter(x => x.id == id)[0].name
      }
    })
    return variantname
  }
  getbarcode(vids) {
    var data = { barcode: '', id: 0 }
    var barcode = ''
    var com_code = vids.sort().join('_')
    if (this.barcodes.some(x => x.com_code == com_code)) {
      data.barcode = this.barcodes.filter(x => x.com_code == com_code)[0].barCode
      data.id = this.barcodes.filter(x => x.com_code == com_code)[0].id
    }
    return data
  }

  filteredvalues = [];
  filtersearch(): void {
    this.prod = this.term
      ? this.prod1.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.prod
    console.log(this.prod)
    console.log(this.products)
  }


  upload(files) {
    this.image = files[0];
    this.blobimageurl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image).replace('unsafe:', ''));
    this.products1.ImgUrl = null;
  }

  focus() {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (invalidElements.length > 0) {
      console.log(invalidElements[1]);

      invalidElements[1].focus();
    }

  }
  ////POPUP////
  openDetailpopup(contentdetail) {
    const modalRef = this.modalService
      .open(contentdetail, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
        },
        reason => {
        }
      );

  }


  submitted: boolean = false
  saveProduct() {
    this.submitted = true;
    if (this.validation()) {
      console.log(this.products1)
      this.products1.Recomended = !!this.products1.Recomended
      this.products1.IsStockMaintained = !!this.products1.IsStockMaintained
      this.products1.IsSaleProdGroup = !!this.products1.IsSaleProdGroup
      this.products1.ProductTypeId = this.products1.ProductTypeId
      var postdata = { objData: JSON.stringify(this.products1) };
      //postdata.data = ;
      console.log(postdata);
      var image = { image: this.image };
      this.Auth.saveProduct(postdata, this.image, this.products1.Id, this.loginfo.companyId).subscribe(data => {
        console.log(data)
        this.back()
      });
    }
    this.getMasterproduct()

  }
  categopt(e) {
    this.products1.ProductOptionGroups = [];
    this.selectedItems = [];
    console.log(e);
    this.opgp = this.products.categoryOptionGroups.filter(x => x.CategoryId == e);
    console.log(this.opgp);
    this.opgp.forEach(element => {
      this.products1.ProductOptionGroups.push(element.OptionGroupId);
      this.selectedItems.push(this.products.optionGroups.filter(x => x.id == element.OptionGroupId)[0]);
    });
    console.log(this.selectedItems);
    console.log(this.products1.ProductOptionGroups);
    console.log(this.products.optionGroups);
  }
  clear() {
    this.products1.ProductOptionGroups = [];
    this.selectedItems = [];
    console.log(this.selectedItems);
    console.log(this.products1.ProductOptionGroups);
  }


  public onFilterChange(item: any) {
    console.log(item);

  }

  public onItemSelect(item: any) {
    console.log(item);
    this.products1.ProductOptionGroups.push(item.id);
    console.log(this.products1.ProductOptionGroups);

  }
  public onDeSelect(item: any) {
    console.log(item);
    var ind1 = this.products1.ProductOptionGroups.findIndex(x => x == item.id);
    this.products1.ProductOptionGroups.splice(ind1, 1);
  }

  public onSelectAll(items: any) {
    console.log(items);
    items.forEach(element => {
      this.products1.ProductOptionGroups.push(element.id);
    });
  }
  public onDeSelectAll(items: any) {
    console.log(items);
    this.products1.ProductOptionGroups = [];
  }


  // setPredefinedQtys() {
  //   this.cakeQuantities.forEach(cq => {
  //     if (cq.saved) {
  //       if (!this.predefinedquantities.some(x => x.CakeQuantityId == cq.Id)) {
  //         this.newpdquantity.CakeQuantityId = cq.Id
  //         this.newpdquantity.QuantityText = cq.QuantityText
  //         this.newpdquantity.Quantity = cq.Quantity
  //         this.newpdquantity.FreeQuantity = cq.FreeQuantity
  //         this.newpdquantity.TotalQuantity = cq.TotalQuantity
  //         this.newpdquantity.Price = cq.Price
  //         this.predefinedquantities.push(Object.assign({}, this.newpdquantity))
  //         this.newpdquantity = new PredefinedQuantityModule({ companyid: this.CompanyId, productid: this.prodId })
  //       } else {
  //         this.predefinedquantities.filter(x => x.CakeQuantityId == cq.Id)[0].Price = cq.Price
  //       }
  //     } else {
  //       if (this.predefinedquantities.some(x => x.CakeQuantityId == cq.Id)) {
  //         if (this.predefinedquantities.filter(x => x.CakeQuantityId == cq.Id)[0].Id > 0)
  //           this.predefinedquantities.filter(x => x.CakeQuantityId == cq.Id)[0].isdeleted = true
  //         else
  //           this.predefinedquantities = this.predefinedquantities.filter(x => x.CakeQuantityId == cq.Id)
  //       }
  //     }
  //   })
  // }

  // calibrate() {
  //   this.cakeQuantities.forEach(cqty => {
  //     if (this.predefinedquantities.some(x => x.CakeQuantityId == cqty.Id && x.isdeleted == false)) {
  //       cqty.saved = true
  //       cqty.Price = this.predefinedquantities.filter(x => x.CakeQuantityId == cqty.Id)[0].Price
  //     } else {
  //       cqty.saved = false
  //     }
  //   })
  // }

  // savePredefQty() {
  //   this.setPredefinedQtys()
  //   this.Auth.savepredefinedqtys(this.prodId, this.predefinedquantities).subscribe(data => {
  //     console.log(data)
  //     if (data["status"] == 200) {
  //       this.predefinedquantities = data["predfqtys"]
  //       this.calibrate()
  //     }
  //   })
  // }

  


}
