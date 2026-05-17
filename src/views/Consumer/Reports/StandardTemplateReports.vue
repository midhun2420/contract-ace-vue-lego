<template>
    <div class="card bs-5 m-4">
        <check-permission/>
        <vue-table-card :show-search-box="false" title="Standard Template Reports" :fields="fields" :url="listUrl" :per-page="10" ref="table">
<!--                        :extra-params="{ month }">-->
            <template #buttons>
                <div class="btn-group">
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
    name : 'ConsumerStandardTemplateReports',
    data () {
        return {
            loading : false,
            listUrl : urls.Consumer.Reports.standardTemplateList,
            fields  : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'name',
                    sortField : 'name',
                    title     : 'Name'
                },
                {
                    name      : 'no_of_uses',
                    sortField : 'no_of_uses',
                    title     : 'No. of Uses'
                },
                {
                    name      : 'date_of_first_use',
                    sortField : 'date_of_first_use',
                    title     : 'First Used Date'
                },
                {
                    name      : 'date_of_last_use',
                    sortField : 'date_of_last_use',
                    title     : 'Last Used Date'
                },
                {
                    name       : '__slot:actions',
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
            const component = this;
            axios.get(urls.Consumer.Reports.standardTemplateListDownload).then(function (data) {
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
