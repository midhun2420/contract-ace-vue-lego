<!-- <template>
    <div>
        <simple-table v-if="details.length!==0" hide-if-no-data
                      :data="details" :fields="fields" ref="table">
            <template #actions="{rowData}">
                <div class="btn-group-tight">
                    <edit-btn icon="" text="Award" v-if="rowData.tender_status!=='Finalized'" @click="awardBidder(rowData)"/>
                    <edit-btn text="Winner" icon="fa fa-star" color="success" v-if="rowData.is_winner"/>
                </div>
            </template>
        </simple-table>

        <delete-modal okButtonColor="primary" bodyColor="primary" headerColor="primary" okButton="Yes"
                      ref="awardModal"
                      title="Award Bidder" :url="FinalizeBidder"
                      :params="{bid_id, tender_id}"
                      @response="formSuccess">
            <p>You are about to award the bidder <b v-html="awardItem && awardItem.name"></b> as the winner. Are
                you
                sure ?</p>
            <template #loading>
                <loading-animation/>
                Please wait.
            </template>
        </delete-modal>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name  : 'FinalizedBiddersList',
    props : { tender_id : { type : String } },
    data () {
        return {
            FinalizeBidder : urls.Consumer.Tender.FinalizeBidder,
            fields         : [
                {
                    name      : 'bid_id',
                    sortField : 'bid_id',
                    title     : 'Bid Id'
                },
                {
                    name      : 'bidder',
                    sortField : 'bidder',
                    title     : 'Bidder'
                },
                {
                    name      : 'amount',
                    sortField : 'amount',
                    title     : 'Amount'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            details   : '',
            bid_id    : '',
            awardItem : {
                name : ''
            }
        };
    },
    mounted () {
        this.loadData();
    },
    methods : {
        loadData () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.FinalizedBiddersList, { tender_id : that.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    if (json['boq-table']) {
                        that.details = json['boq-table'];
                    } else if (json['boq-wo-qty-table']) {
                        that.details = json['boq-wo-qty-table'];
                    } else if (json['sot-table']) {
                        that.details = json['sot-table'];
                    } else if (json['msp-mnt-table']) {
                        that.details = json['msp-mnt-table'];
                    }
                    that.loading = false;
                }
            });
        },
        formSuccess (response) {
            const refs = this.$refs;
            refs.awardModal.close();
            if (response.data.final_list['boq-table']) {
                this.details = response.data.final_list['boq-table'];
            } else if (response.data.final_list['boq-wo-qty-table']) {
                this.details = response.data.final_list['boq-wo-qty-table'];
            } else if (response.data.final_list['sot-table']) {
                this.details = response.data.final_list['sot-table'];
            } else if (response.data.final_list['msp-mnt-table']) {
                this.details = response.data.final_list['msp-mnt-table'];
            }
        },
        awardBidder (rowData) {
            this.awardItem.name = rowData.bidder;
            this.$refs.awardModal.show();
            this.bid_id = rowData.bid_id;
        }
    }
};
</script>

<style scoped>

</style> -->

<template>
  <div>
    <simple-table
      v-if="details.length !== 0"
      hide-if-no-data
      :data="details"
      :fields="fields"
      ref="table"
    >
      <template #actions="{ rowData }">
        <div class="btn-group-tight">
          <edit-btn
            icon=""
            text="Award"
            v-if="rowData.tender_status !== 'Finalized'"
            @click="awardBidder(rowData)"
          />
          <edit-btn
            text="Winner"
            icon="fa fa-star"
            color="success"
            v-if="rowData.is_winner"
          />
        </div>
      </template>
    </simple-table>

    <delete-modal
      okButtonColor="primary"
      bodyColor="primary"
      headerColor="primary"
      okButton="Yes"
      ref="awardModal"
      title="Award Bidder"
      :url="FinalizeBidder"
      :params="{ bid_id, tender_id }"
      @response="formSuccess"
    >
      <p>
        You are about to award the bidder
        <b v-html="awardItem && awardItem.name"></b> as the winner. Are you sure
        ?
      </p>
      <template #loading>
        <loading-animation />
        Please wait.
      </template>
    </delete-modal>
  </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name  : 'FinalizedBiddersList',
    props : { tender_id : { type : String } },
    data () {
        return {
            FinalizeBidder : urls.Consumer.Tender.FinalizeBidder,
            fields         : [
                {
                    name      : 'bid_id',
                    sortField : 'bid_id',
                    title     : 'Bid Id'
                },
                {
                    name      : 'bidder',
                    sortField : 'bidder',
                    title     : 'Bidder'
                },
                {
                    name      : 'amount',
                    sortField : 'amount',
                    title     : 'Amount'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            details   : '',
            bid_id    : '',
            awardItem : {
                name : ''
            }
        };
    },
    mounted () {
        this.loadData();
    },
    methods : {
        loadData () {
            const that = this;
            that.loading = true;
            axios
                .form(urls.Consumer.Tender.FinalizedBiddersList, {
                    tender_id : that.tender_id
                })
                .then(function (response) {
                    const json = response.data;
                    if (json.error === false) {
                        // Get the base table (has tender_status, is_winner)
                        let baseTable = null;
                        if (json['boq-table']) {
                            baseTable = json['boq-table'];
                        } else if (json['boq-wo-qty-table']) {
                            baseTable = json['boq-wo-qty-table'];
                        } else if (json['sot-table']) {
                            baseTable = json['sot-table'];
                        } else if (json['msp-mnt-table']) {
                            baseTable = json['msp-mnt-table'];
                        } else if (json['import-excel-table']) {
                            baseTable = json['import-excel-table'];
                        }

                        // If final-total-table exists, merge amount into base table
                        if (json['final-total-table'] && baseTable) {
                            that.details = baseTable.map(function (row) {
                                const totalRow = json['final-total-table'].find(
                                    t => t.bid_id === row.bid_id
                                );
                                return totalRow
                                    ? { ...row, amount : totalRow.amount }
                                    : row;
                            });
                        } else {
                            that.details = baseTable;
                        }

                        that.loading = false;
                    }
                });
        },
        formSuccess (response) {
            const refs = this.$refs;
            const data = response.data || response;

            refs.awardModal.close();

            if (data && data.msg) {
                this.$notify({
                    type  : 'success',
                    title : data.msg
                });
            }

            if (data && data.final_list) {
                let baseTable = null;
                if (data.final_list['boq-table']) {
                    baseTable = data.final_list['boq-table'];
                } else if (data.final_list['boq-wo-qty-table']) {
                    baseTable = data.final_list['boq-wo-qty-table'];
                } else if (data.final_list['sot-table']) {
                    baseTable = data.final_list['sot-table'];
                } else if (data.final_list['msp-mnt-table']) {
                    baseTable = data.final_list['msp-mnt-table'];
                } else if (data.final_list['import-excel-table']) {
                    baseTable = data.final_list['import-excel-table'];
                }

                if (data.final_list['final-total-table'] && baseTable) {
                    this.details = baseTable.map(function (row) {
                        const totalRow = data.final_list['final-total-table'].find(
                            t => t.bid_id === row.bid_id
                        );
                        return totalRow
                            ? { ...row, amount : totalRow.amount }
                            : row;
                    });
                } else {
                    this.details = baseTable;
                }
            }
        },
        awardBidder (rowData) {
            this.awardItem.name = rowData.bidder;
            this.$refs.awardModal.show();
            this.bid_id = rowData.bid_id;
        }
    }
};
</script>

<style scoped>

</style>
