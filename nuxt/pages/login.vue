<script setup lang="ts">
import { Eye, EyeOff, CircleAlert } from 'lucide-vue-next'

const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const logoFailed = ref(false)

async function onSubmit() {
  errorMessage.value = ''

  if (!username.value.trim() || !password.value) {
    errorMessage.value = 'Please enter your username and password.'
    return
  }

  loading.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    await navigateTo('/')
  } catch (e: any) {
    const status = e?.response?.status
    if (status === 401) {
      errorMessage.value = 'Incorrect username or password. Please try again.'
    } else if (!status) {
      errorMessage.value =
        'Cannot reach the server. Check your connection and try again.'
    } else {
      errorMessage.value = 'Something went wrong. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login">
    <div class="login__brand">
      <span v-if="logoFailed" class="login__wordmark">SUSI AIR</span>
      <img
        v-else
        src="/susiair-logo.png"
        alt="Susi Air"
        @error="logoFailed = true"
      />
      <p class="login__subtitle">Pilot App</p>
    </div>

    <form class="login__card" novalidate @submit.prevent="onSubmit">
      <h1 class="login__title">Sign in</h1>
      <p class="login__hint">Use your pilot account to continue.</p>

      <div v-if="errorMessage" class="login__error" role="alert">
        <CircleAlert :size="18" />
        <span>{{ errorMessage }}</span>
      </div>

      <label class="field">
        <span class="field__label">Username</span>
        <input
          v-model="username"
          type="text"
          autocomplete="username"
          autocapitalize="none"
          placeholder="Enter your username"
        />
      </label>

      <label class="field">
        <span class="field__label">Password</span>
        <div class="field__password">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Enter your password"
          />
          <button
            type="button"
            class="field__toggle"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" :size="18" />
            <Eye v-else :size="18" />
          </button>
        </div>
      </label>

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </main>
</template>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;

  &__brand {
    text-align: center;
    margin-bottom: 28px;

    img {
      max-width: 220px;
      height: auto;
    }
  }

  &__wordmark {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    color: var(--navy);
  }

  &__subtitle {
    margin: 8px 0 0;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  &__card {
    background: var(--surface);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    padding: 24px;
  }

  &__title {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 800;
  }

  &__hint {
    margin: 4px 0 20px;
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 16px;
    padding: 12px;
    border-radius: 12px;
    background: rgba(230, 55, 87, 0.08);
    color: var(--danger);
    font-size: 0.875rem;
    font-weight: 500;

    svg {
      flex-shrink: 0;
      margin-top: 1px;
    }
  }
}

.field {
  display: block;
  margin-bottom: 16px;

  &__label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #e3e6ec;
    border-radius: 12px;
    background: var(--surface);
    color: var(--text);
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(34, 197, 232, 0.2);
    }
  }

  &__password {
    position: relative;

    input {
      padding-right: 44px;
    }
  }

  &__toggle {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    display: flex;
    padding: 6px;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
  }
}

.btn-primary {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  border: 0;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.15s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>