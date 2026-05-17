<template>
    <div class="card bs-5 m-4">
        <check-permission/>
        <vue-table-card :show-search-box="false" title="Tender Reports" :fields="fields" :url="listUrl" :per-page="10"
                        ref="table" :extra-params="{ status }">
            <template #buttons>
                <div class="btn-group">
                    <custom-drop-btn text="Filters" ref="dropDown" icon="fa fa-filter" size="sm" dropdown-width="30r">
                        <i @click="$refs.dropDown.onClickedOutside()" class="fa fa-close pr-3 pt-3 fl-eqh-r"/>
                        <div class="p-3">
                            <validated-vue-select name="Status" :options="statusOptions"
                                                  label="Status"
                                                  v-model="status"/>
                        </div>

                    </custom-drop-btn>
                    <btn v-if="currentUser.features.is_export" color="success" size="sm" @click="ReportDownload"
                         text="Download">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Downloading...</span></span>
                    </btn>
                </div>
            </template>
            <template #actions="{rowData}">
                <div class="btn-group-tight">
                    <btn v-if="currentUser.features.is_export" color="success" size="xs"
                         @click="ReportDownload1(rowData.id)" text="Download Tender Details">
                    </btn>
                </div>
            </template>
        </vue-table-card>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';

export default {
    name : 'ConsumerTenderReports',
    data () {
        return {
            loading  : false,
            loading1 : false,
            status   : '',
            listUrl  : urls.Consumer.Reports.tenderList,
            fields   : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'name',
                    sortField : 'name',
                    title     : 'Name'
                },
                {
                    name      : 'tender_number',
                    sortField : 'tender_number',
                    title     : 'Tender Number'
                },
                {
                    name      : 'created_date',
                    sortField : 'created_date',
                    title     : 'Created Date'
                },
                {
                    name      : 'issued_count',
                    sortField : 'issued_count',
                    title     : 'Issued Count'
                },
                {
                    name      : 'bids_submitted',
                    sortField : 'bids_submitted',
                    title     : 'Bids Submitted'
                },
                {
                    name      : 'status',
                    sortField : 'status',
                    title     : 'Status'
                },
                {
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            statusOptions : [
                { label : 'Created', value : 'Created' },
                { label : 'Saved', value : 'Saved' },
                { label : 'Published', value : 'Published' },
                { label : 'Closed', value : 'Closed' },
                { label : 'Cancelled', value : 'Cancelled' },
                { label : 'Submitted', value : 'Submitted' },
                { label : 'Finalized', value : 'Finalized' }
            ]
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    methods : {
        ReportDownload () {
            if (this.status === null) {
                this.status = '';
            }
            this.loading = true;
            const component = this;
            axios.form(urls.Consumer.Reports.tenderSummaryDownload, { status : component.status }).then(function (data) {
                const json = data.data;
                if (json.url) {
                    component.$notify('Download Success', 'Success', {
                        type : 'success'
                    });
                    window.open(json.url);
                    component.loading = false;
                } else if (json.error === true) {
                    component.$notify('No data available', 'Success', {
                        type : 'success'
                    });
                }
                component.loading = false;
            });
        },
        ReportDownload1 (rowData) {
            this.loading1 = true;
            const component = this;
            axios.form(urls.Consumer.Reports.tenderDetailedDownload, { tender : rowData }).then(function (data) {
                const json = data.data;
                if (json.url) {
                    component.$notify('Download Success', 'Success', {
                        type : 'success'
                    });
                    window.open(json.url);
                    component.loading = false;
                } else if (json.error === true) {
                    component.$notify('No data available', 'Download Failed', {
                        type : 'danger'
                    });
                }
                component.loading = false;
            });
        }
    }
};
</script>

<style scoped>

</style>
