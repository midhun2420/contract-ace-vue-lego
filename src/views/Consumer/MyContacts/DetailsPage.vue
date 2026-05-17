<template>
    <div>
        <check-permission/>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading && permission">
            <div class="mb-4" v-if="details">
                <div class="m-3">
                    <div v-if="details.company_logo">
                        <img alt="logo" :src="details.company_logo"/><br/>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Company Name</span>
                            <span class="text-muted form-control" v-if="details.company_name">{{
                                    details.company_name
                                }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Registration Number</span>
                            <span class="text-muted form-control" v-if="details.company_registration_no">{{
                                    details.company_registration_no
                                }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Contact Number</span>
                            <span class="text-muted form-control"
                                  v-if="details.contact_number">{{ details.contact_number }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                    </div>
                    <h6 class="font-weight-bold">Geographical Area of Operations</h6>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Country</span>
                            <span class="text-muted form-control" v-if="details.country">{{ details.country }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>State</span>
                            <span class="text-muted form-control" v-if="details.state">{{ details.state }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>District</span>
                            <span class="text-muted form-control"
                                  v-if="details.district">{{ details.district }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Industry</span>
                            <span class="text-muted form-control"
                                  v-if="details.industry">{{ details.industry }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Contact Person</span>
                            <span class="text-muted form-control"
                                  v-if="details.contact_person">{{
                                    details.contact_person
                                }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Category</span>
                            <span class="text-muted form-control" v-if="details.category">{{ details.category }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Service Provided</span>
                            <span class="text-muted form-control"
                                  v-if="details.services_provided">{{ details.services_provided }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>E-Mail</span>
                            <span class="text-muted form-control"
                                  v-if="details.contact_e_mail_id">{{ details.contact_e_mail_id }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Value of the Biggest Project</span>
                            <span class="text-muted form-control"
                                  v-if="details.value_of_biggest_project">{{ details.value_of_biggest_project }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Average annual turnover in last year</span>
                            <span class="text-muted form-control" v-if="details.average_annual_turnover_in_last_year">{{
                                    details.average_annual_turnover_in_last_year
                                }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Average annual turnover in last 2 year</span>
                            <span class="text-muted form-control"
                                  v-if="details.average_annual_turnover_in_last_two_years">{{
                                    details.average_annual_turnover_in_last_two_years
                                }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Average annual turnover in last 3 year</span>
                            <span class="text-muted form-control"
                                  v-if="details.average_annual_turnover_in_last_three_years">{{
                                    details.average_annual_turnover_in_last_three_years
                                }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                    </div>
                    <div class="row pb-2">
                        <div class="col">
                            <span>Other details 1</span>
                            <span class="text-muted form-control" v-if="details.other_details_1">{{
                                    details.other_details_1
                                }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Other details 2</span>
                            <span class="text-muted form-control" v-if="details.other_details_2">{{
                                    details.other_details_2
                                }}</span>
                            <span class="text-muted form-control" v-else>Nil</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name  : 'DetailsPage',
    props : { company_id : { type : String } },
    data () {
        return {
            permission : true,
            loading    : false,
            id         : this.$route.params.id,
            details    : []
        };
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        loadDetails () {
            const that = this;
            that.loading = true;
            if (that.company_id) {
                that.id = that.company_id;
            }
            axios.form(urls.Admin.Company.details, { company_id : that.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json['company-information'];
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
