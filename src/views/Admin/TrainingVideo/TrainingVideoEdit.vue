<template>
    <div class="py-1">
        <b-form :save-url="editUrl" @success="editSuccess" v-slot="{model, loading}"
                :initial-data="editingItem">
            <validated-input label="Heading *:" name="Video Heading"
                                v-model="model.video_heading" :rules="rules.heading"/>
            <textarea-input class="c-textarea" label="Description :" name="Video Description"
                            v-model="model.video_description"/>
            <textarea-input class="h-textarea" label="Video url *:" name="Video url"
                             v-model="model.video_url" :rules="rules.heading"/>
            <div class="row">
                <div class="col">
                    <validated-vue-select :options="statusOptions" label="Status" name="Status"
                                    v-model="model.delete_flag"/>
                </div>
                <div class="col">
                    <validated-input label="Order *:" name="Order"
                             type="number" v-model="model.order"/>
                </div>
                <div class="col">
                    <span>Created At :</span>
                    <span class="form-control">
                        {{ editingItem.created_at }}
                    </span>
                </div>
            </div>
            <save-btn text="Update" loading-text="updating.." :loading="loading" color="primary"/>
        </b-form>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name  : 'TrainingVideoAdd',
    props : {
        editSuccess : Function,
        editingItem : null
    },
    data () {
        return {
            loading       : false,
            editUrl       : urls.Admin.Website.TrainingVideo.add,
            statusOptions : [
                { label : 'Enabled', value : false },
                { label : 'Disabled', value : true }
            ],
            rules : {
                heading : { required : true }
            }
        };
    },
    methods : {
        async submit () {
            const that = this;
            const response = await axios.form(urls.Admin.Website.TrainingVideo.add, that.model);
            console.log(response.data);
            if (response.data.success) {
                this.$emit('success');
                alert('success');
            } else {
                alert('error');
            }
        }
    }
};

</script>

<style scoped>
<style>
