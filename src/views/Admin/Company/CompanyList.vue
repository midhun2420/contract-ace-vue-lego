<template>
    <div class="card bs-5">
        <vue-table-card title="Company" :fields="fields" :url="listUrl" :per-page="10" ref="table"
                        :extra-params="{ vendor_category, country, state, district }">
            <template #buttons>
                <div class="btn-group">
                    <drop-btn text="Filters" ref="dropDown" icon="fa fa-filter" size="sm" dropdown-width="35r">
                        <i @click="$refs.dropDown.onClickedOutside()" class="fa fa-close pr-3 pt-3 fl-eqh-r"/>
                        <div class="row p-3">
                            <div class="col">
                                <validated-ajax-vue-select name="Country" :url="countryOptions"
                                                           @input="loadStateOptions1(country)" label="Country"
                                                           v-model="country"/>
                                <validated-vue-select name="District" :options="districtOptions"
                                                      @input="checkIfNullValue(district)" label="District"
                                                      v-model="district"/>
                            </div>
                            <div class="col">
                                <validated-vue-select name="State" :options="stateOptions"
                                                      @input="loadDistrictOptions1(state)"
                                                      label="State" v-model="state"/>
                                <validated-ajax-vue-select name="Vendor Category" :url="vendorCategoryOptions"
                                                           label="Vendor Category"
                                                           v-model="vendor_category"/>
                            </div>
                        </div>
                    </drop-btn>
                    <btn color="success" icon="fa fa-plus" size="sm" @click="$refs.addModal.show()" text="Add"/>
                </div>
            </template>

            <template #actions="{rowData}">
                <div class="btn-group-tight">
                    <delete-btn size="xs" @click="setDelete(rowData)"/>
                    <btn color="primary" size="xs" @click="viewDetails(rowData)" text="View"/>

                    <btn color="success" v-if="!rowData.is_suspended" size="xs" @click="suspendUser(rowData)"
                         text="Suspend"/>

                    <btn color="info" v-if="rowData.is_suspended" size="xs" @click="suspendUser(rowData)"
                         text="Retrieve"/>
                </div>
            </template>

            <template #footer>
                <modal title="Add Company" ref="addModal" width="70r" header-color="primary" no-close-on-backdrop>
                    <b-form :save-url="addUrl" ref="addForm" @success="formSuccess" v-slot="{model, loading}"
                            :save-params="{agreed_to_terms_and_conditions:false}">
                        <div class="row mb-2">
                            <div class="col-md-4">
                                <validated-input name="Name" :rules="rules.company_name" label="Name"
                                                 :disabled="loading"
                                                 v-model="model.company_name"/>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="Registration Number" :rules="rules.company_registration_no"
                                                 label="Registration Number"
                                                 :disabled="loading"
                                                 v-model="model.company_registration_no"/>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="Contact Number" :rules="rules.contact_number" type="number"
                                                 label="Contact Number" :disabled="loading"
                                                 v-model="model.contact_number"/>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4">
                                <validated-input name="E-Mail" :rules="rules.contact_e_mail_id" type="email"
                                                 label="E-Mail" :disabled="loading"
                                                 v-model="model.contact_e_mail_id"/>
                            </div>
                            <div class="col-md-4">
                                <validated-file-input label="Company Logo" name="Company Logo" v-model="model.company_logo"
                                                      :disabled="loading"/>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="Order" :rules="{required:false}" type="number"
                                                 label="Order" :disabled="loading"
                                                 v-model="model.order"/>
                            </div>
                            <div class="col-md-4">
                                <validated-ajax-vue-select name="Vendor Category" multiple :url="vendorCategoryOptions"
                                                           :rules="rules.category" label="Vendor Category"
                                                           v-model="model.category"/>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="Value of the Biggest Project"
                                                 :rules="rules.value_of_biggest_project"
                                                 label="Value of the Biggest Project"
                                                 v-model="model.value_of_biggest_project"/>
                            </div>
                            <div class="col-md-4">
    <validated-ajax-vue-select
        name="Packages"
        multiple
        :url="packageOptions"
        :rules="rules.packages"
        label="Packages"
        v-model="model.package"/>
