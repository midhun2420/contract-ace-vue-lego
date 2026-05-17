<!-- <template>
    <div class="card bs-5 p-4">
        <h4>Terms And Conditions</h4>
        <b-form :save-url="addUrl" @success="formSuccess" ref="addForm" v-slot="{model, loading}">
            <div class="row mt-4">
                <div class="col-4">
                    <validated-file-input label="Upload Terms and Conditions" v-model="model.tac_file"
                                :disabled="loading"/>
                </div>
                <div class="col mt-4">
                    <save-btn class="mr-1" text="Upload" icon="" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                    <btn type="button" text="Click here to view current Terms and Conditions" @click="viewTerms" color="success" size="sm" :disabled="loading"/>
                </div>
            </div>
        </b-form>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name : 'TermsAndCondition',
    data () {
        return {
            addUrl   : urls.Admin.MasterData.Terms.add,
            viewUrl  : urls.Admin.MasterData.Terms.view,
            termsUrl : null
        };
    },
    beforeMount () {
        this.loadData();
    },
    methods : {
        loadData () {
            const that = this;
            that.loading = true;
            axios.get(urls.Admin.MasterData.Terms.view).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.termsUrl = json.file;
                    that.loading = false;
                }
            });
        },
        formSuccess (response) {
            this.$refs.addForm.model = {};
            this.$notify('Successfully Uploaded Terms and Conditions  ', 'Success',
                {
                    type : 'success'
                }
            );
            this.termsUrl = response.data.file;
        },
        viewTerms () {
            window.open(this.termsUrl);
        }
    }
};
</script>

<style scoped>

</style> -->

<template>
    <div class="card bs-5 p-4">
        <h4>Terms And Conditions</h4>

        <b-form :save-url="addUrl"
                @success="formSuccess"
                ref="addForm"
                v-slot="{model, loading}">

            <div class="row mt-4">

                <div class="col-4">
                    <validated-file-input
                        label="Upload Terms and Conditions"
                        v-model="model.tac_file"
                        :disabled="loading"/>
                </div>

                <div class="col mt-4">

                    <save-btn class="mr-1"
                              text="Upload"
                              color="primary"
                              size="sm"
                              :disabled="loading">

                        <span v-if="loading">
                            <loading-animation/>
                            <span style="vertical-align: super">
                                Saving...
                            </span>
                        </span>
                    </save-btn>

                    <btn type="button"
                         text="Click here to view current Terms and Conditions"
                         @click="viewTerms"
                         color="success"
                         size="sm"
                         :disabled="loading"/>
                </div>
            </div>

            <!-- 🔴 Error Message -->
            <div v-if="errorMessage"
                 style="color:#DC3545; margin-top:-12px !important; margin-left: 40rem !important;">
                {{ errorMessage }}
            </div>

        </b-form>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {

    name : 'TermsAndCondition',

    data () {
        return {
            addUrl       : urls.Admin.MasterData.Terms.add,
            viewUrl      : urls.Admin.MasterData.Terms.view,
            termsUrl     : null,
            errorMessage : ''
        };
    },

    methods : {

        // 🔹 After upload success
        formSuccess (response) {
            this.$refs.addForm.model = {};

            this.$notify(
                'Successfully Uploaded Terms and Conditions',
                'Success',
                { type : 'success' }
            );

            this.termsUrl = response.data.file;
        },

        viewTerms () {
            this.errorMessage = '';

            axios.get(this.viewUrl)
                .then((response) => {
                    const json = response.data;

                    if (json.error === false && json.file) {
                        window.open(json.file, '_blank');
                    } else {
                        this.errorMessage =
                    json.msg ||
                    'No files for Terms and Condition exists';
                    }
                })
                .catch(() => {
                    this.errorMessage =
                'No files for Terms and Condition exists';
                });
        }
    }
};
</script>

<style scoped>
</style>
