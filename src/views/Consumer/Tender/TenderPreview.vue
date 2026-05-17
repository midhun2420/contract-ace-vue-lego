<!-- <template>
  <div>
    <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
      <loading-animation/>
      <span style=" vertical-align: super"> Loading details....</span>
    </div>
    <div v-if="!loading && permission">

      <div v-if="details && details.json!==''" class="card container bs-5">
        <div class="row">
          <div class="col text-left mb-3">
            <h4>{{ details.name }}</h4>
          </div>
          <div class="btn-group text-right mb-3 mr-3">
<btn
  v-if="currentUser.packages && currentUser.packages.printing_tenders === 'true'"
  type="button"
  color="warning"
  size="sm"
  @click="printClicked"
  text="Print"
/>

            <btn type="button" color="primary" size="sm"
                 @click="backClicked" text="Back"/>
          </div>
        </div>
        <BidView class="mb-3" v-if="currentUser.features.my_bids_views_and_update"
                 :json="initial_json" :variable-json="variablesJson"
                 :title="details.name + ' # ' + details.id"/>
      </div>
      <div class="bg-primary card bs-5 text-center" v-if="details.json===''">
        Oops ! , Seems you don't have enough contents in your tender for the preview.
      </div>
    </div>
    <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>
  </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import BidView from '@/component/Bidder/BidView';
import OneBid from '@/data/Samples/OneBid';

export default {
    name       : 'TenderPreview.vue',
    components : { BidView },
    data () {
        return {
            show          : false,
            permission    : true,
            loading       : false,
            id            : this.$route.params.id,
            tender_id     : this.$route.params.id,
            details       : null,
            initial_json  : null,
            variablesJson : JSON.stringify(OneBid),
            currentPath   : null,
            previousPath  : null
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    beforeMount () {
        this.loadDetails();
    },
    methods : {
        backClicked () {
            const path = this.$route.path;
            if (path.split('/')[2] === 'archived-tender') {
                this.$router.push('/app/archived/tender/');
            } else if (path.split('/')[2] === 'tender') {
                this.$router.push('/app/tender/');
            }
        },
        printClicked () {
            const baseData = [{ tabName : 'First Tab', data : [] }];
            const currentJson = JSON.parse(JSON.stringify(this.details.json));
            if (JSON.stringify(baseData) !== JSON.stringify(currentJson)) {
                this.printScreen();
            } else {
                this.$notify('Not enough content to generate pdf.', 'Message', {
                    type : 'info'
                });
            }
        },
        printScreen (item) {
            const that = this;
            that.loading = true;

            axios.form(urls.Consumer.Tender.Print, { tender_id : that.tender_id })
                .then(function (response) {
                    const json = response.data;

                    // 🔴 Only message change added here
                    if (json.permission === false) {
                        if (that.details && that.details.status === 'Created') {
                            that.$notify(
                                'Download option is not available while Tender is in Created status.',
                                'Not Allowed',
                                { type : 'warning' }
                            );
                        } else {
                            that.$notify(
                                'You do not have permission to download this Tender.',
                                'Permission Denied',
                                { type : 'warning' }
                            );
                        }

                        that.loading = false;
                        return;
                    }

                    // 🟢 Existing success logic (unchanged)
                    if (json.url) {
                        that.$notify('Pdf generated successfully', 'Success', {
                            type : 'success'
                        });
                        window.open(json.url);
                        that.loading = false;
                    } else {
                        that.$notify('Pdf generation failed', 'Error', {
                            type : 'danger'
                        });
                        that.loading = false;
                    }
                });

            that.loading = false;
        },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.Tender.details, { tender_id : this.tender_id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json.tender;
                    that.initial_json = JSON.stringify(json.tender.json);
                    that.loading = false;
                } else if (json.permission === false) {
                    that.permission = json.permission;
                    that.loading = false;
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
                }
                const status = that.details.status;
                if (status === 'Cancelled' || status === 'Published') {
                    that.show = true;
                }
            });
        }
    }
}
;
</script>

<style scoped>
.text-small {
  font-weight: 500;
}

.form-control {
  border-radius: 5px;
}
</style> -->

