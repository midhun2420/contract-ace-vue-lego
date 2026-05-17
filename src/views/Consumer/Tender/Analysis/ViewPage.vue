<template>
    <div class="container card bs-5">
        <div class="row mb-3">
            <div class="col text-left">
                <h3 style="font-size: 20px;">Bid Analysis</h3>
            </div>
            <div class="col text-right">
                <div class="btn-group">
                    <btn type="button" color="primary" size="xs"
                         @click="$router.go(-1)" text="Back"/>
                    <btn v-if="currentUser.features.is_export" type="button" color="success" size="xs"
                         @click="analysisDownload" text="Excel Download"/>
                </div>
            </div>
        </div>
        <tabs v-if="currentUser.features.my_bids_views_and_update">
            <tab title="Technical">
                <BidderAnalysisTechnicalPage :tender_id="id"/>
            </tab>
            <tab title="Comparison">
                <BidderAnalysisComparisonPage :tender_id="id"/>
            </tab>
            <tab title="Comparison(Amt)">
                <BidAnalysisComparisonAmountPage :tender_id="id"/>
            </tab>
            <tab title="Cumulative">
                <BidderAnalysisCumulativePage :tender_id="id"/>
            </tab>
            <tab title="Chart">
                <BidderAnalysisChartPage :tender_id="id"/>
            </tab>
            <tab title="Finalized Bidders">
                <FinalizedBiddersList :tender_id="id"/>
            </tab>
        </tabs>
        <div v-if="!currentUser.features.my_bids_views_and_update" class="card text-center bg-primary">
            Sorry, You don't have permission to view this page. Kindly contact your Owner.
        </div>
    </div>
</template>

<script>

import BidderAnalysisTechnicalPage from './BidAnalysisTechnical';
import BidderAnalysisComparisonPage from './BidAnalysisComparison';
import BidAnalysisComparisonAmountPage from './BidAnalysisComparisonAmount';
import BidderAnalysisCumulativePage from './BidAnalysisCumulative';
import BidderAnalysisChartPage from './BidAnalysisChart';
import { mapGetters } from 'vuex';
import FinalizedBiddersList from './FinalizedBiddersList';
import axios from 'secure-axios';
import urls from '../../../../data/urls';

export default {
    name       : 'ViewPage',
    components : {
        FinalizedBiddersList,
        BidderAnalysisChartPage,
        BidderAnalysisCumulativePage,
        BidAnalysisComparisonAmountPage,
        BidderAnalysisComparisonPage,
        BidderAnalysisTechnicalPage
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    data () {
        return {
            id : this.$route.params.id
        };
    },
    methods : {
        analysisDownload () {
            this.loading = true;
            const component = this;
            axios.form(urls.Consumer.Tender.DownloadAnalysis, { tender_id : component.id }).then(function (data) {
                const json = data.data;
                component.$notify('Download Success', 'Success', {
                    type : 'success'
                });
                if (json.boq_url) {
                    // window.open('http://localhost:8000' + json.boq_url);
                    window.open(json.boq_url);
                    component.loading = false;
                    component.details = json.boq_url;
                } else if (json.boq_qty_url) {
                    // window.open('http://localhost:8000' + json.boq_qty_url);
                    window.open(json.boq_qty_url);
                    component.loading = false;
                    component.details = json.boq_qty_url;
                } else if (json.sot_url) {
                    // window.open('http://localhost:8000' + json.sot_url);
                    window.open(json.sot_url);
                    component.loading = false;
                    component.details = json.sot_url;
                } else if (json.msp_url) {
                    // window.open('http://localhost:8000' + json.msp_url);
                    window.open(json.msp_url);
                    component.loading = false;
                    component.details = json.msp_url;
                } else if (json.import_url) {
                    // window.open('http://localhost:8000' + json.msp_url);
                    window.open(json.import_url);
                    component.loading = false;
                    component.details = json.import_url;
                } else if (json.report_url) {
                    // window.open('http://localhost:8000' + json.msp_url);
                    window.open(json.report_url);
                    component.loading = false;
                    component.details = json.report_url;
                }
                component.loading = false;
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
</style>
<style>
.ps__rail-x, .ps__rail-y {
      opacity: 1 !important;
    }
</style>
