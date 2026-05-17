<template>
    <tabs class="card bs-5 m-4">
        <tab title="User Acquisition Report">
            <vue-table-card :show-search-box="false" title="" :fields="fields" :url="listUrl"
                            :per-page="10"
                            ref="table" :extra-params="{from_year, to_year}">
                <template #buttons>
                    <div class="btn-group">
                        <drop-btn text="Filters" ref="dropDown" icon="fa fa-filter" size="sm" dropdown-width="35r">
                            <i @click="$refs.dropDown.onClickedOutside()" class="fa fa-close pr-3 pt-3 fl-eqh-r"/>
                            <div class="row p-3">
                                <div class="col">
                                    <validated-vue-select :options="fromYearOptions" name="From Year" label="From Year"
                                                          v-model="from_year"/>
                                    <validated-vue-select :options="toYearOptions" name="To Year" label="To Year"
                                                          v-model="to_year"/>
                                </div>
                            </div>
                        </drop-btn>
                        <btn :loading="loading" loading-text="Downloading..." color="success" size="sm"
                             @click="ReportDownload" text="Download"/>

                    </div>
                </template>
            </vue-table-card>
        </tab>
        <tab title="Company Statistics">
            <statistics title="Company"/>
        </tab>
        <tab title="Users Statistics">
            <statistics title="Users"/>
        </tab>
        <tab title="Tenders Statistics">
            <statistics title="Tenders"/>
        </tab>
        <tab title="Bids Statistics">
            <statistics title="Bids"/>
        </tab>
    </tabs>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import Statistics from './UserAcquisitionCharts/Statistics';

export default {
    name       : 'UserAcquisitionReports',
    components : { Statistics },
    data () {
        return {
            current_year    : new Date().getFullYear(),
            fromYearOptions : [],
            toYearOptions   : [],
            loading         : false,
            from_year       : null,
            to_year         : null,
            listUrl         : urls.Admin.Reports.userAcquisitionList,
            fields          : [
                {
                    name  : 'sl_no',
                    title : 'Sl No'
                },
                {
                    name  : 'month_name',
                    title : 'Month'
                },
                {
                    name  : 'company_count',
                    title : 'No. of Company'
                },
                {
                    name  : 'user_count',
                    title : 'Users'
                },
                {
                    name  : 'tender_count',
                    title : 'Tenders'
                },
                {
                    name  : 'bid_count',
                    title : 'Bids'
                }
            ]
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    watch : {
        from_year : {
            handler () {
                this.setToYearOptions();
            }
        }
    },
    beforeMount () {
        this.setYearOptions();
    },
    methods : {
        setToYearOptions () {
            this.to_year = '';
            if (this.from_year === this.current_year) {
                this.toYearOptions = [{ label : this.current_year, value : this.current_year }];
            } else {
                const options = [];
                if (this.from_year === '' || this.from_year === null) {
                    this.from_year = 2000;
                }
                for (let i = this.current_year; i >= this.from_year + 1; i--) {
                    options.unshift({ label : i, value : i });
                }
                this.toYearOptions = options;
            }
        },
        setYearOptions () {
            const options = [];
            for (let i = this.current_year; i >= 2000; i--) {
                options.unshift({ label : i, value : i });
            }
            this.fromYearOptions = this.toYearOptions = options;
        },
        ReportDownload () {
            this.loading = true;
            const component = this;
            if (component.from_year === null) {
                component.from_year = '';
            }
            if (component.to_year === null) {
                component.to_year = '';
            }
            axios.get(urls.Admin.Reports.userAcquisitionListDownload, {
                params : {
                    from_year : component.from_year,
                    to_year   : component.to_year
                }
            }).then(function (data) {
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
