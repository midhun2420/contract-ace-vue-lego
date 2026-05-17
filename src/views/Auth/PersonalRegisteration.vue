<!-- <template>
    <div>
        <b-form id="form-1" class="mt-3" :save-params="{ id, company_id :detail.company_id }"
                ref="formValidator"
                :save-url="addPersonalDetailsUrl" @success="formSuccess" @failure="displayError"
                v-slot="{model, loading}">
            <div class="alert alert-danger" v-if="errorMessage" v-html="errorMessage"></div>
            <div class="alert alert-info" v-if="infoMessage" v-html="infoMessage"></div>
            <p class="font-weight-bold">Personal Details</p>
            <validated-input name="Name" :rules="rules.name" placeholder="Name*"
                             :disabled="loading" border-radius="custom" v-model="model.name"/>

            <validated-input name="Mobile Number" :rules="rules.staff_phone_number" type="number"
                             placeholder="Mobile Number*" :disabled="loading" border-radius="custom"
                             v-model="model.staff_phone_number"/>

            <validated-input name="E-Mail" type="email" :rules="rules.email" placeholder="E-Mail*"
                             :disabled="loading" border-radius="custom" v-model="model.email"/>

            <validated-input name="Company Name" placeholder="Company Name*" :rules="rules.company_name"
                             :disabled="loading" border-radius="custom" v-model="model.company_name"/>

            <validated-input name="Username" :rules="rules.username" placeholder="Username*"
                             :disabled="loading" border-radius="custom" v-model="model.username"/>

            <custom-password-input name="Password" :rules="rules.password1"
                                   placeholder="Password*" :disabled="loading" border-radius="custom"
                                   v-model="model.password1"/>

            <custom-password-input name="Confirm Password" :rules="rules.password2"
                                   placeholder="Confirm Password*" :disabled="loading" border-radius="custom"
                                   v-model="model.password2"/>
            <div class="row">
                <div class="col-1 pl-4">
                    <checkbox-input @input="removeError"
                                    v-model="model.agreed_to_terms_and_conditions"></checkbox-input>
                </div>
                <div class="col-6 p-0 mt-2">
                    I agree to the <a @click="viewTerms" class="terms">Terms and Conditions</a>
                </div>
            </div>
            <div style="color: #DC3545;" v-if="errorMessage1" v-html="errorMessage1"></div>
            <div class="fl-x-cc my-4">
                <btn color="secondary" id="btn-1" border-radius="custom" class="w-10r font-weight-bold" type="submit"
                     text="Continue">
                    <span v-if="loading"><loading-animation/><span
                        style="vertical-align: super"> Saving...</span></span>
                </btn>
            </div>
        </b-form>
    </div>
</template>

<script>
import urls from '../../data/urls';
import axios from 'secure-axios';

export default {
    name  : 'PersonalRegistration',
    props : {
        detail : { type : Object }
    },
    data () {
        return {
            window : {
                height : window.innerHeight
            },
            errorMessage        : '',
            termsUrl            : null,
            infoMessage         : '',
            errorMessage1       : '',
            infoMessage1        : '',
            showPersonalDetails : true,
            showCompanyDetails  : false,
            id                  : '',
            user                : '',

            companyOptions : urls.Consumer.User.companyOptions,

            addPersonalDetailsUrl : urls.Consumer.Registration.personalDetails,
            addressTypeOptions    : [
                { label : 'Office', value : 'Office' },
                { label : 'Home', value : 'Home' },
                { label : 'Other', value : 'Other' }
            ],
            rules : {
                name : {
                    required : true
                },
                company_name : {
                    required : true
                },
                role : {
                    required : true
                },
                agreed_to_terms_and_conditions : {
                    required : true
                },
                staff_phone_number : {
                    required : true
                },
                username : {
                    required : true
                },
                password1 : {
                    required : true
                },
                password2 : {
                    required : true
                },
                email : {
                    required : true
                }
            }
        };
    },
    beforeMount () {
        this.loadData();
    },
    methods : {
        loadData () {
            const that = this;
            axios.get(urls.Admin.MasterData.Terms.view).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.termsUrl = json.file;
                }
            });
        },
        viewTerms () {
            window.open(this.termsUrl);
        },
        formSuccess (response) {
            this.id = response.data.id;
            this.user = response.data.id;
            this.$emit('success', response);
        },
        removeError (response) {
            if (this.errorMessage1 !== '') {
                this.errorMessage1 = '';
            }
        },
        displayError (response) {
            if (response.data.errors['Agree to Terms and Conditions'] === 'This field is required.') {
                this.errorMessage1 = 'The Terms and Conditions field is required';
            }
        }
    }
};

</script>

<style scoped>
.terms:hover {
    cursor: pointer;
}

