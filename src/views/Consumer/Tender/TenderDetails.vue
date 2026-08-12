<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>

        <!--            Tender Edit Form           -->

        <div v-if="!loading && currentUser.features.view_tender">
            <div v-if="details">
                <Canvas id="canvas" class="mb-4" @back="backClicked"
                        v-if="(details.status==='Created' || details.status==='Saved')"
                        :json="initial_json" @save="onSave" @saveTemplate="saveToMyTemplate" @upload="uploadFile"  @uploadExcel="uploadExcelFile"
                        @publish="showInviteModal" ref="canvas"
                        :number="details.tender_number" :title="details.name">
                    <template #status>
                        <btn disabled color="white" class="btn-basic-b" icon="" size="xs"
                             :text="details.status"/>
                    </template>
                </Canvas>
            </div>
            <div
                v-if="details && (details.status==='Published' || details.status==='Closed' || details.status==='Cancelled' || details.status==='Finalized')"
                class="card container bs-5 mb-5">
                <div class="row">
                    <div class="col">
                        <span :title="details.name" class="h4 pt-1">{{ details.name.substring(0, 20) }}....</span>
                        <span v-if="details.status==='Published'"
                              class="status card bg-success">Published</span>
                        <span v-if="details.status==='Cancelled'"
                              class="status card bg-danger">Cancelled</span>
                        <span v-if="details.status==='Closed'" class="status card bg-warning">Closed</span>
                        <span v-if="details.status==='Finalized'" class="status card bg-success">Finalized</span>
                    </div>
                    <div class="col text-right mb-3">
                        <btn class="mr-2" type="button"
                             v-show="details.status==='Saved' || details.status==='Published' || details.status==='Created'"
                             color="danger" size="xs" @click="$refs.cancelModal.show()"
                             text="Cancel Tender"/>
                        <btn type="button" color="primary" size="xs" class="ml-1"
                             @click="goTO('Bidders')" text="Bidders"/>
                        <btn type="button" color="primary" size="xs" class="ml-1"
                             @click="goTO('Response')" text="Responses"/>
                        <btn v-if="details.status==='Finalized'" type="button" color="primary" size="xs" class="ml-1"
                             @click="goTO('Finalized')" text="Finalized List"/>
                        <btn type="button" color="primary" size="xs" class="ml-1"
                             @click="backClicked" text="Back"/>
                    </div>
                </div>
                <BidView :json="initial_json" :variable-json="variablesJson" id="bidView"
                         :title="details.name + ' # ' + details.id" :key="initial_json"/>
            </div>
            <div
                v-if="details">
                <vue-table-card title="Attachments" class="container bs-5" :fields="fields2"
                                :url="uploadFileList" :per-page="10" id="FileUpload"
                                ref="tableFileUpload" :extra-params="{ tender_id }">
                    <template #buttons>
                        <btn
                            v-if="currentUser.features.is_import && (details.status==='Created' || details.status==='Saved')"
                            color="success" icon="" size="xs" @click="uploadFile" text="Upload File"/>
                    </template>

                    <template #actions="{rowData}">
                        <div class="btn-group-tight">
                            <edit-btn text="view" icon="fa fa-eye" @click="viewFile(rowData)"/>
                            <delete-btn v-if="(details.status==='Created' || details.status==='Saved')"
                                        @click="setFileDelete(rowData)"/>
                            <edit-btn v-if="(details.status==='Created' || details.status==='Saved')"
                                      @click="setFileEdit(rowData)"/>
                        </div>
                    </template>
                </vue-table-card>
            </div>

            <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>

            <!--            Form Modals           -->

            <modal title="Invite Bidders" ref="addModal" width="30r" header-color="primary"
                   no-close-on-backdrop>
                <b-form :save-url="publishTender" @success="tenderPublished" v-slot="{model, loading}"
                        :save-params="{ tender_id, json }">
                    <validated-date-picker label="Close Date" name="closed_date" v-model="model.closed_date"
                                           :rules="rules.closed_date" :disabled="loading"
                                           :disabled-date="disabledBeforeTodayAndAfterAWeek"/>
                    <validated-vue-select name="bidder" :options="bidderOptions" :rules="rules.bidders"
                                          label="Bidder" :disabled="loading" multiple
                                          v-model="model.bidder"/>
                    <save-btn icon="" text="Invite" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Sending Invitation...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <modal title="Invite Bidders" ref="addInviteModal" width="30r" header-color="primary"
                   no-close-on-backdrop>
                <b-form :save-url="inviteTender" @success="tenderPublished1" v-slot="{model, loading}"
                        :save-params="{ tender_id, json: initial_json }">
                    <validated-vue-select name="Bidder" :options="bidderOptions" :rules="rules.bidders"
                                          label="Bidder" :disabled="loading"
                                          v-model="model.bidder"/>
                    <save-btn icon="" text="Invite" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Sending Invitation...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <delete-modal okButton="Yes" ref="cancelModal" title="Cancel Tender" :url="cancelTender"
                          :params="{tender_id}"
                          @response="cancelComplete">
                <p>You are about to cancel the Tender <b v-html="cancelItem && cancelItem.name"></b>. Are
                    you
                    sure
                    ?</p>

                <template #loading>
                    <loading-animation/>
                    Please wait while we delete <b v-html="cancelItem && cancelItem.name"></b>.
                </template>
            </delete-modal>

            <delete-modal ref="deleteModal" :url="deleteFileUrl" :params="deletingItem" @response="deleteFileComplete">
                <p>You are about to delete the file. Are you sure ?</p>

                <template #loading>
                    <loading-animation/>
                    Please wait while we delete.
                </template>
            </delete-modal>

            <delete-modal okButton="ok" cancelButton="cancel" no-close-on-backdrop headerColor="primary"
                          bodyColor="primary" okButtonColor="primary" url="aaa"
                          ref="confirmModal" title="Confirm Exit" @okClicked="confirmExit">
                <p>Changes you made is not saved.</p>
                <b>Exit without saving?</b>
            </delete-modal>

            <!--            Form Modals           -->

            <modal title="My Template" ref="addTemplateModal" width="30r" header-color="primary"
                   no-close-on-backdrop>
                <b-form :save-url="addUrl" @success="templateFormSuccess" v-slot="{model, loading}"
                        :save-params="{ tender_id, json: saveJson }">
                    <validated-input label="Template Name"
                                     v-model="model.name"
                                     :rules="rules.name"
                                     :disabled="loading"/>
                    <save-btn icon="" text="Create" color="primary" size="sm" :disabled="loading"/>
                </b-form>
            </modal>
          <!-- Excel Upload Modal code -->
          <modal no-close-on-backdrop title="Upload Excel File" ref="uploadExcelFileModal" width="30r" header-color="primary">
                <b-form :save-url="uploadExcelUrl"
                        @success="uploadExcelFormSuccess"
                        @failure="uploadExcelFormFailure"
                        v-slot="{model, loading}"
                        :save-params="{ tender_id, tab_name: currentTabName }"
                        @submit.prevent>
                    <validated-file-input
                        label="Upload Excel File"
                        v-model="model.file"
                        accept=".xlsx,.xls"
                        :disabled="loading || excelUploading"/>
                    <save-btn text="Upload" color="primary" size="sm"
                            :disabled="loading || excelUploading">
                        <span v-if="loading || excelUploading">
                            <loading-animation/>
                            <span style="vertical-align: super"> Uploading...</span>
                        </span>
                    </save-btn>
                </b-form>
            </modal>

            <modal no-close-on-backdrop title="Upload File" ref="uploadFileModal" width="30r" header-color="primary">
                <b-form :save-url="uploadFileUrl" @success="uploadFormSuccess" v-slot="{model, loading}"
                        :save-params="{ tender_id }">
                    <validated-file-input label="Upload File" v-model="model.file"
                                          :disabled="loading"/>
                    <save-btn text="Upload" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Uploading...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <modal no-close-on-backdrop title="Update File" ref="updateFileModal" width="30r" header-color="primary">
                <b-form :save-url="uploadFileUrl" @success="fileFormSuccess" v-slot="{model, loading}"
                        :initial-data="editingFileItem">
                    <validated-file-input label="Upload File" v-model="model.file"
                                          :disabled="loading"/>
                    <save-btn text="Update" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Updating...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <!--            Bidders List            -->

            <div
                v-if="details && (details.status==='Published' ||  details.status==='Closed' || details.status==='Cancelled' || details.status==='Finalized')">
                <vue-table-card title="Bidders" class="container bs-5" :fields="fields" :url="bidderList"
                                :per-page="10" id="Bidders"
                                ref="biddersTables" :extra-params="{ tender_id }">
                    <template #buttons>
                        <btn
                            v-if="(details.status!=='Closed' && details.status!=='Finalized' && details.status!=='Cancelled') && currentUser.features.issue_tender"
                            color="success" icon="fa fa-plus" size="xs" @click="showInviteModal1"
                            text="Invite Bidders"/>
                    </template>
                    <template #actions="{rowData}">
                        <div class="btn-group-tight">
                            <btn class="bgc-primary-200"
                                 v-if="currentUser.role==='owner' &&  rowData.has_chat"
                                 size="xs" @click="viewChat(rowData)"
                                 text="Query"/>
                        </div>
                    </template>
                </vue-table-card>
            </div>

            <div
                v-if="currentUser.features.bids_received && details && (details.status==='Published' ||  details.status==='Closed' || details.status==='Cancelled' || details.status==='Finalized')">
                <vue-table-card title="Bidders Response" class="container bs-5" :fields="submittedFields"
                                :url="bidderResponseList" :per-page="10" id="Response"
                                ref="resposeTable" :extra-params="{ tender_id }">
                    <template #buttons>
                        <btn color="success"
                             v-if="currentUser.features.analysis && details.is_submitted && (details.status==='Closed')"
                             icon="" size="xs" @click="showBidAnalysis" text="Bid Analysis"/>
                    </template>
                    <template #actions="{rowData}">
                        <div class="btn-group-tight">
                            <btn :loading="unlockLoading" loading-text="Unlocking..."
                                 v-if="rowData.status==='Submitted' && !rowData.is_unlocked && (rowData.tender_status==='Published' && rowData.tender_status==='Closed')"
                                 type="button" color="primary" size="xs" @click="unlockBidder(rowData)" text="Unlock"/>
                            <btn
                                v-if="rowData.status!=='Submitted' && rowData.is_unlocked && rowData.status!=='Finalized' && (rowData.tender_status==='Published' && rowData.tender_status==='Closed')"
                                type="button" color="secondary" size="xs" text="Unlocked"/>
                            <!--                            <btn v-if="rowData.status==='Submitted' && rowData.is_unlocked && rowData.status!=='Finalized' && (rowData.tender_status!=='Finalized' && rowData.tender_status!=='Cancelled')" type="button"-->
                            <!--                                 color="success" size="xs" text="Re-Submitted"/>-->
                            <btn type="button" color="warning" size="xs" @click="printScreen(rowData)" text="Print"/>
                            <btn color="primary" size="xs" @click="preview(rowData)" text="view"/>
                        </div>
                    </template>
                </vue-table-card>
            </div>

            <div v-if="currentUser.features.bids_received && (details.status==='Finalized') && data.length!==0"
                 class="card bs-5 container" id="Finalized">
                <div class="row">
                    <div class="col float-left">
                        <h4>Finalized List</h4>
                    </div>
                    <div class="col text-right">
                        <btn color="success"
                             v-if="currentUser.features.analysis && details.is_submitted && (details.status==='Finalized')"
                             icon="" size="xs" @click="showBidAnalysis" text="Bid Analysis"/>
                    </div>
                </div>
                <simple-table hide-if-no-data
                              :data="data" :fields="fields1" ref="table">
                    <template #actions="{rowData}">
                        <div class="btn-group-tight">
                            <edit-btn text="Winner" icon="fa fa-star" color="success" v-if="rowData.is_winner"/>
                        </div>
                    </template>
                </simple-table>
            </div>
        </div>
        <div v-if="!currentUser.features.view_tender" class="card text-center bg-primary">
            Sorry, You don't have permission to view this page. Kindly contact your Owner.
        </div>
    </div>
