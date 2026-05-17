<template>
    <div>
        <check-permission/>
        <vue-table-card v-if="currentUser.features.view_tender" class="card bs-5" title="Tender" :fields="fields"
                        :url="parent_id ? urls.Consumer.Tender.amendList : listUrl" :per-page="10" ref="table" :extra-params="{ parent: parent_id, project: project_id }">
            <template #tender_number="{rowData}">
                <div class="fl-te-c">
                    <div>{{ rowData.tender_number }}</div>
                    <btn v-if="rowData.is_root_parent" class="ml-2" color="primary"
                         icon="fa fa-file" @click="$router.push('/app/parent/' + rowData.id + '/tender/')"
                         size="xs"/>
                </div>
            </template>
            <template #buttons>
                <!-- <btn v-if="parent_id" color="primary" class="mr-2" size="sm" title="Back"
                     @click="$router.push('/app/tender/')"/> -->
                     <btn
    v-if="parent_id"
    color="primary"
    class="mr-2"
    size="sm"
    title="Back"
    @click="goBack"
/>
<btn
    v-if="!parent_id && isImport"
    color="success"
    icon="fa fa-upload"
    size="sm"
    @click="$refs.importModal.show()"
    text="Import"
/>

                <btn v-if="!parent_id && currentUser.features.create_new_tender" class="ml-2" color="success"
                     icon="fa fa-plus"
                     size="sm" @click="$refs.addModal.show()" text="Add"/>
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

                    <btn icon="" v-if="currentUser.features.bids_received && (rowData.status==='Published' ||
                         rowData.status==='Closed')
                         && (rowData.id===viewMoreId)" @click="tenderRevision(rowData)" text="Revision" size="xs"/>

<btn
    icon=""
    class="bgc-primary-200"
    @click="copyTender(rowData)"
    text="Amend"
    size="xs"
    v-if="currentUser.packages && currentUser.packages.issue_amendment === 'true'
      && rowData.status!=='Created' && (rowData.id===viewMoreId)"