.terms {
    color: #e8ae0e;
}
</style> -->
<template>
    <div>
        <b-form id="form-1"
                class="mt-3"
                :save-params="{ id, company_id : detail.company_id }"
                ref="formValidator"
                :save-url="addPersonalDetailsUrl"
                @success="formSuccess"
                @failure="displayError"
                v-slot="{model, loading}">

            <!-- Main Error / Info -->
            <div class="alert alert-danger" v-if="errorMessage" v-html="errorMessage"></div>
            <div class="alert alert-info" v-if="infoMessage" v-html="infoMessage"></div>

            <p class="font-weight-bold">Personal Details</p>

            <validated-input name="Name"
                             :rules="rules.name"
                             placeholder="Name*"
                             :disabled="loading"
                             border-radius="custom"
                             v-model="model.name"/>

            <validated-input name="Mobile Number"
                             :rules="rules.staff_phone_number"
                             type="number"
                             placeholder="Mobile Number*"
                             :disabled="loading"
                             border-radius="custom"
                             v-model="model.staff_phone_number"/>

            <validated-input name="E-Mail"
                             type="email"
                             :rules="rules.email"
                             placeholder="E-Mail*"
                             :disabled="loading"
                             border-radius="custom"
                             v-model="model.email"/>

            <validated-input name="Company Name"
                             :rules="rules.company_name"
                             placeholder="Company Name*"
                             :disabled="loading"
                             border-radius="custom"
                             v-model="model.company_name"/>

            <validated-input name="Username"
                             :rules="rules.username"
                             placeholder="Username*"
                             :disabled="loading"
                             border-radius="custom"
                             v-model="model.username"/>

            <custom-password-input name="Password"
                                   :rules="rules.password1"
                                   placeholder="Password*"
                                   :disabled="loading"
                                   border-radius="custom"
                                   v-model="model.password1"/>

            <custom-password-input name="Confirm Password"
                                   :rules="rules.password2"
                                   placeholder="Confirm Password*"
                                   :disabled="loading"
                                   border-radius="custom"
                                   v-model="model.password2"/>

            <!-- Terms Section -->
            <div class="row">
                <div class="col-1 pl-4">
                    <checkbox-input
                        @input="removeError"
                        v-model="model.agreed_to_terms_and_conditions">
                    </checkbox-input>
                </div>

                <div class="col-6 p-0 mt-2">
                    I agree to the
                    <a href="javascript:void(0)"
                       @click.prevent="viewTerms"
                       class="terms">
                        Terms and Conditions
                    </a>
                </div>
            </div>

            <!-- Terms Error Message -->
            <div style="color:#DC3545;"
                 v-if="errorMessage1"
                 v-html="errorMessage1">
            </div>

            <!-- Submit Button -->
            <div class="fl-x-cc my-4">
                <btn color="secondary"
                     id="btn-1"
                     border-radius="custom"
                     class="w-10r font-weight-bold"
                     type="submit"
                     text="Continue">

                    <span v-if="loading">
                        <loading-animation/>
                        <span style="vertical-align: super"> Saving...</span>
                    </span>
                </btn>
            </div>

        </b-form>
    </div>
</template>

<script>
import urls from '../../data/urls';
import axios from 'secure-axios';

export default {
    name : 'PersonalRegistration',

    props : {
        detail : { type : Object }
    },

    data () {
        return {
            errorMessage  : '',
            infoMessage   : '',
            errorMessage1 : '',
            id            : '',
            user          : '',

            addPersonalDetailsUrl :
                urls.Consumer.Registration.personalDetails,

            rules : {
                name                           : { required : true },
                company_name                   : { required : true },
                role                           : { required : true },
                agreed_to_terms_and_conditions : { required : true },
                staff_phone_number             : { required : true },
                username                       : { required : true },
                password1                      : { required : true },
                password2                      : { required : true },
                email                          : { required : true }
            }
        };
    },

    methods : {

        // 🔹 Terms click logic
        viewTerms () {
            this.errorMessage1 = '';

            axios.get(urls.Admin.MasterData.Terms.view)
                .then((response) => {
                    const json = response.data;

                    if (json.error === false && json.file) {
                        window.open(json.file, '_blank');
                    } else {
                        this.errorMessage1 =
                    json.msg ||
                    'No files for Terms and Condition exists';
                    }
                })
                .catch(() => {
                    this.errorMessage1 =
                'No files for Terms and Condition exists';
                });
        },

        formSuccess (response) {
            this.id = response.data.id;
            this.user = response.data.id;
            this.$emit('success', response);
        },

        removeError () {
            this.errorMessage1 = '';
        },

        displayError (response) {
            if (
                response.data.errors &&
                response.data.errors['Agree to Terms and Conditions'] ===
                'This field is required.'
            ) {
                this.errorMessage1 =
                    'The Terms and Conditions field is required';
            }
        }
    }
};
</script>

<style scoped>
.terms {
    color: #e8ae0e;
}
.terms:hover {
    cursor: pointer;
    text-decoration: underline;
}
</style>
