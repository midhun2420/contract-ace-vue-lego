<template>
    <div class="py-1">
        <b-form :save-url="addUrl" @success="addSuccess" v-slot="{model, loading}" class="row">
            <div class="col-md-12">
                <validated-input label="Heading *:" name="Video Heading"
                                    v-model="model.video_heading" :rules="rules.heading"/>
            </div>
            <div class="col-md-12">
                <textarea-input class="c-textarea" label="Description :" name="Video Description"
                                v-model="model.video_description"/>
            </div>
            <div class="col-md-12">
                <textarea-input class="h-textarea" label="Video url *:" name="Video url"
                                 v-model="model.video_url" :rules="rules.heading"/>
            </div>
            <div class="col-md-6">
                <validated-vue-select :options="statusOptions" label="Status" name="Status"
                                       v-model="model.delete_flag"/>
            </div>
            <div class="col-md-6">
                <validated-input label="Order :" name="Order"
                                 type="number" v-model="model.order"/>
            </div>
            <div class="col-md-5">
                <save-btn text="Add" loading-text="saving.." :loading="loading" color="primary"/>
            </div>
        </b-form>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name  : 'TrainingVideoAdd',
    props : {
        addSuccess : Function
    },
    data () {
        return {
            loading : false,
            addUrl  : urls.Admin.Website.TrainingVideo.add,
            model   : {
                video_heading     : '',
                video_url         : '',
                video_description : '',
                delete_flag       : '',
                order             : ''
            },
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
