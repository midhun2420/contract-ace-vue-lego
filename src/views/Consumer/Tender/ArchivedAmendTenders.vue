<template>
    <div>
        <check-permission/>
        <vue-table-card v-if="currentUser.features.view_tender" class="card bs-5" title="Tender"
                        :fields="fields" :url="listUrl" :per-page="10" ref="table"
                        :extra-params="extraParams">

            <template #buttons>
                <btn color="primary" icon="fa fa-arrow-left" size="sm" text="Back" @click="goBack"/>
            </template>

            <template #tender_number="{ rowData }">
                <div class="fl-x fl-a-c">
                    <span>{{ rowData.tender_number }}</span>
                </div>
            </template>

            <template #actions="{rowData}">
                <div class="btn-group-tight">
                    <btn icon="" color="primary" @click="setEdit(rowData)" text="Edit" size="xs"
                         v-if="currentUser.features.create_new_tender
                         && (rowData.status==='Created' || rowData.status==='Saved')
                          && (rowData.id===viewMoreId)"/>

                    <btn icon="" color="primary" @click="setClosedDateEdit(rowData)" text="Edit" size="xs"
                         v-if="currentUser.features.create_new_tender && rowData.status==='Published'
                          && (rowData.id===viewMoreId)"/>

                    <btn icon="" text="Delete" color="danger" @click="setDelete(rowData)" size="xs"
                         v-if="currentUser.features.create_new_tender && (rowData.status==='Created'
                          || rowData.status==='Saved') && (rowData.id===viewMoreId)"/>

                    <btn icon="" class="bgc-primary-200" @click="copyTender(rowData)" text="Amend" size="xs"
                         v-if="currentUser.features.create_new_tender && rowData.status!=='Created'
                          && (rowData.id===viewMoreId)"/>

                    <btn icon="" v-if="currentUser.features.view_tender" class="bgc-primary-400" size="xs"
                         @click="viewDetails(rowData)" text="Open"/>

                    <btn icon="" v-if="currentUser.features.view_tender" class="bgc-primary-600" size="xs"
                         @click="preview(rowData)" text="Preview"/>

                    <btn v-if="currentUser.features.is_export && (rowData.id===viewMoreId)" color="success"
                         icon="fa fa-upload-file" size="xs"
                         @click="showExportFile(rowData)"
                         text="Export"/>

                    <btn icon="fa fa-ellipsis-h" class="bgc-info-600" size="xs"
                         @click="viewMore(rowData)" text=""/>
                </div>
            </template>

            <template #footer>
                <modal no-close-on-backdrop title="Export Tender" ref="showExportModal" width="30r"
                       header-color="primary">
                    <validated-input label="File Name" v-model="file_name"
                                     :rules="{required :true}"/>
                    <btn size="sm" text="Export" @click="exportFile"/>
                </modal>

                <modal no-close-on-backdrop title="Add Tender" ref="addModal" width="45r" header-color="primary">
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}">
                        <div class="row">
                            <div class="col">
                                <validated-input label="Tender" v-model="model.name"
                                                 :rules="rules.name" :disabled="loading"/>
                                <validated-input label="Tender Number" name="Tender Number"
                                                 v-model="model.tender_number"
                                                 :rules="rules.tender_number"
                                                 :disabled="loading"/>
                            </div>
                        </div>
                        <save-btn text="Add Tender" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Saving...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <modal no-close-on-backdrop title="Edit Tender" ref="editModal" width="30r" header-color="primary">
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}"
                            :initial-data="editingItem">
                        <validated-input label="Tender" v-model="model.name"
                                         :rules="rules.name" :disabled="loading"/>
                        <validated-input label="Tender Number" name="Tender Number"
                                         v-model="model.tender_number"
                                         :rules="rules.tender_number"
                                         :disabled="loading"/>
                        <save-btn text="Update" icon="" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Updating...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <modal no-close-on-backdrop title="Edit Closed Date" ref="editDateModal" width="30r"
                       header-color="primary">
                    <b-form :save-url="closeDateUrl" @success="formSuccess" v-slot="{model, loading}"
                            :initial-data="editingItem">
                        <div class="row">
                            <div class="col">
                                <validated-date-picker label="Close Date" name="Closed Date"
                                                       v-model="model.closed_date"
                                                       :rules="rules.closed_date" :disabled="loading"
                                                       :disabled-date="disabledBeforeTodayAndAfterAWeek"/>
                            </div>
                        </div>
                        <save-btn text="Update" icon="" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Updating...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <modal title="Amend Tender" ref="copyTenderModal" width="30r" header-color="primary"
                       no-close-on-backdrop>
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}"
                            :save-params="{
      tender_id,
      copied_tender : true,
      is_root_parent: true,
      project: project_id}">
                        <validated-input label="Tender name"
                                         v-model="model.name"
                                         :rules="rules.name"
                                         :disabled="loading"/>
                        <validated-input label="Tender Number" name="Tender Number"
                                         v-model="model.tender_number"
                                         :rules="rules.tender_number"
                                         :disabled="loading"/>
                        <save-btn icon="" text="Save" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Updating...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <delete-modal ref="deleteModal" title="Delete Tender" :params="deletingItem" :url="deleteTender"
                              @response="deleteComplete">
                    <p>You are about to delete the Tender <b v-html="deletingItem && deletingItem.name"></b>. Are you
                        sure ?</p>
                    <template #loading>
                        <loading-animation/>
                        Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
                    </template>
                </delete-modal>
            </template>
        </vue-table-card>

        <div v-if="!currentUser.features.view_tender" class="card text-center bg-primary">
            Sorry, You don't have permission to view this page. Kindly contact your Owner.
        </div>
    </div>
