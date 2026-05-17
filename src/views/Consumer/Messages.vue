<template>
  <div>
    <check-permission />

    <!-- FEATURED NOTIFICATION (GROUPED VIEW) -->
    <div v-if="isFeaturedNotification" class="card bs-5">

      <!-- HEADER : LEFT TITLE | RIGHT ENTRY COUNT -->
      <div class="card-header" style="display: flex; justify-content: space-between;">
        <h3 class="card-title mb-0">Message</h3>

        <div v-if="!loading" class="text-muted small">
          {{ startEntry }}-{{ endEntry }} of {{ totalRecords }}
        </div>
      </div>

      <div class="card-body">
        <div v-if="loading" class="text-center p-4">Loading...</div>

        <div v-else-if="groupedMessages.length === 0" class="text-center p-4">
          No messages found
        </div>

        <!-- GROUPED TABLE -->
        <div v-else>
          <div
            v-for="(group, index) in groupedMessages"
            :key="index"
            class="message-group mb-4"
          >
            <div class="project-header">
              {{ group.projectName || 'Ungrouped' }}
            </div>

            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style="width: 60%;">Message</th>
                    <th style="width: 30%;">Date</th>
                    <th class="text-end" style="width: 10%;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in group.messages" :key="row.id">
                    <td style="width: 60%;">{{ row.message }}</td>
                    <td style="width: 30%;">{{ row.created_on }}</td>
                    <td class="text-end" style="width: 10%;">
                      <slot name="actions" :rowData="row" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- PAGINATION (ONLY) -->
        <div
          v-if="!loading && totalPages > 1"
          class="d-flex justify-content-start align-items-center mt-3"
        >
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" @click.prevent="changePage(currentPage - 1)">‹</a>
            </li>

            <li
              v-for="page in displayedPages"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>

            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <a class="page-link" @click.prevent="changePage(currentPage + 1)">›</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- NORMAL vue-table-card (UNCHANGED) -->
    <vue-table-card
      v-else
      :show-search-box="false"
      title="Message"
      class="card bs-5"
      :url="listUrl"
      :fields="fields"
      :per-page="10"
      ref="table"
    />
  </div>
</template>

<script>
import urls from '@/data/urls';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    name : 'Messages',

    data () {
        return {
            listUrl : urls.Consumer.Message.list,

            fields : [
                { name : 'message', sortField : 'message', title : 'Message' },
                { name : 'created_on', sortField : 'created_on', title : 'Date' },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'text-end',
                    dataClass  : 'text-end'
                }
            ],

            groupedMessages : [],
            loading         : false,
            currentPage     : 1,
            perPage         : 10,
            totalRecords    : 0,
            totalPages      : 0
        };
    },

    computed : {
        ...mapGetters(['currentUser']),

        isFeaturedNotification () {
            return this.currentUser?.packages?.featured_notifications === 'true';
        },

        displayedPages () {
            const pages = [];
            const max = 5;
            let start = Math.max(1, this.currentPage - 2);
            const end = Math.min(this.totalPages, start + max - 1);

            if (end - start < max - 1) {
                start = Math.max(1, end - max + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
            return pages;
        },

        startEntry () {
            return this.totalRecords === 0
                ? 0
                : (this.currentPage - 1) * this.perPage + 1;
        },

        endEntry () {
            return Math.min(this.currentPage * this.perPage, this.totalRecords);
        }
    },

    mounted () {
        if (this.isFeaturedNotification) {
            this.fetchAndGroupMessages();
        }
    },

    methods : {
        async fetchAndGroupMessages () {
            this.loading = true;

            try {
                // ✅ USE SAME API AS DASHBOARD
                const response = await axios.get(urls.Consumer.Message.list, {
                    params : { page : this.currentPage }
                });
                // const response = await axios.get(urls.Consumer.Message.list, { params: { page: this.currentPage }

                const notifications = response.data.data || [];

                // Dashboard pole project_name illathathu skip cheyyam
                const grouped = {};

                notifications.forEach(n => {
                    if (!n.project_name) return; // ❗ same as dashboard

                    const key = n.project_name.trim();

                    if (!grouped[key]) {
                        grouped[key] = [];
                    }

                    grouped[key].push(n);
                });

                this.groupedMessages = Object.keys(grouped).map(p => ({
                    projectName : p,
                    messages    : grouped[p]
                }));

                // this.totalRecords = this.groupedMessages.length;
                // this.totalPages = 1;
                this.totalRecords = response.data.total;
                this.totalPages = response.data.last_page;
                this.currentPage = response.data.current_page;
                this.perPage = response.data.per_page;
            } catch (e) {
                console.error('Notification fetch failed', e);
            } finally {
                this.loading = false;
            }
        },

        changePage (page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.fetchAndGroupMessages();
            }
        }
    }
};
</script>

<style scoped>
.message-group {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.project-header {
  background: #f8f9fa;
  padding: 10px 15px;
  font-weight: 600;
  border-left: 4px solid #274365;
  margin-bottom: 8px;
}

.page-link {
  cursor: pointer;
}
</style>