</template>
<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import Canvas from '../../../component/Editor/Canvas';
import BidView from '@/component/Bidder/BidView';
import OneBid from '@/data/Samples/OneBid';

export default {
    name       : 'TenderDetailsPage',
    components : { Canvas, BidView },
    data () {
        const now = new Date();
        const month = now.getMonth() + 1;
        const minDate = now.getFullYear() + '-' + month + '-' + now.getDate();
        return {
            style : {
                height : ''

            },
            show               : false,
            goBack             : false,
            unlockLoading      : false,
            routeNextPath      : '',
            loading            : false,
            permission         : true,
            id                 : this.$route.params.id,
            tender_id          : this.$route.params.id,
            goto               : this.$route.params.goto,
            min                : minDate,
            initial_json       : null,
            bidder_id          : '',
            json               : null,
            saveJson           : null,
            details            : [],
            data               : [],
            bidderOptions      : [],
            addUrl             : urls.Consumer.MyTemplate.addEdit,
            uploadFileUrl      : urls.Consumer.Tender.uploadFile,
            uploadExcelUrl     : urls.Consumer.Tender.uploadExcelFile,
            publishTender      : urls.Consumer.Tender.publishTender,
            inviteTender       : urls.Consumer.Tender.inviteTender,
            bidderAdd          : urls.Consumer.Tender.bidderAdd,
            bidderList         : urls.Consumer.Tender.bidderList,
            bidderResponseList : urls.Consumer.Tender.bidderResponseList,
            cancelTender       : urls.Consumer.Tender.cancelTender,
            deleteFileUrl      : urls.Consumer.Tender.deleteFile,
            uploadFileList     : urls.Consumer.Tender.uploadFileList,
            cancelItem         : null,
            tenderName         : '',
            tenderNumber       : '',
            deletingItem       : {
                id : ''
            },
            editingItem : {
                tender_number : '',
                id            : '',
                json          : this.initial_json,
                tender_id     : this.$route.params.id,
                name          : ''
            },
            editingFileItem : {
                id        : '',
                tender_id : this.$route.params.id,
                file      : ''
            },
            excelUploading      : false,
            isUploadingSilently : false,
            excelUploadData     : {
                file     : null,
                tab_name : ''
            },
            excelErrors : {
                file     : null,
                tab_name : null
            },
            currentTabName : 'First Tab',
            excelColumns   : [],
            excelFileRules : {},
            fields         : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'user',
                    sortField : 'user',
                    title     : 'Bidder'
                },
                {
                    name      : 'company',
                    sortField : 'company',
                    title     : 'Company'
                },
                {
                    name      : 'contact_number',
                    sortField : 'contact_number',
                    title     : 'Phone'
                },
                {
                    name      : 'contact_e_mail_id',
                    sortField : 'contact_e_mail_id',
                    title     : 'E-Mail'
                },
                {
                    name      : 'status',
                    sortField : 'status',
                    title     : 'Status'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            submittedFields : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'user',
                    sortField : 'user',
                    title     : 'Bidder'
                },
                {
                    name      : 'company',
                    sortField : 'company',
                    title     : 'Company'
                },
                {
                    name      : 'contact_number',
                    sortField : 'contact_number',
                    title     : 'Phone'
                },
                {
                    name      : 'contact_e_mail_id',
                    sortField : 'contact_e_mail_id',
                    title     : 'E-Mail'
                },
                {
                    name      : 'status_text',
                    sortField : 'status_text',
                    title     : 'Status'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            fields1 : [
                {
                    name      : 'bid_id',
                    sortField : 'bid_id',
                    title     : 'Bid Id'
                },
                {
                    name      : 'bidder',
                    sortField : 'bidder',
                    title     : 'Bidder'
                },
                {
                    name      : 'amount',
                    sortField : 'amount',
                    title     : 'Amount'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            fields2 : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'Id'
                },
                {
                    name      : 'file',
                    sortField : 'file',
                    title     : 'File'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            rules : {
                name : {
                    required : true
                },
                json : {
                    required : true
                },
                bidders : {
                    required : true
                },
                file : {
                    required : true
                },
                closed_date : {
                    required : true
                }
            },
            variablesJson : JSON.stringify(OneBid)
        };
    },
    computed : {
        ...mapGetters(['currentUser']),
        parsedJson () {
            if (!this.initial_json) return null;
            try {
                return typeof this.initial_json === 'string'
                    ? JSON.parse(this.initial_json)
                    : this.initial_json;
            } catch (e) {
                console.error('Error parsing initial_json:', e);
                return null;
            }
        }
    },
    beforeMount () {
        this.loadDetails();
        this.loadData();
    },
    watch : {
        initial_json (newVal, oldVal) {
            console.log('initial_json changed!');
            console.log('Old value:', oldVal);
            console.log('New value:', newVal);

            if (newVal) {
                try {
                    const parsed = JSON.parse(newVal);
                    const hasData = parsed && Array.isArray(parsed) &&
                                   parsed.some(tab => tab.data && tab.data.length > 0);
                    console.log('New value has data:', hasData);
                } catch (e) {
                    console.error('Error parsing new initial_json:', e);
                }
            }
        },
        '$route.query.project_id' : function (newVal, oldVal) {
            console.log('Project ID changed from', oldVal, 'to', newVal);
            if (this.$refs.table) {
                this.$refs.table.refreshTable();
            }
        }
    },
    mounted () {
        console.log('Tender Details Mounted');
        console.log('Route query:', this.$route.query);
        console.log('Project ID from query:', this.$route.query.project_id);
        console.log('Project ID from params:', this.$route.params.project_id);
        // if (!sessionStorage.getItem('tenderReturnPath')) {
        //     sessionStorage.setItem('tenderReturnPath', this.$route.fullPath);
        // }
    },

    methods : {
        // backClicked () {
        //     // Get project_id and parent_id - preserve from query first
        //     const projectId =
        // this.$route.query.project_id ||
        // this.$route.params.project_id ||
        // this.details.project_id ||
        // this.details.project;

        //     const projectName =
        // this.$route.query.project_name ||
        // this.details.project_name;

        //     const parentId =
        // this.$route.params.parent_id ||
        // this.details.parent_id;

        //     const path = this.$route.path;

        //     if (this.details.status === 'Created' || this.details.status === 'Saved') {
        //         const confirm = this.getConfirm();

        //         if (confirm || this.goBack) {
        //             this.$refs.canvas.stopEditingCanvas();
        //             this.handleBackNavigation(path, projectId, projectName, parentId);
        //         } else {
        //             this.$refs.confirmModal.show();
        //         }
        //     } else {
        //         this.handleBackNavigation(path, projectId, projectName, parentId);
        //     }
        // },

        backClicked () {
            console.log(
                'RETURN PATH',
                sessionStorage.getItem('tenderReturnPath')
            );

            const returnPath =
        sessionStorage.getItem('tenderReturnPath');

            if (returnPath) {
                sessionStorage.removeItem('tenderReturnPath');
                this.$router.replace(returnPath);
                return;
            }

            this.$router.replace('/app/archived/tender/');
        },
        handleBackNavigation (path, projectId, projectName, parentId) {
            // Check if this is an archived tender
            if (path.includes('archived-tender') || path.includes('archived/tender')) {
                // Simply go back to previous page in browser history
                this.$router.go(-1);
            } else if (parentId && parentId !== 'undefined') {
                this.$router.push(`/app/parent/${parentId}/tender/`);
            } else {
                this.$router.push('/app/tender/');
            }
        },

        confirmBackCLicked () {
            const path = this.$route.path;
            if (path.split('/')[2] === 'archived-tender') {
                this.$router.push('/app/archived/tender/');
            } else if (path.split('/')[2] === 'tender') {
                this.$router.push('/app/tender/');
            }
        },
        getConfirm () {
            const json = this.$refs.canvas.getJSON();
            const baseData = '[\n' +
                '    {\n' +
                '        "tabName": "First Tab",\n' +
                '        "data": []\n' +
                '    }\n' +
                ']';
            const currentJson = JSON.parse(JSON.stringify(this.details.json));
            const newJson = JSON.parse(json);
            console.log('newJson', newJson);
            console.log('currentJson', currentJson);
            if ((JSON.stringify(currentJson) === JSON.stringify(newJson)) || (json === baseData)) {
                return true;
            }
        },
        loadData () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.FinalizedBiddersList, { tender_id : that.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    // Get base table (has tender_status, is_winner)
                    let baseTable = null;
                    if (json['boq-table']) {
                        baseTable = json['boq-table'];
                    } else if (json['sot-table']) {
                        baseTable = json['sot-table'];
                    } else if (json['msp-mnt-table']) {
                        baseTable = json['msp-mnt-table'];
                    } else if (json['boq-wo-qty-table']) {
                        baseTable = json['boq-wo-qty-table'];
                    } else if (json['import-excel-table']) {
                        baseTable = json['import-excel-table'];
                    } else {
                        baseTable = [];
                    }

                    // If final-total-table exists, merge amount into base table
                    if (json['final-total-table'] && baseTable.length) {
                        that.data = baseTable.map(function (row) {
                            const totalRow = json['final-total-table'].find(
                                t => t.bid_id === row.bid_id
                            );
                            return totalRow
                                ? { ...row, amount : totalRow.amount }
                                : row;
                        });
                    } else {
                        that.data = baseTable;
                    }

                    that.loading = false;
                    that.goTO(that.goto);
                    that.goto = '';
                }
                that.goTO(that.goto);
            });
        },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.details, { tender_id : this.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json.tender;
                    that.initial_json = JSON.stringify(json.tender.json);
                    that.loading = false;
                } else if (response.data.permission === false) {
                    that.loading = false;
                    that.permission = false;
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
                }
                const status = that.details.status;
                if (status === 'Cancelled' || status === 'Published') {
                    that.show = true;
                }
                that.setEdit(that.details);
            });
        },
        showBidAnalysis () {
            this.$router.push('/app/bidder/' + this.id + '/analysis/');
        },
        unlockBidder (item) {
            const that = this;
            that.unlockLoading = true;
            axios.form(urls.Consumer.Tender.unlockBidder, { bid_id : item.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.$notify('Bidder Unlocked Successfully', 'Success', {
                        type : 'success'
                    });
                    that.$refs.resposeTable.refreshTable();
                    that.$refs.biddersTables.refreshTable();
                    that.unlockLoading = false;
                } else {
                    that.$refs.resposeTable.refreshTable();
                    that.$refs.biddersTables.refreshTable();
                    that.$notify('Could not unlock the bidder, Please try again later.', 'Error', {
                        type : 'danger'
                    });
                    that.unlockLoading = false;
                }
                that.unlockLoading = false;
            });
            that.unlockLoading = false;
            that.refs.tables.refreshTable();
        },
        printScreen (item) {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.Print, { bid_id : item.id }).then(function (response) {
                const json = response.data;
                if (json.url) {
                    that.$notify('Pdf generated successfully', 'Success', {
                        type : 'success'
                    });
                    window.open(json.url);
                    that.loading = false;
                } else {
                    that.$notify('Pdf generation failed', 'Error', {
                        type : 'danger'
                    });
                    that.loading = false;
                }
                that.loading = false;
            });
            that.loading = false;
        },
        goTO (id) {
            const hash = this.$route.hash;
            if (id) {
                window.location.href = '#' + id;
            } else if (hash === '#Submitted') {
                window.location.href = '#Response';
            }
        },
        onSave (json) {
            if (this.isUploadingSilently) {
                this.isUploadingSilently = false;
                this.editingItem.json = json;
                const that = this;
                axios.form(urls.Consumer.Tender.save, that.editingItem).then(function (response) {
                    const json = response.data;
                    if (json.error === false) {
                        that.details.json = json.json;
                        that.formSuccess1(response);
                    }
                });
                return;
            }

            this.editingItem.json = json;
            const that = this;
            axios.form(urls.Consumer.Tender.save, that.editingItem).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details.json = json.json;
                    that.$notify('Tender Saved Successfully', 'Success',
                        {
                            type : 'success'
                        }
                    );
                    that.formSuccess1(response);
                }
            });
        },
        confirmExit (response) {
            this.$refs.confirmModal.close();
            this.goBack = true;
            if (this.routeNextPath) {
                this.$router.push(this.routeNextPath);
            } else {
                this.$router.go(-1);
            }
        },
        uploadFile () {
            this.$refs.uploadFileModal.show();
        },
        saveToMyTemplate () {
            this.saveJson = JSON.stringify(this.details.json);
            this.$refs.addTemplateModal.show();
        },
        disabledBeforeTodayAndAfterAWeek (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return date < tomorrow;
        },
        showInviteModal (json) {
            this.loadOptions();
            this.json = json;
            this.initial_json = json;
            console.log('showInviteModal - JSON being sent:', json);
            this.$refs.addModal.show();
        },
        showInviteModal1 () {
            this.loadOptions();
            this.$refs.addInviteModal.show();
        },
        loadOptions () {
            const component = this;
            axios.form(urls.Consumer.Tender.bidderOptions, { tender_id : this.tender_id }).then(function (data) {
                const json = data.data;
                component.bidderOptions = json.data;
            });
        },
        formSuccess1 (response) {
            this.cleanTitle(this.title);
            this.cleanTenderNumber(this.number);
            this.initial_json = JSON.stringify(response.data.json);
        },
        cleanTitle (title) {
            this.tenderName = title;
            if (title.length > 12) {
                this.title = title.substring(0, 12) + '...';
            }
        },
        cleanTenderNumber (number) {
            this.tenderNumber = number;
            if (number.length > 3) {
                this.number = number.substring(0, 3) + '...';
            }
        },
        templateFormSuccess (response) {
            this.$refs.addTemplateModal.close();
        },
        uploadFormSuccess (response) {
            const refs = this.$refs;
            this.$refs.uploadFileModal.close();
            refs.tableFileUpload.refreshTable();
        },
        formSuccess (response) {
            this.details.name = response.data.tender.name;
            this.details.closed_date = response.data.tender.closed_date;
            this.details.json = response.data.tender.json;
        },
        cancelComplete (response) {
            const refs = this.$refs;
            refs.cancelModal.close();

            // ✅ 1. Try session stored return path
            const returnPath = sessionStorage.getItem('tenderReturnPath');

            if (returnPath && returnPath.includes('/app/')) {
                sessionStorage.removeItem('tenderReturnPath');
                this.$router.replace(returnPath).catch(() => {});
                return;
            }

            // ✅ 2. If parent tender exists
            if (this.details && this.details.parent_id) {
                this.$router.replace(`/app/parent/${this.details.parent_id}/tender/`).catch(() => {});
                return;
            }

            // ✅ 3. If project exists in query
            if (this.$route.query.project_id) {
                this.$router.replace({
                    path  : `/app/project/${this.$route.query.project_id}/details/`,
                    query : { name : this.$route.query.name }
                }).catch(() => {});
                return;
            }

            // ✅ 4. Final fallback
            this.$router.replace('/app/tender/').catch(() => {});
        },
        tenderPublished (response) {
            const refs = this.$refs;
            const that = this;

            console.log('tenderPublished - Full Response:', response.data);
            console.log('tenderPublished - Current initial_json BEFORE:', that.initial_json);

            const currentJsonBackup = that.initial_json;

            refs.addModal.close();
            refs.addInviteModal.close();

            this.details.status = response.data.status;
            this.details.name = response.data.name;

            if (this.details.status === 'Cancelled' || this.details.status === 'Published') {
                this.show = true;
            }

            that.loading = true;
            axios.form(urls.Consumer.Tender.details, { tender_id : that.tender_id }).then(function (detailResponse) {
                const json = detailResponse.data;
                if (json.error === false) {
                    that.details = json.tender;
                    that.initial_json = JSON.stringify(json.tender.json);

                    console.log('tenderPublished - Reloaded initial_json:', that.initial_json);

                    try {
                        const parsedReloaded = JSON.parse(that.initial_json);
                        const hasData = parsedReloaded && Array.isArray(parsedReloaded) &&
                                       parsedReloaded.some(tab => tab.data && tab.data.length > 0);

                        if (!hasData) {
                            console.error('CRITICAL: Reloaded data is empty! Using backup.');
                            that.initial_json = currentJsonBackup;
                            that.details.json = JSON.parse(currentJsonBackup);
                        } else {
                            console.log('tenderPublished - Data verified, has content');
                        }
                    } catch (e) {
                        console.error('Error parsing reloaded data:', e);
                        that.initial_json = currentJsonBackup;
                    }

                    that.loading = false;

                    that.$nextTick(() => {
                        console.log('tenderPublished - Final initial_json:', that.initial_json);
                    });
                }
            }).catch(function (error) {
                console.error('Error reloading tender details:', error);
                that.initial_json = currentJsonBackup;
                that.loading = false;
            });

            if (refs.biddersTables) {
                that.$nextTick(() => {
                    refs.biddersTables.refreshTable();
                });
            }
        },
        viewFile (item) {
            window.open(item.url);
        },
        tenderPublished1 (response) {
            const refs = this.$refs;
            const that = this;

            console.log('tenderPublished1 - Full Response:', response.data);
            console.log('tenderPublished1 - Current initial_json BEFORE:', that.initial_json);

            const currentJsonBackup = that.initial_json;

            refs.addModal.close();
            refs.addInviteModal.close();

            this.details.status = response.data.status;
            this.details.name = response.data.name;

            if (this.details.status === 'Cancelled' || this.details.status === 'Published') {
                this.show = true;
            }

            that.loading = true;
            axios.form(urls.Consumer.Tender.details, { tender_id : that.tender_id }).then(function (detailResponse) {
                const json = detailResponse.data;
                if (json.error === false) {
                    that.details = json.tender;
                    that.initial_json = JSON.stringify(json.tender.json);

                    console.log('tenderPublished1 - Reloaded initial_json:', that.initial_json);

                    try {
                        const parsedReloaded = JSON.parse(that.initial_json);
                        const hasData = parsedReloaded && Array.isArray(parsedReloaded) &&
                                       parsedReloaded.some(tab => tab.data && tab.data.length > 0);

                        if (!hasData) {
                            console.error('CRITICAL: Reloaded data is empty! Using backup.');
                            that.initial_json = currentJsonBackup;
                            that.details.json = JSON.parse(currentJsonBackup);
                        } else {
                            console.log('tenderPublished1 - Data verified, has content');
                        }
                    } catch (e) {
                        console.error('Error parsing reloaded data:', e);
                        that.initial_json = currentJsonBackup;
                    }

                    that.loading = false;

                    that.$nextTick(() => {
                        console.log('tenderPublished1 - Final initial_json:', that.initial_json);
                    });
                }
            }).catch(function (error) {
                console.error('Error reloading tender details:', error);
                that.initial_json = currentJsonBackup;
                that.loading = false;
            });

            if (refs.biddersTables) {
                that.$nextTick(() => {
                    refs.biddersTables.refreshTable();
                });
            }
        },
        setEdit (details) {
            this.editingItem.id = details.id;
            this.editingItem.name = details.name;
            this.editingItem.tender_number = details.tender_number;
        },
        saveTender (item) {
            const id = item.id;
            axios.form(urls.Consumer.Tender.saveTender, { tender_id : id });
        },
        preview (rowData) {
            this.$router.push('/app/bidder/' + rowData.id + '/details/');
        },
        viewChat (rowData) {
            this.$router.push('/app/bidder/' + rowData.id + '/chat/' + rowData.tender_id + '/');
        },
        fileFormSuccess () {
            const refs = this.$refs;
            refs.updateFileModal.close();
            refs.tableFileUpload.refreshTable();

            this.editingFileItem = {};
        },
        setFileEdit (item) {
            this.editingFileItem.id = item.id;
            this.editingFileItem.file = item.file;
            this.$refs.updateFileModal.show();
        },
        setFileDelete (item) {
            this.deletingItem.id = item.id;
            this.$refs.deleteModal.show();
        },
        deleteFileComplete (response) {
            this.deletingItem = {};
            this.$refs.deleteModal.close();
            this.$refs.tableFileUpload.refreshTable();
        },

        uploadExcelFormSuccess (response) {
            if (this.excelUploading) {
                console.log('Already processing, skipping...');
                return;
            }

            this.excelUploading = true;
            this.isUploadingSilently = true;

            const refs = this.$refs;
            const that = this;

            try {
                if (response.data.error === false) {
                    refs.uploadExcelFileModal.close();

                    const newJsonData = response.data.json;
                    const columns = response.data.columns;

                    console.log('Received NEW JSON from Excel:', newJsonData);
                    console.log('Received Columns:', columns);

                    // Get CURRENT canvas JSON
                    const currentJson = refs.canvas ? refs.canvas.getJSON() : this.initial_json;
                    let existingData;

                    try {
                        existingData = typeof currentJson === 'string'
                            ? JSON.parse(currentJson)
                            : currentJson;
                    } catch (e) {
                        console.error('Error parsing current JSON:', e);
                        existingData = this.details.json || [{ tabName : 'First Tab', data : [] }];
                    }

                    console.log('EXISTING data BEFORE merge:', JSON.parse(JSON.stringify(existingData)));

                    // Find current tab
                    const currentTabIndex = existingData.findIndex(
                        tab => tab.tabName === this.currentTabName
                    );

                    if (currentTabIndex >= 0) {
                        // Process and ADD the imported table to existing data
                        if (newJsonData && Array.isArray(newJsonData)) {
                            newJsonData.forEach(tab => {
                                if (tab.data && Array.isArray(tab.data)) {
                                    tab.data.forEach(item => {
                                        if (item.type === 'import-excel') {
                                            item.type = 'editor-import-excel';
                                        }

                                        if (item.type === 'editor-import-excel' && item.prop) {
                                            item.prop.columns = columns;

                                            if (!item.prop.editableData) {
                                                item.prop.editableData = {};
                                            }

                                            console.log('Adding imported table to existing data');
                                            existingData[currentTabIndex].data.push(item);
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        console.error('Current tab not found:', this.currentTabName);
                        existingData.push({
                            tabName : this.currentTabName,
                            data    : newJsonData[0]?.data || []
                        });
                    }

                    console.log('MERGED data:', JSON.parse(JSON.stringify(existingData)));

                    // Store the merged JSON string
                    const mergedJsonString = JSON.stringify(existingData);

                    // Update local state FIRST
                    this.details.json = existingData;
                    this.initial_json = mergedJsonString;

                    // Save to backend BEFORE updating canvas
                    this.editingItem.json = mergedJsonString;

                    console.log('Saving merged data to backend...');

                    axios.form(urls.Consumer.Tender.save, that.editingItem).then(function (saveResponse) {
                        const json = saveResponse.data;

                        if (json.error === false) {
                            console.log('Backend save successful!');

                            // Update details with saved JSON
                            that.details.json = json.json;
                            that.initial_json = JSON.stringify(json.json);

                            // NOW update the canvas with the saved data
                            if (refs.canvas) {
                                refs.canvas.setJSON(that.initial_json);

                                const tabIndex = json.json.findIndex(
                                    tab => tab.tabName === that.currentTabName
                                );

                                if (tabIndex >= 0) {
                                    that.$nextTick(() => {
                                        refs.canvas.selectTab(tabIndex, true);
                                    });
                                }
                            }

                            if (columns) {
                                that.excelColumns = columns;
                            }

                            // that.$notify(
                            //     'Excel table added and saved successfully',
                            //     'Success',
                            //     { type : 'success' }
                            // );

                            if (refs.tableFileUpload) {
                                refs.tableFileUpload.refreshTable();
                            }
                        } else {
                            console.error('Backend save failed:', json);
                            that.$notify(
                                'Failed to save changes to backend',
                                'Error',
                                { type : 'danger' }
                            );
                        }
                    }).catch(function (error) {
                        console.error('Error saving to backend:', error);
                        that.$notify(
                            'An error occurred while saving',
                            'Error',
                            { type : 'danger' }
                        );
                    }).finally(function () {
                        // Reset flags
                        that.isUploadingSilently = false;
                        setTimeout(() => {
                            that.excelUploading = false;
                        }, 1000);
                    });
                } else {
                    this.isUploadingSilently = false;
                    this.$notify(
                        response.data.message || 'Excel file upload failed',
                        'Error',
                        { type : 'danger' }
                    );
                    setTimeout(() => {
                        this.excelUploading = false;
                    }, 1000);
                }
            } catch (error) {
                this.isUploadingSilently = false;
                console.error('Error processing Excel upload:', error);
                this.$notify(
                    'An error occurred while processing the Excel file',
                    'Error',
                    { type : 'danger' }
                );
                setTimeout(() => {
                    this.excelUploading = false;
                }, 1000);
            }
        },
        uploadExcelFormFailure (response) {
            console.log('Excel upload failed:', response);

            const refs = this.$refs;
            refs.uploadExcelFileModal.close();

            // Get error message from response data
            const errorMessage = response?.data?.message ||
                       response?.data?.msg ||
                       response?.data?.error ||
                       'Excel file upload failed';

            this.$notify(
                errorMessage,
                'Error',
                { type : 'danger' }
            );

            // Reset uploading flag
            this.excelUploading = false;
            this.isUploadingSilently = false;
        },

        uploadExcelFile (tabName) {
            if (tabName) {
                this.currentTabName = tabName;
            }
            this.$refs.uploadExcelFileModal.show();
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

.status {
    font-size: 8px;
    padding: .4rem;
    margin-left: 1rem;
    vertical-align: super;
}
</style>
