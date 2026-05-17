<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="details && !loading && permission" class="card container bs-5">
            <div class="row">
                <div class="col text-left mb-3">
                    <h4>Bid Details</h4>
                </div>
                <div class="col text-right mb-3">
                    <btn type="button" color="warning" size="xs" @click="printScreen()" text="Print"/>
                    <btn type="button" class="ml-2" color="primary" size="xs"
                         @click="$router.go(-1)" text="Back"/>
                </div>
            </div>
            <Canvas class="" :json="initial_json" :variable-json="variablesJson"
                    :title="details.name + ' # ' + details.id"/>
        </div>
        <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '@/data/urls';
import Canvas from '@/component/Bidder/BidView';

export default {
    name       : 'BidderDetailsPage',
    components : { Canvas },
    data () {
        return {
            id            : this.$route.params.id,
            loading       : false,
            permission    : true,
            initial_json  : null,
            tender_id     : '',
            details       : [],
            variablesJson : ''
        };
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        printScreen () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.Print, { bid_id : that.id }).then(function (response) {
                const json = response.data;
                if (json.url) {
                    that.$notify('Pdf generated successfully', 'Success', {
                        type : 'success'
                    });
                    window.open(json.url);
                    that.loading = false;
                } else {
                    that.$notify('Pdf generation failed', 'Error', {
                        type : 'danger'
                    });
                    that.loading = false;
                }
                that.loading = false;
            });
            that.loading = false;
        },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.MyBid.tender_bid_details, { bid_id : that.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json.bid;
                    that.variablesJson = JSON.stringify(json.bid.json);
                    that.initial_json = JSON.stringify(json.tender.data.tender_json);
                    that.initial_json = JSON.stringify(json.tender.data.tender_json);
                    that.tender_id = JSON.stringify(json.tender.data.tender_id);
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
