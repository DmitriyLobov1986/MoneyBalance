<template>
  <v-dialog persistent max-width="600px" v-model="dialog">
    <v-card ref="card" :height="card.height">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Авторизация</v-toolbar-title>
      </v-toolbar>
      <v-progress-linear
        :active="userLoading"
        height="10"
        indeterminate
        color="cyan"
      ></v-progress-linear>
      <v-card-text class="mt-5">
        <v-form v-model="valid">
          <v-container fluid>
            <v-row>
              <v-col cols="8">
                <v-autocomplete
                  v-model="user"
                  :rules="userRulles"
                  :items="users"
                  dense
                  label="Пользователь"
                  clearable
                  @change="clearCode"
                ></v-autocomplete>
              </v-col>
              <v-col cols="4" align-self="center">
                <v-btn
                  @click="getData"
                  ref="codeButton"
                  :disabled="authDisabled"
                  outlined
                  rounded
                  small
                  color="indigo"
                >
                  {{ users.length > 0 ? 'Получить код' : 'Пользователи' }}
                </v-btn>
              </v-col>

              <v-col cols="8">
                <v-text-field
                  @keypress.enter="login"
                  v-model="code"
                  :rules="codeRules"
                  type="password"
                  label="Код"
                  counter
                  maxlength="4"
                  clearablzze
                ></v-text-field>
              </v-col>
              <v-col cols="4" align-self="center">
                <v-btn
                  :disabled="!valid"
                  rounded
                  small
                  outlined
                  color="indigo"
                  @click="login"
                >
                  Авторизоваться
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <transition @beforeEnter="beforeEnter" @enter="enter" @leave="leave">
        <Alert name="add" :type="alertType" v-if="alert">{{ alert }}</Alert>
      </transition>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
//Vue
import { Component, Vue } from 'vue-property-decorator'

//Types
import { IloginomVarr, LoginomAuth } from '@/Types/loginomTypes'

//Md5
import md5 from 'js-md5'

//Components
import Alert from '@/components/Alert.vue'

//GSAP
import { gsap } from 'gsap'

@Component({
  name: 'Login',
  components: {
    Alert,
  },
})
export default class Login extends Vue {
  //Анимация allert
  beforeEnter(el: HTMLElement): void {
    el.style.opacity = '0'
  }

  enter(el: HTMLElement): void {
    const timeline = gsap.timeline()

    timeline
      .to(this.card, {
        height: 326,
        duration: 0.6,
        ease: 'slow(0.7, 0.7, false)',
      })
      .to(el, {
        duration: 2,
        opacity: 1,
        x: 0,
        ease: 'circ.out',
      })
  }

  leave(): void {
    const timeline = gsap.timeline()

    timeline.to(this.card, {
      height: 270,
      duration: 0.6,
      ease: 'slow(0.7, 0.7, false)',
    })
  }

  //Переменные
  url =
    'http://main-ts02.ukritter.local/lgi/Service.svc/Rest/Авторизация/Vue_auth'

  dialog = true
  card = {
    height: 270,
  }

  codeBtnAct = true
  hash = ''
  code = null

  alert = ''
  userLoading = false
  alertType = ''

  valid = false

  user = null
  users: string[] = []

  userRulles = [
    (v: string): boolean | string => !!v || 'Требуется пользователь',
  ]
  codeRules = [(v: string): boolean | string => this.validateCode(v)]

  //Computed
  get authDisabled(): boolean {
    return !this.codeBtnAct || (!this.user && this.users.length > 0)
  }

  //Методы
  async getData(): Promise<void> {
    this.alert = ''
    this.codeBtnAct = false
    this.userLoading = true

    //axios
    const params =
      this.users.length === 0
        ? {}
        : {
            user: this.user,
          }
    try {
      const resp = await this.$http.get<IloginomVarr<LoginomAuth>>(this.url, {
        params,
      })

      const data = resp.data.Variables

      if (data.resolved && this.users.length === 0) {
        this.users = JSON.parse(data.answer)
        this.showAlert('Пользователи загружены!!!!', 'success')
      } else if (data.resolved) {
        this.hash = data.answer
        this.showAlert('Код получен!!!!!', 'success')
      } else {
        this.showAlert(data.answer, 'error')
      }
    } catch (error) {
      this.showAlert(error as string, 'error')
    }

    this.codeBtnAct = true
    this.userLoading = false
  }

  validateCode(code: string | null): string | boolean {
    if (!code) {
      return 'Требуется код'
    }

    if (md5(code) !== this.hash.toLowerCase()) {
      return 'Неверный код'
    }

    return true
  }

  clearCode(): void {
    this.code = null
    this.hash = ''
  }

  showAlert(mes: string, type: string): void {
    this.alert = mes
    this.alertType = type
  }

  login(): void {
    if (!this.valid) return
    this.$sessionStorage.set('login', true)
    this.dialog = false
    this.$router.push({ name: 'Home' })
  }
}
</script>

<style scoped>
/* @import '../../node_modules/animate.css/animate.compat.css'; */

::v-deep .v-dialog {
  overflow: hidden;
}
</style>
