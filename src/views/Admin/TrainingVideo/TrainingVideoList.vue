<template>
<div class="card bs-5">
    <vue-table-card title="Training Videos" :fields="fields" :url="listUrl" :per-page="10" ref="table">
    <template #buttons>
        <btn color="primary" @click="$refs.addModal.show()" size="sm" icon="fa fa-plus" text="New"/>
    </template>

    <template #actions={rowData}>
        <div class="btn-group-tight">
            <btn size="xs" text="Edit" @click="viewDetails(rowData)" icon="fa fa-pencil"/>
            <btn size="xs" text="Delete" color="danger" @click="setDelete(rowData)" icon="fa fa-trash"/>
            <btn size="xs" text="Play" @click="playVideo(rowData.url)" icon="fa fa-play-circle"/>
        </div>
    </template>
    </vue-table-card>

    <modal ref="addModal" title="Add New Video" header-color="primary" width="70r" no-close-on-backdrop>
        <!-- <training-video-add @success="AddSuccess"></training-video-add> -->
        <training-video-add :addSuccess="AddSuccess"></training-video-add>
    </modal>
    <modal ref="editModal" title="Training video details" header-color="primary" width="70r" no-close-on-backdrop>
        <training-video-edit :editSuccess="EditSuccess" :editingItem="editingItem"></training-video-edit>
    </modal>
    <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
        <p>You are about to delete the video <b v-html="deletingItem && deletingItem.video_heading"></b>. Are you sure ?</p>

         <template #loading>
            <loading-animation/>
            Please wait while we delete <b v-html="deletingItem && deletingItem.video_heading"></b>.
         </template>
    </delete-modal>
</div>
</template>

<script>
import urls from '@/data/urls';
// import axios from 'secure-axios';
import TrainingVideoAdd from '@/views/Admin/TrainingVideo/TrainingVideoAdd';
import TrainingVideoEdit from '@/views/Admin/TrainingVideo/TrainingVideoEdit';

export default {
    name       : 'TrainingVideoList',
    components : {
        TrainingVideoAdd,
        TrainingVideoEdit
    },
    data () {
        return {
            loading       : false,
            editingItem   : null,
            delete_flag   : null,
            deletingItem  : null,
            listUrl       : urls.Admin.Website.TrainingVideo.Vuelist,
            deleteUrl     : urls.Admin.Website.TrainingVideo.delete,
            statusOptions : [
                { label : 'Enabled', value : false },
                { label : 'Disabled', value : true }
            ],
            fields : [
                // {
                //     name      : 'order',
                //     title     : 'sl No',
                //     sortField : 'order'
                // },
                {
                    name      : 'video_heading',
                    title     : 'Heading',
                    sortField : 'heading'
                },
                // {
                //     name      : 'video_description',
                //     title     : 'Description',
                //     sortField : 'video_description'
                // },
                {
                    name      : 'url',
                    title     : 'Video Url',
                    sortField : 'url'
                },
                {
                    name      : 'order',
                    title     : 'Order',
                    sortField : 'order'
                },
                {
                    name      : 'status',
                    title     : 'Status',
                    sortField : 'status'
                },
                // {
                //     name      : 'created_at',
                //     title     : 'Created At',
                //     sortField : 'created_at'
                // },
                {
                    name  : '__slot:actions',
                    title : 'Actions'

                }
            ]
        };
    },
    methods : {
        viewDetails (data) {
            this.$refs.editModal.show();
            this.editingItem = { ...data };
        },
        AddSuccess () {
            this.$refs.addModal.close();
            this.$refs.table.refreshTable();
        },
        EditSuccess () {
            this.$refs.editModal.close();
            this.$refs.table.refreshTable();
            this.editingItem = null;
        },
        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },
        deleteComplete () {
            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
        },
        playVideo (data) {
            window.open(data);
        }
    }
};
</script>

<style>
<style>
