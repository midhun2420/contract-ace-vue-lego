<template>
    <div class="card bs-5 m-4">
        <check-permission/>
        <vue-table-card :show-search-box="false" title="My Contacts Reports" :fields="fields" :url="listUrl" :per-page="10" ref="table"
                        :extra-params="{ vendor_category, geographical_area_of_operations, country }">
            <template #buttons>
                <div class="btn-group">
                    <custom-drop-btn text="Filters" ref="dropDown" icon="fa fa-filter" size="sm" dropdown-width="30r">
                        <i @click="$refs.dropDown.onClickedOutside()" class="fa fa-close pr-3 pt-3 fl-eqh-r"/>
                        <div class="p-3">
                            <validated-ajax-vue-select name="Vendor Category" :url="vendorCategoryOptions"
                                                       label="Vendor Category"
                                                       v-model="vendor_category"/>
                            <validated-ajax-vue-select name="Area of Operation" :url="areaOfOperationOptions"
                                                       label="Area of Operation"
                                                       v-model="geographical_area_of_operations"/>
                            <validated-ajax-vue-select name="Country" :url="countryOptions"
                                                       label="Country"
                                                       v-model="country"/>
                        </div>
                    </custom-drop-btn>
                    <btn v-if="currentUser.features.is_export" color="success" size="sm" @click="ReportDownload" text="Download">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Downloading...</span></span>
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
    name : 'MyContactReports',
    data () {
        return {
            vendor_category                 : '',
            geographical_area_of_operations : '',
            country                         : '',
            loading                         : false,
            loading1                        : false,
            listUrl                         : urls.Consumer.Reports.vendorList,
            vendorCategoryOptions           : urls.Admin.Company.vendorCategoryOptions,
            areaOfOperationOptions          : urls.Admin.Company.areaOfOperationOptions,
            countryOptions                  : urls.Admin.Company.countryOptions,
            fields                          : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'contact_person',
                    sortField : 'contact_person',
                    title     : 'Contact Person'
                },
                {
                    name      : 'vendor_name',
                    sortField : 'vendor_name',
                    title     : 'Company Name'
                },
                {
                    name      : 'phone_numbers',
                    sortField : 'phone_numbers',
                    title     : 'Phone'
                },
                {
                    name      : 'mail_ids',
                    sortField : 'mail_ids',
                    title     : 'E-Mail'
                },
                {
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ]
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    methods : {
        ReportDownload () {
            this.loading = true;
            if (this.vendor_category === null) {
                this.vendor_category = '';
            }
            if (this.geographical_area_of_operations === null) {
                this.geographical_area_of_operations = '';
            }
            if (this.country === null) {
                this.country = '';
            }
            const component = this;
            axios.form(urls.Consumer.Reports.vendorListUserDownload, {
                vendor_category                 : component.vendor_category,
                geographical_area_of_operations : component.geographical_area_of_operations,
                country                         : component.country
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
