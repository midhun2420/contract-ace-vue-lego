<template>
    <div>
        <div v-if="loading" class="container bg-primary p-3 mb-4 mt-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>

        <!--            Tender Edit Form           -->

        <div v-if="!loading && currentUser.features.issue_tender">
            <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>
            <!--            Bidders List            -->

            <div
                 v-if="details && (details.status==='Published' ||  details.status==='Closed' || details.status==='Cancelled' || details.status==='Finalized')">
                <vue-table-card  :show-pagination="false" :show-search-box="false" title="Bidders" class="container full-height" :fields="fields"
                                :url="bidderList"
                                :per-page="100" id="Bidders"
                                ref="table" :extra-params="{ tender_id }">
                </vue-table-card>
            </div>

            <div
                 v-if="details && (details.status==='Published' ||  details.status==='Closed' || details.status==='Cancelled' || details.status==='Finalized')">
                <vue-table-card :show-pagination="false" :show-search-box="false" title="Bidders Response" class="container full-height"
                                :fields="fields"
                                :url="bidderResponseList" :per-page="100" id="Response"
                                ref="table" :extra-params="{ tender_id }">
                </vue-table-card>
            </div>

            <div v-if="(details.status==='Finalized') && data.length!==0" class="full-height card container" id="Finalized">
                <h4>Finalized List</h4>
                <simple-table
                              :data="data" :fields="fields1" ref="table">
                    <template #actions="{rowData}">
                        <div class="btn-group-tight">
                            <edit-btn text="Winner" icon="fa fa-star" color="success" v-if="rowData.is_winner"/>
                        </div>
                    </template>
                </simple-table>
            </div>

            <div class="card container mb-3"
                 v-if="details && (details.status==='Published' || details.status==='Closed' || details.status==='Cancelled' || details.status==='Finalized') && currentUser.features.issue_tender">
                <div class="row">
                    <div class="col">
                        <span class="h4 pt-1">{{ details.name }}</span>
                        <span v-if="details.status==='Published'"
                              class="status card bg-success">Published</span>
                        <span v-if="details.status==='Cancelled'"
                              class="status card bg-danger">Cancelled</span>
                        <span v-if="details.status==='Closed'" class="status card bg-warning">Closed</span>
                        <span v-if="details.status==='Finalized'" class="status card bg-success">Finalized</span>
                    </div>
                </div>
                <BidView :json="initial_json" :variable-json="variablesJson" id="bidView"
                         :title="details.name + ' # ' + details.id"/>
            </div>
        </div>
        <div v-if="!currentUser.features.view_tender" class="card text-center bg-primary">
            Sorry, You don't have permission to view this page. Kindly contact your Owner.
        </div>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import BidView from '@/component/Bidder/PrintBidView';
import OneBid from '@/data/Samples/OneBid';

export default {
    name       : 'PrintTenderDetailsPage',
    components : { BidView },
    data () {
        const now = new Date();
        const month = now.getMonth() + 1;
        const minDate = now.getFullYear() + '-' + month + '-' + now.getDate();
        return {
            show               : false,
            showPrint          : true,
            loading            : false,
            permission         : true,
            id                 : this.$route.params.id,
            tender_id          : this.$route.params.id,
            min                : minDate,
            initial_json       : null,
            bidder_id          : '',
            details            : [],
            data               : [],
            bidderOptions      : [],
            bidderList         : urls.Consumer.Tender.bidderList,
            bidderResponseList : urls.Consumer.Tender.bidderResponseList,
            fields             : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'user',
                    sortField : 'user',
                    title     : 'Bidder'
                },
                {
                    name      : 'company',
                    sortField : 'company',
                    title     : 'Company'
                },
                {
                    name      : 'contact_number',
                    sortField : 'contact_number',
                    title     : 'Phone'
                },
                {
                    name      : 'contact_e_mail_id',
                    sortField : 'contact_e_mail_id',
                    title     : 'E-Mail'
                },
                {
                    name      : 'status',
                    sortField : 'status',
                    title     : 'Status'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            fields1 : [
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
            variablesJson : JSON.stringify(OneBid)
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    beforeMount () {
        this.loadDetails();
    },
    watch : {
        data () {
            setTimeout(this.printScreen, 1000);
        }
    },
    methods : {
        async loadDetails () {
            const that = this;
            that.loading = true;
            const response = await axios.form(urls.Consumer.Tender.details, { tender_id : that.tender_id });
            const json = response.data;
            if (json.error === false) {
                that.loadData();
                that.details = json.tender;
                that.initial_json = JSON.stringify(json.tender.json);
                that.loading = false;
            } else if (response.data.permission === false) {
                that.loading = false;
                that.permission = false;
            } else if (json.error === true) {
                that.permission = json.permission;
                that.loading = false;
            }
            const status = that.details.status;
            if (status === 'Cancelled' || status === 'Published') {
                that.show = true;
            }
            that.setEdit(that.details);
        },
        async loadData () {
            const that = this;
            that.loading = true;
            const response = await axios.form(urls.Consumer.Tender.FinalizedBiddersList, { tender_id : that.tender_id });
            const json = response.data;
            if (json.error === false) {
                if (json['boq-table']) {
                    that.data = json['boq-table'];
                } else if (json['sot-table']) {
                    that.data = json['sot-table'];
                } else if (json['msp-mnt-table']) {
                    that.data = json['msp-mnt-table'];
                } else if (json['boq-wo-qty-table']) {
                    that.data = json['boq-wo-qty-table'];
                }
                that.loading = false;
                that.loading = false;
            }
        },
        printScreen () {
            window.print();
        },
        disabledBeforeTodayAndAfterAWeek (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return date < tomorrow;
        },
        setEdit (details) {
            this.editingItem.id = details.id;
            this.editingItem.name = details.name;
            this.editingItem.tender_number = details.tender_number;
        }
    }
}
;
</script>

<style scoped>
.text-small {
    font-weight: 500;
}

.form-control {
    border-radius: 5px;
}

.status {
    font-size: 8px;
    padding: .4rem;
    margin-left: 1rem;
    vertical-align: super;
}
</style>
