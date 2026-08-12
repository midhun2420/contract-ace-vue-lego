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
          v-if="canProductCatalogue"
          label="Product Catalogue"
          :url="productOptions"
          v-model="product"
          class="c-input-select"
          @option:selected="onOptionSelected"
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

        <!-- VIEW TOGGLE — Projects style -->
        <div class="fl-x fl-j-sb mb-3 pt-1">
          <div></div>
          <div class="fl-x" style="gap: 8px;">
            <btn
              size="xs"
              class="lv"
              text="Card View"
              icon="fa fa-th-large"
              :color="viewType === 'card' ? 'primary' : 'secondary'"
              @click="viewType = 'card'"
            />
            <btn
              size="xs"
              class="lv"
              text="List View"
              icon="fa fa-list"
              :color="viewType === 'list' ? 'primary' : 'secondary'"
              @click="viewType = 'list'"
            />
          </div>
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
                  color="primary"
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
                  v-if="canProductCatalogue && i.package?.features?.product_catelogue?.enabled === 'true'"
                  color="primary"
                  size="xs"
                  class="ml-1"
                  text="Product Catalogue"
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
        <div v-if="!loading && viewType === 'list' && details.data.length" class="card bs-5">
          <div class="card-body">
            <div class="table-responsive">
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
                      <div class="btn-group-tight">
                        <btn
                          v-if="!i.is_my_contact"
                          size="xs"
                          color="primary"
                          text="Add"
                          @click="addToMyContacts(i)"
                        />
                        <btn
                          size="xs"
                          color="primary"
                          text="View"
                          @click="viewDetails(i)"
                        />
                        <btn
                          v-if="canProductCatalogue && i.package?.features?.product_catelogue?.enabled === 'true'"
                          size="xs"
                          color="primary"
                          text="Catalogue"
                          @click="viewProductCatalog(i)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- NO DATA -->
        <div v-if="!loading && !details.data.length" class="text-center p-5">
          No data available
        </div>

        <!-- PAGINATION -->
        <div v-if="details.data.length" class="pagination-container">
          <div class="d-flex">
            <btn
              size="sm"
              icon="fa fa-angle-double-left"
              title=""
              @click="goToFirstPage"
              :disabled="page === 1"
              class="mr-1"
            />
            <btn
              size="sm"
              icon="fa fa-chevron-left"
              title=""
              @click="prevClicked"
              :disabled="!prev"
              class="mr-2"
            />
            <div class="page-numbers d-flex align-items-center">
              <btn
                v-for="pageNum in visiblePages"
                :key="pageNum"
                size="sm"
                :text="pageNum.toString()"
                :color="pageNum === page ? 'primary' : 'secondary'"
                @click="goToPage(pageNum)"
                class="mx-1"
              />
            </div>
            <btn
              size="sm"
              icon="fa fa-chevron-right"
              title=""
              @click="nextClicked"
              :disabled="!next"
              class="ml-2"
            />
            <btn
              size="sm"
              icon="fa fa-angle-double-right"
              title=""
              @click="goToLastPage"
              :disabled="page === details.last_page"
              class="ml-1"
            />
          </div>

          <div class="text-center mt-2">
            <small class="text-muted">
              Page {{ page }} of {{ details.last_page }} ({{ details.total }} total results)
            </small>
          </div>

          <div class="text-center mt-2">
            <div class="d-inline-flex align-items-center">
              <small class="mr-2">Go to page:</small>
              <input
                type="number"
                v-model.number="jumpToPageInput"
                @keyup.enter="jumpToPage"
                min="1"
                :max="details.last_page"
                class="form-control form-control-sm"
                style="width: 80px"
                placeholder="Page"
              />
              <btn
                size="sm"
                text="Go"
                color="primary"
                @click="jumpToPage"
                class="ml-2"
              />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- DETAILS MODAL -->
    <modal ref="showDetailsPage" title="Details Page" width="70r">
      <details-page :company_id="id.toString()" />
    </modal>

    <!-- PRODUCT CATALOG MODAL -->
    <modal ref="productCatalogModal" title="Product catalogue" width="90r">

      <!-- Loading -->
      <div v-if="productLoading" class="text-center p-4">
        <loading-animation />
        <p>Loading products...</p>
      </div>

      <template v-if="!productLoading">

        <div
          v-if="products"
          class="mb-3"
          style="display:flex; justify-content:space-between; align-items:center; gap:12px;"
        >

          <!-- LEFT : SEARCH -->
          <div style="width:260px;">
            <validated-input
              type="text"
              v-model="productSearch"
              placeholder="Search product..."
              class="form-control-sm"
            />
          </div>

          <!-- RIGHT : BUTTONS -->
          <div style="display:flex; align-items:center; gap:8px;">
            <btn
              color="primary"
              size="xs"
              text="Download Catalogue"
              @click="downloadProductCatalogue"
            />
            <btn
              size="xs"
              text="Card View"
              icon="fa fa-th-large"
              :color="productViewType === 'card' ? 'primary' : 'secondary'"
              @click="switchProductView('card')"
            />
            <btn
              size="xs"
              text="List View"
              icon="fa fa-list"
              :color="productViewType === 'list' ? 'primary' : 'secondary'"
              @click="switchProductView('list')"
            />
          </div>
        </div>

        <!-- CARD VIEW -->
