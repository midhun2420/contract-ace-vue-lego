<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading && permission" class="container card bs-5">
            <!--            Bid Preview          -->
            <div class="row">
                <div class="col text-left mb-3">
                    <h4>Bid Preview</h4>
                </div>
                <div class="col text-right mb-3">
                    <btn
    v-if="canPrintTender"
    color="secondary"
    class="mr-2"
    size="sm"
    @click="printBid"
    text="Print"
/>
                    <btn type="button" color="primary" size="sm"
                         @click="$router.push('/app/my-bid/')" text="Back"/>
                </div>
            </div>
            <div v-if="details && initial_json!=='' && currentUser.features.my_bids_views_and_update">
                <BidView class="mb-3"
                         :json="initial_json" :variable-json="variablesJson"
                         :title="details.name + ' # ' + details.id"/>
            </div>
        </div>
        <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import BidView from '@/component/Bidder/BidView';

export default {
    name       : 'BidPreview',
    components : { BidView },
    data () {
        return {
            loading       : false,
            permission    : true,
            id            : this.$route.params.id,
            bid_id        : this.$route.params.id,
            details       : [],
            show          : false,
            initial_json  : null,
            variablesJson : ''
        };
    },
    computed : {
        ...mapGetters(['currentUser']),

        canPrintTender () {
            const pkg = this.currentUser.packages || {};
            return (
                this.currentUser.role === 'owner' &&
            (pkg.printing_tenders === true || pkg.printing_tenders === 'true')
            );
        }
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.MyBid.details, { bid_id : that.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json.bid;
                    that.initial_json = JSON.stringify(json.tender.data.tender_json);
                    that.variablesJson = JSON.stringify(json.bid.json);
                    that.loading = false;
                } else if (json.permission === false) {
                    that.permission = json.permission;
                    that.loading = false;
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
                }
                const status = that.details.status;
                if (status === 'Rejected' || status === 'Submitted') {
                    that.show = true;
                }
            });
        },
        printBid () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.MyBid.Print, { bid_id : that.id }).then(function (response) {
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
