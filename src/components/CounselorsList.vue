<template>
    <div class="d-flex vh-100 bg-light">
      <SideBar />
      <div class="flex-grow-1 d-flex flex-column">
        <NavberMenu />
        <div class="container mt-4">
          <h4 class="mb-3">Counselor List</h4>
          <table class="table table-striped table-bordered">
            <thead class="thead-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(counselor, index) in counselors?.data?.userlist" :key="counselor.id" :value="counselor.id">
                <td>{{ index + 1 }}</td>
                <td>{{ counselor.name }}</td>
                <td>{{ counselor.email }}</td>
                <td>{{ counselor.role }}</td>
                <td><span :class="statusClass(counselor.status)">
                  {{ counselor.status }}
                </span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  <script>
  import api from './axios';
  import SideBar from './SideBar.vue';
  import NavberMenu from './NavberMenu.vue';
  export default {
    data() {
      return {
        counselors: { data: { userlist: [] } },
      }
    },
    components: {
      SideBar,
      NavberMenu
    },
    async mounted() {
      await this.fetchCounselor();
    },
    methods: {
        async fetchCounselor() {
        try {
            const response = await api.get('/counselor-list', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            this.counselors = response.data;
            console.log(this.counselors);
            
        } catch (error) {
            console.error('Error fetching counselors:', error);
        }
      },
      statusClass(status) {
        return {
          'badge bg-primary': status === 'active',
          'badge bg-secondary': status === 'inactive',
        };
      },
      changeStatus(application) {
        // Handle lead editing logic
        console.log('Editing application:', application);
      }
    }
  
  }
  </script>
  <style></style>