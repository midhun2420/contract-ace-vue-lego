<template>
    <div>
        <div v-show="!showVerificationPage">
            <b-form class="mt-3" ref="addForm" id="form-2" :save-url="generateOTPUrl" @success="showVerificationModal"
                    v-slot="{model, loading}" :save-params="detail">
                <p><b>Company Details</b><span class="text-muted"> (Optional)</span></p>
                <validated-input name="company_registration_no" :rules="rules.company_registration_no"
                                 placeholder="Registration Number" :disabled="loading" border-radius="custom"
                                 v-model="model.company_registration_no"/>
<!--                <validated-file-input name="Logo" :disabled="loading" class="mb-0"-->
<!--                                      v-model="company_logo" border-radius="custom"/>-->
<!--                <p class="small">Upload your company logo</p>-->
                <validated-input name="contact_number" :rules="rules.contact_number"
                                 placeholder="Contact Number" :disabled="loading" type="number"
                                 border-radius="custom" v-model="model.contact_number"/>
                <validated-input name="contact_e_mail_id" :rules="rules.contact_e_mail_id" placeholder="E-Mail"
                                 :disabled="loading" type="email"
                                 border-radius="custom" v-model="model.contact_e_mail_id"/>
                <validated-ajax-vue-select name="Country" :url="countryOptions" @input="loadStateOptions"
                                           :rules="rules.country" placeholder="Country" border-radius="custom"
                                           v-model="model.country"/>
                <validated-vue-select name="State" :options="stateOptions" @input="loadDistrictOptions"
                                      :rules="rules.state" border-radius="custom"
                                      placeholder="State" v-model="model.state"/>
                <validated-vue-select name="District" :options="districtOptions" border-radius="custom"
                                      :rules="rules.district" placeholder="District" @input="checkIfNullValue"
                                      v-model="model.district" multiple/>
                <validated-ajax-vue-select :rules="rules.industry" :url="industryOptions" name="Industry"
                                           v-model="model.industry" placeholder="Industry"
                                           border-radius="custom"></validated-ajax-vue-select>
                <validated-input name="Contact Person" :rules="rules.contact_person"
                                 placeholder="Contact Person" :disabled="loading"
                                 border-radius="custom" v-model="model.contact_person"/>

                <validated-ajax-vue-select :rules="rules.services_provided" placeholder="Service Provided"
                                           :url="servicesOptions" v-model="model.services_provided" multiple
                                           border-radius="custom"></validated-ajax-vue-select>

                <validated-input name="Average Annual Turnover In Last Year" type="number"
                                 :rules="rules.average_annual_turnover_in_last_year" border-radius="custom"
                                 placeholder="Average Annual Turnover In Last Year"
                                 :disabled="loading" v-model="model.average_annual_turnover_in_last_year"/>

                <validated-input name="Average Annual Turnover In Last 2 Years" type="number"
                                 :rules="rules.average_annual_turnover_in_last_two_years" border-radius="custom"
                                 placeholder="Average Annual Turnover In Last 2 Years"
                                 :disabled="loading" v-model="model.average_annual_turnover_in_last_two_years"/>

                <validated-input name="Average Annual Turnover In Last 3 Years" type="number"
                                 :rules="rules.average_annual_turnover_in_last_three_years" border-radius="custom"
                                 placeholder="Average Annual Turnover In Last 3 Years"
                                 :disabled="loading" v-model="model.average_annual_turnover_in_last_three_years"/>

                <validated-input name="Value of the Biggest Project" :rules="rules.value_of_biggest_project"
                                 placeholder="Value of the Biggest Project" :disabled="loading"
                                 border-radius="custom" v-model="model.value_of_biggest_project"/>

                <textarea-input name="Other Details 1" v-model="model.other_details_1" border-radius="custom"
                                placeholder="Other Details 1"/>

                <textarea-input name="Other Details 2" v-model="model.other_details_2" border-radius="custom"
                                placeholder="Other Details 2"/>

                <validated-ajax-vue-select :rules="rules.category" placeholder="Vendor Category"
                                           :url="vendorCategoryOptions" v-model="model.category" multiple
                                           border-radius="custom"></validated-ajax-vue-select>

                <div class="fl-x-cc my-4">
                    <btn color="secondary" id="btn-3" border-radius="custom" @click="goBack1"
                         class="w-10r font-weight-bold"
                         text="Back" type="button"/>
                    <btn color="secondary" id="btn-2" border-radius="custom" class="w-10r ml-3 font-weight-bold"
                         type="submit" text="Save">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Saving...</span></span>
                    </btn>
                </div>

            </b-form>
        </div>
        <div v-show="showVerificationPage">
            <div v-if="!optVerified">
                <b-form @success="otpVerified" ref="otpForm" :save-url="verifyOtpUrl" :save-params="detail"
                        #default="{model, loading}">
                    <validated-input :rules="rules.otp" :disabled="loading" type="number"
                                     v-model="model.otp" name="Otp"
                                     :label="message"></validated-input>
                    <div class="bgc-danger card bs-5 mb-2" v-if="errorMessage" v-html="errorMessage"></div>
                    <p v-if="countDown!==0">Resend OTP after {{ countDown }}s.</p>
                    <div class="fl-x-cc my-4">
                        <btn color="secondary" id="btn-4" border-radius="custom" @click="goBack"
                             class="font-weight-bold"
                             text="Back" type="button"/>
                        <btn color="secondary" v-if="countDown===0" @click="resendOTP" border-radius="custom"
                             class="font-weight-bold ml-2" type="button"
                             text="Resend OTP">
                        <span v-if="loading1"><loading-animation/><span
                            style="vertical-align: super"> Generating OTP...</span></span>
                        </btn>
                        <btn color="secondary" border-radius="custom" class="ml-2 font-weight-bold" type="submit"
                             text="Verify">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Verifying...</span></span>
                        </btn>
                    </div>
                </b-form>
            </div>
            <span v-if="optVerified"><loading-animation/>
                <span style="vertical-align: super"> Please wait while we redirect to login page.</span>
            </span>
        </div>
    </div>
