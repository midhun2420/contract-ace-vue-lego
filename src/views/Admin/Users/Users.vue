<template>
    <vue-table-card title="Users" :extra-params="{ company }" class="card bs-5" :fields="fields" :url="listUrl"
                    :per-page="10" ref="table" @data-loaded="handleDataLoaded">
        <template #buttons>
            <btn
                color="success"
                v-if="(currentUser.role === 'owner' && currentUser.features.delegate_role_to_others && canAddUser) || (currentUser.is_superuser === true && canAddUser)"
                icon="fa fa-plus"
                size="sm"
                @click="$refs.addModal.show()"
                text="Add"/>
        </template>
        <template #actions="{rowData}">
            <div class="btn-group-tight">
                <delete-btn size="xs" v-if="currentUser.role==='owner' || currentUser.is_superuser === true" @click="setDelete(rowData)"/>

                <btn v-if="rowData.is_suspended === true && !rowData.is_superuser"
                     color="warning" size="xs" text="Suspended"/>

                <btn color="primary" size="xs" @click="viewDetails(rowData)" text="View"/>
            </div>
        </template>

        <template #footer>
            <modal title="Add User" ref="addModal" header-color="primary" no-close-on-backdrop>
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}" :save-params="{company}">
                    <div class="row">
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
                                                   v-model="model.password1"/>
                        </div>
                        <div class="col-md-4">
                            <custom-password-input name="Confirm Password" :rules="rules.password2"
                                                   label="Confirm Password" :disabled="loading"
                                                   v-model="model.password2"/>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-md-4">
                            <validated-vue-select name="Role" :options="roleOptions" ref="roleOptionReload"
                                                  :rules="rules.role" label="Role"
                                                  v-model="model.role"></validated-vue-select>
                        </div>
                        <div class="col-md-4">
                            <validated-vue-select name="Address Type" :options="addressTypeOptions"
                                                  label="Address Type" :disabled="loading"
                                                  v-model="model.address_type"></validated-vue-select>
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
                    <save-btn text="Save" icon="" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>
            <modal no-close-on-backdrop title="User Details" ref="userDetails" header-color="primary">
                <user-details-page :detail="detail_id"/>
            </modal>
            <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                <p>You are about to delete the company <b v-html="deletingItem && deletingItem.name"></b>. Are you sure
                    ?</p>
                <template #loading>
                    <loading-animation/>
                    Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
                </template>
            </delete-modal>
        </template>

    </vue-table-card>
</template>

<script>
import urls from '@/data/urls';
import UserDetailsPage from './UserDetails';
import { mapGetters } from 'vuex';
import axios from 'secure-axios';

