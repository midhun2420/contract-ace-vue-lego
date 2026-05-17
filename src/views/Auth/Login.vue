<template>
    <login-page-layout>
        <div v-if="showPage" v-show="!show" class="card bg-2">
            <h3 class="card-head">
                Login
            </h3>
            <b-form @success="loginClicked" @failure="loginError" :save-url="loginUrl" #default="{loading}"
                    :save-params="model1">

                <validated-input border-radius="custom" v-model="model1.username" :disabled="loading"
                                 :rules="rules.username" placeholder="Username" name="Username"/>
                <custom-password-input border-radius="custom" v-model="model1.password" :disabled="loading"
                                       :rules="rules.password" placeholder="Password"
                                       name="Password"/>
                <p class="fl-x-cr mt-2">
                    <router-link to="/auth/forgot-password/">Forgot Password ?</router-link>
                </p>
                <div class="fl-y-cc mt-2">
                    <btn @click="setModel" color="secondary" border-radius="custom" class="w-10r font-weight-bold"
                         type="submit"
                         :disabled="loading"
                         text="Login">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Verifying...</span></span>
                    </btn>
                    <p class="mt-3">
                        Not a member?
                        <router-link to="/auth/register/">Register now</router-link>
                    </p>
                </div>
            </b-form>
        </div>

        <modal no-close-on-backdrop ref="termsModal" header-color="secondary" title="Terms" width="30r">
            <b-form @success="loginClicked" @error="loginError" :save-url="loginUrl"
                    #default="{loading}" :save-params="model">
                <!--                <checkbox-input :rules="rules.agreed_to_terms_and_conditions" :disabled="loading"-->
                <!--                                v-model="model1.agreed_to_terms_and_conditions"-->
                <!--                                label="Agree to Terms and Conditions"></checkbox-input>-->
                <div class="row">
                    <div class="col-1 pr-1">
                        <checkbox-input v-model="model.agreed_to_terms_and_conditions"></checkbox-input>
                    </div>
                    <div class="col-7 p-0 mt-2">
                        <a @click="viewTerms" class="terms">Agree to Terms and Conditions</a>
                    </div>
                </div>
                <div class="bgc-danger card bs-5 mb-2" v-if="errorMessage" v-html="errorMessage"></div>
                <div class="fl-y-cc mt-4">
                    <btn color="secondary" border-radius="custom" class="w-10r font-weight-bold" type="submit"
                         text="Login">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Verifying...</span></span>
                    </btn>
                </div>
            </b-form>
        </modal>
        <!--        <modal no-close-on-backdrop ref="companyModal" title="Company Details" width="40r" header-color="secondary">-->
        <complete-company-registration @goBack="goBack" v-show="show" class="card" @success="companySuccess"
                                       :data="model"/>
        <!--        </modal>-->
    </login-page-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import urls from '../../data/urls';
import LoginPageLayout from '@/views/Auth/LoginPageLayout';
import CompleteCompanyRegistration from './CompleteCompanyRegistration';
import axios from 'secure-axios';

export default {
    name       : 'Login',
    components : { CompleteCompanyRegistration, LoginPageLayout },
    // metaInfo   : {
    //     title         : 'Login',
    //     titleTemplate : 'ContractAce | %s',
    //     htmlAttrs     : {
    //         lang : 'en',
    //         amp  : true
    //     }
    // },
    data () {
        return {
            window : {
                height : window.innerHeight
            },
            loginUrl     : urls.auth.login,
            errorMessage : '',
            show         : false,
            showPage     : true,
            rules        : {
                username : {
                    required : true
                },
                password : {
                    required : true
                },
                agreed_to_terms_and_conditions : {
                    required : true
                }
            },
            termsUrl : null,
            model1   : {
                id       : '',
                email    : '',
                username : '',
                password : ''
            },
            model : {
                id                             : '',
                email                          : '',
                username                       : '',
                password                       : '',
                agreed_to_terms_and_conditions : ''
            }
        };
    },
    beforeMount () {
        this.loadData();
    },
    methods : {
        ...mapActions(['setUser']),
        ...mapGetters(['currentUser']),
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
        setModel () {
            this.model.username = this.model1.username;
            this.model.password = this.model1.password;
        },
        loginClicked (response) {
            if (response.data.error === false) {
                const redirectUrl = sessionStorage.getItem('redirectPath');
                this.setUser(response.data.user);
                this.$router.push(redirectUrl || { path : '/app/' }).catch(() => {
                });
            }
            localStorage.clear();
        },
        loginError (response) {
            if (response.data.errors.__all__ === 'Agree to terms and conditions before login.') {
                this.$refs.termsModal.show();
            } else if (response.data.errors.__all__ === 'Please register your company to continue.') {
                this.model.id = response.data.errors['User Id'];
                this.model.email = response.data.errors.Email;
                this.model1.id = response.data.errors['User Id'];
                this.model1.email = response.data.errors.Email;
                this.show = true;
            }
        },
        companySuccess (response) {
            this.showPage = false;
        },
        goBack () {
            this.show = false;
        }
    }
};

</script>
<style>
.bgc-danger {
    color: white;
}

.c-gradient-1 {
    background: rgb(4, 213, 255);
    background: linear-gradient(100deg, rgba(4, 213, 255, 1) 35%, rgba(0, 153, 255, 1) 67%);
    /*border: none !important;*/
}
.notifications [type="error"] {
  background: #dc3545 !important;
  color: white !important;
}

</style>
