<template>
    <div class="d-flex vh-100 bg-light">
        <SideBar />
        <div class="flex-grow-1 d-flex flex-column">
            <NavberMenu />
            <div class="container mt-4">
                <h1>Application List</h1>
            </div>
        </div>
    </div>
</template>
<script>
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
    }
}
</script>
<style></style>