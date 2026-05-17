<template>
    <div class="container card col-md-4 bs-5 mt-5">
        <check-permission/>
        <b-form @success="passwordChanged" :save-url="changeUrl" #default="{model, loading}">
            <div class="text-center text-muted mb-4">
                <p>CHANGE PASSWORD</p>
            </div>
            <div class="row">
                <div class="col">
                    <custom-password-input label="Old Password" name="Old Password" v-model="model.old_password"
                                           :disabled="loading" :rules="rules.old_password"/>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <custom-password-input label="New Password" name="New Password" v-model="model.new_password"
                                           :disabled="loading" :rules="rules.new_password"/>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <custom-password-input label="Confirm Password" name="Confirm Password"
                                           v-model="model.confirm_password"
                                           :disabled="loading" :rules="rules.confirm_password"/>
                </div>
            </div>
            <div class=" row mt-4">
                <div class="col">
                    <btn color="success" type="submit" text="Save" size="block"
                         :disabled="loading"/>
                </div>
            </div>
        </b-form>
    </div>
</template>

<script>
// import axios from 'secure-axios';
import urls from '@/data/urls';
// import { mapGetters } from 'vuex';

export default {
    name       : 'ChangePassword',
    components : {},
    data () {
        return {
            changeUrl : urls.auth.changePassword,
            rules     : {
                old_password : {
                    required : true
                },
                new_password : {
                    required : true
                },
                confirm_password : {
                    required : true
                }
            }
        };
    },
    methods : {
        passwordChanged (response) {
            this.$router.push('/auth/login/');
        }
    }
};
</script>

<style scoped>
.full-page {
    height: 100vh;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
}
</style>
