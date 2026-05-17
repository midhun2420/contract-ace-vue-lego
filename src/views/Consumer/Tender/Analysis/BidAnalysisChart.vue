<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading"  class="card">
            <div class="p-4">
                <div v-if="tender" class="row mb-3">
                    <div class="col"><b>Project Name</b> : {{tender.name_of_project}}</div>
                </div>
                <div v-if="tender" class="row mb-3">
                    <div class="col"><b>Client Name</b> : {{ tender.name_of_client }}</div>
                    <div class="col"><b>Date Of Report</b> : {{ tender.date_of_report }}</div>
                </div>
                <div class="small">
                    <line-chart :width="1000" :height="500" :data="data"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '@/data/urls';
import LineChart from '../../../../component/ChartComponents/LineChart';

export default {
    name       : 'BidderAnalysisChartPage',
    components : { LineChart },
    props      : { tender_id : { type : String } },
    data () {
        return {
            id         : this.$route.params.id,
            permission : true,
            loading    : false,
            data       : {
                label    : '',
                datasets : ''
            },
            tender : null
        };
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.ChartAnalysisView, { tender_id : that.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    if (json['combined-chart']) {
                        that.data.label = json['combined-chart'].label;
                        that.data.datasets = json['combined-chart'].datasets;
                    } else if (json['boq-table']) {
                        that.data.label = json['boq-table'].label;
                        that.data.datasets = json['boq-table'].datasets;
                    } else if (json['boq-wo-qty-table']) {
                        that.data.label = json['boq-wo-qty-table'].label;
                        that.data.datasets = json['boq-wo-qty-table'].datasets;
                    } else if (json['sot-table']) {
                        that.data.label = json['sot-table'].label;
                        that.data.datasets = json['sot-table'].datasets;
                    } else if (json['msp-mnt-table']) {
                        that.data.label = json['msp-mnt-table'].label;
                        that.data.datasets = json['msp-mnt-table'].datasets;
                    } else if (json['import-excel-table']) {
                        that.data.label = json['import-excel-table'].label;
                        that.data.datasets = json['import-excel-table'].datasets;
                    }
                    that.tender = json.tender;
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
</style>
