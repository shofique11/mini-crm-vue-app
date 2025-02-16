<template>
    <div class="d-flex vh-100 bg-light">
        <SideBar />
        <div class="flex-grow-1 d-flex flex-column">
            <NavberMenu />
            <div class="container mt-4">
                <h1>Lead list</h1>
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
            leads: 0,
        }
    },
    components: {
        SideBar,
        NavberMenu
    },
    async mounted() {
    await this.fetchLeads();
  },
  methods: {
    async fetchLeads() {
      try {
        const response = await api.get('/leads', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.leads = response.data;
        console.log(this.leads);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
    
}
</script>
<style></style>