</template>

<script>

import urls from '../../../data/urls';
import { mapGetters } from 'vuex';
import axios from 'secure-axios';

export default {
    name : 'ArchivedAmendTenders',
    data () {
        return {
            deleteTender : urls.Consumer.Tender.delete,
            addUrl       : urls.Consumer.Tender.create,
            closeDateUrl : urls.Consumer.Tender.closeDate,
            viewMoreId   : '',
            tender_id    : '',
            project_id   : '',
            json_file    : '',
            file_name    : '',
            editingItem  : {
                id            : '',
                name          : '',
                closed_date   : '',
                tender_number : ''
            },
            deletingItem : null,
            fields       : [
                {
                    name      : '__slot:tender_number',
                    sortField : 'tender_number',
                    title     : 'Tender Number'
                },
                {
                    name      : 'name',
                    sortField : 'name',
                    title     : 'Tender'
                },
                {
                    name      : 'created_date',
                    sortField : 'created_date',
                    title     : 'Created Date'
                },
                {
                    name      : 'user',
                    sortField : 'user',
                    title     : 'Created By'
                },
                {
                    name      : 'published_date',
                    sortField : 'published_date',
                    title     : 'Published Date'
                },
                {
                    name      : 'closed_date',
                    sortField : 'closed_date',
                    title     : 'Closed Date'
                },
                {
                    name      : 'status',
                    sortField : 'status',
                    title     : 'Status'
                },
                {
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            rules : {
                name : {
                    required : true
                },
                tender_number : {
                    required : true
                },
                closed_date : {
                    required : true
                }
            }
        };
    },
    computed : {
        ...mapGetters(['currentUser']),

        listUrl () {
            return urls.Consumer.Tender.amendList;
        },

        extraParams () {
            const params = { type : 'archive' };

            if (this.$route.params.id) {
                params.parent = this.$route.params.id;
            }

            return params;
        }
    },
    methods : {
        goBack () {
            const returnPath = sessionStorage.getItem('parentTenderReturnPath');
            if (returnPath) {
                this.$router.push(returnPath);
            } else {
                this.$router.back();
            }
        },
        viewDetails (rowData) {
            this.$router.push('/app/archived-tender/' + rowData.id + '/details/');
        },
        preview (rowData) {
            this.$router.push('/app/archived-tender/' + rowData.id + '/preview/');
        },
        viewMore (item) {
            if (this.viewMoreId === item.id) {
                this.viewMoreId = '';
            } else {
                this.viewMoreId = item.id;
            }
        },
        showExportFile (item) {
            this.file_name = '';
            this.json_file = item;
            this.$refs.showExportModal.show();
        },
        async exportFile () {
            const component = this;
            const response = await axios.form(urls.Consumer.Tender.getJson, { tender_id : component.json_file.id });
            const data = JSON.stringify(response.data.json);
            const blob = new Blob([data], { type : 'application/json;charset=utf-8' });
            const e = document.createEvent('MouseEvents');
            const a = document.createElement('a');
            a.download = this.file_name + '.json';
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            this.exportSuccess();
        },
        exportSuccess () {
            this.$notify('Export Successful', 'Success', {
                type : 'success'
            });
            this.$refs.showExportModal.close();
        },
        disabledBeforeTodayAndAfterAWeek (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return date < tomorrow;
        },
        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            refs.editModal.close();
            refs.copyTenderModal.close();
            refs.editDateModal.close();
            refs.table.refreshTable();
        },
        setEdit (item) {
            this.editingItem.id = item.id;
            this.editingItem.name = item.name;
            this.editingItem.tender_number = item.tender_number;
            this.$refs.editModal.show();
        },
        copyTender (item) {
            this.tender_id = item.id;
            this.project_id = item.project_id;
            this.$refs.copyTenderModal.show();
        },
        setClosedDateEdit (item) {
            this.editingItem.id = item.id;
            this.editingItem.closed_date = item.closed_date;
            this.$refs.editDateModal.show();
        },
        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },
        deleteComplete () {
            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
        }
    }
};
</script>

<style scoped>

</style>
