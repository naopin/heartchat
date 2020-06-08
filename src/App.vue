<template>
  <div id="app">
    <header class="header">
      <h1>Heart</h1>
      <!-- ログイン時にはフォームとログアウトボタンを表示 -->

      <div class="username" v-if="user.uid" key="login">
        [{{ user.displayName }}]
        <button class="outbutton" type="button" @click="doLogout">SignOut</button>
      </div>
      
      <!-- 未ログイン時にはログインボタンを表示 -->
      <div v-else key="logout">
        <button class="inbutton" type="button" @click="doLogin">SignIn</button>
      </div>
    </header>

    <!--Firebase から取得したリストを描画（トランジション付き-->
    <transition-group name="chat" tag="div" class="list content">
      <section v-for="{ key, name, image, message } in chat" :key="key" class="item">
        <div class="item-image"><img :src="image" width="40" height="40"></div>
        <div class="item-detail">
          <div class="item-name">{{ name }}</div>
          <div class="item-message">
            <nl2br tag="div" :text="message"/>
          </div>
        </div>
      </section>
    </transition-group>
  
    <!-- 入力フォーム -->
    <form action="" @submit.prevent="doSend" class="form">
      <textarea
        v-model="input"
        :disabled="!user.uid"
        @keydown.enter.exact.prevent="doSend"></textarea>
      <button type="submit" :disabled="!user.uid" class="send-button">SEND</button>
    </form>
  </div>
</template>

<script>
// firebase モジュール
import firebase from 'firebase'
// 改行を <br> タグに変換するモジュール
import Nl2br from 'vue-nl2br'
export default {
  components: { Nl2br },
  data() {
    return {
      user: {},  // ユーザー情報
      chat: [],  // 取得したメッセージを入れる配列
      input: ''  // 入力したメッセージ
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      const ref_message = firebase.database().ref('message')
      if (user) {
        this.chat = []
        // message に変更があったときのハンドラを登録
        ref_message.limitToLast(10).on('child_added', this.childAdded)
      } else {
        // message に変更があったときのハンドラを解除
        ref_message.limitToLast(10).off('child_added', this.childAdded)
      }
    })
  },
  methods: {
    // ログイン処理
    doLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut()
    },
    // スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(snap) {
      const message = snap.val()
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
      })
      this.scrollBottom()
    },
    doSend() {
      if (this.user.uid && this.input.length) {
        // firebase にメッセージを追加
        firebase.database().ref('message').push({
          message: this.input,
          name: this.user.displayName,
          image: this.user.photoURL
        }, () => {
          this.input = '' // フォームを空にする
        })
      }
    }
  }
}
</script>

<style>

* {
  margin: 0;
  box-sizing: border-box;
}
.header {
  background: linear-gradient(to right, rgb(253, 192, 106) 10%, rgb(248, 129, 96) 35%, #6a82fc 85%);
  margin-bottom: 3em;
  padding: 0.8em 1em;
  color: #fff;
  text-align: center;
  font-family: 'Javanese Text','Zapfino','Zapfino',sans-serif;
}
.content {
  margin: 0 auto;
  padding: 0 10px;
  max-width: 600px;
}
.form {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 80px;
  width: 100%;
  background:rgb(216, 218, 216);
}
.form textarea {
  border: 1px solid #ccc;
  border-radius: 2px;
  height: 3em;
  width: calc(100% - 20em);
  resize: none;
}

.inbutton {
   padding: .1em 1em ;
  font-size: 1.2em;
  font-family: 'Javanese Text','Zapfino','Zapfino',sans-serif;
  font-style: bold;
}

.outbutton {
  padding: .1em 1em ;
  font-size: 1.2em;
  font-family: 'Javanese Text','Zapfino','Zapfino',sans-serif;
  font-style: bold;
}
.list {
  margin-bottom: 100px;
}
.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
}
.item-image img {
  border-radius: 20px;
  vertical-align: top;
}
.item-detail {
  margin: 0 0 0 1.4em;
}
.item-name {
  font-size: 75%;
}
.item-message {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #fcce99;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-message::before {
  position: absolute;
  content: " ";
  display: block;
  left: -16px;
  bottom: 12px;
  border: 4px solid transparent;
  border-right: 12px solid #fcce99;
}
.send-button {
  height: 3em;
  margin-left: 1rem;
  padding: 0 2rem;
}
/* トランジション用スタイル */
.chat-enter-active {
  transition: all 1.5s;
}
.chat-enter {
  opacity: 0;
  transform: translateY(-1em);
}

</style>