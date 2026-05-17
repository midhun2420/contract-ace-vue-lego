<template>
  <div class="card">
    <div class="row">
      <!-- FILTER SECTION -->
      <div class="col-3 pl-4 pr-3 br-1">
        <div class="row p-0">
          <div class="col-lg-6 col-7">
            <p class="txt-clr-custom-2 font-weight-bold">Filters</p>
          </div>
          <div
            class="col-lg-6 col-5 fl-x-br cursor-pointer"
            @click="clearFilter"
          >
            <p class="red font-weight-bold">Clear All</p>
          </div>
        </div>

        <validated-input
          v-model="search"
          placeholder="Search by Company Name"
        />

        <validated-ajax-vue-select
          label="Industry"
          :url="industryOptions"
          v-model="industry"
          class="c-input-select"
        />

        <validated-ajax-vue-select
          label="Vendor Category"
          :url="vendorCategoryOptions"
          v-model="vendor_category"
          class="c-input-select"
        />

        <validated-ajax-vue-select
          label="Services Provided"
          :url="servicesOptions"
          v-model="services_provided"
          class="c-input-select"
        />

        <validated-ajax-vue-select
          label="Country"
          :url="countryOptions"
          v-model="country"
          @input="loadStateOptions1(country)"
          class="c-input-select"
        />

        <validated-vue-select
          label="State"
          :options="stateOptions"
          v-model="state"
          @input="loadDistrictOptions1(state)"
          class="c-input-select"
        />

        <validated-vue-select
          label="District"
          :options="districtOptions"
          v-model="district"
          class="c-input-select"
        />

        <btn
          text="Search"
          color="primary"
          icon="fa fa-filter"
          class="btn-block"
          @click="loadData"
        />
      </div>

      <!-- RIGHT SECTION -->
      <div class="col-9">
        <!-- VIEW TOGGLE -->
        <div class="text-right mb-2">
          <btn
            size="xs"
            text="Card View"
            icon="fa fa-th-large"
            :color="viewType === 'card' ? 'primary' : 'secondary'"
            class="mr-1"
            @click="setView('card')"
          />
          <btn
            size="xs"
            text="List View"
            icon="fa fa-list"
            :color="viewType === 'list' ? 'primary' : 'secondary'"
            @click="setView('list')"
          />
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="text-center p-5">
          <loading-animation />
          <span> Loading details....</span>
        </div>

        <!-- CARD VIEW -->
        <div
          v-if="!loading && viewType === 'card' && details.data.length"
          class="row ml-3 mb-3 pt-2 w-100p"
        >
          <div
            v-for="(i, index) in details.data"
            :key="index"
            class="col-4 mb-3 cursor-pointer"
          >
            <div class="m-1 p-4 bs-4 h-100p">
              <div class="fl-x-br mt-3">
                <btn
                  :disabled="addLoading"
                  v-if="!i.is_my_contact"
                  color="secondary"
                  size="xs"
                  text="Add"
                  class="mr-1"
                  @click="addToMyContacts(i)"
                />
                <btn
                  :disabled="addLoading"
                  color="primary"
                  size="xs"
                  text="View"
                  @click="viewDetails(i)"
                />
                <btn
                  color="success"
                  size="xs"
                  class="ml-1"
                  text="Product Catalog"
                  @click="viewProductCatalog(i)"
                />
              </div>

              <div class="fl-x-cc mt-5">
                <img v-if="i.company_logo" :src="i.company_logo" />
                <div v-else class="p-4 b-1">
                  <i class="small">Company Logo</i>
                </div>
              </div>

              <p class="text-center mt-4 font-weight-bold fs--1 txt-clr-custom">
                {{ i.company_name }}<br />
                {{ i.company_registration_no }}
              </p>

              <div class="fl-x-tl mt-3 mb-0">
                <p class="ic-text mb-0">{{ i.contact_number }}</p>
              </div>
              <div class="fl-x-tl mt-0">
                <p class="ic-text">{{ i.contact_e_mail_id }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- LIST VIEW -->
        <div v-if="!loading && viewType === 'list' && details.data.length">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Company</th>
                <th>Reg No</th>
                <th>Contact</th>
                <th>Email</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, index) in details.data" :key="index">
                <td>{{ i.company_name }}</td>
                <td>{{ i.company_registration_no }}</td>
                <td>{{ i.contact_number }}</td>
                <td>{{ i.contact_e_mail_id }}</td>
                <td class="text-right">
                  <btn
                    v-if="!i.is_my_contact"
                    size="xs"
                    color="secondary"
                    text="Add"
                    class="mr-1"
                    @click="addToMyContacts(i)"
                  />
                  <btn
                    size="xs"
                    color="primary"
                    text="View"
                    @click="viewDetails(i)"
                  />
                  <btn
                    size="xs"
                    color="success"
                    text="Catalog"
                    class="ml-1"
                    @click="viewProductCatalog(i)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- NO DATA -->
        <div v-if="!loading && !details.data.length" class="text-center p-5">
          No data available
        </div>

        <!-- PAGINATION -->
        <div v-if="details.data.length" class="fl-te-c mt-3">
          <btn
            size="sm"
            icon="fa fa-chevron-left"
            @click="prevClicked"
            v-if="prev"
          />
          <btn size="sm" icon="fa fa-chevron-left" disabled v-else />
          <btn size="sm">{{ details.current_page }}</btn>
          <btn
            size="sm"
            icon="fa fa-chevron-right"
            @click="nextClicked"
            v-if="next"
          />
          <btn size="sm" icon="fa fa-chevron-right" disabled v-else />
        </div>
      </div>
    </div>

    <!-- DETAILS MODAL -->
    <modal ref="showDetailsPage" title="Details Page" width="70r">
      <details-page :company_id="id.toString()" />
    </modal>

    <!-- PRODUCT CATALOG MODAL -->
    <modal ref="productCatalogModal" title="Product Catalog" width="80r">
      <company-product-catalog
        v-if="selectedCompanyId"
        :company_id="selectedCompanyId"
      />
    </modal>
  </div>
