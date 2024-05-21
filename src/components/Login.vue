<template>
    <div>
        <slot name="logo">
      <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
      ></v-img>
        </slot>
  
        <v-form @submit.prevent="login" ref="form">
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
  
           <v-text-field
          v-model="email"
          density="compact"
          :placeholder="Emailplease"
          :rules="[v => !!v || 'Item is required']"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
  
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
            style="pointer-events: none;"
          >
            Forgot login password?</a>
        </div>
  
        <v-text-field
                v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          :placeholder="passwordPlaceholder"
          :rules="[v => !!v || 'Item is required']"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>
  
        <slot name="notice">
        <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
          </v-card-text>
        </v-card>
        </slot>
  
        <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          type="submit"
        >
          Log In
        </v-btn>

        <h5 class="text-center grey--text mt-4 mb-3">Or Sign up using</h5>
                          <div class="d-flex justify-space-between align-center mx-10 mb-11">
                            <v-btn depressed outlined color="grey" @click="signInWithGoogle">
                              <v-icon color="red">fab fa-google</v-icon>
                            </v-btn>
                        </div>
                        <v-card-text class="text-center">
                          <a class="text-blue text-decoration-none" href="#" @click.prevent="navigateToRegister">
                            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
                          </a>
                        </v-card-text>
      </v-card>
        </v-form>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
  
  const email = ref("");
  const password = ref("");
  const visible = ref(false);
  const router = useRouter();
  const auth = getAuth();
  const isLoggedIn = ref(false);
  
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        router.push("/feed");
      })
      .catch((error) => {
        console.error('Google sign-in error', error);
        alert('Failed to sign in with Google. Please try again.');
      });
  };
  
  const login = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        console.log("Successfully signed In", userCredential);
        if (auth.currentUser.emailVerified) {
          router.push('/feed'); // Redirect user after login to the feed page
        } else {
          alert("Please verify your email before accessing this page");
          router.push('/verify-email');
        }
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      });
  };
  
  const navigateToRegister = () => {
    router.push('/register2');
  };
  
  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      isLoggedIn.value = !!user;
    });
  });
  </script>