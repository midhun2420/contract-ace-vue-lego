<template>
    <vue-table-card title="" :fields="fields" :url="listUrl" :per-page="10" ref="table">
        <template #buttons>
            <btn color="success" icon="fa fa-plus" size="sm" @click="$refs.addModal.show()" text="Add"/>
        </template>

        <template #footer>
            <modal title="Invite User" no-close-on-backdrop ref="addModal" width="50r" header-color="primary">
                <b-form ref="inviteForm" :save-url="createInvitation" @success="formSuccess" v-slot="{model, loading}">
                    <div class="row">
                        <div class="col">
                            <validated-input
                                label="Name" v-model="model.name"
                                :rules="rules.name" :disabled="loading"/>
                        </div>
                        <div class="col">
                            <validated-input name="email" :rules="rules.email" type="email"
                                             label="Email" :disabled="loading"
                                             v-model="model.email"></validated-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <validated-input name="Contact Number" :rules="rules.phone_number" type="number"
                                             label="Contact Number" :disabled="loading"
                                             v-model="model.phone_number"/>
                        </div>
                        <div class="col">
                            <validated-input name="Contact Person" :rules="rules.contact_person"
                                             label="Contact Person" :disabled="loading"
                                             v-model="model.contact_person"/>
                        </div>
                    </div>
                    <save-btn icon="" text="Add" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Sending...</span></span>
                    </save-btn>
                </b-form>
            </modal>
            <modal title="Send Invitation" no-close-on-backdrop ref="sendInviteModal" width="40r"
                   header-color="primary">
                <b-form ref="sendInviteForm" :save-url="sendInvitation" @success="formSuccess1"  @failure="formFailure" v-slot="{model, loading}"     :save-params="{invitation, email}">
                    <div class="row">
                        <div class="col">
                            <validated-vue-select label="Tender Number" v-model="model.tender"
                                                  :rules="rules.tender_number" :disabled="loading"
                                                  :options="tenderNumberOptions" @input="loadTenderData(model.tender)"/>
                        </div>
                        <div v-if="show" class="col">
                            <validated-input name="Closed Date"
                                             label="Closed Date" :disabled="true"
                                             v-model="model.closed_date"></validated-input>
                        </div>
                    </div>
                    <validated-input v-if="show" name="Tender"
                                     label="Tender" :disabled="true"
                                     v-model="model.tender_name"></validated-input>
                    <label>Description</label>
                    <textarea-input name="Description" :rules="rules.description" v-model="model.description"/>
                    <save-btn icon="" text="Send" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Sending...</span></span>
                    </save-btn>
                </b-form>
            </modal>
            <delete-modal ref="deleteModal" title="Delete User" :params="deletingItem" :url="sendInvitationDelete"
                          @response="deleteComplete">
                <p>You are about to delete the User. Are you
                    sure
                    ?</p>

                <template #loading>
                    <loading-animation/>
                    Please wait while we delete.
                </template>
            </delete-modal>
        </template>
        <template #actions="{rowData}">
            <div class="btn-group-tight">
                <edit-btn icon="" class="bg-success" text="Send Invitation"
                          @click="showInvitationModal(rowData)"/>
                <btn icon="" text="Delete" color="danger" @click="setDelete(rowData)" size="xs"/>
            </div>
        </template>
    </vue-table-card>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name : 'InviteUsers',
    data () {
        return {
            sendInvitation       : urls.Consumer.MyContact.sendInvitation,
            createInvitation     : urls.Consumer.MyContact.createInvitation,
            listUrl              : urls.Consumer.MyContact.sendInvitationList,
            sendInvitationDelete : urls.Consumer.MyContact.sendInvitationDelete,
            invitation           : '',
            email                : '',
            tenderNumberOptions  : [],
            show                 : false,
            deletingItem         : null,
            fields               : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'phone_number',
                    sortField : 'phone_number',
                    title     : 'Contact Number'
                },
                {
                    name      : 'contact_person',
                    sortField : 'contact_person',
                    title     : 'Contact Person'
                },
                {
                    name      : 'to_name',
                    sortField : 'to_name',
                    title     : 'Recipient'
                },
                {
                    name      : 'from_mail',
                    sortField : 'from_mail',
                    title     : 'From'
                },
                {
                    name      : 'to_email',
                    sortField : 'to_email',
                    title     : 'To'
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
                description : {
                    required : true
                },
                email : {
                    required : true
                },
                tender_number : {
                    required : true
                },
                phone_number : {
                    required : false
                },
                contact_person : {
                    required : false
                }
            }
        };
    },
    mounted () {
        this.loadOptions();
    },
    methods : {
        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },
        deleteComplete (response) {
            this.deletingItem = null;

            this.$refs.deleteModal.close();

            if (response && !response.error) {
                this.$notify(
                    'Deleted successfully',
                    'Message',
                    {
                        type : 'success'
                    }
                );
            }

            this.$refs.table.refreshTable();
        },
        showInvitationModal (item) {
            this.invitation = item.id;
            this.email = item.to_email;
            const refs = this.$refs;
            refs.sendInviteModal.show();
        },
        formFailure (response) {
            console.log('FAILURE RESPONSE', response);

            const json = response?.data || {};

            if (json.errors?.email) {
                this.$notify(
                    json.errors.email,
                    'Error',
                    {
                        type : 'danger'
                    }
                );

                this.$refs.sendInviteModal.close();

                return;
            }

            if (json.msg) {
                this.$notify(
                    json.msg,
                    'Error',
                    {
                        type : 'danger'
                    }
                );

                this.$refs.sendInviteModal.close();
            }
        },
        formSuccess (response) {
            console.log('CREATE SUCCESS', response);

            const refs = this.$refs;

            // Close Invite User modal
            if (refs.addModal) {
                refs.addModal.close();
            }

            // Refresh table
            refs.table.refreshTable();
        },
        formSuccess1 (response) {
            console.log('response', response);

            if (response && response.data && response.data.error) {
                this.$notify(
                    response.data.errors.email,
                    'Error',
                    {
                        type : 'danger'
                    }
                );
                this.$refs.sendInviteModal.close();
                return;
            }

            const refs = this.$refs;
            refs.sendInviteModal.close();
            refs.table.refreshTable();
        },
        loadTenderData (number) {
            if (number) {
                const value = this.tenderNumberOptions.filter(obj => obj.value === number);
                this.$refs.sendInviteForm.setModelValue('closed_date', value[0].closed_date);
                this.$refs.sendInviteForm.setModelValue('tender_name', value[0].name);
                this.show = true;
            } else {
                this.$refs.sendInviteForm.setModelValue('closed_date', '');
                this.$refs.sendInviteForm.setModelValue('tender_name', '');
                this.show = false;
            }
        },
        loadOptions () {
            const component = this;
            axios.get(urls.Consumer.MyContact.tenderNumberOptionsUrl).then(function (data) {
                const json = data.data;
                component.tenderNumberOptions = json.data;
            });
        }
    }
};
</script>

<style scoped>

</style>
