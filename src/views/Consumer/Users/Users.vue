<template>
    <div>
        <check-permission/>
        <vue-table-card title="Users" class="card bs-5" :fields="fields" :url="listUrl" :per-page="10" ref="table">
            <template #buttons>
                <btn
                    color="success"
                    v-if="currentUser.role === 'owner' && currentUser.features.delegate_role_to_others && canAddUser"
                    ref="addBtn"
                    icon="fa fa-plus"
                    size="sm"
                    @click="$refs.addModal.show()"
                    text="Add"/>
            </template>

            <template #actions="{rowData}">
                <div class="btn-group-tight">
                    <delete-btn size="xs" v-if="currentUser.role==='owner'" @click="setDelete(rowData)"/>

                    <btn color="primary" v-if="currentUser.role==='owner'" size="xs" @click="editRole(rowData)"
                         text="Edit Role"/>

                    <btn v-if="rowData.is_suspended === false && currentUser.role === 'owner'"
                         color="success" size="xs" @click="suspendUser(rowData)" text="Suspend"/>

                    <btn
                        v-if="rowData.is_suspended === true && currentUser.role === 'owner' && rowData.suspend_by === 'owner'"
                        color="info" size="xs" @click="suspendUser(rowData)" text="Retrieve"/>

                    <btn v-if="rowData.is_suspended === true && (rowData.is_superuser
                                || rowData.suspend_by === 'owner') && currentUser.role !== 'owner'"
                         color="warning" size="xs" text="Suspended"/>

                    <btn color="primary" size="xs" @click="viewDetails(rowData)" text="View"/>
                </div>
            </template>

            <template #footer>
                <modal title="Add User" ref="addModal" header-color="primary" no-close-on-backdrop>
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}">
                        <div class="row mb-2">
                            <div class="col-md-4">
                                <validated-input name="Name" :rules="rules.name"
                                                 label="Name" :disabled="loading"
                                                 v-model="model.name"></validated-input>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="Mobile Number" :rules="rules.staff_phone_number" type="number"
                                                 label="Mobile Number" :disabled="loading"
                                                 v-model="model.staff_phone_number"></validated-input>
                            </div>
                            <div class="col-md-4">
                                <validated-input name="E-Mail" :rules="rules.email" type="email"
                                                 label="E-Mail" :disabled="loading"
                                                 v-model="model.email"></validated-input>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4">
                                <validated-input name="Username" :rules="rules.username"
                                                 label="Username" :disabled="loading"
                                                 v-model="model.username"></validated-input>
                            </div>
                            <div class="col-md-4">
                                <custom-password-input name="Password" :rules="rules.password1"
                                                       label="Password" :disabled="loading"
                                                       v-model="model.password1"></custom-password-input>
                            </div>
                            <div class="col-md-4">
                                <custom-password-input name="Confirm Password" :rules="rules.password2"
                                                       label="Confirm Password" :disabled="loading"
                                                       v-model="model.password2"></custom-password-input>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4">
                                <validated-vue-select name="Role" :options="roleOptions"
                                                      :rules="rules.role" label="Role"
                                                      v-model="model.role"></validated-vue-select>
                            </div>
                            <div class="col-md-4">
                                <validated-vue-select name="Address Type" label="Address Type"
                                                      :options="addressTypeOptions" :disabled="loading"
                                                      v-model="model.address_type"/>
                            </div>
                            <div class="col-md-4">
                                <checkbox-input class="mt-4" name="Is Primary Address" label="Is Primary Address"
                                                :disabled="loading"
                                                v-model="model.is_primary_address"></checkbox-input>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col">
                                <label>Address</label>
                                <textarea-input name="Address" v-model="model.address"/>
                            </div>
                        </div>
                        <save-btn text="Save" color="primary" icon="" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Saving...</span></span>
                        </save-btn>
                    </b-form>
                </modal>
                <modal title="Edit Role" ref="editModal" width="30r" header-color="primary" no-close-on-backdrop>
                    <b-form :save-url="editRoleUrl" @success="formSuccess" v-slot="{model, loading}"
                            :initial-data="editingItem">
                        <validated-vue-select name="Role" :options="roleOptions"
                                              :rules="rules.role" label="Role"
                                              v-model="model.role"></validated-vue-select>
                        <save-btn text="Update" icon="" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Updating...</span></span>
                        </save-btn>
                    </b-form>
                </modal>
                <modal no-close-on-backdrop title="User Details" ref="userDetails" header-color="primary">
                    <user-details-page :detail="detail_id"/>
                </modal>
                <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                    <p>You are about to delete the company <b v-html="deletingItem && deletingItem.name"></b>. Are you
                        sure?</p>

                    <template #loading>
                        <loading-animation/>
                        Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
                    </template>
                </delete-modal>
            </template>

        </vue-table-card>
    </div>
</template>

<script>
import urls from '@/data/urls';
import UserDetailsPage from './UserDetails';
import { mapGetters } from 'vuex';
import axios from 'secure-axios';

