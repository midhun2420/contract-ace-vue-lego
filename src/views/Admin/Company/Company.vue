<template>

    <div class="card">
        <div class="">
            <div>
                <div class="col-12">
                    <div class="row">
                        <div class="col-lg-6">
                            <div>
                                <h3 class=" fs-6 mb-4 ml-1 mt-2">Company</h3>
                            </div>
                        </div>
                        <div class="col-lg-6 fl-x-br fl-a-s">
                            <btn @click="$refs.addModal.show()" text="Add" color="success" icon="fa fa-plus"
                                 class="px-3"></btn>
                        </div>
                    </div>

                </div>
            </div>
            <div class="p-0">
                <div class="row mt-3">
                    <div class="col-3 pl-4 pr-3 br-1">
                        <div class=" row p-0 ">
                            <div class="col-lg-6  col-7">

                                <p class="txt-clr-custom-2 font-weight-bold">Filters</p>

                            </div>
                            <div class="col-lg-6 col-5 fl-x-br cursor-pointer" @click="clearFilter">
                                <p class=" red font-weight-bold">Clear All</p>

                            </div>
                        </div>
                        <validated-input v-model="search" placeholder="Search by Company Name"/>
                        <validated-ajax-vue-select name="Industry" :url="industryOptions" label="Industry"
                                                   v-model="industry" class="c-input-select"/>
                        <validated-ajax-vue-select
                        label="Product Catalogue"
                        :url="productOptions"
                        v-model="product"
                        class="c-input-select"
                        @option:selected="onOptionSelected"
                        />
                        <validated-ajax-vue-select name="Vendor Category" :url="vendorCategoryOptions"
                                                   label="Vendor Category" class="c-input-select"
                                                   v-model="vendor_category"/>
                        <validated-ajax-vue-select name="Services Provided" :url="servicesOptions"
                                                   class="c-input-select"
                                                   label="Services Provided" v-model="services_provided"/>
                        <validated-ajax-vue-select name="Country" :url="countryOptions"
                                                   @input="loadStateOptions1(country)" label="Country"
                                                   v-model="country" class="c-input-select"/>
                        <validated-vue-select name="State" :options="stateOptions"
                                              @input="loadDistrictOptions1(state)"
                                              label="State" v-model="state" class="c-input-select"/>
                        <validated-vue-select name="District" :options="districtOptions"
                                              @input="checkIfNullValue(district)" label="District"
                                              v-model="district" class="c-input-select"/>
                        <btn @click="searchClicked" text="Search" color="primary"
                             icon="fa fa-filter" class="btn-block"/>
                    </div>
                    <div v-if="loading" class="col-10 row text-center">
                        <div class="col p-3 mb-4 mt-7" style="border-radius: 6px;">
                            <loading-animation/>
                            <span style=" vertical-align: super"> Loading details....</span>
                        </div>
                    </div>
                    <div v-if="!loading && details.data.length!==0" class="col-9 row of-h">
                        <div class="row ml-3 mb-3 pt-2 w-100p">

                            <div v-for="(i, index) in details.data" :key="index"
                                 class="col-4   mb-3   cursor-pointer">
                                <div class="m-1 p-3 bs-4 h-100p">
                                    <div class="fl-x-br mt-3">

                                        <btn class="gl fa fa-pencil mr-1" size="xs"
                                             @click="setOrderEdit(i)"
                                             text="Order"/>
                                        <btn @click="setDelete(i)" class="gl fa mr-1" text="Delete" size="xs"></btn>
                                        <btn @click="viewDetails(i)" class="gl mr-1" text="View" size="xs"></btn>
                                        <btn class="gl" v-if="!i.is_suspended" size="xs"
                                             @click="suspendUser(i)" text="Suspend"/>
                                        <btn class="gl" v-if="i.is_suspended" size="xs"
                                             @click="suspendUser(i)" text="Retrieve"/>

                                    </div>

                                    <div class="fl-x-cc mt-5">
                                        <img v-if="i.company_logo" alt="" :src="i.company_logo">
                                        <div v-else class="p-4 b-1"><i class="small">Company Logo</i></div>
                                    </div>
                                    <div>
                                    <p class="text-center mt-4 font-weight-bold fs--1 txt-clr-custom">
                                        {{ i.company_name }}

                                        {{ i.company_registration_no }}
                                    </p>
                                    <div class="fl-x-tl mt-3 mb-0">
                                        <img alt=""
                                             src="../../../assets/images/icons/material-symbols_phone-enabled-sharp.png"
                                             class="mr-2 mt-1">
                                        <p class="ic-text mb-0">{{ i.contact_number }}</p>
                                    </div>
                                    <div class="fl-x-tl mt-0">
                                        <img alt="" src="../../../assets/images/icons/material-symbols_mail-rounded.png"
                                             class="mr-2 mt-1">
                                        <p class="ic-text">{{ i.contact_e_mail_id }}</p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="details.data.length !== 0" class="col-9 mt-4 fl-te-c">
                                <div>
                                    Showing {{ details.from }} to {{ details.to }} of {{ details.total }} entries
                                </div>
                                <div>
                                    <btn class="m-1" size="sm" @click="prevClicked" v-if="prev" type="button"
                                         icon="fa fa-chevron-left"/>
                                    <btn class="m-1" size="sm" disabled v-else type="button" icon="fa fa-chevron-left"/>
                                    <btn class="m-1" size="sm" type="button">{{ details.current_page }}</btn>
                                    <btn class="m-1" size="sm" @click="nextClicked" v-if="next" type="button"
                                         icon="fa fa-chevron-right"/>
                                    <btn class="m-1" size="sm" disabled v-else type="button"
                                         icon="fa fa-chevron-right"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!loading && details.data.length===0" class="col-9 row text-center">
                        <div class="col p-3 mb-4 mt-7" style="border-radius: 6px;">
                            <span style=" vertical-align: super"> No data available</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
                        <validated-file-input name="Logo" label="Logo" :disabled="loading"
                                              v-model="model.company_logo"/>
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
                    <div class="col-md-4">
                        <validated-input name="E-Mail" :rules="rules.contact_e_mail_id" type="email"
                                         label="E-Mail" :disabled="loading"
                                         v-model="model.contact_e_mail_id"/>
                    </div>
                    <div class="col-md-4">
                        <validated-input name="Order" :rules="{required:false}" type="number"
                                         label="Order" :disabled="loading"
                                         v-model="model.order"/>
                    </div>
                </div>
                <div class="row mb-2">
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
        <modal title="Edit Order" ref="editOrderModal" width="30r" header-color="primary" no-close-on-backdrop>
            <b-form :save-url="editOrderUrl" ref="editOrderForm" @success="orderFormSuccess" v-slot="{model, loading}"
                    :initial-data="{id:company_id, order: current_order}">
                <div class="row mb-2">
                    <div class="col">
                        <validated-input name="Order" :rules="{required:true}" label="Order"
                                         :disabled="loading" v-model="model.order"/>
                    </div>
                </div>
                <save-btn icon="" text="Update" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Updating...</span></span>
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
    </div>

