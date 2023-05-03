export class DenomEntry {
    Id: number
    EntryDateTime: string
    UserId: number
    StoreId: number
    CompanyId: number
    EditedForId: number
    Entries: Array<Entry>
    TotalAmount: number
    OpeningBalance: number
    CashIn: number
    CashOut: number
    ExpectedBalance: number
    CashInJson: string
    CashOutJson: string
    TransactionJson: string
    SalesCash: number
    EntryTypeId: number
    constructor(loginfo, editforid,userid) {
        console.log(loginfo)
        this.Id = 0
        this.EntryDateTime = null
        this.UserId = userid
        this.StoreId = loginfo.storeId
        this.CompanyId = loginfo.companyId
        this.EditedForId = editforid
        this.TotalAmount = 0
        this.SalesCash = 0
        this.Entries = []
        this.EntryTypeId = null
    }
}

export class Entry {
    Id: number
    DenomName: string
    Count: number
    Amount: number
    DenomEntryId: number
    constructor(denomination) {
        this.Id = 0
        this.DenomName = denomination
        this.Count = null
        this.Amount = null
        this.DenomEntryId = null
    }
}