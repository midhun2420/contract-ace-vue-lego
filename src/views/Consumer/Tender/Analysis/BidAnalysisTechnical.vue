<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading" class="card">
            <div class="p-4">
                <div v-if="tender" class="row mb-3">
                    <div class="col"><b>Project Name</b> : {{ tender.project }}</div>
                </div>
                <div v-if="tender" class="row mb-3">
                    <div class="col"><b>Tender Status</b> : {{ tender.status }}</div>
                    <div class="col"><b>Date Of Report</b> : {{ tender.date_of_report }}</div>
                    <div class="col"><b>Client Name</b> : {{ tender.client }}</div>
                </div>
                <perfect-scrollbar>
                    <table id="role" class="table table-bordered" ref="table">
                        <thead>
                        <tr>
                            <td class="font-weight-bold">Sr No.</td>
                            <td class="font-weight-bold">Description</td>
                            <td class="font-weight-bold" v-for="(record) in  contractors" v-bind:key="record.id">
                                <pre>Contractor - {{ record.id }}</pre>
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Name of Contractor</td>
                            <td v-for="(record) in  contractors" v-bind:key="record.id">
                                <pre>{{ record.name_of_contractor }}</pre>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Total Price</td>
                            <td v-for="(record) in  contractors" v-bind:key="record.id">
    <pre>{{ (grandTotals.find(g => g.id === record.id) || {}).total_price || record.total_price }}</pre>
</td>
                        </tr>
<!--                        <tr>-->
<!--                            <td>3</td>-->
<!--                            <td>Location of Office</td>-->
<!--                            <td v-for="(record) in  contractors" v-bind:key="record.id"><pre>{{-->
<!--                                    record.location_of_office-->
<!--                                }}</pre>-->
<!--                            </td>-->
<!--                        </tr>-->
                        <tr>
                            <td>3</td>
                            <td :colspan="(contractors.length + 1)">Turnover for the last three yearsr</td>
                        </tr>
                        <tr>
                            <td class="text-right">a</td>
                            <td>Year-1</td>
                            <td v-for="(record) in  contractors" v-bind:key="record.id">
                                <pre>{{ record.year_1 }}</pre>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-right">b</td>
                            <td>Year-2</td>
                            <td v-for="(record) in  contractors" v-bind:key="record.id">
                                <pre>{{ record.year_2 }}</pre>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-right">c</td>
                            <td>Year-3</td>
                            <td v-for="(record) in  contractors" v-bind:key="record.id">
                                <pre>{{ record.year_3 }}</pre>
                            </td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Value of Biggest Project</td>
                            <td v-for="(record) in  contractors" v-bind:key="record.id"><pre>{{
                                    record.value_of_biggest_project
                                }}</pre>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </perfect-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '@/data/urls';

export default {
    name  : 'BidderAnalysisTechnicalPage',
    props : { tender_id : { type : String } },
    data () {
        return {
            permission  : true,
            loading     : false,
            contractors : [],
            tender      : null,
            grandTotals : []
        };
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.TechnicalAnalysisView, { tender_id : that.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    // that.contractors = json.boq_bids;
                    if (json.boq_bids) {
                        that.contractors = json.boq_bids;
                    } else if (json.boq_qty_bids) {
                        that.contractors = json.boq_qty_bids;
                    } else if (json.sot_bids) {
                        that.contractors = json.sot_bids;
                    } else if (json.msp_bids) {
                        that.contractors = json.msp_bids;
                    } else if (json.import_excel_bids) {
                        that.contractors = json.import_excel_bids;
                    }

                    that.tender = json.Tender;
                    that.grandTotals = json.grand_total_bids || [];
                    that.loading = false;
                } else if (json.permission === false) {
                    that.permission = json.permission;
                    that.loading = false;
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
                }
            });
        }
    }
};
</script>

<style scoped>
.text-small {
    font-weight: 500;
}

.form-control {
    border-radius: 5px;
}

pre {
    font-family: Montserrat, sans-serif;
}
</style>
