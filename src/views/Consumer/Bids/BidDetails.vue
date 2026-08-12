<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading && permission">
            <!--            Tender Edit Form           -->
            <div v-if="details">
                <!-- BidDetailsPage - Canvas title fix -->
<Canvas ref="canvas"
        v-if="details.status==='Published' || details.status==='Saved'"
        :json="initial_json" :variable-json="variablesJson"
        :title="(details.name ? details.name.substring(0, 20) + (details.name.length > 20 ? '....' : '') : 'Bid Details')">
                    <div class="btn-group mb-2">
                        <btn v-if="currentUser.features.my_bids_views_and_update && details.tender_status==='Published'"
                             type="button" color="primary" size="xs" @click="onSave" text="Save"/>

                        <!--                        <btn v-if="currentUser.features.create_save_to_my_template" type="button" color="info" size="xs"-->
                        <!--                             @click="saveToMyTemplate"-->
                        <!--                             text="Save as My Template"/>-->

                        <btn v-if="currentUser.features.my_bids_submit" type="button" color="danger" size="xs"
                             @click="$refs.rejectModal.show()"
                             text="Reject"/>

                        <btn type="button" color="success" size="xs" @click="submitBidDetails" text="Submit"
                             v-if="currentUser.features.my_bids_submit && details.status==='Saved'
                                && details.tender_status==='Published' && !details.is_unlocked"/>

                        <btn type="button" color="success" size="xs" @click="submitBidDetails" text="Re-Submit"
                             v-if="currentUser.features.my_bids_submit && details.status==='Saved'
                                && (details.tender_status==='Published' || details.tender_status==='Closed') && details.is_unlocked"/>

                        <btn type="button" color="primary" size="xs" @click="$router.push('/app/my-bid/')"
                             text="Back"/>

                    </div>
                </Canvas>
            </div>
            <!--            Bid Preview          -->

            <div
                v-if="details && details.status!=='Published' && details.status!=='Saved'"
                class="container card bs-5">
                <div class="row">
                    <div class="col">
                        <h4>Bid Details</h4>
                    </div>
                    <div class="col text-right">
                        <btn type="button" color="primary" size="sm"
                             @click="$router.push('/app/my-bid/')" text="Back"/>
                    </div>
                </div>
                <BidView class="mb-3" :json="initial_json" :variable-json="variablesJson"
                         :title="details.name + ' # ' + details.id"/>
            </div>
            <vue-table-card title="Attachments" class="container bs-5 mt-4" :fields="fields2"
                            :url="uploadFileList" :per-page="10" id="FileUpload"
                            ref="tableFileUpload" :extra-params="{ tender_id }">
                <template #actions="{rowData}">
                    <div class="btn-group-tight">
                        <edit-btn text="view" icon="fa fa-eye" @click="viewFile(rowData)"/>
                    </div>
                </template>
            </vue-table-card>
            <delete-modal okButton="Yes" ref="rejectModal" title="Reject Invitation" :url="rejectTender"
                          :params="{ bid_id }"
                          @response="rejectComplete">
                <p>You are about to reject the invitation. Are you sure?</p>

                <template #loading>
                    <loading-animation/>
                    Please wait while we reject the invitation.
                </template>
            </delete-modal>
            <delete-modal okButton="Yes" headerColor="primary" bodyColor="primary" okButtonColor="primary"
                          ref="submitModal" title="WARNING" class="text-center" :url="submitBid"
                          :params="{ bid_id, json : submitJSON }"
                          @response="bidSubmitted">
                <p>You are about to submit the bid.
                    Once submitted you can no longer make any changes.
                </p>
                <b>Do you wish to continue?</b>

                <template #loading>
                    <loading-animation/>
                    Please wait while we submit the Bid.
                </template>
            </delete-modal>

            <!--            Form Modals           -->

            <!--            <modal no-close-on-backdrop title="My Template" ref="addModal" width="30r" header-color="primary" no-close-on-backdrop>-->
            <!--                <b-form :save-url="addUrl" @success="formSuccess1" v-slot="{model, loading}"-->
            <!--                        :save-params="{ tender_id }">-->
            <!--                    <validated-input label="Template Name"-->
            <!--                                     v-model="model.name"-->
            <!--                                     :rules="rules.name"-->
            <!--                                     :disabled="loading"/>-->
            <!--                    <save-btn icon="" text="Create" color="primary" size="sm" :disabled="loading"/>-->
            <!--                </b-form>-->
            <!--            </modal>-->
        </div>
        <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import Canvas from '@/component/Bidder/Canvas';
import BidView from '@/component/Bidder/BidView';
// import OneBid from '@/data/Samples/OneBid';