<div v-if="filteredProducts.length && productViewType === 'card'" class="row">
  <div v-for="(p, index) in filteredProducts" :key="index" class="col-3 mb-3">
    <div class="card p-3 h-100 bs-3">

      <!-- CARD HEADER -->
      <div class="text-center mb-3">
        <h6 class="font-weight-bold mb-1">{{ p.name }}</h6>
        <p class="text-muted fs--1 mb-1">{{ p.brand || '&nbsp;' }}</p>
        <p class="price mb-0">₹ {{ p.price }}</p>
      </div>

      <hr class="mt-0 mb-2" />

      <!-- CARD BODY -->
      <div class="product-info mb-3">
        <p class="mb-1"><small><strong>Unit:</strong> {{ p.unit || 'N/A' }}</small></p>
        <p class="mb-1"><small><strong>Quantity:</strong> {{ p.quantity || 'N/A' }}</small></p>
        <p class="mb-1"><small><strong>Location:</strong> {{ p.location || 'N/A' }}</small></p>
      </div>

      <!-- CARD FOOTER -->
      <div class="text-center">
        <btn size="xs" color="primary" text="View Details" @click="viewProductDetails(p)" />
      </div>

    </div>
  </div>
</div>

        <!-- LIST VIEW -->
        <div v-if="filteredProducts.length && productViewType === 'list'" class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Valid Till</th>
                <th>Specification</th>
                <th>Grade</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in filteredProducts" :key="index">
                <td>{{ p.name || '-' }}</td>
                <td>{{ p.description || '-' }}</td>
                <td>{{ p.unit || 'N/A' }}</td>
                <td>₹ {{ p.price }}</td>
                <td>{{ p.location || '-' }}</td>
                <td>{{ p.quantity || '-' }}</td>
                <td>{{ p.price_valid_till || '-' }}</td>
                <td>{{ p.specification || '-' }}</td>
                <td>{{ p.grade || '-' }}</td>
                <td>{{ p.updated_on || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- No Products -->
        <div v-if="!filteredProducts.length" class="text-center p-4">
          No products available
        </div>

      </template>
    </modal>

    <!-- PRODUCT DETAILS MODAL -->
    <modal ref="productDetailsModal" title="Product Details" width="60r">
      <div v-if="selectedProduct">
        <div class="row mb-2">
          <div class="col-md-6">
            <strong>Product Name:</strong> {{ selectedProduct.name }}
          </div>
          <div class="col-md-6" v-if="selectedProduct.brand">
            <strong>Brand:</strong> {{ selectedProduct.brand }}
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-6">
            <strong>Price:</strong> ₹{{ selectedProduct.price }}
          </div>
          <div class="col-md-6">
            <strong>Quantity:</strong> {{ selectedProduct.quantity }}
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-6">
            <strong>Unit:</strong> {{ selectedProduct.unit || 'N/A' }}
          </div>
          <div class="col-md-6" v-if="selectedProduct.grade">
            <strong>Grade:</strong> {{ selectedProduct.grade }}
          </div>
        </div>
        <div class="row mb-2" v-if="selectedProduct.location || selectedProduct.price_valid_till">
          <div class="col-md-6" v-if="selectedProduct.location">
            <strong>Location:</strong> {{ selectedProduct.location }}
          </div>
          <div class="col-md-6" v-if="selectedProduct.price_valid_till">
            <strong>Valid Till:</strong> {{ selectedProduct.price_valid_till }}
          </div>
        </div>
        <div class="row">
          <div class="mb-2 col-md-6" v-if="selectedProduct.description">
            <strong>Description:</strong>
            <p>{{ selectedProduct.description }}</p>
          </div>
          <div class="mb-2 col-md-6" v-if="selectedProduct.specification">
            <strong>Specification:</strong>
            <p>{{ selectedProduct.specification }}</p>
          </div>
        </div>
        <div class="text-muted small" v-if="selectedProduct.updated_on">
          <strong>Last Updated:</strong> {{ selectedProduct.updated_on }}
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import urls from '../../../data/urls';
import axios from 'secure-axios';
import DetailsPage from './DetailsPage';
import { mapGetters } from 'vuex';

export default {
    name       : 'Company',
    components : { DetailsPage },

    data () {
        return {
            viewType        : 'card',
            productSearch   : '',
            loading         : false,
            addLoading      : false,
            productLoading  : false,
            productViewType : 'card',

            details  : { data : [], last_page : 1, total : 0 },
            page     : 1,
            per_page : 9,
            prev     : false,
            next     : false,
            id       : '',

            jumpToPageInput : null,

            selectedCompanyId : null,
            products          : [],
            selectedProduct   : null,

            search            : '',
            vendor_category   : '',
            services_provided : '',
            industry          : '',
            country           : '',
            state             : '',
            district          : '',
            product           : '',
            productName       : '',
            productObject     : null,

            stateOptions    : [],
            districtOptions : [],

            vendorCategoryOptions       : urls.Admin.Company.vendorCategoryOptions,
            industryOptions             : urls.Admin.Company.industryOptions,
            productOptions              : urls.Consumer.Company.productCatalogueVueSelect,
            servicesOptions             : urls.Admin.Company.servicesOptions,
            countryOptions              : urls.Admin.MasterData.State.countryOptions,
            productCatalogueDownloadUrl : urls.Consumer.Company.productCatalogueDownload,

            listUrl : urls.Consumer.MyContact.companyList
        };
    },

    computed : {
        filteredProducts () {
            if (!this.productSearch || !this.productSearch.trim()) {
                return this.products;
            }
            const q = this.productSearch.toLowerCase().trim();
            return this.products.filter(p => {
                const name = (p.name || '').toString().toLowerCase().trim();
                const brand = (p.brand || '').toString().toLowerCase().trim();
                const description = (p.description || '').toString().toLowerCase().trim();
                const location = (p.location || '').toString().toLowerCase().trim();
                const unit = (p.unit || '').toString().toLowerCase().trim();
                const grade = (p.grade || '').toString().toLowerCase().trim();
                const specification = (p.specification || '').toString().toLowerCase().trim();
                return (
                    name.includes(q) ||
                    brand.includes(q) ||
                    description.includes(q) ||
                    location.includes(q) ||
                    unit.includes(q) ||
                    grade.includes(q) ||
                    specification.includes(q)
                );
            });
        },
        visiblePages () {
            const totalPages = this.details.last_page || 1;
            const current = this.page;
            const pages = [];
            let start = Math.max(1, current - 2);
            let end = Math.min(totalPages, current + 2);
            if (current <= 3) { end = Math.min(5, totalPages); }
            if (current >= totalPages - 2) { start = Math.max(1, totalPages - 4); }
            for (let i = start; i <= end; i++) { pages.push(i); }
            return pages;
        },
        ...mapGetters(['currentUser']),
        canProductCatalogue () {
            const flag = this.currentUser?.packages?.product_catelogue;
            return flag === true || flag === 'true';
        }
    },

    mounted () {
        this.loadData();
    },

    methods : {
        setView (type) {
            this.viewType = type;
        },

        // ✅ NEW: switch product view and clear search
        switchProductView (type) {
            this.productViewType = type;
            this.productSearch = '';
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
                    this.$notify('Unable to add vendor', '', { type : 'danger' });
                } else {
                    this.$notify('Vendor added to Preferred Vendors', '', { type : 'success' });
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
                        district          : this.district,
                        product           : this.productName
                    }
                })
                .then((res) => {
                    this.details = res.data;
                    this.prev = this.page > 1;
                    this.next = this.page < this.details.last_page;
                    this.loading = false;
                });
        },

        loadProducts () {
            if (!this.selectedCompanyId) return;
            this.productLoading = true;
            axios
                .get(urls.Consumer.Company.vendorCatalogueList, {
                    params : {
                        vendor_id : this.selectedCompanyId,
                        per_page  : 1000
                    }
                })
                .then((res) => {
                    if (res.data && res.data.status === true) {
                        this.products = res.data.data || [];
                    } else if (res.data && Array.isArray(res.data.data)) {
                        this.products = res.data.data;
                    } else if (res.data && Array.isArray(res.data)) {
                        this.products = res.data;
                    }
                    this.productLoading = false;
                })
                .catch((err) => {
                    console.error('Error loading products:', err);
                    this.$notify('Failed to load products', '', { type : 'danger' });
                    this.productLoading = false;
                });
        },

        prevClicked () {
            if (this.page > 1) { this.page--; this.loadData(); }
        },
        nextClicked () {
            if (this.page < this.details.last_page) { this.page++; this.loadData(); }
        },
        goToFirstPage () {
            if (this.page !== 1) { this.page = 1; this.loadData(); }
        },
        goToLastPage () {
            if (this.page !== this.details.last_page) { this.page = this.details.last_page; this.loadData(); }
        },
        goToPage (pageNum) {
            if (pageNum !== this.page && pageNum >= 1 && pageNum <= this.details.last_page) {
                this.page = pageNum;
                this.loadData();
            }
        },
        jumpToPage () {
            const pageNum = parseInt(this.jumpToPageInput);
            if (pageNum && pageNum >= 1 && pageNum <= this.details.last_page) {
                this.page = pageNum;
                this.loadData();
                this.jumpToPageInput = null;
            } else {
                this.$notify('Invalid page number', '', { type : 'warning' });
            }
        },

        clearFilter () {
            this.search = '';
            this.vendor_category = '';
            this.services_provided = '';
            this.industry = '';
            this.country = '';
            this.state = '';
            this.district = '';
            this.product = '';
            this.productName = '';
            this.productObject = null;
            this.page = 1;
            this.loadData();
        },

        viewDetails (row) {
            this.id = row.id;
            this.$refs.showDetailsPage.show();
        },

        viewProductCatalog (row) {
            this.selectedCompanyId = row.id;
            this.productViewType = 'card';
            this.productSearch = ''; // ✅ clear search on open
            this.products = []; // ✅ clear old products immediately
            this.$refs.productCatalogModal.show();
            this.$nextTick(() => { this.loadProducts(); });
        },

        viewProductDetails (product) {
            this.selectedProduct = product;
            this.$refs.productDetailsModal.show();
        },

        loadStateOptions1 (item) {
            this.state = '';
            this.district = '';
            this.stateOptions = [];
            this.districtOptions = [];
            if (!item) return;
            axios.form(urls.Admin.Company.stateOptions, { country : item })
                .then((response) => { this.stateOptions = response.data.data || []; });
        },

        loadDistrictOptions1 (item) {
            this.district = '';
            this.districtOptions = [];
            if (!item) return;
            axios.form(urls.Admin.Company.districtOption, { state : item })
                .then((response) => { this.districtOptions = response.data.data || []; });
        },

        downloadProductCatalogue () {
            if (!this.selectedCompanyId) {
                this.$notify('Company ID not available', 'Error', { type : 'error' });
                return;
            }
            const formData = new FormData();
            formData.append('id', this.selectedCompanyId);
            axios.post(this.productCatalogueDownloadUrl, formData)
                .then((res) => {
                    const data = res.data;
                    if (!data.success) {
                        this.$notify(data.message || 'No Product Available', 'Warning', { type : 'warning' });
                        return;
                    }
                    if (data.pdf_url) {
                        const fileUrl = data.pdf_url.startsWith('http')
                            ? data.pdf_url
                            : `${window.location.origin}${data.pdf_url}`;
                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.setAttribute('download', 'product_catalogue.pdf');
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        this.$notify('Product catalogue downloaded successfully', 'Success', { type : 'success' });
                    } else {
                        this.$notify('File URL not found', 'Error', { type : 'error' });
                    }
                })
                .catch(() => {
                    this.$notify('Failed to download catalogue', 'Error', { type : 'error' });
                });
        },

        onOptionSelected (option) {
            if (option) {
                this.productName = option.label || option.text || option.name || '';
                this.productObject = option;
            } else {
                this.productObject = null;
                this.productName = '';
            }
        }
    },

    watch : {
        product (newVal) {
            console.log('Product value:', newVal);
        }
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
.product-img {
  max-height: 120px;
  max-width: 100%;
  object-fit: contain;
}
.product-detail-img {
  max-height: 300px;
  max-width: 100%;
  object-fit: contain;
}
.img-placeholder {
  height: 120px;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}
.img-placeholder-large {
  height: 200px;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}
.price {
  color: #28a745;
  font-weight: bold;
  font-size: 1.2rem;
}
.pagination-container {
  margin-top: 20px;
  padding: 15px 0;
  border-top: 1px solid #dee2e6;
}
.page-numbers {
  min-width: 200px;
  justify-content: center;
}
.product-info {
  font-size: 0.875rem;
  color: #6c757d;
}
.d-flex {
  display: flex;
  justify-items: center;
  align-items: center;
  width: 40%;
  margin: auto;
}
.btn-group-tight {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}
:deep(.lv) {
  font-family: Montserrat, sans-serif !important;
  font-size: 13px !important;
  padding: 9px 14px !important;
}
</style>
