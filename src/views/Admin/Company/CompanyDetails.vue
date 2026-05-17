<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading && permission">
            <div class="card bs-5 mb-4" v-if="details">
                <div class="row mb-3">
                    <div class="col text-left">
                        <b style="font-size: 19px;">Company Details<span v-if="details.order"> - # {{ details.order }}</span></b>
                    </div>
                    <div class="col text-right">
                        <btn color="primary" size="sm" @click="$router.push('/app/company-list/')" text="Back"/>
                    </div>
                </div>
                <div class="m-3">
                    <img alt="logo" v-if="details.company_logo" :src="details.company_logo"/>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Company Name</span><br/>
                            <span class="text-primary font-weight-bold" v-if="details.company_name">{{
                                    details.company_name
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Registration Number</span><br/>
                            <span class="text-primary font-weight-bold" v-if="details.company_registration_no">{{
                                    details.company_registration_no
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Contact Number</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.contact_number">{{ details.contact_number }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                    </div>
                    <h6 class="font-weight-bold">Geographical Area of Operation</h6>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Country</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.country">{{ details.country }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>State</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.state">{{ details.state }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>District</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.district">{{ details.district }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Industry</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.industry">{{ details.industry }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Contact Person</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.contact_person">{{
                                    details.contact_person
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Category</span><br/>
                            <span class="text-primary font-weight-bold" v-if="details.category">{{
                                    details.category
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Service Provided</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.services_provided">{{ details.services_provided }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>E-Mail</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.contact_e_mail_id">{{ details.contact_e_mail_id }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Value of the Biggest Project</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.value_of_biggest_project">{{
                                    details.value_of_biggest_project
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <span>Average annual turnover in last year</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.average_annual_turnover_in_last_year">{{
                                    details.average_annual_turnover_in_last_year
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Average annual turnover in last 2 year</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.average_annual_turnover_in_last_two_years">{{
                                    details.average_annual_turnover_in_last_two_years
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Average annual turnover in last 3 year</span><br/>
                            <span class="text-primary font-weight-bold"
                                  v-if="details.average_annual_turnover_in_last_three_years">{{
                                    details.average_annual_turnover_in_last_three_years
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                    </div>
                    <div class="row pb-2">
                        <div class="col">
                            <span>Other details 1</span><br/>
                            <span class="text-primary font-weight-bold" v-if="details.other_details_1">{{
                                    details.other_details_1
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Other details 2</span><br/>
                            <span class="text-primary font-weight-bold" v-if="details.other_details_2">{{
                                    details.other_details_2
                                }}</span>
                            <span class="text-primary font-weight-bold" v-else>Nil</span>
                        </div>
                        <div class="col">
                            <span>Package</span><br/>
                            <div class="d-flex align-items-center">
                                <span class="text-primary font-weight-bold" v-if="details.package_name && details.package_name.length > 0">
                                    {{ formatPackages(details.package_name) }}
                                </span>
                                <span class="text-primary font-weight-bold" v-else>Nil</span>
                                <edit-btn text="" class="ml-2" color="info" @click="openEditPackageModal"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <users v-if="details" :detail="this.$route.params.id" :user-count-limit="packageUserLimit"/>
            </div>
        </div>
        <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>

        <!-- Edit Package Modal -->
        <modal no-close-on-backdrop title="Edit Package" ref="editPackageModal" width="40r" header-color="primary">
            <b-form
                :save-url="editPackageUrl"
                ref="editPackageForm"
                @success="packageEditSuccess"
                @error="packageEditError"
                v-slot="{model, loading}"
                :initial-data="editingPackageData"
                :notify="false"
                :show-success-message="false"
                suppress-notification>
                <div class="row mb-2">
                    <div class="col-12">
                        <validated-ajax-vue-select
                            name="Package"
                            :url="packageOptions"
                            :rules="{required: false}"
                            label="Package"
                            v-model="model.package"/>
                    </div>
                </div>
                <save-btn text="Update Package" color="primary" size="sm" :disabled="loading">
                    <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Updating...</span></span>
                </save-btn>
            </b-form>
        </modal>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import Users from '../Users/Users';

export default {
    name       : 'CompanyDetailsPage',
    components : { Users },
    data () {
        return {
            loading            : false,
            permission         : true,
            id                 : this.$route.params.id,
            details            : [],
            packageUserLimit   : null,
            editingPackageData : null,
            packageOptions     : urls.Admin.MasterData.Package.packageOptions,
            editPackageUrl     : urls.Admin.Company.addEdit
        };
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Admin.Company.details, { company_id : that.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json['company-information'];
                    that.loading = false;

                    const userCount = that.details &&
                that.details.package &&
                that.details.package.features &&
                that.details.package.features.user_count &&
                that.details.package.features.user_count.userCount;

                    console.log('userCount:', userCount);
                    that.packageUserLimit = (userCount !== undefined && userCount !== null && userCount !== false)
                        ? parseInt(userCount, 10)
                        : null;
                    console.log('packageUserLimit:', that.packageUserLimit);
                } else if (json.permission === false) {
                    that.permission = json.permission;
                    that.loading = false;
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
                }
            });
        },

        loadPackageLimit (packageId) {
            const that = this;

            axios.form(urls.Admin.MasterData.Package.details, {
                id : packageId
            }).then(function (response) {
                console.log('PACKAGE RESPONSE', response.data);

                const pkg =
            response.data.data?.[0] ||
            response.data.data ||
            response.data;

                console.log('PACKAGE OBJECT', pkg);

                const limit =
            pkg.features?.user_count?.userCount || null;

                console.log('USER LIMIT', limit);

                that.packageUserLimit =
            limit !== null
                ? parseInt(limit, 10)
                : null;

                console.log(
                    'FINAL packageUserLimit',
                    that.packageUserLimit
                );
            }).catch(function (error) {
                console.error(
                    'Failed to load package limit:',
                    error
                );
            });
        },
        formatPackages (packages) {
            if (typeof packages === 'string') {
                return packages;
            }
            if (Array.isArray(packages)) {
                return packages.join(', ');
            }
            if (typeof packages === 'object' && packages !== null) {
                if (packages.name) return packages.name;
                if (packages.package_name) return packages.package_name;
                return Object.values(packages).map(pkg => {
                    if (typeof pkg === 'string') return pkg;
                    if (typeof pkg === 'object') return pkg.name || pkg.package_name || '';
                    return '';
                }).filter(Boolean).join(', ');
            }
            return '';
        },

        openEditPackageModal () {
            this.editingPackageData = {
                id                                          : this.details.id,
                company_name                                : this.details.company_name,
                company_registration_no                     : this.details.company_registration_no,
                contact_number                              : this.details.contact_number,
                country                                     : this.details.country_id || this.details.country,
                state                                       : this.details.state_id || this.details.state,
                district                                    : this.details.district_ids || this.details.district,
                industry                                    : this.details.industry_id,
                contact_person                              : this.details.contact_person,
                category                                    : this.details.category_ids || this.details.category,
                services_provided                           : this.details.service_ids || this.details.service,
                contact_e_mail_id                           : this.details.contact_e_mail_id,
                value_of_biggest_project                    : this.details.value_of_biggest_project,
                average_annual_turnover_in_last_year        : this.details.average_annual_turnover_in_last_year,
                average_annual_turnover_in_last_two_years   : this.details.average_annual_turnover_in_last_two_years,
                average_annual_turnover_in_last_three_years : this.details.average_annual_turnover_in_last_three_years,
                other_details_1                             : this.details.other_details_1,
                other_details_2                             : this.details.other_details_2,
                package                                     : this.details.package_id || this.details.package || null,
                company_logo                                : this.details.company_logo
            };
            this.$nextTick(() => {
                this.$refs.editPackageModal.show();
            });
        },

        packageEditSuccess (response) {
            if (response && response.stopPropagation) {
                response.stopPropagation();
            }
            this.$refs.editPackageModal.close();
            this.editingPackageData = null;
            this.loadDetails();
        },

        packageEditError (error) {
            console.error('Package update error:', error);
            this.$notify({
                type  : 'error',
                title : 'Error',
                text  : 'Failed to update package. Please try again.'
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

.d-flex {
    display: flex;
}

.align-items-center {
    align-items: center;
}

.ml-2 {
    margin-left: 0.5rem;
}
</style>