export default {
    name       : 'BidDetailsPage',
    components : { Canvas, BidView },
    data () {
        return {
            loading        : false,
            permission     : true,
            id             : this.$route.params.id,
            bid_id         : this.$route.params.id,
            json           : '',
            submitJSON     : '',
            details        : [],
            show           : false,
            tender_id      : '',
            // addUrl        : urls.Consumer.MyTemplate.saveToMyTemplate,
            uploadFileList : urls.Consumer.Tender.uploadFileList,
            rejectTender   : urls.Consumer.MyBid.rejectTender,
            submitBid      : urls.Consumer.MyBid.submitBid,
            deletingItem   : null,
            initial_json   : null,
            variablesJson  : null,
            editingItem    : {
                id     : '',
                bid_id : this.$route.params.id,
                name   : '',
                json   : ''
            },
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
            fields : [
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
                    name      : 'created_by',
                    sortField : 'created_by',
                    title     : 'Created By'
                },
                {
                    name      : 'created_date',
                    sortField : 'created_date',
                    title     : 'Created Date'
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
                }
            }
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    mounted () {
        this.loadDetails();
    },
    methods : {
        viewFile (item) {
            window.open(item.url);
        },
        submitBidDetails () {
            const refs = this.$refs;
            this.submitJSON = refs.canvas.getVariableJSON();
            refs.submitModal.show();
        },
        onSave () {
            const refs = this.$refs;
            const json = refs.canvas.getVariableJSON();
            // Implement save here.
            this.editingItem.json = json;
            const that = this;
            axios.form(urls.Consumer.MyBid.bidUpdate, that.editingItem).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details.status = 'Saved';
                    that.formSuccess(response);
                }
            });
        },
        // saveToMyTemplate (json) {
        //     // this.editingItem.json = json;
        //     this.$refs.addModal.show();
        // },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.MyBid.details, { bid_id : that.id }).then(function (response) {
                const json = response.data;
                console.log('Full response:', json);
                console.log('bid.name:', json.bid?.name);
                console.log('tender data:', json.tender?.data);
                if (json.error === false) {
                    that.details = json.bid;
                    that.details.name = json.bid.tender || 'Bid Details';
                    that.variablesJson = JSON.stringify(json.bid.json);
                    that.initial_json = JSON.stringify(json.tender.data.tender_json);
                    that.tender_id = json.tender.data.tender_id;
                    that.loading = false;
                } else if (json.permission === false) {
                    that.permission = json.permission;
                    that.loading = false;
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
                }
                const status = that.details.status;
                if (status === 'Rejected' || status === 'Submitted') {
                    that.show = true;
                }
                that.setEdit(that.details);
            });
        },
        setEdit (details) {
            this.editingItem = details;
        },
        formSuccess (response) {
            this.$notify('Bid Saved', 'Success', {
                type : 'success'
            });
        },
        // formSuccess1 (response) {
        //     this.$refs.addModal.close();
        // this.$notify('Added to My Templates', 'Success', {
        //     type : 'success'
        // });
        bidSubmitted (response) {
            const refs = this.$refs;

            // Close the warning modal first
            if (refs.submitModal) {
                refs.submitModal.close();
            }

            console.log('Bid Submit Response:', response); // For debugging

            // Extract response data - handle different response structures
            let responseData = null;

            if (response && response.data) {
                responseData = response.data;
            } else if (response) {
                responseData = response;
            }

            // Display the message from backend
            if (responseData) {
                // Check for success
                if (responseData.success === true || responseData.error === false) {
                    // Get message from various possible fields
                    const message = responseData.msg ||
                          responseData.message ||
                          responseData.data?.msg ||
                          responseData.data?.message ||
                          'Bid Submitted Successfully';

                    // Show success notification
                    this.$notify(message, 'Success', {
                        type : 'success'
                    });
                } else {
                    // Handle error case
                    const errorMessage = responseData.msg ||
                               responseData.message ||
                               responseData.data?.msg ||
                               responseData.data?.message ||
                               'Failed to submit bid';

                    this.$notify(errorMessage, 'Error', {
                        type : 'error'
                    });
                }
            } else {
                // Fallback if no response data
                this.$notify('Bid Submitted Successfully', 'Success', {
                    type : 'success'
                });
            }

            // Navigate to my-bid page after a short delay to show the notification
            setTimeout(() => {
                this.$router.push('/app/my-bid/');
            }, 1000);
        },

        // Also update rejectComplete to show backend message
        rejectComplete (response) {
            const refs = this.$refs;

            // Close the modal first
            if (refs.rejectModal) {
                refs.rejectModal.close();
            }

            console.log('Reject Response:', response); // For debugging

            // Extract response data
            let responseData = null;

            if (response && response.data) {
                responseData = response.data;
            } else if (response) {
                responseData = response;
            }

            // Display the message from backend
            if (responseData) {
                if (responseData.success === true || responseData.error === false) {
                    const message = responseData.msg ||
                          responseData.message ||
                          responseData.data?.msg ||
                          responseData.data?.message ||
                          'Tender Rejected Successfully';

                    this.$notify(message, 'Success', {
                        type : 'success'
                    });
                } else {
                    const errorMessage = responseData.msg ||
                               responseData.message ||
                               responseData.data?.msg ||
                               responseData.data?.message ||
                               'Failed to reject tender';

                    this.$notify(errorMessage, 'Error', {
                        type : 'error'
                    });
                }
            } else {
                this.$notify('Tender Rejected Successfully', 'Success', {
                    type : 'success'
                });
            }

            // Navigate after a short delay
            setTimeout(() => {
                this.$router.push('/app/my-bid/');
            }, 1000);
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
