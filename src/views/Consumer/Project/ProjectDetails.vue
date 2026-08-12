<template>
    <div>
        <check-permission/>

        <!-- Tender List -->
        <vue-table-card v-if="currentUser.features.view_tender" class="card bs-5" :title="projectName" :fields="fields"
                        :url="listUrl" :per-page="10" ref="table" :extra-params="extraParams" >

            <template #tender_number="{rowData}">
                <div class="fl-te-c">
                    <div>{{ rowData.tender_number }}</div>
                    <!-- <btn v-if="rowData.is_root_parent" class="ml-2" color="primary"
                         icon="fa fa-file" @click="$router.push('/app/parent/' + rowData.id + '/tender/')"
                         size="xs"/> -->
<btn
    v-if="rowData.is_root_parent"
    class="ml-2"
    color="primary"
    icon="fa fa-file"
    size="xs"
    @click="openTenderFromProject(rowData)"
/>
                </div>
            </template>

            <template #buttons>
                <!-- Import button -->
                <btn
                     v-if="!parent_id && isImport"
                    color="success"
                    icon="fa fa-upload"
                    size="sm"
                    @click="openImportModal"
                    text="Import"
                    class="mr-2"
                />
                <!-- Add button for project-specific tenders -->
                <btn v-if="currentUser.features.create_new_tender" color="primary"
                     icon="fa fa-plus" size="sm" @click="openAddModal" text="Add Tender"/>

                <btn v-if="canArchiveTenders" color="primary" class="ml-2"
     icon="fa fa-archive" size="sm" @click="archiveTenders()" text="Archived Tenders"/>
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

                    <btn icon="" v-if="currentUser.features.view_tender" class="bgc-primary-400" size="xs"
                         @click="viewDetails(rowData)" text="Open"/>

                    <btn icon="" v-if="currentUser.features.view_tender" class="bgc-primary-600" size="xs"
                         @click="preview(rowData)" text="Preview"/>

                    <btn v-if="isExportEnabled() && (rowData.id===viewMoreId)" color="success"
                         icon="fa fa-upload-file" size="xs"
                         @click="showExportFile(rowData)"
                         text="Export"/>
                    <btn icon="fa fa-archive" class="bgc-info-700" size="xs"
                        v-if="canArchiveTenders && !rowData.is_root_parent
                        && currentUser.features.create_new_tender
                        && (rowData.status==='Cancelled' || rowData.status==='Finalized')
                        && (rowData.id===viewMoreId)"
                        @click="setArchiveTender(rowData.id)" text=""/>
                    <btn icon="fa fa-ellipsis-h" class="bgc-info-600" size="xs"
                         @click="viewMore(rowData)" text=""/>
                </div>
            </template>

            <template #footer>
                <!-- Import Modal -->
                <modal no-close-on-backdrop title="Import Tender" ref="importModal" width="45r" header-color="primary"
                       @close="resetImportModal">
                    <div>
                        <validated-input
                            label="Tender"
                            name="name"
                            v-model="importModel.name"
                            :rules="rules.name"
                            :disabled="importLoading"/>

                        <validated-input
                            label="Tender Number"
                            name="tender_number"
                            v-model="importModel.tender_number"
                            :rules="rules.tender_number"
                            :disabled="importLoading"/>

                        <validated-file-input
                            label="File"
                            name="file"
                            v-model="importModel.file"
                            :disabled="importLoading"/>

                        <btn
                            text="Import"
                            icon=""
                            color="primary"
                            size="sm"
                            @click="handleImport"
                            :disabled="importLoading">
                            <span v-if="importLoading">
                                <loading-animation/>
                                <span style="vertical-align: super"> Importing...</span>
                            </span>
                        </btn>
                    </div>
                </modal>

                <modal no-close-on-backdrop title="Export Tender" ref="showExportModal" width="30r"
                       header-color="primary">
                    <validated-input label="File Name" v-model="file_name"
                                     :rules="{required :true}"/>
                    <btn size="sm" text="Export" @click="exportFile"/>
                </modal>

                <!-- Add Tender Modal - PASSES project_id -->
                <modal no-close-on-backdrop title="Add Tender" ref="addModal" width="45r" header-color="primary"
                       @close="resetAddModal">
                    <div class="row">
                        <div class="col">
                            <validated-input label="Tender Name" v-model="addModel.name"
                                             :rules="rules.name"
                                             @keyup.enter="handleAddTender"/>
                            <validated-input label="Tender Number" name="Tender Number"
                                             v-model="addModel.tender_number"
                                             :rules="rules.tender_number"
                                             @keyup.enter="handleAddTender"/>
                        </div>
                    </div>
                    <btn text="Add Tender" color="primary" size="sm" @click="handleAddTender" :disabled="addLoading">
                        <span v-if="addLoading"><loading-animation/><span
                            style="vertical-align: super"> Saving...</span></span>
                    </btn>
                </modal>

                <modal no-close-on-backdrop title="Edit Tender" ref="editModal" width="30r" header-color="primary"
                       @close="resetEditModal">
                    <validated-input label="Tender" v-model="editingItem.name"
                                     :rules="rules.name"
                                     @keyup.enter="handleEditTender"/>
                    <validated-input label="Tender Number" name="Tender Number"
                                     v-model="editingItem.tender_number"
                                     :rules="rules.tender_number"
                                     @keyup.enter="handleEditTender"/>
                    <btn text="Update" icon="" color="primary" size="sm" @click="handleEditTender" :disabled="editLoading">
                        <span v-if="editLoading"><loading-animation/><span
                            style="vertical-align: super"> Updating...</span></span>
                    </btn>
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
                       no-close-on-backdrop @close="resetAmendModal">
                    <validated-input label="Tender name"
                                     v-model="amendModel.name"
                                     :rules="rules.name"
                                     @keyup.enter="handleAmendTender"/>
                    <validated-input label="Tender Number" name="Tender Number"
                                     v-model="amendModel.tender_number"
                                     :rules="rules.tender_number"
                                     @keyup.enter="handleAmendTender"/>
                    <btn icon="" text="Save" color="primary" size="sm" @click="handleAmendTender" :disabled="amendLoading">
                        <span v-if="amendLoading"><loading-animation/><span
                            style="vertical-align: super"> Updating...</span></span>
                    </btn>
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
            projectId         : this.$route.params.id,
            projectName       : this.$route.query.name || 'Loading...',
            listUrl           : urls.Consumer.Tender.list,
            deleteTender      : urls.Consumer.Tender.delete,
            addUrl            : urls.Consumer.Tender.create,
            importUrl         : urls.Consumer.Tender.importFile,
            closeDateUrl      : urls.Consumer.Tender.closeDate,
            archiving         : false,
            is_root_parent    : false,
            archive_tender_id : '',
            viewMoreId        : '',
            tender_id         : '',
            json_file         : '',
            file_name         : '',
            existingTenders   : [],
            addLoading        : false,
            editLoading       : false,
            amendLoading      : false,
            importLoading     : false,
            importModel       : {
                name          : '',
                tender_number : '',
                file          : null
            },
            addModel : {
                name          : '',
                tender_number : ''
            },
            amendModel : {
                name          : '',
                tender_number : ''
            },
            editingItem : {
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
                    title     : 'Tender Name'
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
                closed_date : {
                    required : true
                }
            }
        };
    },

    mounted () {
        if (this.$route.query.name) {
            this.projectName = this.$route.query.name;
        } else {
            this.fetchProjectDetails();
        }
        this.loadExistingTenders();
    },

    computed : {
        ...mapGetters(['currentUser']),
        isImport () {
            const flag = this.currentUser?.packages?.is_import;
            return flag === true || flag === 'true';
        },
        // Make extra-params reactive
        extraParams () {
            return {
                project : this.projectId
            };
        },

        // Make save-params reactive
        saveParams () {
            return {
                project : this.projectId
            };
        },

        importInitialData () {
            return {
                project : this.projectId
            };
        },
        canArchiveTenders () {
            const val = this.currentUser?.packages?.archived_tenders;
            console.log('canArchiveTenders:', val);
            return val === 'true';
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
        openTenderFromProject (rowData) {
            sessionStorage.setItem('tenderReturnPath', this.$route.fullPath);
            sessionStorage.setItem('parentTenderReturnPath', this.$route.fullPath); // ✅ Add this line
            this.$router.replace('/app/parent/' + rowData.id + '/tender/');
        },
        // Open Import Modal
        openImportModal () {
            this.importModel.name = '';
            this.importModel.tender_number = '';
            this.importModel.file = null;
            this.importLoading = false;
            this.$refs.importModal.show();
        },

        // Reset Import Modal
        resetImportModal () {
            this.importModel.name = '';
            this.importModel.tender_number = '';
            this.importModel.file = null;
            this.importLoading = false;
        },

        // Handle Import
        async handleImport () {
            // Validate
            if (!this.importModel.name || !this.importModel.tender_number || !this.importModel.file) {
                this.$notify('Please fill all required fields', 'Error', {
                    type : 'danger'
                });
                return;
            }

            this.importLoading = true;

            try {
                const response = await axios.form(this.importUrl, {
                    name          : this.importModel.name,
                    tender_number : this.importModel.tender_number,
                    file          : this.importModel.file,
                    project       : this.projectId
                });

                console.log('Import Response:', response.data);

                // Check permission (same as exportFile)
                if (response.data.permission === false) {
                    this.$notify(
                        'You do not have permission to import this tender',
                        'Permission Denied',
                        { type : 'warning' }
                    );
                    // this.$refs.importModal.close();
                    this.importLoading = false;
                    return;
                }

                // Check for errors
                if (response.data.error === true) {
                    let errorMessage = 'Failed to import tender';
                    if (response.data.errors) {
                        const errorMessages = Object.values(response.data.errors);
                        errorMessage = errorMessages.join(', ');
                    } else if (response.data.msg) {
                        errorMessage = response.data.msg;
                    }

                    this.$notify(errorMessage, 'Error', {
                        type : 'danger'
                    });
                    this.$refs.importModal.close();
                    this.importLoading = false;
                    return;
                }

                // Success
                this.$notify(
                    response.data.msg || 'Tender imported successfully',
                    'Success',
                    { type : 'success' }
                );

                // Reset form
                this.importModel.name = '';
                this.importModel.tender_number = '';
                this.importModel.file = null;

                this.$refs.importModal.close();
                this.$refs.table.refreshTable();
                this.loadExistingTenders();
            } catch (error) {
                console.error('Import error:', error);
                this.$notify('Failed to import tender', 'Error', {
                    type : 'danger'
                });
            }

            this.importLoading = false;
        },

        // Open modal methods - clear data before opening
        openAddModal () {
            this.addModel.name = '';
            this.addModel.tender_number = '';
            this.addLoading = false;
            this.$refs.addModal.show();
        },

        openEditModal (item) {
            this.editingItem.id = item.id;
            this.editingItem.name = item.name;
            this.editingItem.tender_number = item.tender_number;
            this.editLoading = false;
            this.$refs.editModal.show();
        },

        openAmendModal (item) {
            this.is_root_parent = true;
            this.tender_id = item.id;
            this.amendModel.name = '';
            this.amendModel.tender_number = '';
            this.amendLoading = false;
            this.$refs.copyTenderModal.show();
        },

        // Reset methods for clearing modal data
        resetAddModal () {
            this.addModel.name = '';
            this.addModel.tender_number = '';
            this.addLoading = false;
        },

        resetEditModal () {
            this.editingItem.id = '';
            this.editingItem.name = '';
            this.editingItem.tender_number = '';
            this.editLoading = false;
        },

        resetAmendModal () {
            this.amendModel.name = '';
            this.amendModel.tender_number = '';
            this.amendLoading = false;
        },

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

        async loadExistingTenders () {
            try {
                const response = await axios.get(this.listUrl, {
                    params : { project : this.projectId }
                });
                if (response.data && response.data.data) {
                    this.existingTenders = response.data.data;
                }
            } catch (error) {
                console.error('Error loading existing tenders:', error);
            }
        },

        checkDuplicateTender (name, tenderNumber, excludeId = null) {
            if (!name || !tenderNumber) {
                return null;
            }

            const nameLower = name.trim().toLowerCase();
            const numberLower = tenderNumber.trim().toLowerCase();

            const duplicate = this.existingTenders.find(tender => {
                if (excludeId && tender.id === excludeId) {
                    return false;
                }
                return tender.name.trim().toLowerCase() === nameLower ||
                       tender.tender_number.trim().toLowerCase() === numberLower;
            });

            if (duplicate) {
                let message = 'A tender with ';
                if (duplicate.name.trim().toLowerCase() === nameLower) {
                    message += `the name "${duplicate.name}"`;
                }
                if (duplicate.tender_number.trim().toLowerCase() === numberLower) {
                    if (duplicate.name.trim().toLowerCase() === nameLower) {
                        message += ' and ';
                    }
                    message += `the number "${duplicate.tender_number}"`;
                }
                message += ' already exists.';
                return message;
            }
            return null;
        },

        async handleAddTender () {
            // Check for duplicates
            const error = this.checkDuplicateTender(this.addModel.name, this.addModel.tender_number);
            if (error) {
                this.$notify(error, 'Warning', {
                    type : 'warning'
                });
                return;
            }

            // Validate required fields
            if (!this.addModel.name || !this.addModel.tender_number) {
                this.$notify('Please fill all required fields', 'Error', {
                    type : 'danger'
                });
                return;
            }

            this.addLoading = true;
            try {
                const response = await axios.form(this.addUrl, {
                    name          : this.addModel.name,
                    tender_number : this.addModel.tender_number,
                    project       : this.projectId
                });

                if (response.data.error === false) {
                    this.$notify('Tender Added Successfully', 'Success', {
                        type : 'success'
                    });
                    this.addModel.name = '';
                    this.addModel.tender_number = '';
                    this.$refs.addModal.close();
                    this.$refs.table.refreshTable();
                    this.loadExistingTenders();
                } else {
                    // Handle backend validation errors
                    let errorMessage = 'Failed to add tender';
                    if (response.data.errors) {
                        // Extract error messages from errors object
                        const errorMessages = Object.values(response.data.errors);
                        errorMessage = errorMessages.join(', ');
                    } else if (response.data.msg) {
                        errorMessage = response.data.msg;
                    }

                    this.$notify(errorMessage, 'warning', {
                        type : 'warning'
                    });
                }
            } catch (error) {
                this.$notify('Failed to add tender', 'Error', {
                    type : 'danger'
                });
            }
            this.addLoading = false;
        },

        async handleEditTender () {
            // Check for duplicates (excluding current item)
            const error = this.checkDuplicateTender(
                this.editingItem.name,
                this.editingItem.tender_number,
                this.editingItem.id
            );
            if (error) {
                this.$notify(error, 'Warning', {
                    type : 'warning'
                });
                return;
            }

            // Validate required fields
            if (!this.editingItem.name || !this.editingItem.tender_number) {
                this.$notify('Please fill all required fields', 'Error', {
                    type : 'danger'
                });
                return;
            }

            this.editLoading = true;
            try {
                const response = await axios.form(this.addUrl, {
                    id            : this.editingItem.id,
                    name          : this.editingItem.name,
                    tender_number : this.editingItem.tender_number,
                    project       : this.projectId
                });

                if (response.data.error === false) {
                    this.$notify('Tender Updated Successfully', 'Success', {
                        type : 'success'
                    });
                    this.$refs.editModal.close();
                    this.$refs.table.refreshTable();
                    this.loadExistingTenders();
                } else {
                    // Handle backend validation errors
                    let errorMessage = 'Failed to update tender';
                    if (response.data.errors) {
                        const errorMessages = Object.values(response.data.errors);
                        errorMessage = errorMessages.join(', ');
                    } else if (response.data.msg) {
                        errorMessage = response.data.msg;
                    }

                    this.$notify(errorMessage, 'Error', {
                        type : 'danger'
                    });
                }
            } catch (error) {
                this.$notify('Failed to update tender', 'Error', {
                    type : 'danger'
                });
            }
            this.editLoading = false;
        },

        async handleAmendTender () {
            // Check for duplicates
            const error = this.checkDuplicateTender(this.amendModel.name, this.amendModel.tender_number);
            if (error) {
                this.$notify(error, 'Warning', {
                    type : 'warning'
                });
                return;
            }

            // Validate required fields
            if (!this.amendModel.name || !this.amendModel.tender_number) {
                this.$notify('Please fill all required fields', 'Error', {
                    type : 'danger'
                });
                return;
            }

            this.amendLoading = true;
            try {
                const response = await axios.form(this.addUrl, {
                    name           : this.amendModel.name,
                    tender_number  : this.amendModel.tender_number,
                    tender_id      : this.tender_id,
                    copied_tender  : true,
                    is_root_parent : this.is_root_parent,
                    project        : this.projectId
                });

                if (response.data.error === false) {
                    this.$notify('Tender Amended Successfully', 'Success', {
                        type : 'success'
                    });
                    this.amendModel.name = '';
                    this.amendModel.tender_number = '';
                    this.$refs.copyTenderModal.close();
                    this.$refs.table.refreshTable();
                    this.loadExistingTenders();
                } else {
                    // Handle backend validation errors
                    let errorMessage = 'Failed to amend tender';
                    if (response.data.errors) {
                        const errorMessages = Object.values(response.data.errors);
                        errorMessage = errorMessages.join(', ');
                    } else if (response.data.msg) {
                        errorMessage = response.data.msg;
                    }

                    this.$notify(errorMessage, 'Error', {
                        type : 'danger'
                    });
                }
            } catch (error) {
                this.$notify('Failed to amend tender', 'Error', {
                    type : 'danger'
                });
            }
            this.amendLoading = false;
        },

        goBack () {
            this.$router.push('/app/project/');
        },

        tenderRevision (rowData) {
            sessionStorage.setItem('tenderReturnPath', this.$route.fullPath);
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
            if (response.data.permission === false) {
                this.$notify(
                    'You do not have permission to export this tender',
                    'Permission Denied',
                    { type : 'warning' }
                );
                return;
            }
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
            this.loadExistingTenders();
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
            this.openEditModal(item);
        },

        copyTender (item) {
            this.openAmendModal(item);
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
            const data = response.data || response;
            console.log(data);
            if (data.success === true) {
                this.$notify(
                    data.msg || 'Deleted Successfully',
                    'Success',
                    { type : 'success' }
                );
                this.$refs.table.refreshTable();
            } else {
                this.$notify(
                    data.msg || 'Unable to delete record',
                    'Warning',
                    { type : 'warning' }
                );
            }

            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
            this.loadExistingTenders();
        },
        archiveTenders () {
            this.$router.push({
                path  : '/app/archived/tender/',
                query : {
                    project_id   : this.projectId,
                    project_name : this.projectName
                }
            });
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
