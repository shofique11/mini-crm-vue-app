<template>
  
  <div class="login-container">
    <div class="login-box">
      <div><img alt="Vue logo" src="../assets/logo.png" width="250px"></div>
      <h3>Login</h3>
      <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
      <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      <form @submit.prevent="loginFrom" v-if="loginForm">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
        </div>
        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Login</span>
        </button>
        <p>If you have doon't account, counselor <router-link to="/register" class="nav-link  bg-opacity-10 rounded py-2 px-3 regist-link">Register here</router-link></p>
      </form>
        <div v-if="requiresTwoFactor">
        <input class="tfCode" v-model="two_factor_code" placeholder="Verification Code" />
        <button @click="verifyTwoFactor">Verify</button>
      </div>
    </div>
  </div>
</template>

<script>
//import axios from 'axios';
import api from './axios';
export default {
  data() {
    return {
      loginForm: true,
      email: '',
      password: '',
      isLoading: false,
      requiresTwoFactor: false,
      two_factor_code: '',
      errors: {},
      errorMessage: "",
      message:"",
    };
  },
  methods: {
    async loginFrom() {
      this.isLoading = true;
      try {
        const response = await api.post('/login', {
          email: this.email,
          password: this.password
        });
        this.isLoading = false; // Hide loading state
        if (response.data.requiresTwoFactor) {
          this.requiresTwoFactor = true;
          this.loginForm = false;
          this.message = response.data.message;
        } else {
        localStorage.setItem('token', response.data.token); // Store token
        localStorage.setItem('user-info', JSON.stringify(response.data));
        if (response.data.user.role === 'admin') {
            this.$router.push('/admin-dashboard'); // Redirect Admin
        } else if (response.data.user.role === 'counselor') {
            this.$router.push('/counselor-dashboard'); // Redirect Counselor
        } else {
            this.$router.push('/dashboard'); // Default Dashboard
        }
      }
      } catch (error) {
        this.isLoading = false; // Hide loading state on error
        this.errorMessage = error.response?.data?.message || 'Invalid Email or Password!';
      }
    },
    async verifyTwoFactor() {
      try {
        const response = await api.post('/verify-2fa', {
          email: this.email,
          two_factor_code: String(this.two_factor_code),
        });
        console.log('Login successful:', response.data);
        console.log("User Data:", response.data.user);
        console.log("User Role:", response.data.user?.role);

        // Store user data and token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          name: response.data.user.name,
          role: response.data.user.role,
        }));
         // Normalize role to lowercase
        const userRole = response.data.user?.role?.toLowerCase();
        if (userRole === 'admin') {
            this.$router.push('/admin-dashboard'); // Redirect Admin
        } else if (userRole === 'counselor') {
            this.$router.push('/counselor-dashboard'); // Redirect Counselor
        } else {
            this.$router.push('/dashboard'); // Default Dashboard
        }
      } catch (error) {
        console.error('2FA Verification failed', error.response?.data || error);
        this.errorMessage = error.response?.data?.message || '2FA verification failed. Try again.';
      }
    },
  }
};
</script>

<style scoped>
/* Container styling */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea, #243b79);
}

/* Login box */
.login-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
}

/* Title */
h2 {
  margin-bottom: 20px;
  color: #333;
}

/* Input group */
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.input-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

/* Button */
button {
  width: 100%;
  padding: 10px;
  background: #243b79;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #5a67d8;
}
p{
    font-size: 14px;
    margin-top: 10px;
    line-height: 14px;
}
.regist-link{
  color: #243b79;
}
.regist-link:hover{
  text-decoration: underline;
}
.tfCode{
  margin-bottom: 15px;
}
.alert-success{
  font-size: 14px;
}
</style>
