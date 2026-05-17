<template>
    <div class="card bs-5 m-4">
        <check-permission/>
        <vue-table-card :show-search-box="false" title="User Reports" :fields="fields" :url="listUrl" :per-page="10" ref="table"
                        :extra-params="{ role }">
            <template #buttons>
                <div class="btn-group">
                    <custom-drop-btn text="Filters" ref="dropDown" icon="fa fa-filter" size="sm" dropdown-width="30r">
                        <i @click="$refs.dropDown.onClickedOutside()" class="fa fa-close pr-3 pt-3 fl-eqh-r"/>
                        <div class="p-3">
                            <validated-ajax-vue-select name="Role" :url="roleOptions"
                                                       label="Role" v-model="role"/>
                        </div>

                    </custom-drop-btn>
                    <btn v-if="currentUser.features.is_export" color="success" size="sm" @click="ReportDownload" text="Download">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Downloading...</span></span>
                    </btn>
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
    name : 'ConsumerUserReports',
    data () {
        return {
            role        : '',
            loading     : false,
            listUrl     : urls.Consumer.Reports.userList,
            roleOptions : urls.Admin.User.reportRoleOptions,
            fields      : [
                {
                    name      : 'Sl No',
                    sortField : 'Sl No',
                    title     : 'Sl No'
                },
                {
                    name      : 'Name Of User',
                    sortField : 'Name Of User',
                    title     : 'Name Of User'
                },
                {
                    name      : 'Role',
                    sortField : 'Role',
                    title     : 'Role'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
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
            axios.form(urls.Consumer.Reports.userListDownload, { role : component.role }).then(function (data) {
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
