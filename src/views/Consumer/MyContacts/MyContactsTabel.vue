<template>
    <div>
        <check-permission/>

        <!-- Tender List -->
<vue-table-card
  v-if="viewType === 'list'"
  ref="table"
  class="card bs-5"
  title="Product Catalogue"
  :fields="fields"
  :url="listUrl"
  :per-page="per_page"
  :extra-params="extraParams"
>
            <template #tender_number="{rowData}">
                <div class="fl-te-c">
                    <div>{{ rowData.tender_number }}</div>
                    <btn v-if="rowData.is_root_parent" class="ml-2" color="primary"
                         icon="fa fa-file" @click="$router.push('/app/parent/' + rowData.id + '/tender/')"
                         size="xs"/>
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

                    <btn icon="" v-if="currentUser.features.bids_received && (rowData.status==='Published' ||
                         rowData.status==='Closed')
                         && (rowData.id===viewMoreId)" @click="tenderRevision(rowData)" text="Revision" size="xs"/>

                    <btn icon="" class="bgc-primary-200" @click="copyTender(rowData)" text="Amend" size="xs"
                         v-if="isAmendEnabled() && currentUser.features.create_new_tender && rowData.status!=='Created'
                          && (rowData.id===viewMoreId)"/>

                    <!-- <btn icon="" v-if="currentUser.features.view_tender" class="bgc-primary-400" size="xs"
                         @click="viewDetails(rowData)" text="Open"/> -->

                    <!-- <btn icon="" v-if="currentUser.features.view_tender" class="bgc-primary-600" size="xs"
                         @click="preview(rowData)" text="Preview"/>

                    <btn v-if="isExportEnabled() && (rowData.id===viewMoreId)" color="success"
                         icon="fa fa-upload-file" size="xs"
                         @click="showExportFile(rowData)"
                         text="Export"/> -->
                    <!-- <btn icon="fa fa-archive" class="bgc-info-700" size="xs"
                         v-if="!rowData.is_root_parent && currentUser.features.create_new_tender
                         && (rowData.status==='Cancelled' || rowData.status==='Finalized')
                         && (rowData.id===viewMoreId)"
                         @click="setArchiveTender(rowData.id)" text=""/>
                    <btn icon="fa fa-ellipsis-h" class="bgc-info-600" size="xs"
                         @click="viewMore(rowData)" text=""/> -->
                </div>
            </template>

            <template #footer>
                <modal no-close-on-backdrop title="Export Tender" ref="showExportModal" width="30r"
                       header-color="primary">
                    <validated-input label="File Name" v-model="file_name"
                                     :rules="{required :true}"/>
                    <btn size="sm" text="Export" @click="exportFile"/>
                </modal>

                <!-- Add Tender Modal - PASSES project_id -->
                <modal no-close-on-backdrop title="Add Tender" ref="addModal" width="45r" header-color="primary">
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}"
                            :save-params="saveParams">
                        <div class="row">
                            <div class="col">
                                <validated-input label="Tender Name" v-model="model.name"
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
                            :initial-data="editingItem"
                            :save-params="saveParams">
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
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}"
                            :save-params="copyTenderParams">
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
    name : 'ProjectDetails',

    data () {
        return {
            viewType          : 'list', // ✅ ADD THIS LINE
            listUrl           : urls.Consumer.Company.productCatalogueList, // ✅ FIXED
            projectId         : this.$route.params.id,
            projectName       : this.$route.query.name || 'Loading...',
            // listUrl           : urls.Consumer.Tender.list,
            deleteTender      : urls.Consumer.Tender.delete,
            addUrl            : urls.Consumer.Tender.create,
            closeDateUrl      : urls.Consumer.Tender.closeDate,
            archiving         : false,
            is_root_parent    : false,
            archive_tender_id : '',
            viewMoreId        : '',
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
                { name : 'name', title : 'name' },
                { name : 'description', title : 'description' },
                { name : 'unit', title : 'unit' },
                { name : 'price', title : 'price' },
                { name : 'location', title : 'location' },
                { name : 'quantity', title : 'quantity' },
                { name : 'rating', title : 'rating' },
                { name : 'price_valid_till', title : 'price valid till' },
                { name : 'specification', title : 'specification' },
                { name : 'remarks', title : 'remarks' },
                { name : 'grade', title : 'grade' },
                { name : 'updated_on', title : 'updated on' },
                {
                    name       : '__slot:actions',
                    titleClass : 'text-right',
                    dataClass  : 'text-right'
                }
            ],
            rules : {
                name          : { required : true },
                tender_number : { required : true },
                closed_date   : { required : true }
            }
        };
    },
    mounted () {
        if (this.$route.query.name) {
            this.projectName = this.$route.query.name;
        } else {
            this.fetchProjectDetails();
        }
    },

    computed : {
        ...mapGetters(['currentUser']),

        extraParams () {
            return {
                search          : this.search,
                vendor_category : this.vendor_category,
                industry        : this.industry,
                country         : this.country,
                state           : this.state,
                district        : this.district
            };
        },

        // Make save-params reactive
        saveParams () {
            return {
                project : this.projectId
            };
        },

        // Copy tender params
        copyTenderParams () {
            return {
                tender_id      : this.tender_id,
                copied_tender  : true,
                is_root_parent : this.is_root_parent,
                project        : this.projectId
            };
        }
    },

    methods : {
        // Helper function to check if Amend button should be enabled
        isAmendEnabled () {
            const issueAmendment = this.currentUser.packages.issue_amendment;
            return issueAmendment === true || issueAmendment === 'true';
        },

        // Helper function to check if Export button should be enabled
        isExportEnabled () {
            const exportTenderDocument = this.currentUser.packages.export_tender_document;
            return exportTenderDocument === true || exportTenderDocument === 'true';
        },

        async fetchProjectDetails () {
            try {
                const response = await axios.get(urls.Consumer.Projects.list);

                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    const currentProject = response.data.data.find(p => p.id === this.projectId);
                    if (currentProject) {
                        this.projectName = currentProject.name || 'Project Details';
                    } else {
                        this.projectName = 'Project Details';
                    }
                } else {
                    this.projectName = 'Project Details';
                }
            } catch (error) {
                console.error('Error fetching project details:', error);
                this.projectName = 'Project Details';
            }
        },

        goBack () {
            this.$router.push('/app/project/');
        },

        tenderRevision (rowData) {
            this.$router.push('/app/tender/' + rowData.id + '/details/#Submitted');
        },

        setArchiveTender (id) {
            this.archive_tender_id = id;
            this.$refs.confirmArchiveModal.show();
        },

        async confirmArchive () {
            this.archiving = true;
            try {
                const response = await axios.form(urls.Consumer.Tender.archiveTender,
                    { tender_id : this.archive_tender_id });
                const json = response.data;
                if (json.error === false) {
                    this.archiveSuccess();
                } else {
                    this.archiveFailure();
                }
            } catch (error) {
                this.archiveFailure();
            }
            this.archiving = false;
            this.$refs.confirmArchiveModal.close();
        },

        archiveSuccess () {
            this.$notify('Archived Successfully', 'Success', {
                type : 'success'
            });
            this.$refs.confirmArchiveModal.close();
            this.$refs.table.refreshTable();
        },

        archiveFailure () {
            this.$notify('Could not archive the tender, Please try again later.', 'Error', {
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
            this.json_file = item;
            this.$refs.showExportModal.show();
        },

        async exportFile () {
            const response = await axios.form(urls.Consumer.Tender.getJson, { tender_id : this.json_file.id });
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

        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            refs.editModal.close();
            refs.copyTenderModal.close();
            refs.editDateModal.close();
            refs.table.refreshTable();
        },

        viewDetails (rowData) {
            sessionStorage.setItem('tenderReturnPath', this.$route.fullPath);
            this.$router.push('/app/tender/' + rowData.id + '/details/');
        },

        preview (rowData) {
            sessionStorage.setItem('tenderReturnPath', this.$route.fullPath);
            this.$router.push('/app/tender/' + rowData.id + '/preview/');
        },

        setEdit (item) {
            this.editingItem.id = item.id;
            this.editingItem.name = item.name;
            this.editingItem.tender_number = item.tender_number;
            this.$refs.editModal.show();
        },

        copyTender (item) {
            this.is_root_parent = false;
            this.tender_id = item.id;
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
            if (response && response.data) {
                if (response.data.error === false && response.data.success === true) {
                    this.$notify(response.data.msg || 'Tender Deleted Successfully', 'Success', {
                        type : 'success'
                    });
                } else {
                    this.$notify(response.data.msg || 'Failed to delete tender', 'Error', {
                        type : 'danger'
                    });
                }
            } else {
                this.$notify('Tender Deleted Successfully', 'Success', {
                    type : 'success'
                });
            }

            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
        }
    }
};
</script>

<style scoped>
.page-header h2 {
    color: #1f2937;
    font-weight: 600;
}

.text-muted {
    color: #6b7280;
    font-size: 14px;
}
</style>