export default {
    name       : 'Users',
    components : { UserDetailsPage },

    data () {
        return {
            totalUsers : 0,

            roleOptions    : [],
            companyOptions : urls.Admin.User.companyOptions,

            listUrl     : urls.Admin.User.list,
            addUrl      : urls.Admin.User.addEdit,
            deleteUrl   : urls.Admin.User.delete,
            editRoleUrl : urls.Admin.User.editRole,

            editingItem        : null,
            deletingItem       : null,
            detail_id          : '',
            addressTypeOptions : [
                { label : 'Office', value : 'Office' },
                { label : 'Home', value : 'Home' },
                { label : 'Other', value : 'Other' }
            ],
            fields : [
                { name : 'id', sortField : 'id', title : 'ID' },
                { name : 'name', sortField : 'name', title : 'Name' },
                { name : 'role_name', sortField : 'role_name', title : 'Role' },
                { name : 'company', sortField : 'company', title : 'Company' },
                { name : 'staff_phone_number', sortField : 'staff_phone_number', title : 'Phone' },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            rules : {
                name               : { required : true },
                role               : { required : true },
                staff_phone_number : { required : true },
                username           : { required : true },
                password1          : { required : true },
                password2          : { required : true },
                email              : { required : true }
            }
        };
    },

    computed : {
        ...mapGetters(['currentUser']),

        // ✅ FIXED: Check user_count_limit first, then user_count
        canAddUser () {
            const pkg = this.currentUser.packages || {};
            const userCount = pkg.user_count;
            const userCountLimit = pkg.user_count_limit;

            // ✅ PRIORITY 1: user_count_limit check (takes precedence)
            if (userCountLimit !== undefined && userCountLimit !== null) {
                let numericLimit = 0;

                if (typeof userCountLimit === 'string') {
                    const match = userCountLimit.match(/\d+/);
                    if (match) numericLimit = parseInt(match[0], 10);
                } else if (typeof userCountLimit === 'number') {
                    numericLimit = userCountLimit;
                }

                if (!isNaN(numericLimit) && numericLimit > 0) {
                    // 🔴 STRICT: Only less than (<) allowed
                    return this.totalUsers < numericLimit;
                }
            }

            // ✅ PRIORITY 2: user_count check
            // If explicitly disabled
            if (userCount === 'false' || userCount === false) {
                return false;
            }

            // If unlimited
            if (userCount === 'true' || userCount === true) {
                return true;
            }

            // If numeric limit
            let numericLimit = 0;
            if (typeof userCount === 'string') {
                const match = userCount.match(/\d+/);
                if (match) numericLimit = parseInt(match[0], 10);
            } else if (typeof userCount === 'number') {
                numericLimit = userCount;
            }

            if (!isNaN(numericLimit) && numericLimit > 0) {
                // 🔴 STRICT: Only less than (<) allowed
                return this.totalUsers < numericLimit;
            }

            // Default: allow
            return true;
        }
    },

    mounted () {
        this.loadRoleOption();
        this.loadTotalUsers();

        // Debug: Check current user role
        console.log('🔍 DEBUG - Current User:', this.currentUser);
        console.log('🔍 DEBUG - Current Role:', this.currentUser.role);
        console.log('🔍 DEBUG - Is Owner?:', this.currentUser.role === 'owner');
    },

    methods : {
        loadTotalUsers () {
            const that = this;
            axios.get(this.listUrl, { params : { per_page : 1, page : 1 } })
                .then(function (response) {
                    if (response.data) {
                        // Add +1 for owner to total count (owner not included in API response)
                        that.totalUsers = (response.data.total || 0) + 1;

                        console.log('📊 Total Users (including owner):', that.totalUsers);
                        console.log('📦 User Limit:', that.currentUser.packages?.user_count);
                        console.log('✅ Can Add User?:', that.canAddUser);
                    }
                })
                .catch(function (error) {
                    console.error('❌ Failed to load user count:', error);
                });
        },

        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            refs.editModal.close();
            refs.table.refreshTable();
            this.editingItem = null;
            this.loadTotalUsers();
        },

        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },

        viewDetails (rowData) {
            this.$refs.userDetails.show();
            this.detail_id = rowData.id;
        },

        editRole (item) {
            this.editingItem = { ...item };
            this.$refs.editModal.show();
        },

        loadRoleOption () {
            const that = this;
            axios.get(urls.Admin.User.roleOptions, { company : that.company })
                .then(function (response) {
                    that.roleOptions = response.data.data;
                });
        },

        suspendUser (item) {
            const that = this;
            axios.form(urls.Admin.User.suspend, { user : item.id })
                .then(function (response) {
                    if (response.data && response.data.msg) {
                        that.$notify({
                            title   : 'Message',
                            message : response.data.msg,
                            type    : 'success'
                        });
                    }

                    that.$refs.table.refreshTable();
                    that.loadTotalUsers();
                })
                .catch(function (error) {
                    if (error.response && error.response.data && error.response.data.msg) {
                        that.$notify({
                            title   : 'Error',
                            message : error.response.data.msg,
                            type    : 'error'
                        });
                    }
                });
        },

        suspendSuccess () {
            this.$refs.table.refreshTable();
            this.loadTotalUsers();
        },

        suspendFailure () {
            this.$refs.table.refreshTable();
        },

        deleteComplete (response) {
            let message = null;

            if (response) {
                if (response.data && response.data.message) {
                    message = response.data.message;
                } else if (response.data && response.data.data && response.data.data.message) {
                    message = response.data.data.message;
                } else if (response.message) {
                    message = response.message;
                }
            }

            if (message) {
                this.$notify({
                    title   : 'Success',
                    message : message,
                    type    : 'success'
                });
            }

            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
            this.loadTotalUsers();
        }
    }
};
</script>

<style scoped>

</style>