<template>
  <div>
    <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
      <loading-animation/>
      <span style="vertical-align: super"> Loading details....</span>
    </div>

    <div v-if="!loading && permission">

      <!-- Tender Preview -->

      <div v-if="details && details.json!==''" class="card container bs-5">
        <div class="row">
          <div class="col text-left mb-3">
            <h4>{{ details.name }}</h4>
          </div>

          <div class="btn-group text-right mb-3 mr-3">

            <!-- PRINT BUTTON -->
            <btn
              v-if="currentUser.packages
                    && currentUser.packages.printing_tenders === 'true'"
              type="button"
              color="warning"
              size="sm"
              @click="printClicked"
              text="Print"
            />

            <btn
              type="button"
              color="primary"
              size="sm"
              @click="backClicked"
              text="Back"
            />
          </div>
        </div>

        <BidView
          class="mb-3"
          v-if="currentUser.features.my_bids_views_and_update"
          :json="initial_json"
          :variable-json="variablesJson"
          :title="details.name + ' # ' + details.id"
        />
      </div>

      <div class="bg-primary card bs-5 text-center" v-if="details.json===''">
        Oops! Seems you don't have enough contents in your tender for the preview.
      </div>
    </div>

    <div v-if="!permission" class="card text-center bg-primary">
      Page not found!
    </div>
  </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import BidView from '@/component/Bidder/BidView';
import OneBid from '@/data/Samples/OneBid';

export default {
    name       : 'TenderPreview.vue',
    components : { BidView },

    data () {
        return {
            show          : false,
            permission    : true,
            loading       : false,
            id            : this.$route.params.id,
            tender_id     : this.$route.params.id,
            details       : null,
            initial_json  : null,
            variablesJson : JSON.stringify(OneBid),
            currentPath   : null,
            previousPath  : null
        };
    },

    computed : {
        ...mapGetters(['currentUser'])
    },

    beforeMount () {
        this.loadDetails();
    },

    methods : {

        /* ================= BACK BUTTON FIX ================= */
        backClicked () {
            // 1️⃣ If project_id exists in query
            if (this.$route.query.project_id) {
                this.$router.push({
                    path  : '/app/project/' + this.$route.query.project_id + '/details/',
                    query : { name : this.$route.query.name || '' }
                });

                return;
            }

            // 2️⃣ If came from project page, use history back
            if (window.history.length > 1) {
                this.$router.go(-1);
                return;
            }

            // 3️⃣ Fallback
            this.$router.push('/app/tender/');
        },

        /* ================= PRINT ================= */
        printClicked () {
            const baseData = [{ tabName : 'First Tab', data : [] }];
            const currentJson = JSON.parse(JSON.stringify(this.details.json));

            if (JSON.stringify(baseData) !== JSON.stringify(currentJson)) {
                this.printScreen();
            } else {
                this.$notify(
                    'Not enough content to generate pdf.',
                    'Message',
                    { type : 'info' }
                );
            }
        },

        printScreen () {
            const that = this;
            that.loading = true;

            axios.form(urls.Consumer.Tender.Print, {
                tender_id : that.tender_id
            })
                .then(function (response) {
                    const json = response.data;

                    if (json.permission === false) {
                        if (that.details && that.details.status === 'Created') {
                            that.$notify(
                                'Download option is not available while Tender is in Created status.',
                                'Not Allowed',
                                { type : 'warning' }
                            );
                        } else {
                            that.$notify(
                                'You do not have permission to download this Tender.',
                                'Permission Denied',
                                { type : 'warning' }
                            );
                        }

                        that.loading = false;
                        return;
                    }

                    if (json.url) {
                        that.$notify(
                            'Pdf generated successfully',
                            'Success',
                            { type : 'success' }
                        );
                        window.open(json.url);
                    } else {
                        that.$notify(
                            'Pdf generation failed',
                            'Error',
                            { type : 'danger' }
                        );
                    }

                    that.loading = false;
                })
                .catch(function () {
                    that.$notify(
                        'Something went wrong while generating PDF.',
                        'Error',
                        { type : 'danger' }
                    );
                    that.loading = false;
                });
        },

        /* ================= LOAD DETAILS ================= */
        loadDetails () {
            const that = this;
            that.loading = true;

            axios.form(urls.Consumer.Tender.details, {
                tender_id : that.tender_id
            })
                .then(function (response) {
                    const json = response.data;

                    if (json.error === false) {
                        that.details = json.tender;
                        that.initial_json = JSON.stringify(json.tender.json);
                    } else if (json.permission === false) {
                        that.permission = false;
                    } else {
                        that.permission = false;
                    }

                    if (that.details) {
                        const status = that.details.status;
                        if (status === 'Cancelled' || status === 'Published') {
                            that.show = true;
                        }
                    }

                    that.loading = false;
                })
                .catch(function () {
                    that.permission = false;
                    that.loading = false;
                });
        }
    }
};
</script>

<style scoped>
.text-small {
  font-weight: 500;
}

.form-control {
  border-radius: 5px;
}
</style>
