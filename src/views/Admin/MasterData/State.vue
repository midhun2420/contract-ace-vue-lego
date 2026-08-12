<template>
    <vue-table-card title="State" :fields="fields" :url="listUrl" :per-page="10" ref="table">
        <template #buttons>
            <btn color="success" icon="fa fa-plus" size="sm" @click="$refs.addModal.show()" text="Add"/>
        </template>

        <template #actions="{rowData}">
            <div class="btn-group-tight">
                <delete-btn @click="setDelete(rowData)"/>
                <edit-btn @click="setEdit(rowData)"/>
            </div>
        </template>

        <template #footer>
            <modal title="Add State" ref="addModal" width="30r" header-color="primary" no-close-on-backdrop>
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}">
                    <validated-input label="State"
                                     v-model="model.name"
                                     :rules="rules.state"
                                     :disabled="loading"/>
                    <validated-ajax-vue-select :url="countryOptions" label="Country"
                                               :rules="rules.country"
                                               v-model="model.country" :disabled="loading"/>
                    <save-btn text="Add State" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <modal title="Edit State" ref="editModal" width="30r" header-color="primary" no-close-on-backdrop>
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}" :initial-data="editingItem">
                    <validated-input label="State"
                                     v-model="model.name"
                                     :rules="rules.state"
                                     :disabled="loading"/>
                    <validated-ajax-vue-select :url="countryOptions" label="Country"
                                               :rules="rules.country"
                                               v-model="model.country" :disabled="loading"/>
                    <save-btn text="Save State" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                <p>You are about to delete the state <b v-html="deletingItem && deletingItem.name"></b>. Are you sure ?</p>

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

export default {
    name : 'State',
    data () {
        return {
            showAddForm    : false,
            listUrl        : urls.Admin.MasterData.State.list,
            addUrl         : urls.Admin.MasterData.State.addEdit,
            deleteUrl      : urls.Admin.MasterData.State.delete,
            countryOptions : urls.Admin.MasterData.State.countryOptions,
            editingItem    : null,
            deletingItem   : null,
            fields         : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'name',
                    sortField : 'name',
                    title     : 'State'
                },
                {
                    name      : 'country_name',
                    sortField : 'country_name',
                    title     : 'Country'
                },
                {
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            rules : {
                state : {
                    required : true
                },
                country : {
                    required : true
                }
            }
        };
    },
    methods : {
        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            refs.editModal.close();
            refs.table.refreshTable();

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

        deleteComplete (response) {
            const data = response.data || response;
            console.log(data);
            if (data.success === true) {
                this.$notify(
                    data.message || 'Deleted Successfully',
                    'Success',
                    { type : 'success' }
                );
                this.$refs.table.refreshTable();
            } else {
                this.$notify(
                    data.message || 'Unable to delete record',
                    'Warning',
                    { type : 'warning' }
                );
            }
            this.$refs.deleteModal.close();
            // this.$refs.table.refreshTable();
            // setTimeout(() => {
            //     this.$notify(
            //         'Deleted Successfully',
            //         'Message',
            //         {
            //             type : 'success'
            //         }
            //     );
            // }, 1000);
        }
    }
};
</script>

<style scoped>

</style>
