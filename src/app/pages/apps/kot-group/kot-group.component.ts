import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'



@Component({
  selector: 'app-kot-group',
  templateUrl: './kot-group.component.html',
  styleUrls: ['./kot-group.component.scss']
})
export class KotGroupComponent implements OnInit {

  constructor(private Auth: AuthService, private modalService: NgbModal,) { }

  term: string = ''
  show = true
  loginfo
  CompanyId: any
  StoreId: any

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

  Kotgroup: any = {
    id: 0,
    description: '',
    isEditable: false,
    createdDate: moment().format('YYYY-MM-DD HH:MM A'),
    modifiedDate: moment().format('YYYY-MM-DD HH:MM A'),
    companyId: 0,
    updated: false,
    printer: null
  }






  ngOnInit(): void {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.getKotgroup()
      this.Kotgroup = {
        id: 0,
        description: '',
        isEditable: false,
        createdDate: moment().format('YYYY-MM-DD HH:MM A'),
        modifiedDate: moment().format('YYYY-MM-DD HH:MM A'),
        companyId: this.loginfo.companyId,
        updated: false,
        printer: null
      }
    })

  }



  KotGroup: any = []
  Kotgrp: any
  getKotgroup() {
    this.Auth.getkotgroup(this.loginfo.companyId).subscribe(data => {
      this.KotGroup = data
      this.Kotgrp = this.KotGroup
      console.log(this.KotGroup)
      console.log(this.Kotgrp)
      this.show = true
    })
  }

  submitted: boolean = false;
  Validation() {
    var isvalid = true;
    if (this.Kotgroup.description == '') isvalid = false;
    return isvalid;
  }

  // editkot(kotgrp) {
  //   this.Kotgroup = kotgrp
  //   this.show = !this.show
  // }

  kotbyid(Id) {    
    this.Auth.getkotgrpbyId(Id).subscribe(data => {
      this.Kotgroup = data
      this.show = !this.show
      console.log(this.Kotgroup)
    })
  }

  savekot() {
    this.Kotgroup.companyId = this.loginfo.companyId
    this.submitted = true;
    console.log(this.submitted);
    if (this.Validation()) {
      if (this.Kotgroup.id == 0) {
        this.Auth.AddKotGroup(this.Kotgroup).subscribe(data => {
          console.log(data)
          this.submitted = false;
          this.back()
          this.getKotgroup()
        })
      } else if ((this.Kotgroup.id > 0)) {
        this.Auth.UpdatekotGrp(this.Kotgroup).subscribe(data1 => {
          console.log(data1)
          this.submitted = false;
          this.back()
          this.getKotgroup()
        })
      }
    }
  }

  getkotdelete(Id,modalRef) {
    this.Auth.DeleteKotgrp(Id).subscribe(data => {
      this.getKotgroup();
      console.log(data)
      this.openDetailpopup(modalRef)
    });

  }



  filtersearch(): void {
    this.Kotgrp = this.term
      ? this.KotGroup.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
      : this.KotGroup
    console.log(this.Kotgrp)
  }

  back() {
    console.log('Bact to TaxGrp Screen!')
    this.show = !this.show
    this.submitted = false;
    this.Kotgroup = {
      id: 0,
      description: '',
      isEditable: false,
      createdDate: moment().format('YYYY-MM-DD HH:MM A'),
      modifiedDate: moment().format('YYYY-MM-DD HH:MM A'),
      companyId: 0,
      updated: false,
      printer: null
    }
    console.log(this.Kotgroup)
  }
}