</div>
                        </div>
                        <h6 class="font-weight-bold">Geographical Area of Operation</h6>
                        <div class="row mb-2">
                            <div class="col-md-4">
                                <validated-ajax-vue-select name="Country" :url="countryOptions"
                                                           @input="loadStateOptions"
                                                           :rules="rules.country" label="Country"
                                                           v-model="model.country"/>
                            </div>
                            <div class="col-md-4">
                                <validated-vue-select name="State" :options="stateOptions" @input="loadDistrictOptions"
                                                      :rules="rules.state"
                                                      label="State"
                                                      v-model="model.state"/>
                            </div>
                            <div class="col-md-4">
                                <validated-vue-select name="District" multiple :options="districtOptions"
                                                      :rules="rules.district" label="District" @input="checkIfNullValue"
                                                      v-model="model.district"/>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4">
                                <validated-ajax-vue-select name="Industry" :url="industryOptions"
                                                           :rules="rules.industry" label="Industry"
                                                           v-model="model.industry"/>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="Contact Person" :rules="rules.contact_person"
                                                 label="Contact Person"
                                                 :disabled="loading"
                                                 v-model="model.contact_person"/>
                            </div>
                            <div class="col-md-4">
                                <validated-ajax-vue-select name="Services Provided" :url="servicesOptions" multiple
                                                           :rules="rules.services_provided" label="Services Provided"
                                                           v-model="model.services_provided"/>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4">
                                <validated-input name="Average Annual Turnover In Last Year"
                                                 :rules="rules.average_annual_turnover_in_last_year"
                                                 label="Average Annual Turnover In Last Year"
                                                 :disabled="loading" type="number"
                                                 v-model="model.average_annual_turnover_in_last_year"/>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="Average Annual Turnover In Last 2 Years"
                                                 :rules="rules.average_annual_turnover_in_last_two_years"
                                                 label="Average Annual Turnover In Last 2 Years"
                                                 :disabled="loading" type="number"
                                                 v-model="model.average_annual_turnover_in_last_two_years"/>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="Average Annual Turnover In Last 3 Years"
                                                 :rules="rules.average_annual_turnover_in_last_three_years"
                                                 label="Average Annual Turnover In Last 3 Years"
                                                 :disabled="loading" type="number"
                                                 v-model="model.average_annual_turnover_in_last_three_years"/>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col">
                                <label>Other Details 1</label>
                                <textarea-input name="Other Details 1" v-model="model.other_details_1"/>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col">
                                <label>Other Details 2</label>
                                <textarea-input name="Other Details 2" v-model="model.other_details_2"/>
                            </div>
                        </div>
                        <save-btn text="Add Company" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Saving...</span></span>
                        </save-btn>
                    </b-form>
                </modal>
                <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                    <p>You are about to delete the company <b v-html="deletingItem && deletingItem.name"></b>. Are you
                        sure
                        ?</p>

                    <template #loading>
                        <loading-animation/>
                        Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
                    </template>
                </delete-modal>
            </template>

        </vue-table-card>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name : 'Company',
    data () {
        return {
            showAddForm     : false,
            vendor_category : '',
            country         : '',
            state           : '',
            district        : '',

            industryOptions       : urls.Admin.Company.industryOptions,
            vendorCategoryOptions : urls.Admin.Company.vendorCategoryOptions,
            servicesOptions       : urls.Admin.Company.servicesOptions,
            packageOptions        : urls.Admin.MasterData.Package.packageOptions,
            districtOptions       : [],
            stateOptions          : [],
            countryOptions        : urls.Admin.MasterData.State.countryOptions,

            listUrl   : urls.Admin.Company.list,
            addUrl    : urls.Admin.Company.addEdit,
            deleteUrl : urls.Admin.Company.delete,

            editingItem  : null,
            deletingItem : null,
            fields       : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'company_name',
                    sortField : 'company_name',
                    title     : 'Company Name'
                },
                {
                    name      : 'company_registration_no',
                    sortField : 'company_registration_no',
                    title     : 'Registration Number'
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
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            rules : {
                contact_person : {
                    required : false
                },
                company_name : {
                    required : true
                },
                value_of_biggest_project : {
                    required : false
                },
                company_registration_no : {
                    required : false
                },
                contact_number : {
                    required : false
                },
                contact_e_mail_id : {
                    required : false
                },
                industry : {
                    required : false
                },
                services_provided : {
                    required : false
                },
                average_annual_turnover_in_last_year : {
                    required : false
                },
                average_annual_turnover_in_last_two_years : {
                    required : false
                },
                average_annual_turnover_in_last_three_years : {
                    required : false
                },
                category : {
                    required : false
                }
            }
        };
    },
    methods : {
        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            refs.table.refreshTable();

            this.editingItem = null;
        },
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
        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },
        viewDetails (rowData) {
            this.$router.push('/app/company/' + rowData.id + '/details/');
        },
        suspendUser (item) {
            const that = this;
            axios.form(urls.Admin.Company.suspend, { company : item.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.suspendSuccess(json);
                } else {
                    that.suspendFailure(json);
                }
            });
        },
        suspendSuccess () {
            this.$refs.table.refreshTable();
        },
        suspendFailure () {
            this.$refs.table.refreshTable();
        },
        deleteComplete (response) {
            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
        }
    }
};
</script>

<style scoped>

</style>
