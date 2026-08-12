<template>
    <ajax-view class="card bs-5 p-4" :url="detailsUrl" #default="{ response }">
        <div class="row mb-3">
            <div class="col text-left">
                <h3 style="font-size: 20px;">Roles</h3>
            </div>
            <div class="col text-right mb-3">
                <btn color="success" class="mr-2" icon="fa fa-plus" size="sm" @click="$refs.addModal.show()"
                     text="Add Role"/>
            </div>
        </div>
        <div class="p-4">
            <table id="role" class="table table-bordered" ref="table">
                <thead>
                <tr>
                    <th>Features / Roles</th>
                    <th class="p-0" v-for="(record) in response.roles" v-bind:key="record.role_id">
                        <!--                        {{ record.name }}-->
                        <div class="btn-group-tight">
                            {{ record.name }}
                            <edit-btn text="" class="ml-1" color="info" @click="setEdit(record)"/>
                            <delete-btn text="" design="basic" color="danger" @click="setDelete(record)"/>
                        </div>
                    </th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td>Delegate Roles to others</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input size="md" :id="record.role_id + 'delegate_role_to_others'"
                                            name="delegate_role_to_others" :rules="{required: false}"
                                            v-model="record.delegate_role_to_others"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Create & Save to My Template</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'create_save_to_my_template'"
                                            name="create_save_to_my_template" :rules="{required: false}"
                                            v-model="record.create_save_to_my_template"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>My Bids - View & update</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'my_bids_views_and_update'"
                                            name="my_bids_views_and_update" :rules="{required: false}"
                                            v-model="record.my_bids_views_and_update"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>My Bids - Submit</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'my_bids_submit'" name="my_bids_submit"
                                            :rules="{required: false}" v-model="record.my_bids_submit"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Create New Tender</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'create_new_tender'" name="create_new_tender"
                                            :rules="{required: false}" v-model="record.create_new_tender"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>View Tenders</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'view_tender'" name="view_tender"
                                            :rules="{required: false}" v-model="record.view_tender"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Issue Tender</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'issue_tender'" name="issue_tender"
                                            :rules="{required: false}" v-model="record.issue_tender"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Bids Received</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'bids_received'" name="bids_received"
                                            :rules="{required: false}" v-model="record.bids_received"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Analysis</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'analysis'" name="analysis" :rules="{required: false}"
                                            v-model="record.analysis" :disabled="false"
                                            @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Import</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'is_import'" name="is_import"
                                            :rules="{required: false}" v-model="record.is_import"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Export</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'is_export'" name="is_export"
                                            :rules="{required: false}" v-model="record.is_export"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Contacts (My Vendors)</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'contacts_my_vendor'" name="contacts_my_vendor"
                                            :rules="{required: false}" v-model="record.contacts_my_vendor"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Dash Board</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'dashboard'" name="dashboard"
                                            :rules="{required: false}" v-model="record.dashboard"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Standard Template</td>
                    <td v-for="(record) in  response.roles" v-bind:key="record.role_id">
                        <div class="td">
                            <checkbox-input :id="record.role_id + 'standard_template'" name="standard_template"
                                            :rules="{required: false}" v-model="record.standard_template"
                                            :disabled="false" @input="changePermission(record)">
                            </checkbox-input>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <modal no-close-on-backdrop title="Add Role" ref="addModal" width="30r" header-color="primary">
            <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}">
                <validated-input label="Role" v-model="model.name" :disabled="loading"/>
                <save-btn text="Add Role" color="primary" size="sm" :disabled="loading">
                    <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                </save-btn>
            </b-form>
        </modal>
        <modal no-close-on-backdrop title="Edit Role" ref="editModal" width="30r" header-color="primary">
            <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}" :initial-data="editingItem">
                <validated-input label="Role" v-model="model.name" :disabled="loading"/>
                <save-btn text="Save Role" color="primary" size="sm" :disabled="loading">
                    <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                </save-btn>
            </b-form>
        </modal>
        <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
            <p>You are about to delete the role <b v-html="deletingItem && deletingItem.name"></b>. Are you sure ?
            </p>

            <template #loading>
                <loading-animation/>
                Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
            </template>
        </delete-modal>
    </ajax-view>
</template>
<script>
import axios from 'secure-axios';
import urls from '../../../data/urls';

export default {
    name : 'Role',
    data () {
        return {
            detailsUrl   : urls.Admin.MasterData.Role.details,
            addUrl       : urls.Admin.MasterData.Role.addEdit,
            deleteUrl    : urls.Admin.MasterData.Role.delete,
            editingItem  : null,
            deletingItem : null
        };
    },
    methods : {
        changePermission (record) {
            const rec = record;
            axios.form(urls.Admin.MasterData.Role.changePermission, rec);
        },
        formSuccess () {
            this.$refs.addModal.close();
            this.$refs.editModal.close();

            setTimeout(() => {
                this.$router.go();
            }, 2500);

            this.editingItem = null;
        },
        setEdit (item) {
            this.editingItem = { ...item };
            this.$refs.editModal.show();
        },
        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },
        // deleteComplete (response) {
        //     this.deletingItem = null;
        //     this.$refs.deleteModal.close();

        //     const message = response.data?.message;

        //     this.$notify(
        //         message,
        //         'Message',
        //         {
        //             type : 'success'
        //         }
        //     );
        // }
        deleteComplete (response) {
            const data = response.data || response;
            console.log(data);
            if (data.success === true) {
                this.$notify(
                    data.message || 'Deleted Successfully',
                    'Success',
                    { type : 'success' }
                );
                this.$refs.deleteModal.close();
                this.deletingItem = null;

                setTimeout(() => {
                    this.$router.go();
                }, 1500);
            } else {
                this.$notify(
                    data.message || 'Unable to delete record',
                    'Warning',
                    { type : 'warning' }
                );
                this.$refs.deleteModal.close();
            }
        }
    }
};
</script>
<style scoped>
#role {
    font-size: 15px;
    font-family: Montserrat, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

#role td, #role th {
    border: 1px solid #ddd;
    padding: 8px;
    vertical-align: middle;
    width: 14rem;
}

#role tr {
    text-align: center;
}

#role tr:nth-child(even) {
    background-color: #f2f2f2;
}

.form-check {
    justify-content: center !important;
    padding: 0 !important;
}

#role tr:hover {
    background-color: lightgrey;
}

#role th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    text-transform: capitalize;
    background-color: rgb(39 68 102);
    color: white;
}
</style>
