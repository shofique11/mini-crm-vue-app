<template>
  
  <div class="login-container">
    <div class="login-box">
      <div><img alt="Vue logo" src="../assets/logo.png" width="250px"></div>
      <h2>Login</h2>
      <form @submit.prevent="loginFrom">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
        </div>
        <button type="submit">Login</button>
        <p>If you have doon't account, counselor <router-link to="/register" class="nav-link  bg-opacity-10 rounded py-2 px-3">Register here</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async loginFrom() {
      console.log("Email:", this.email);
      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          email: this.email,
          password: this.password
        });
      
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.access_token); // Store token
        localStorage.setItem('user-info', JSON.stringify(response.data));

        this.$router.push('/dashboard'); // Redirect after login
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Login failed!';
      }
    }
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
</style>
