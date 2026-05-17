<template>
    <div class="card bs-5 m-4">
        <vue-table-card :show-search-box="false" title="User Reports" :fields="fields" :url="listUrl" :per-page="10"
                        ref="table" :extra-params="{ role }">
            <template #buttons>
                <div class="btn-group">
                    <custom-drop-btn text="Filters" ref="dropDown" icon="fa fa-filter" size="sm" dropdown-width="30r">
                        <i @click="$refs.dropDown.onClickedOutside()" class="fa fa-close pr-3 pt-3 fl-eqh-r"/>
                        <div class="p-3">
                            <validated-ajax-vue-select name="Role" :url="roleOptions"
                                                       label="Role" v-model="role"/>
                        </div>

                    </custom-drop-btn>
                    <btn :loading="loading" loading-text="Downloading..." color="success" size="sm"
                         @click="ReportDownload" text="Download"/>
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
    name : 'UserReports',
    data () {
        return {
            role        : '',
            loading     : false,
            listUrl     : urls.Admin.Reports.userList,
            roleOptions : urls.Admin.User.reportRoleOptions,
            fields      : [
                {
                    name  : 'id',
                    title : 'ID'
                },
                {
                    name  : 'name',
                    title : 'Name'
                },
                {
                    name  : 'company_name',
                    title : 'Company Name'
                },
                {
                    name  : 'date_of_registration',
                    title : 'Date of Reg.'
                },
                {
                    name  : 'role',
                    title : 'Role'
                },
                {
                    name  : 'status',
                    title : 'Status'
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
            if (this.role === null) {
                this.role = '';
            }
            const component = this;
            axios.form(urls.Admin.Reports.userListDownload, { role : component.role }).then(function (data) {
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