</template>

<script>
import urls from '../../../data/urls';
import axios from 'secure-axios';

export default {
    name : 'Company',
    data () {
        return {
            prev     : '',
            next     : '',
            page     : '1',
            per_page : '9',

            company_id    : '',
            current_order : '',
            editOrderUrl  : urls.Admin.Company.orderUpdate,

            details         : '',
            loading         : false,
            showAddForm     : false,
            search          : '',
            vendor_category : '',
            country         : '',
            state           : '',
            district        : '',
            product         : '',
            productName     : '',
            productObject   : null,

            services_provided     : '',
            industry              : '',
            vendorCategoryOptions : urls.Admin.Company.vendorCategoryOptions,
            productOptions        : urls.Consumer.Company.productCatalogueVueSelect,

            industryOptions : urls.Admin.Company.industryOptions,
            servicesOptions : urls.Admin.Company.servicesOptions,
            packageOptions  : urls.Admin.MasterData.Package.packageOptions,
            districtOptions : [],
            stateOptions    : [],
            countryOptions  : urls.Admin.MasterData.State.countryOptions,

            listUrl   : urls.Admin.Company.list,
            addUrl    : urls.Admin.Company.addEdit,
            deleteUrl : urls.Admin.Company.delete,

            editingItem  : null,
            deletingItem : null,
            rules        : {
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
                },
                packages : {
                    required : false
                }
            }
        };
    },
    mounted () {
        this.loadData();
    },
    methods : {
        clearFilter () {
            this.search = '';
            this.vendor_category = '';
            this.services_provided = '';
            this.industry = '';
            this.country = '';
            this.state = '';
            this.district = '';
            this.districtOptions = [];
            this.stateOptions = [];
            this.page = 1;
            this.loadData();
            this.product = '';
            this.productName = '';
            this.productObject = null;
        },
        searchClicked () {
            this.page = 1; // 🔥 RESET PAGE
            this.loadData();
        },
        loadData () {
            const that = this;
            that.loading = true;
            axios.get(this.listUrl, {
                params : {
                    page              : that.page,
                    per_page          : that.per_page,
                    search            : that.search,
                    vendor_category   : that.vendor_category,
                    services_provided : that.services_provided,
                    industry          : that.industry,
                    country           : that.country,
                    state             : that.state,
                    district          : that.district,
                    product           : that.productName
                }
            }).then(function (response) {
                const json = response.data;
                if (json.status === true) {
                    that.details = json;
                    that.loading = false;
                    that.setPagination();
                } else {
                    that.$notify('Could not load the data, Please try again later.', '', {
                        type : 'danger'
                    });
                    that.loading = false;
                }
                that.loading = false;
            });
        },
        setPagination () {
            this.prev = parseInt(this.details.current_page) !== this.details.from;
            this.next = parseInt(this.details.current_page) !== this.details.last_page;
        },
        prevClicked () {
            this.page = parseInt(this.page) - 1;
            this.loadData();
        },
        nextClicked () {
            this.page = parseInt(this.page) + 1;
            this.loadData();
        },
        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            this.loadData();

            this.editingItem = null;
        },
        orderFormSuccess () {
            const refs = this.$refs;
            refs.editOrderModal.close();
            this.loadData();

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
        setOrderEdit (item) {
            this.company_id = item.id;
            this.current_order = item.order;
            this.$refs.editOrderModal.show();
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
            this.loadData();
        },
        suspendFailure () {
            this.loadData();
        },
        deleteComplete (response) {
            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.loadData();
        },
        onOptionSelected (option) {
            if (option) {
                this.productName = option.label || option.text || option.name || '';
                this.productObject = option;
            } else {
                this.productObject = null;
                this.productName = '';
            }
        }
    }
};
</script>