/>

                    <btn icon="" v-if="currentUser.features.view_tender" class="bgc-primary-400" size="xs"
                         @click="viewDetails(rowData)" text="Open"/>

                    <btn icon="" v-if="currentUser.features.view_tender" class="bgc-primary-600" size="xs"
                         @click="preview(rowData)" text="Preview"/>

                    <btn
                        v-if="isExportEnabled() && (rowData.id === viewMoreId)"
                        color="success"
                        icon="fa fa-upload-file"
                        size="xs"
                        @click="showExportFile(rowData)"
                        text="Export"
                    />

                    <btn icon="fa fa-archive" class="bgc-info-700" size="xs"
                         v-if="!rowData.is_root_parent && currentUser.features.create_new_tender && canArchiveTenders
                         && (rowData.status==='Cancelled' || rowData.status==='Finalized')
                         && (rowData.id===viewMoreId)  "
                         @click="setArchiveTender(rowData.id)" text=""/>
                    <btn icon="fa fa-ellipsis-h" class="bgc-info-600" size="xs"
                         @click="viewMore(rowData)" text=""/>
                </div>
            </template>

            <template #footer>
                <modal no-close-on-backdrop title="Import Tender" ref="importModal" width="45r" header-color="primary">
                    <b-form :save-url="importUrl" @success="importSuccess" v-slot="{model, loading}">
                        <validated-input label="Tender" name="name" v-model="model.name"
                                         :rules="rules.name" :disabled="loading"/>
                        <validated-input label="Tender Number" name="tender_number"
                                         v-model="model.tender_number"
                                         :rules="rules.tender_number"
                                         :disabled="loading"/>
                        <validated-file-input label="File" name="file" v-model="model.file" :disabled="loading"/>
                        <save-btn text="Import" icon="" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Importing...</span></span>
                        </save-btn>
                    </b-form>
                </modal>
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
                        <!--                    <label>Json</label>-->
                        <!--                    <textarea-input name="Json" v-model="model.json" :rules="rules.name"/>-->
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
                                <validated-date-picker label="Close Date" name="Closed Date" v-model="model.closed_date"
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
                    <b-form
  :save-url="addUrl"
  @success="formSuccess"
  v-slot="{model, loading}"
  :save-params="{
      tender_id,
      copied_tender : true,
      is_root_parent,
      project: project_id
  }">
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
                        sure
                        ?</p>

                    <template #loading>
                        <loading-animation/>
                        Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
                    </template>
                </delete-modal>

                <delete-modal okButton="ok" cancelButton="cancel" no-close-on-backdrop headerColor="primary"
                              bodyColor="primary" okButtonColor="primary" :url="''" :params="{}"
                              ref="confirmArchiveModal" title="Archive Tender" @okClicked="confirmArchive">
                    <p>Do you wish to archive the Tender?</p>
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
    name : 'Tender',
    data () {
        return {
            urls,
            parent_id         : this.$route.params.id,
            listUrl           : urls.Consumer.Tender.list,
            deleteTender      : urls.Consumer.Tender.delete,
            addUrl            : urls.Consumer.Tender.create,
            importUrl         : urls.Consumer.Tender.importFile,
            closeDateUrl      : urls.Consumer.Tender.closeDate,
            project_id        : this.$route.query.project_id || '',
            archiving         : false,
            is_root_parent    : false,
            archive_tender_id : '',
            json              : '',
            viewMoreId        : '',
            currentRowID      : '',
            tender_id         : '',
            json_file         : '',
            file_name         : '',
            editingItem       : {
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
                file : {
                    required : true
                },
                json : {
                    required : true
                },
                closed_date : {
                    required : true
                }
            }
        };
    },
    watch : {
        '$route' (to, from) {
            this.$router.go();
        }
    },
    computed : {
        ...mapGetters(['currentUser']),
        isImport () {
            const flag = this.currentUser?.packages?.is_import;
            return flag === true || flag === 'true';
        },
        canArchiveTenders () {
            return this.currentUser?.packages?.archived_tenders === 'true';
        }
    },
    methods : {
        goBack () {
            const returnPath = sessionStorage.getItem('tenderReturnPath');
            const parentReturnPath = sessionStorage.getItem('parentTenderReturnPath');

            if (parentReturnPath && this.parent_id) {
                sessionStorage.removeItem('parentTenderReturnPath');
                sessionStorage.removeItem('tenderReturnPath');
                this.$router.replace(parentReturnPath);
            } else if (returnPath) {
                sessionStorage.removeItem('tenderReturnPath');
                this.$router.replace(returnPath);
            } else {
                this.$router.push('/app/tender/');
            }
        },
        tenderRevision (rowData) {
            this.$router.push('/app/tender/' + rowData.id + '/details/#Submitted');
        },
        setArchiveTender (id) {
            this.archive_tender_id = id;
            this.$refs.confirmArchiveModal.show();
        },
        async confirmArchive () {
            const response = await axios.form(
                urls.Consumer.Tender.archiveTender,
                { tender_id : this.archive_tender_id }
            );

            const json = response.data;

            if (json.error === false) {
                this.archiveSuccess(json.message);
            } else {
                this.archiveFailure(json.message); // 👈 message pass cheyyunnu
            }

            this.$refs.confirmArchiveModal.close();
        },
        archiveSuccess (message) {
            this.$notify(message || 'Archived Successfully', 'Success', {
                type : 'success'
            });
            this.$refs.confirmArchiveModal.close();
            this.$refs.table.refreshTable();
        },
        archiveFailure (message) {
            this.$notify(message || 'Could not archive the tender, Please try again later.', 'Error', {
                type : 'danger'
            });

            this.$refs.confirmArchiveModal.close();
            this.$refs.table.refreshTable();
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
            this.json_file = '';
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
        disabledBeforeTodayAndAfterAWeek (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return date < tomorrow;
        },
        exportSuccess () {
            this.$notify('Export Successful', 'Success', {
                type : 'success'
            });
            this.$refs.showExportModal.close();
        },
        importSuccess () {
            this.$notify('Import Successful', 'Success', {
                type : 'success'
            });
            this.$refs.importModal.close();
            this.$refs.table.refreshTable();
        },
        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            refs.editModal.close();
            refs.copyTenderModal.close();
            refs.editDateModal.close();
            refs.table.refreshTable();
        },
        viewDetails (rowData) {
            sessionStorage.setItem('tenderReturnPath', this.$route.fullPath); // ✅ Add this
            this.$router.push('/app/tender/' + rowData.id + '/details/');
        },
        preview (rowData) {
            sessionStorage.setItem('tenderReturnPath', this.$route.fullPath); // ✅ Add this
            this.$router.push('/app/tender/' + rowData.id + '/preview/');
        },
        setEdit (item) {
            this.editingItem.id = item.id;
            this.editingItem.name = item.name;
            this.editingItem.tender_number = item.tender_number;
            // this.editingItem.json = JSON.stringify(item.json);
            this.$refs.editModal.show();
        },
        copyTender (item) {
            this.is_root_parent = this.$route.path === '/app/tender/';
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

        deleteComplete (response) {
            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
        },
        isExportEnabled () {
            const exportTenderDocument = this.currentUser.packages?.export_tender_document;
            return exportTenderDocument === true || exportTenderDocument === 'true';
        }
    }
};
</script>

<style scoped>

</style>