export default {
    name  : 'Users',
    props : {
        detail         : { type : String },
        userCountLimit : { type : Number, default : null }
    },
    components : { UserDetailsPage },
    data () {
        return {
            company        : this.detail,
            roleOptions    : [],
            companyOptions : urls.Admin.User.companyOptions,

            listUrl     : urls.Admin.User.list,
            addUrl      : urls.Admin.User.addEdit,
            editRoleUrl : urls.Admin.User.editRole,
            deleteUrl   : urls.Admin.User.delete,

            editingItem        : null,
            deletingItem       : null,
            detail_id          : '',
            totalUsers         : 0,
            currentUserCount   : 0,
            packageUserLimit   : null,
            addressTypeOptions : [
                { label : 'Office', value : 'Office' },
                { label : 'Home', value : 'Home' },
                { label : 'Other', value : 'Other' }
            ],
            fields : [
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
                    name      : 'role_name',
                    sortField : 'role_name',
                    title     : 'Role'
                },
                {
                    name      : 'company',
                    sortField : 'company',
                    title     : 'Company'
                },
                {
                    name      : 'staff_phone_number',
                    sortField : 'staff_phone_number',
                    title     : 'Phone'
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
                role : {
                    required : true
                },
                staff_phone_number : {
                    required : true
                },
                username : {
                    required : true
                },
                password1 : {
                    required : true
                },
                password2 : {
                    required : true
                },
                email : {
                    required : true
                }
            }
        };
    },
    watch : {
        // When parent passes userCountLimit prop, sync it to packageUserLimit
        userCountLimit (val) {
            console.log('userCountLimit prop received:', val);
            if (val !== null) {
                this.packageUserLimit = val;
            }
        }
    },
    computed : {
        ...mapGetters(['currentUser']),

        userLimit () {
            if (this.packageUserLimit !== null) {
                return this.packageUserLimit;
            }
            const limit = this.currentUser?.packages?.user_count_limit;
            return limit ? parseInt(limit) : 0;
        },

        canAddUser () {
            console.log('canAddUser check — packageUserLimit:', this.packageUserLimit, 'totalUsers:', this.totalUsers);

            // Use packageUserLimit passed from parent
            if (this.packageUserLimit !== null) {
                if (this.packageUserLimit === 0) return true; // 0 means unlimited
                return this.totalUsers < this.packageUserLimit; // 4 < 5 = true (can add), 5 < 5 = false (limit reached)
            }

            const pkg = this.currentUser.packages || {};
            const userCount = pkg.user_count;
            const userCountLimit = pkg.user_count_limit;

            // PRIORITY 1: user_count_limit check
            if (userCountLimit !== undefined && userCountLimit !== null) {
                let numericLimit = 0;
                if (typeof userCountLimit === 'string') {
                    const match = userCountLimit.match(/\d+/);
                    if (match) numericLimit = parseInt(match[0], 10);
                } else if (typeof userCountLimit === 'number') {
                    numericLimit = userCountLimit;
                }
                if (!isNaN(numericLimit) && numericLimit > 0) {
                    return this.totalUsers < numericLimit;
                }
            }

            // PRIORITY 2: user_count check
            if (userCount === 'false' || userCount === false) return false;
            if (userCount === 'true' || userCount === true) return true;

            let numericLimit = 0;
            if (typeof userCount === 'string') {
                const match = userCount.match(/\d+/);
                if (match) numericLimit = parseInt(match[0], 10);
            } else if (typeof userCount === 'number') {
                numericLimit = userCount;
            }
            if (!isNaN(numericLimit) && numericLimit > 0) {
                return this.totalUsers < numericLimit;
            }

            return true;
        }
    },
    mounted () {
        console.log('PROP LIMIT', this.userCountLimit);
        console.log('PACKAGE LIMIT', this.currentUser?.packages);
        this.loadRoleOption();
        this.loadTotalUsers();
        // Use prop if already available at mount time
        if (this.userCountLimit !== null) {
            this.packageUserLimit = this.userCountLimit;
        }
    },
    methods : {
        loadTotalUsers () {
            const that = this;
            axios.get(this.listUrl, { params : { per_page : 1, page : 1, company : this.company } })
                .then(function (response) {
                    if (response.data) {
                        // No +1, use actual total from API
                        that.totalUsers = response.data.total || 0;
                        console.log('totalUsers loaded:', that.totalUsers);
                    }
                })
                .catch(function (error) {
                    console.error('Failed to load user count:', error);
                });
        },

        handleDataLoaded (data) {
            this.currentUserCount = data?.total || 0;
            // No +1, use actual total
            this.totalUsers = data?.total || 0;
            console.log('handleDataLoaded totalUsers:', this.totalUsers);
        },

        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            this.loadRoleOption();
            this.editingItem = null;
            this.loadTotalUsers();
            refs.table.refreshTable();
        },

        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },

        viewDetails (rowData) {
            this.$refs.userDetails.show();
            this.detail_id = rowData.id;
        },

        addRole (item) {
            if (!this.canAddUser) {
                this.$toast.warning(`User limit reached. You can only add ${this.userLimit} users.`);
                return;
            }
            this.$refs.addModal.show();
        },

        loadRoleOption () {
            const that = this;
            axios.form(urls.Admin.User.roleOptions, { company : that.company }).then(function (response) {
                const json = response.data;
                that.roleOptions = json.data;
            });
        },

        deleteComplete (response) {
            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
            this.loadRoleOption();
            this.loadTotalUsers();
        }
    }
};
</script>

<style scoped>

</style>
