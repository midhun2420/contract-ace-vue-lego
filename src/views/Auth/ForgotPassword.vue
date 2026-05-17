<template>
    <login-page-layout>
        <div class="card bg-2">
            <h3 class="card-head" @click="showVerificationModal">
                Forgot Password
            </h3>
            <b-form v-show="showEmailSection" @success="showVerificationModal" @failure="formError"
                    :save-url="sentOtp"
                    #default="{loading}"
                    :save-params="model">
                <p>Please enter your registered E-Mail ID for OTP verification.</p>
                <validated-input border-radius="custom" v-model="model.email" :disabled="loading"
                                 :rules="rules.email" type="email" placeholder="E-mail" name="Email"/>
                <div class="fl-y-cc mt-4">
                    <btn color="secondary" border-radius="custom" class="w-10r font-weight-bold" type="submit"
                         :disabled="loading" text="Send OTP">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Verifying...</span></span>
                    </btn>
                    <p class="mt-3">
                        <router-link to="/auth/login/">Back to Login</router-link>
                    </p>
                </div>
            </b-form>
            <div v-show="showVerificationPage">
                <b-form @success="otpVerified" ref="otpForm" :save-url="validateOtp" :save-params="model"
                        #default="{model, loading}" @failure="formError">
                    <validated-input :rules="rules.otp" :disabled="loading" type="number"
                                     v-model="model.otp" name="Otp"
                                     :label="message"></validated-input>
                    <div class="bgc-danger card bs-5 mb-2" v-if="errorMessage" v-html="errorMessage"></div>
                    <div class="fl-x-cc my-4">
                        <btn color="secondary" id="btn-4" border-radius="custom" @click="goBack"
                             class="font-weight-bold"
                             text="Back" type="button"/>
                        <btn color="secondary" border-radius="custom" class="ml-2 font-weight-bold"
                             type="submit"
                             text="Verify">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Verifying...</span></span>
                        </btn>
                    </div>
                </b-form>
            </div>
            <div v-show="changePasswordPage">
                <b-form @success="changePasswordSuccess" @failure="formError" ref="otpForm" :save-url="changePassword"
                        :save-params="model" #default="{model, loading}">
                    <custom-password-input label="Password" name="Password" v-model="model.new_password"
                                           :disabled="loading" :rules="{required:true}"/>
                    <custom-password-input label="Confirm Password" name="ConfirmPassword"
                                           v-model="model.confirm_password"
                                           :disabled="loading" :rules="{required:true}"/>
                    <div class="fl-x-cc my-4">
                        <btn color="secondary" border-radius="custom" class="ml-2 font-weight-bold"
                             type="submit" text="Change Password">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Verifying...</span></span>
                        </btn>
                    </div>
                </b-form>
            </div>
        </div>
    </login-page-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import urls from '../../data/urls';
import LoginPageLayout from '@/views/Auth/LoginPageLayout';

export default {
    name       : 'ForgotPassword',
    components : { LoginPageLayout },
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
            message : '',
            window  : {
                height : window.innerHeight
            },
            loading              : false,
            showEmailSection     : true,
            showVerificationPage : false,
            changePasswordPage   : false,
            sentOtp              : urls.forgotPassword.sentOtp,
            validateOtp          : urls.forgotPassword.validateOtp,
            changePassword       : urls.forgotPassword.changePassword,
            errorMessage         : '',
            rules                : {
                otp : {
                    required : true,
                    min      : 6,
                    max      : 6
                },
                email : {
                    required : true
                }
            },
            model : {
                id           : '',
                email        : '',
                otp          : '',
                new_password : ''
            }
        };
    },
    beforeMount () {
        this.loadData();
    },
    methods : {
        ...mapActions(['setUser']),
        ...mapGetters(['currentUser']),
        formError () {
            this.$notify('Something went wrong, Please try again later|', 'Message', {
                type : 'warning'
            });
        },
        otpVerified (response) {
            this.model.id = response.data.id;
            this.model.otp = response.data.otp;
            this.showVerificationPage = false;
            this.changePasswordPage = true;
        },
        changePasswordSuccess () {
            this.$notify('Password Changed Successfully', 'Success', {
                type : 'success'
            });
            this.$router.push('/auth/login/');
        },
        goBack () {
            this.showVerificationPage = false;
            this.$refs.otpForm.model = {};
        },
        showVerificationModal (response) {
            this.showEmailSection = false;
            this.message = 'A One Time Password is sent to "' + this.model.email + '" . Please enter the OTP below to verify your email address.';
            this.showVerificationPage = true;
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
    border: none !important;
}
</style>
