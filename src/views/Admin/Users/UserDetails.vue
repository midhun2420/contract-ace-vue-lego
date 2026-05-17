<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading && details">
            <div class="row mb-3">
                <div class="col">
                    <b>Name</b>
                    <span class="text-muted form-control" v-if="details.name">{{
                            details.name
                        }}</span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
                <div class="col">
                    <b>Username</b>
                    <span class="text-muted form-control"
                          v-if="details.username">{{ details.username }}</span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
                <div class="col">
                    <b>Contact Number</b>
                    <span class="text-muted form-control"
                          v-if="details.staff_phone_number">{{ details.staff_phone_number }}</span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <b>E-Mail</b>
                    <span class="text-muted form-control"
                          v-if="details.email">{{ details.email }}</span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
                <div class="col">
                    <b>Role</b>
                    <span class="text-muted form-control" v-if="details.role">{{
                            details.role
                        }}</span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
                <div class="col">
                    <b>Company</b>
                    <span class="text-muted form-control"
                          v-if="details.company">{{ details.company }}</span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <b>Address</b>
                    <span class="text-muted form-control"
                          v-if="details.address">{{ details.address }}</span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <b>Address Type</b>
                    <span class="text-muted form-control" v-if="details.address_type">{{
                            details.address_type
                        }}</span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
                <div class="col">
                    <b>Is Primary Address</b>
                    <span class="text-muted form-control" v-if="details.is_primary_address !== ''">
                                <div v-if="details.is_primary_address===true">Yes</div>
                                <div v-if="details.is_primary_address===false">No</div>
                            </span>
                    <span class="text-muted form-control" v-else>Nil</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '@/data/urls';

export default {
    name  : 'UserDetailsPage',
    props : {
        detail : { type : Number }
    },
    data () {
        return {
            id      : this.detail,
            loading : false,
            details : []
        };
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Admin.User.details, { user : that.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json.data;
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
