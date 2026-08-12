<template>
    <div>
        <check-permission/>
        <vue-table-card v-if="currentUser.features.standard_template || currentUser.is_superuser" class="card bs-5"
                        title="Standard Templates" :fields="fields" :url="listUrl" :per-page="10"
                        ref="table">
            <template #buttons>
                <btn v-if="currentUser.is_superuser" color="success" icon="fa fa-file" size="sm"
                     @click="$refs.importTemplateModal.show()" text="Import Template" class="mr-2"/>
                <btn v-if="currentUser.is_superuser" color="success" icon="fa fa-plus" size="sm"
                     @click="$refs.addModal.show()" text="Add"/>
            </template>

            <template #actions="{rowData}">
                <div class="btn-group-tight">
                    <edit-btn size="xs" v-if="currentUser.is_superuser" @click="setEdit(rowData)"/>
                    <!--                    <edit-btn icon="fa fa-pencil" color="info" @click="showEditor(rowData)" text="Editor"/>-->
                    <!--                    <edit-btn icon="fa fa-eye" color="info" @click="showPreview(rowData)" text="Preview"/>-->
                    <delete-btn size="xs" v-if="currentUser.is_superuser" @click="setDelete(rowData)"/>
                    <edit-btn icon="" class="primary" size="xs" v-if="currentUser.is_superuser" color="primary"
                              @click="viewDetails(rowData)"
                              text="View"/>
                    <btn v-if="!rowData.is_published && currentUser.is_superuser" color="success" size="xs" @click="publishTemplate(rowData)"
                         text="Publish"/>
                    <btn v-if="rowData.is_published && currentUser.is_superuser" color="warning" size="xs" @click="publishTemplate(rowData)"
                         text="Suppress"/>
                    <edit-btn icon="" class="bgc-primary-600" size="xs" color="info" @click="showBidPreview(rowData)"
                              text="Preview"/>
                </div>
            </template>

            <template #footer>
                <modal no-close-on-backdrop title="Import Template" ref="importTemplateModal" width="30r" header-color="primary">
                    <b-form :save-url="importUrl" @success="importSuccess" v-slot="{model, loading}">
                        <validated-input label="Standard Template" name="name" v-model="model.name" :disabled="loading"/>
                        <validated-file-input label="File" name="file" v-model="model.file" :disabled="loading"/>
                        <save-btn text="Import" icon="" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span
                            style="vertical-align: super"> Importing...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <modal title="Add Standard Template" ref="addModal" width="30r" header-color="primary">
                    <b-form :save-url="addUrl" @success="formSuccess" @failure="formError" v-slot="{model, loading}"
                            :save-params="{json: json}">
                        <validated-input label="Standard Template" v-model="model.name" :disabled="loading"/>
                        <!--                    <textarea-input label="Json" v-model="model.json" :disabled="loading"/>-->
                        <save-btn icon="" text="Save" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Saving...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <modal title="Edit Standard Template" ref="editModal" width="30r" header-color="primary">
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}"
                            :initial-data="editingItem">
                        <validated-input label="Name" v-model="model.name" :disabled="loading"/>
                        <!--                    <textarea-input label="Json" v-model="model.json" :disabled="loading"/>-->
                        <save-btn icon="" text="Update" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Updating...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                    <p>You are about to delete the Standard Template <b
                        v-html="deletingItem && deletingItem.name"></b>.
                        Are
                        you sure ?</p>

                    <template #loading>
                        <loading-animation/>
                        Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
                    </template>
                </delete-modal>
            </template>

        </vue-table-card>
        <div v-if="(!currentUser.features.standard_template) && (!currentUser.is_superuser)"
             class="card text-center bg-primary">
            Sorry, You don't have permission to view this page. Kindly contact your Owner.
        </div>
    </div>
</template>

<script>
import urls from '@/data/urls';
import { mapGetters } from 'vuex';
import axios from 'secure-axios';

export default {
    name : 'StandardTemplates',
    data () {
        return {
            listUrl     : urls.Admin.StandardTemplate.list,
            importUrl   : urls.Admin.StandardTemplate.import,
            addUrl      : urls.Admin.StandardTemplate.addEdit,
            deleteUrl   : urls.Admin.StandardTemplate.delete,
            json        : '',
            editingItem : {
                id   : '',
                name : ''
            },
            deletingItem : null,
            fields       : [
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
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ]
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    methods : {
        publishTemplate (item) {
            const that = this;

            axios.form(urls.Admin.StandardTemplate.publish, { id : item.id })
                .then(function (response) {
                    console.log('Publish Response:', response.data);

                    const json = response.data;

                    if (json.error === false) {
                        that.publishSuccess(json);
                    } else {
                        that.publishFailure(json);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        publishSuccess (response) {
            this.$notify(
                response.msg,
                'Message',
                {
                    type : 'success'
                }
            );

            this.$refs.table.refreshTable();
        },
        publishFailure (response) {
            this.$notify(
                response.msg || 'Publish Failed',
                'Error',
                {
                    type : 'danger'
                }
            );

            this.$refs.table.refreshTable();
        },
        viewDetails (rowData) {
            this.$router.push('/app/standard-template/' + rowData.id + '/details/');
        },

        showBidPreview (rowData) {
            this.$router.push('/app/standard-template/' + rowData.id + '/bid-view/');
        },

        formSuccess (response) {
            console.log('formSuccess called', response);

            const refs = this.$refs;

            refs.addModal.close();
            refs.editModal.close();

            refs.table.refreshTable();
        },

        formError () {
            this.$notify('Import Failed', 'Success', {
                type : 'success'
            });
        },
        importSuccess () {
            this.$notify('Import Successful', 'Success', {
                type : 'success'
            });
            this.$refs.importTemplateModal.close();
            this.$refs.table.refreshTable();
        },

        setEdit (item) {
            this.editingItem.id = item.id;
            this.editingItem.name = item.name;
            this.$refs.editModal.show();
        },

        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },

        deleteComplete (response) {
            this.deletingItem = null;
            this.$refs.deleteModal.close();

            this.$refs.table.refreshTable();

            setTimeout(() => {
                this.$notify(
                    'Deleted Successfully',
                    'Message',
                    {
                        type : 'success'
                    }
                );
            }, 1000);
        }
    }
};
</script>

<style scoped>

</style>
