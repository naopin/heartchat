import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
Vue.config.productionTip = false

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCZLg0gUfLzdS51Sr24Wx4WnHxU7nCdxcc",
    authDomain: "chat-app-a19a9.firebaseapp.com",
    databaseURL: "https://chat-app-a19a9.firebaseio.com",
    projectId: "chat-app-a19a9",
    storageBucket: "chat-app-a19a9.appspot.com",
    messagingSenderId: "521990960235",
    appId: "1:521990960235:web:bb9c51ad18025186d9ed2e",
    measurementId: "G-CCQ8BYCW15"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

new Vue({
  render: h => h(App),
}).$mount('#app')