<style scoped lang="scss">
.bs-custom {
    background-color: #f6fbff;
}

.bs-custom:hover {
    background: #eef2f6;
}

.label-fs {
    font-size: 11px;
    color: #284565;

}

.txt-clr-custom {
    color: #284565;
    font-size: 13px;

}

.txt-clr-custom-1 {
    color: #284565;

}

.txt-clr-custom-2 {
    color: #284565;
    font-size: 13px;

}

.red {
    color: red;
    font-size: 12px;
}

.ic-text {
    font-size: 12px;
    color: #284565;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.item {
    padding: 3rem;
    border: #ccc 1px solid;
    background: #f4f4f4;
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
}

.item:first-child {
    grid-column-start: 1;
    grid-column-end: 5;
}

.zsm img {
    height: 53px;
    width: 100px;
}

.c-input-select {
    .form-control {
        position: relative;
        padding: var(--spacer-1) var(--spacer-2) !important;

        input {
            //font-family: 'inter-bold';
            //font-size: 0.8rem;
            padding: var(--spacer-1) var(--spacer-2) !important;
            color: var(--color-white) !important;
        }

        .form-check > .control:focus-visible, .form-control > .control:focus-visible {
            color: white;
        }

        .vs__open-indicator {
            display: none !important;
        }

        .vs__actions {
            display: none !important;
        }

        &:after {
            content: '';
            position: absolute;
            right: var(--spacer-3);
            top: 50%;
            transform: translateY(-50%) !important;
            width: 16px;
            height: 16px;
            background: url("../../../assets/images/icons/material-symbols_arrow-forward-ios-rounded.png");
            transform: rotate(90deg);
        }
    }
}
</style>
