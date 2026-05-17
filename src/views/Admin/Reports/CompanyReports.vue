<template>
    <div class="card bs-5 m-4">
        <vue-table-card :show-search-box="false" title="Company Reports" :fields="fields" :url="listUrl" :per-page="10"
                        ref="table"
                        :extra-params="{ country, state, district, vendor_category, services_provided, industry }">
            <template #buttons>
                <div class="btn-group">
                    <custom-drop-btn text="Filters" ref="dropDown" icon="fa fa-filter" size="sm" dropdown-width="40r">
                        <i @click="$refs.dropDown.onClickedOutside()" class="fa fa-close pr-3 pt-3 fl-eqh-r"/>
                        <div class="row p-3">
                            <validated-ajax-vue-select name="Country" :url="countryOptions"
                                                       @input="loadStateOptions1(country)" label="Country"
                                                       v-model="country" class="col-6"/>
                            <validated-vue-select name="State" :options="stateOptions"
                                                  @input="loadDistrictOptions1(state)"
                                                  label="State" v-model="state" class="col-6"/>
                            <validated-vue-select name="District" :options="districtOptions"
                                                  @input="checkIfNullValue(district)" label="District"
                                                  v-model="district" class="col-6"/>
                            <validated-ajax-vue-select name="Vendor Category" :url="vendorCategoryOptions"
                                                       label="Vendor Category" class="col-6"
                                                       v-model="vendor_category"/>
                            <validated-ajax-vue-select name="Services Provided" :url="servicesOptions"
                                                       label="Services Provided" v-model="services_provided"
                                                       class="col-6"/>
                            <validated-ajax-vue-select name="Industry" :url="industryOptions" label="Industry"
                                                       v-model="industry"
                                                       class="col-6"/>
                        </div>

                    </custom-drop-btn>
                    <btn :loading="loading" loading-text="Downloading..." color="success" size="sm"
                         @click="ReportDownload" text="Download"/>
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
    name : 'CompanyReports',
    data () {
        return {
            role                  : '',
            loading               : false,
            vendor_category       : '',
            country               : '',
            state                 : '',
            district              : '',
            services_provided     : '',
            industry              : '',
            industryOptions       : urls.Admin.Company.industryOptions,
            servicesOptions       : urls.Admin.Company.servicesOptions,
            listUrl               : urls.Admin.Reports.companyList,
            roleOptions           : urls.Admin.User.reportRoleOptions,
            vendorCategoryOptions : urls.Admin.Company.vendorCategoryOptions,
            districtOptions       : [],
            stateOptions          : [],
            countryOptions        : urls.Admin.MasterData.State.countryOptions,
            fields                : [
                {
                    name  : 'id',
                    title : 'ID'
                },
                {
                    name  : 'company_name',
                    title : 'Name Of Company'
                },
                {
                    name  : 'created_date',
                    title : 'Created Date'
                },
                {
                    name  : 'number_of_users',
                    title : 'Users'
                },
                {
                    name  : 'status',
                    title : 'Status'
                }
            ]
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    methods : {
        loadStateOptions1 (item) {
            if (this.country === null) {
                this.country = '';
            }
            this.state = '';
            this.district = '';
            this.stateOptions = [];
            this.districtOptions = [];
            const that = this;
            axios.form(urls.Admin.Company.stateOptions, { country : item }).then(function (response) {
                const json = response.data;
                that.stateOptions = json.data;
                that.districtOptions = [];
            });
        },
        loadDistrictOptions1 (item) {
            this.districtOptions = [];
            if (this.state === null) {
                this.state = '';
            }
            this.district = '';
            const that = this;
            axios.form(urls.Admin.Company.districtOption, { state : item }).then(function (response) {
                const json = response.data;
                that.districtOptions = json.data;
            });
        },
        loadStateOptions (item) {
            if (this.$refs.addForm.getModelValue('country') === null) {
                this.$refs.addForm.setModelValue('country', '');
            }
            this.$refs.addForm.setModelValue('state', '');
            this.$refs.addForm.setModelValue('district', '');
            this.stateOptions = [];
            this.districtOptions = [];
            const that = this;
            axios.form(urls.Admin.Company.stateOptions, { country : item }).then(function (response) {
                const json = response.data;
                that.stateOptions = json.data;
                that.districtOptions = [];
            });
        },
        loadDistrictOptions (item) {
            if (this.$refs.addForm.getModelValue('state') === null) {
                this.$refs.addForm.setModelValue('state', '');
            }
            this.districtOptions = [];
            this.$refs.addForm.setModelValue('district', '');
            const that = this;
            axios.form(urls.Admin.Company.districtOption, { state : item }).then(function (response) {
                const json = response.data;
                that.districtOptions = json.data;
            });
        },
        checkIfNullValue (item) {
            if (this.$refs.addForm.getModelValue('district') === null) {
                this.$refs.addForm.setModelValue('district', '');
            }
        },
        ReportDownload () {
            this.loading = true;
            if (this.role === null) {
                this.role = '';
            }
            const component = this;
            axios.form(urls.Admin.Reports.companyListDownload,
                {
                    vendor_category   : this.vendor_category,
                    services_provided : this.services_provided,
                    industry          : this.industry,
                    country           : this.country,
                    state             : this.state,
                    district          : this.district
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
