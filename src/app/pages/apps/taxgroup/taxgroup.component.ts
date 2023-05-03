import { Component, OnInit } from '@angular/core'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'

@Component({
  selector: 'app-taxgroup',
  templateUrl: './taxgroup.component.html',
  styleUrls: ['./taxgroup.component.scss'],
})
export class TaxgroupComponent implements OnInit {
  loginfo: any
  taxgroups: any = []
  show = true
  submitted: boolean = false
  taxgroup: any = {
    id: 0,
    description: '',
    tax1: 0,
    tax2: 0,
    tax3: 0,
    companyId: 0,
    isInclusive: false,
  }
  constructor(private Auth: AuthService, private notification: NzNotificationService,) { }

  ngOnInit(): void {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.gettax()
      this.taxgroup = {
        id: 0,
        description: '',
        tax1: 0,
        tax2: 0,
        tax3: 0,
        companyId: this.loginfo.companyId,
        isInclusive: false,
      }
    })
  }

  tabledata: []
  gettax() {
    this.Auth.GetTaxGrp(this.loginfo.companyId).subscribe(data => {
      this.taxgroups = data
      this.tabledata = this.taxgroups
      console.log(this.taxgroups)
      this.show = true
    })
  }

  term: string = ''
  filtersearch(): void {
    this.tabledata = this.term
      ? this.taxgroups.filter(x => x.tax1.toString().includes(this.term.toString()) || (x.description.toLowerCase().includes(this.term.toLowerCase())))
      : this.taxgroups
    console.log(this.tabledata)
  }

  // term: string = ''
  // filtersearch(): void {
  //   this.tabledata = this.term
  //     ? (this.taxgroups.filter(x =>x.description.toLowerCase().includes(this.term.toLowerCase()))||(x => x.tax1.toString().includes(this.term.toString())))
  //     : this.taxgroups
  //   console.log(this.tabledata)
  // }

  validation() {
    var isvalid = true;
    if (this.taxgroup.description == '') isvalid = false;
    if (this.taxgroup.tax1 == 0) isvalid = false;
    if (this.taxgroup.tax2 == 0) isvalid = false;
    if (this.taxgroup.tax3 == 0) isvalid = false;
    // if (this.taxgroup.id == 0) isvalid = false;

    return isvalid;
  }

  addTax() {
    console.log(this.taxgroup)
    this.submitted = true;
    console.log(this.submitted);
    if (this.validation()) {
      var obj = {}
      Object.keys(this.taxgroup).forEach(key => {
        obj[key.charAt(0).toUpperCase() + key.slice(1)] = this.taxgroup[key]
      })
      if (this.taxgroup.id == 0) {
        this.Auth.AddTaxGrp(obj).subscribe(data => {
          console.log(data)
          this.Auth.updatetaxgroupdb(data['taxgroup']).subscribe(data => {
            this.taxgroup = {
              id: 0,
              description: '',
              tax1: 0,
              tax2: 0,
              tax3: 0,
              companyId: this.loginfo.companyId,
              isInclusive: false,
            }
            this.gettax()
           
          })
        })
      } else {
        this.Auth.UpdateTaxGrp(obj).subscribe(data1 => {
          this.Auth.updatetaxgroupdb(data1['taxgroup']).subscribe(data => {
            this.taxgroup = {
              id: 0,
              description: '',
              tax1: 0,
              tax2: 0,
              tax3: 0,
              companyId: this.loginfo.companyId,
              isInclusive: false,
            }
            this.gettax()
          })
        })
      }
    }
    else {
      this.back()
      this.notification.error("Error", "Variant Added UnSuccessfully")
    }
  }

  editTaxgroup(taxgroup) {
    this.taxgroup = taxgroup
    this.show = !this.show
  }

  back() {
    console.log('Bact to TaxGrp Screen!')
    this.show = !this.show
    this.taxgroup = {
      id: 0,
      description: '',
      tax1: 0,
      tax2: 0,
      tax3: 0,
      companyId: this.loginfo.companyId,
      isInclusive: false,
    }
  }
}
