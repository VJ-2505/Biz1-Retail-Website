import { Component, ElementRef, HostListener, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment'
import { AuthService } from 'src/app/auth.service';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { log } from 'ng-zorro-antd';
import { DenomEntry, Entry } from './denominationentry.module';

@Component({
  selector: 'app-denomination-entries',
  templateUrl: './denomination-entries.component.html',
  styleUrls: ['./denomination-entries.component.scss']
})
export class DenominationEntriesComponent implements OnInit {

  @ViewChild('drawerTitle') liveSearchInput: TemplateRef<void>
  @ViewChild('Petty_data_modal', { static: true }) Petty_data_modal: ElementRef
  @ViewChild('Report_data_modal', { static: true }) Report_data_modal: ElementRef
  @ViewChild('Copy_data_modal', { static: true }) Copy_data_modal: ElementRef
  userid: any
  constructor(private calendar: NgbCalendar, private modalService: NgbModal, private Auth: AuthService,) {
    const user = JSON.parse(localStorage.getItem('user'))
    this.userid = user.id
    console.log(user.id)
    console.log(this.userid);
  }
  model: NgbDateStruct
  showcalender: boolean = false
  date: { year: number; month: number }
  displaydate = moment().format('Do MMM YYYY')
  entrytypeid: number = null
  smodel = ''
  loginfo
  stores: any = []
  CompanyId: any
  StoreId: any
  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.CompanyId
      this.StoreId = this.loginfo.StoreId
      this.getstores()
      this.getDenomTypes()
    })
    this.model = this.calendar.getToday()
  }

  from: string = moment().subtract(60, "minutes").format("hh:mm");
  to: string = moment().format("hh:mm");
  today: string = moment().format("YYYY-MM-DD");
  diffMargin: number = 100;
  denomentries = [];

  onDateSelect(date: NgbDate) {
    console.log(date)
    this.model = date
    this.displaydate = moment(`${date.year}-${date.month}-${date.day}`).format('Do MMM YYYY')
    this.showcalender = false
  }
  getDateFormated(time) {
    return moment(this.today + " " + time).format("YYYY-MM-DD hh:mm A");
  }
  entrytypes = [
    { id: null, type: "All" },
    { id: 1, type: "Send to Store" },
    { id: 2, type: "Closing" },
  ];

  close() {
    console.log("side drawer closed")
    this.visible = false
  }

  openPettymodal() {
    this.modalService.open(this.Petty_data_modal, { centered: true, size: 'lg' })
  }

  openReportmodal() {
    this.modalService.open(this.Report_data_modal, { centered: true, size: 'lg' })
  }
  copydata: any = "";
  openCopymodal() {
    this.copydata = "";
    var max_store_len = 0;
    var max_user_len = 0;
    this.copy_raw_data.forEach((data) => {
      console.log(this.copy_raw_data)
      // console.log(data)
      if (data.store.length > max_store_len) max_store_len = data.store.length;
      if (data.user.length > max_user_len) max_user_len = data.user.length;
    });
    max_store_len = max_store_len + 1;
    max_user_len = max_user_len + 1;
    this.copy_raw_data.forEach((data) => {
      console.log(data)
      if (data.store.length < max_store_len) {
        var diff = max_store_len - data.store.length;
        data.store = data.store + ("-".repeat(diff));
      }
      if (data.user.length < max_user_len) {
        var diff = max_user_len - data.user.length;
        data.user = data.user + ("-".repeat(diff));
      }
      this.copydata += data.store + data.user + data.remarks + "--" + data.time + "\n\n";
      console.log(this.copydata)
    });
    this.modalService.open(this.Copy_data_modal, { centered: true, size: 'lg' })


  }



  // cancel() {
  //   this.copy_raw_data = [
  //     { store: "", user: "", remarks: "", time: "" },
  //   ];
  //   console.log(this.copy_raw_data)
  // }
  getstores() {
    this.Auth.getstore(this.loginfo.companyId).subscribe(data => {
      this.stores = data
      console.log(this.stores)

    })
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      map(term =>
        term === ''
          ? []
          : this.stores
            .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10),
      ),
    )

  formatter = (x: { name: string }) => x.name

  storeid: number = 0
  selectedItem(store) {
    console.log(store)
    this.storeid = store.id
    console.log(this.storeid)
    this.loginfo.storeId = this.storeid;
    this.getstorecashsales();
  }

  totalexcess = 0;
  totalshortage = 0;
  total = 0;
  copy_raw_data: Array<{
    store: string;
    user: string;
    remarks: string;
    time: string;
  }> = [];

  // getfetchentries() {
  //   var date = `${this.model.year}-${this.model.month}-${this.model.day}`
  //   this.Auth.fetchDenominationEntries(this.storeid, date, this.loginfo.companyId, this.entrytypeid).subscribe(data => {
  //     console.log(data)
  //     this.denomentries = data["data"];
  //     console.log(this.denomentries)
  //     this.denomentries = this.denomentries.sort((a, b) => {
  //       return a.Id - b.Id;
  //     });
  //     var olddiff = 0;
  //     this.denomentries.forEach((dentry, index) => {
  //       dentry.edited = false;
  //       dentry.CashInTransaxns = dentry.CashInJson
  //         ? JSON.parse(dentry.CashInJson)
  //         : [];
  //       dentry.CashOutTransaxns = dentry.CashOutJson
  //         ? JSON.parse(dentry.CashOutJson)
  //         : [];
  //       dentry.SalesTransaxns = dentry.TransactionJson
  //         ? JSON.parse(dentry.TransactionJson)
  //         : [];
  //       dentry.diff = dentry.TotalAmount - dentry.ExpectedBalance;
  //       console.log(dentry.diff)
  //       dentry.Remarks =
  //         dentry.diff == 0
  //           ? "Tallied"
  //           : dentry.diff > 0
  //             ? "Excess"
  //             : "Shortage";

  //       console.log(dentry.Remarks)
  //       if (index > 0 && this.storeid > 0)
  //         dentry.compared_value = dentry.diff - olddiff;
  //       olddiff = dentry.diff;
  //       dentry.storename = this.stores.filter(
  //         (x) => x.Id == dentry.StoreId
  //       )[0].name;
  //       console.log(this.stores)
  //       console.log(dentry.storename)
  //       if (this.denomentries.some((x) => x.EditedForId == dentry.Id)) {
  //         dentry.edited = true;
  //         dentry.editid = this.denomentries.filter(
  //           (x) => x.EditedForId == dentry.Id
  //         )[0].Id;
  //       } else {
  //         this.totalexcess += dentry.diff > 0 ? dentry.diff : 0;
  //         this.totalshortage += dentry.diff < 0 ? dentry.diff : 0;
  //       }
  //       var obj = {
  //         store: dentry.storename,
  //         user: dentry.UserName,
  //         remarks: dentry.diff + " " + dentry.Remarks,
  //         time: moment(dentry.EntryDateTime).format("HH:MM A"),
  //       };
  //       this.copy_raw_data.push(obj);
  //     });
  //     this.total = this.totalexcess + this.totalshortage;
  //     this.denomentries = this.denomentries.sort((a, b) => {
  //       return b.Id - a.Id;
  //     });
  //   })
  // }

  // Petty-Cash

  store_petty_cash = {
    salescash: 0,
    expensecash: 0,
    fromSales: 0,
    fromExpense: 0,
    to: "",
    transferAmount: 0,
    transferReason: "",
  };
  totalsales: any;

  getstorecashsales() {
    this.Auth.getstorecashsales(this.storeid, this.loginfo.companyId, moment({ ...this.model, month: this.model.month - 1 }).format("YYYY-MM-DD")).subscribe((data) => {
      console.log(data);
      this.totalsales = JSON.parse(JSON.stringify(data["totalsales"][0]));
      console.log(this.totalsales)
      this.store_petty_cash = {
        salescash: this.totalsales.salescash,
        expensecash: this.totalsales.expensecash,
        fromSales: null,
        fromExpense: null,
        to: "",
        transferAmount: 0,
        transferReason: "",
      };
      console.log(this.store_petty_cash)
    });
  }

  transfer() {
    if (this.store_petty_cash.fromSales > 0) {
      this.store_petty_cash.to = "EXPENSE";
    } else if (this.store_petty_cash.fromExpense) {
      this.store_petty_cash.to = "SALES";
    }

    console.log(JSON.stringify(this.store_petty_cash));
    this.store_petty_cash.transferAmount += (this.store_petty_cash.fromExpense || 0) + (this.store_petty_cash.fromSales || 0);
    console.log(this.store_petty_cash.transferAmount)
    this.store_petty_cash.salescash += (this.store_petty_cash.fromExpense || 0) - (this.store_petty_cash.fromSales || 0);
    console.log(this.store_petty_cash.salescash)
    this.store_petty_cash.expensecash += (this.store_petty_cash.fromSales || 0) - (this.store_petty_cash.fromExpense || 0);
    console.log(this.store_petty_cash.expensecash);

    this.store_petty_cash.fromExpense = null;
    this.store_petty_cash.fromSales = null;
  }

  cancelTransfer() {
    console.log("CANCEL TRANSFER");
    this.store_petty_cash = {
      salescash: this.totalsales.salescash,
      expensecash: this.totalsales.expensecash,
      fromSales: null,
      fromExpense: null,
      to: "",
      transferAmount: 0,
      transferReason: "",
    };
  }

  completeTransfer() {
    console.log(
      `Transfer amount of Rs.${this.store_petty_cash.transferAmount} from ${this.store_petty_cash.to == "EXPENSE" ? "Sales" : "Expense"
      } cash to ${this.store_petty_cash.to == "EXPENSE" ? "Expense" : "Sales"
      } cash`
    );
    console.log(this.store_petty_cash);
    this.Auth.pettyCashTransfer(this.storeid, this.loginfo.companyId, this.store_petty_cash.transferAmount, this.store_petty_cash.to, escape(this.store_petty_cash.transferReason)).subscribe((data) => {
      console.log(data);
      this.getstorecashsales();
    });
    this.modalService.dismissAll();
  }


  // Report
  badStores = [];
  missingStores = [];
  badStoresString: string = "";
  missingStoresString: string = "";
  withDifference: boolean = false;

  getDenomReport() {

    this.Auth.denomEntryReport(this.loginfo.companyId, this.getDateFormated(this.from), this.getDateFormated(this.to), this.diffMargin).subscribe((data) => {
      console.log(data);
      this.badStores = data["badStores"];
      this.missingStores = data["missingStores"];

      this.genBadStoresString();

      this.missingStoresString = this.missingStores
        .map((x) => x.name)
        .join(" \n");
      console.log(this.missingStoresString)
      this.modalService.open(this.Report_data_modal, {
        centered: true,
        size: "lg",
      });
      // this.openReportmodal()
    });
  }

  genBadStoresString() {
    this.badStoresString = "";
    let largetstString = this.getLargestString(
      this.badStores.map((x) => x.name)

    );
    this.badStores.forEach((bs) => {
      this.badStoresString +=
        this.addPadding(largetstString.length, bs.name) +
        this.diffString(bs.diff) +
        "\n";
    });
  }

  getLargestString(arr) {
    var largetsString = "";
    console.log(arr);
    arr.forEach((str) => {
      if (str.length > largetsString.length) {
        largetsString = str;
      }
    });
    return largetsString;
  }

  addPadding(totLen, string) {
    let extraLen = totLen - string.length;
    return string + " ".repeat(extraLen);
  }

  diffString(diff) {
    let str = "";
    if (this.withDifference) {
      if (diff > 0) {
        str = "  -->  Shortage " + diff;
      } else if (diff < 0) {
        str = "  -->  Excess " + diff;
      } else if (diff == 0) {
        str = "  -->  " + diff;
      }
    }
    return str;
  }

  // Save Denom-entry

  entrydatetime = {
    date: "",
    time: "",
  };

  denomEntry: DenomEntry

  visible: boolean = false
  open(): void {
    this.visible = true
    this.denomEntry = new DenomEntry(this.loginfo, null, this.userid)
    this.denominationtype.forEach(den => {
      this.denomEntry.Entries.push(new Entry(den))
    });
    this.entrydatetime = {
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("HH:MM"),
    };

  }

  denominationtype: any = []

  getDenomTypes() {
    this.Auth.getDenominationTypes().subscribe(data => {
      this.denominationtype = data
      console.log(this.denominationtype)
    })
  }

  calculate() {
    this.denomEntry.TotalAmount = 0;
    this.denomEntry.Entries.forEach((entry) => {
      entry.Amount = +entry.DenomName * entry.Count;
      this.denomEntry.TotalAmount += entry.Amount;
    });
  }
  getfetchentries() {
    this.totalexcess = 0;
    this.totalshortage = 0;
    this.total = 0;
    this.copy_raw_data = [
      { store: "Store", user: "User", remarks: "Remarks", time: "time" },
    ];
    var date = `${this.model.year}-${this.model.month}-${this.model.day}`;
    this.Auth.fetchDenominationEntries(this.storeid, date, this.loginfo.companyId, this.entrytypeid).subscribe((data) => {
      console.log(data);
      this.denomentries = data["data"];
      this.denomentries = this.denomentries.sort((a, b) => { return a.Id - b.Id; });
      console.log(this.denomentries)
      var olddiff = 0;
      this.denomentries.forEach((dentry, index) => {
        console.log(dentry)
        dentry.edited = false;
        dentry.CashInTransaxns = dentry.CashInJson
          ? JSON.parse(dentry.CashInJson)
          : [];
        dentry.CashOutTransaxns = dentry.CashOutJson
          ? JSON.parse(dentry.CashOutJson)
          : [];
        dentry.SalesTransaxns = dentry.TransactionJson
          ? JSON.parse(dentry.TransactionJson)
          : [];
        dentry.diff = dentry.TotalAmount - dentry.ExpectedBalance;
        dentry.Remarks = dentry.diff == 0
          ? "Tallied"
          : dentry.diff > 0
            ? "Excess"
            : "Shortage";
        if (index > 0 && this.storeid > 0)
          dentry.compared_value = dentry.diff - olddiff;
        olddiff = dentry.diff;
        dentry.storename = this.stores.filter(

          (x) => x.id == dentry.StoreId
        )[0].name;
        if (this.denomentries.some((x) => x.EditedForId == dentry.Id)) {
          dentry.edited = true;
          dentry.editid = this.denomentries.filter(
            (x) => x.EditedForId == dentry.Id
          )[0].Id;
        } else {
          this.totalexcess += dentry.diff > 0 ? dentry.diff : 0;
          this.totalshortage += dentry.diff < 0 ? dentry.diff : 0;
        }
        var obj = {
          store: dentry.storename,
          user: dentry.UserName,
          remarks: dentry.diff + " " + dentry.Remarks,
          time: moment(dentry.EntryDateTime).format("HH:MM A"),
        };
        console.log(obj)
        this.copy_raw_data.push(obj);
      });
      this.total = this.totalexcess + this.totalshortage;
      this.denomentries = this.denomentries.sort((a, b) => {
        return b.Id - a.Id;
      });
    });
  }

  save() {
    console.log(this.entrydatetime);
    console.log(this.entrydatetime.date + "T" + this.entrydatetime.time);
    console.log(
      moment(this.entrydatetime.date + "T" + this.entrydatetime.time).format(
        "YYYY-MM-DD hh:mm A"
      )
    );
    // return;
    if (this.denomEntry.Entries.some((e) => e.Count > 0 && e.Amount > 0)) {
      if (this.denomEntry.EditedForId == null) {
        var date = moment().format("YYYY-MM-DD");
        this.Auth
          .getstorecashsales(this.storeid, this.loginfo.companyId, date)
          .subscribe((data) => {
            console.log(data);
            var cash_transaxns = data["totalsales"][0].cashsales;
            let salescash = data["totalsales"][0].salescash;
            let expensecash = data["totalsales"][0].expensecash;

            this.denomEntry.EntryDateTime = moment(
              this.entrydatetime.date + "T" + this.entrydatetime.time
            ).format("YYYY-MM-DD hh:mm A");
            this.denomEntry.Entries = this.denomEntry.Entries.filter(
              (e) => e.Count > 0 && e.Amount > 0
            );
            console.log(this.model, moment(this.model).format("DD-MM-YYYY"));
            var _date = moment().format("DD-MM-YYYY");
            this.Auth
              .dayclosing(this.loginfo.companyId, this.storeid, _date, "13:51")
              .subscribe((dcdata) => {
                console.log(dcdata);
                this.denomEntry.OpeningBalance =
                  dcdata["closingTrans"]["OpeningBalance"];
                this.denomEntry.CashIn = dcdata["CashIn"];

                this.denomEntry.CashOut = dcdata["CashOut"];
                if (
                  (this.denomEntry.EntryTypeId == 3 ||
                    this.denomEntry.EntryTypeId == 4) &&
                  dcdata["CashOut"] > 0
                ) {
                  this.denomEntry.CashOut =
                    dcdata["CashOut"] -
                    (dcdata["cashOutTrx"].filter(
                      (x) => x.TransTypeId == 10 && x.Amount > 0
                    )[0]
                      ? dcdata["cashOutTrx"].filter(
                        (x) => x.TransTypeId == 10 && x.Amount > 0
                      )[0].Amount
                      : 0 || 0);
                }
                let sent_store_index = -1;
                sent_store_index = dcdata["cashOutTrx"].filter((y) =>
                  y.TransactionId ==
                    dcdata["cashOutTrx"].filter(
                      (x) => x.TransTypeId == 10 && x.Amount > 0
                    )[0]
                    ? dcdata["cashOutTrx"].filter(
                      (x) => x.TransTypeId == 10 && x.Amount > 0
                    )[0].TransactionId
                    : 0 || 0
                );
                this.denomEntry.SalesCash = data["totalsales"][0].cashsales
                  ? data["totalsales"][0].cashsales
                  : 0;
                console.log(
                  this.denomEntry.OpeningBalance,
                  this.denomEntry.CashIn,
                  this.denomEntry.SalesCash,
                  this.denomEntry.CashOut
                );

                if (
                  this.denomEntry.EntryTypeId == 3 ||
                  this.denomEntry.EntryTypeId == 4
                ) {
                  this.denomEntry.ExpectedBalance = this.denomEntry.CashIn + (expensecash ? expensecash : 0) - this.denomEntry.CashOut;
                  this.denomEntry.CashOutJson = JSON.stringify(
                    dcdata["cashOutTrx"].filter((x, i) => i != sent_store_index)
                  );
                } else if (
                  this.denomEntry.EntryTypeId == 5 ||
                  this.denomEntry.EntryTypeId == 6
                ) {
                  console.log(
                    `formula openingsales(${salescash ? salescash : 0
                    }) + salescash(${this.denomEntry.SalesCash})`
                  );
                  console.log(
                    (salescash ? salescash : 0) + this.denomEntry.SalesCash
                  );
                  this.denomEntry.ExpectedBalance =
                    (salescash ? salescash : 0) + this.denomEntry.SalesCash;
                  this.denomEntry.CashOutJson = JSON.stringify(
                    dcdata["cashOutTrx"]
                  );
                } else {
                  this.denomEntry.ExpectedBalance =
                    this.denomEntry.OpeningBalance +
                    this.denomEntry.SalesCash -
                    this.denomEntry.CashOut;
                  this.denomEntry.CashOutJson = JSON.stringify(
                    dcdata["cashOutTrx"]
                  );
                }

                this.denomEntry.CashInJson = JSON.stringify(
                  dcdata["cashInTrx"]
                );
                this.denomEntry.TransactionJson = JSON.stringify(
                  data["transactions"]
                );
                console.log(this.denomEntry);
                // return
                this.Auth.addDenomEntry(this.denomEntry).subscribe((data) => {
                  console.log(data)
                  this.visible = false;
                  this.getfetchentries();
                });
              });
          });
      } else {
        var parentEntry = this.denomentries.filter(
          (x) => x.Id == this.denomEntry.EditedForId
        )[0];
        console.log(parentEntry);
        this.denomEntry.EntryDateTime = moment().format("YYYY-MM-DD hh:mm A");
        this.denomEntry.Entries = this.denomEntry.Entries.filter(
          (e) => e.Count > 0 && e.Amount > 0
        );
        this.denomEntry.OpeningBalance = parentEntry["OpeningBalance"];
        this.denomEntry.CashIn = parentEntry["CashIn"];
        this.denomEntry.SalesCash = parentEntry["SalesCash"];
        this.denomEntry.CashOut = parentEntry["CashOut"];
        this.denomEntry.ExpectedBalance =
          this.denomEntry.OpeningBalance +
          this.denomEntry.CashIn +
          this.denomEntry.SalesCash -
          this.denomEntry.CashOut;
        this.denomEntry.CashInJson = parentEntry["CashInJson"];
        this.denomEntry.CashOutJson = parentEntry["CashOutJson"];

        this.Auth.addDenomEntry(this.denomEntry).subscribe((data) => {
          console.log(data)
          this.visible = false;
          this.getfetchentries();
        });
      }
    }
  }

}