</template>

<script>
import urls from '../../data/urls';
import axios from 'secure-axios';

export default {
    name  : 'CompanyRegistration',
    props : {
        detail : { type : Object }
    },
    data () {
        return {
            company_logo         : '',
            countDown            : 120,
            show                 : false,
            loading1             : false,
            showVerificationPage : false,
            optVerified          : false,
            count                : false,
            models               : null,

            window : {
                height : window.innerHeight
            },
            errorMessage : '',
            infoMessage  : '',
            message      : '',
            id           : this.detail.id,

            verifyOtpUrl          : urls.Consumer.User.verifyOtpUrl,
            generateOTPUrl        : urls.Consumer.User.generateOTPUrl,
            companyOptions        : urls.Consumer.User.companyOptions,
            industryOptions       : urls.Consumer.Company.industryOptions,
            vendorCategoryOptions : urls.Consumer.Company.vendorCategoryOptions,
            servicesOptions       : urls.Consumer.Company.servicesOptions,
            stateOptions          : [],
            countryOptions        : urls.Admin.Company.countryOptions,
            districtOptions       : [],

            addPersonalDetailsUrl : urls.Consumer.Registration.personalDetails,
            addCompanyDetailsUrl  : urls.Consumer.Registration.companyDetails,
            rules                 : {
                otp : {
                    required : true,
                    min      : 6,
                    max      : 6
                },
                contact_person : {
                    required : false
                },
                company_registration_no : {
                    required : false
                },
                value_of_biggest_project : {
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
                geographical_area_of_operations : {
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
                agreed_to_terms_and_conditions : {
                    required : true
                }
            }
        };
    },
    methods : {
        loadStateOptions (item) {
            if (this.$refs.addForm.getModelValue('country') === null) {
                this.$refs.addForm.setModelValue('country', '');
            }
            this.$refs.addForm.setModelValue('state', '');
            this.stateOptions = [];
            this.districtOptions = [];
            this.$refs.addForm.setModelValue('district', '');
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
            axios.form(urls.Consumer.Company.districtOptions, { state : item }).then(function (response) {
                const json = response.data;
                that.districtOptions = json.data;
            });
        },
        checkIfNullValue (item) {
            if (this.$refs.addForm.getModelValue('district') === null) {
                this.$refs.addForm.setModelValue('district', '');
            }
        },
        async resendOTP () {
            this.countDown = 120;
            const component = this;
            component.loading1 = true;
            const response = await axios.form(urls.Consumer.User.generateOTPUrl, component.models);
            const json = response.data;
            if (json.error === false) {
                component.show = true;
                component.countDownTimer();
                component.loading1 = false;
            } else {
                component.errorMessage = json.errors.__all__;
                component.loading1 = false;
            }
        },
        countDownTimer () {
            if (this.countDown > 0 && this.count === true) {
                setTimeout(() => {
                    this.countDown -= 1;
                    this.countDownTimer();
                }, 1000);
            } else {
                this.show = false;
            }
        },
        goBack () {
            this.countDown = 120;
            this.count = false;
            this.showVerificationPage = false;
            this.$refs.otpForm.model = {};
        },
        goBack1 () {
            this.countDown = 120;
            this.$emit('goBack');
            this.$refs.companyDetails.model = {};
        },
        showVerificationModal (response) {
            this.message = 'A One Time Password is sent to "' + this.detail.email + '" . Please enter the OTP below to verify your email address.';
            this.models = response.data.data;
            this.models.user = this.detail.user;
            this.models.email = this.detail.email;
            this.showVerificationPage = true;
            this.show = true;
            this.count = true;
            this.countDownTimer();
        },
        otpVerified (item) {
            this.optVerified = true;
            const that = this;
            that.models.id = that.detail.company_id;
            that.models.company_name = that.detail.company_name;
            // that.models.company_logo = that.company_logo;
            axios.form(urls.Consumer.Registration.companyDetails, that.models).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.$router.push('/auth/login/');
                } else {
                    that.$notify('Sorry, we could not register your company,Try refreshing the page.', 'Error',
                        {
                            type : 'danger'
                        });
                }
            });
        }
    }
};

</script>

<style scoped>

</style>
