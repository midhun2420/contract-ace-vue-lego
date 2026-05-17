<template>
    <login-page-layout>
        <div class="card bg-2">
            <h3 class="card-head">
                Registration
            </h3>
            <personal-registration @success="changePage" :detail="detail" v-show="showPersonalDetails"/>
            <company-registration @goBack="goBack" :detail="detail" v-show="showCompanyDetails"/>
            <p class="mt-3 text-center">
                Already a member?
                <router-link to="/auth/login/">Login now</router-link>
            </p>
        </div>
    </login-page-layout>
</template>

<script>
import urls from '../../data/urls';
import LoginPageLayout from './LoginPageLayout';
import PersonalRegistration from './PersonalRegisteration';
import CompanyRegistration from './CompanyRegistration';

export default {
    name       : 'ViewPage',
    components : { CompanyRegistration, PersonalRegistration, LoginPageLayout },
    data () {
        return {
            window : {
                height : window.innerHeight
            },
            errorMessage        : '',
            infoMessage         : '',
            showPersonalDetails : true,
            showCompanyDetails  : false,
            id                  : '',
            detail              : {
                user                           : '',
                email                          : '',
                agreed_to_terms_and_conditions : ''
            },
            agreed_to_terms_and_conditions : '',

            companyOptions         : urls.Consumer.User.companyOptions,
            industryOptions        : urls.Consumer.Company.industryOptions,
            vendorCategoryOptions  : urls.Consumer.Company.vendorCategoryOptions,
            areaOfOperationOptions : urls.Consumer.Company.areaOfOperationOptions,
            servicesOptions        : urls.Consumer.Company.servicesOptions,

            addPersonalDetailsUrl : urls.Consumer.Registration.personalDetails,
            addCompanyDetailsUrl  : urls.Consumer.Registration.companyDetails
        };
    },
    methods : {
        goBack () {
            this.showPersonalDetails = true;
            this.showCompanyDetails = false;
        },
        changePage (response) {
            this.id = response.data.id;
            this.detail.user = response.data.id;
            this.detail.email = response.data.email;
            this.detail.company_name = response.data.company_name;
            this.detail.company_id = response.data.company_id;
            this.detail.agreed_to_terms_and_conditions = response.data.agreed_to_terms_and_conditions;
            this.showPersonalDetails = false;
            this.showCompanyDetails = true;
        }
    }
};

</script>

<style scoped>

</style>