</template>

<script>
import urls from '../../../data/urls';
import axios from 'secure-axios';
import DetailsPage from './DetailsPage';
import CompanyProductCatalog from './CompanyProductCatalog';

export default {
    name       : 'Company',
    components : {
        DetailsPage,
        CompanyProductCatalog
    },

    data () {
        return {
            viewType : 'card',

            loading    : false,
            addLoading : false,

            details  : { data : [] },
            page     : 1,
            per_page : 9,
            prev     : false,
            next     : false,
            id       : '',

            // Product catalog
            selectedCompanyId : null,

            search            : '',
            vendor_category   : '',
            services_provided : '',
            industry          : '',
            country           : '',
            state             : '',
            district          : '',

            stateOptions    : [],
            districtOptions : [],

            vendorCategoryOptions : urls.Admin.Company.vendorCategoryOptions,
            industryOptions       : urls.Admin.Company.industryOptions,
            servicesOptions       : urls.Admin.Company.servicesOptions,
            countryOptions        : urls.Admin.MasterData.State.countryOptions,

            listUrl : urls.Consumer.MyContact.companyList
        };
    },

    mounted () {
        this.loadData();
    },

    methods : {
        setView (type) {
            this.viewType = type;
        },

        async addToMyContacts (vendor) {
            if (this.addLoading) return;

            this.addLoading = true;

            try {
                const res = await axios.form(urls.Consumer.MyContact.addToMyContacts, {
                    company : vendor.id
                });

                if (res.data && res.data.status === true) {
                    vendor.is_my_contact = true;

                    this.$notify('Vendor added to Preferred Vendors', '', {
                        type : 'success'
                    });
                } else {
                    this.$notify('Unable to add vendor', '', { type : 'danger' });
                }
            } catch (e) {
                this.$notify('Something went wrong', '', { type : 'danger' });
            }

            this.addLoading = false;
        },

        loadData () {
            this.loading = true;
            axios
                .get(this.listUrl, {
                    params : {
                        page              : this.page,
                        per_page          : this.per_page,
                        search            : this.search,
                        vendor_category   : this.vendor_category,
                        services_provided : this.services_provided,
                        industry          : this.industry,
                        country           : this.country,
                        state             : this.state,
                        district          : this.district
                    }
                })
                .then((res) => {
                    this.details = res.data;
                    this.prev = this.page > 1;
                    this.next = this.page < this.details.last_page;
                    this.loading = false;
                });
        },

        prevClicked () {
            this.page--;
            this.loadData();
        },

        nextClicked () {
            this.page++;
            this.loadData();
        },

        clearFilter () {
            this.search = '';
            this.vendor_category = '';
            this.services_provided = '';
            this.industry = '';
            this.country = '';
            this.state = '';
            this.district = '';
            this.loadData();
        },

        viewDetails (row) {
            this.id = row.id;
            this.$refs.showDetailsPage.show();
        },

        viewProductCatalog (row) {
            console.log('Opening product catalog for company:', row.id);
            // Set the selected company ID
            this.selectedCompanyId = row.id;
            // Open the modal
            this.$nextTick(() => {
                this.$refs.productCatalogModal.show();
            });
        },

        loadStateOptions1 () {},
        loadDistrictOptions1 () {}
    }
};
</script>

<style scoped lang="scss">
.txt-clr-custom {
  color: #284565;
  font-size: 13px;
}
.txt-clr-custom-2 {
  color: #284565;
  font-size: 13px;
}
.red {
  color: red;
  font-size: 12px;
}
.ic-text {
  font-size: 12px;
  color: #284565;
}
</style>
