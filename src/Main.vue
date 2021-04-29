<template>
  <div>
    <div v-if="typeElement == 'widget'">
      <div style="width:335px">
        <div
          v-show="showFabWindow"
          class="sc-chat-window"
          style="margin-bottom: 80px; box-shadow: 0px 0px 27px 1.5px rgba(0,0,0,0.2);"
          :class="{ opened: showFabWindow, closed: !showFabWindow }"
        >
          <div style="padding: 0">
            <div
              v-if="!dialogIsNull"
              class="elevation-0"
              no-body
              ref="chatWindow"
            >
              <div id="messageListContainer" class="container__message-list">
                <div class="nav__toolbar">
                  <b>{{ dialogName ? dialogName : "Без имени" }}</b>
                  <button @click="onClose()" class="button">
                    Завершить беседу
                    <done-icon></done-icon>
                  </button>
                  <!--                  <b-button @click="onClose()" variant="warning" class="mb-2">-->
                  <!--                    Завершить беседу-->
                  <!--                    <done-icon></done-icon>-->
                  <!--                  </b-button>-->
                </div>
                <!--                <b-button v-if="dialogId!=null" id="btn__video-call" class="m-2" style="background-color: rgb(65, 73, 242)" @click="sendVideoCall()">-->
                <!--                  Предложить звонок-->
                <!--                  <open-in-new-icon/>-->
                <!--                </b-button>-->
                <div
                  ref="messageList"
                  id="listgroup-ex"
                  style="position:relative; overflow-y:auto;"
                  class="text-center"
                >
                  <!--                    <b-button @click="loadMore()" v-if="messageListTemplate!=''">-->
                  <!--                      Загрузить еще-->
                  <!--                    </b-button>-->
                  <div class="chat">
                    <div class="chat-container">
                      <div class="conversation">
                        <div class="conversation-container">
                          <div
                            v-for="(item, idx) in messageListTemplate"
                            :key="idx"
                          >
                            <div
                              v-if="item.by == 'input'"
                              class="message received"
                            >
                              <div v-if="item.data.text != ''">
                                {{ item.data.text }}
                              </div>
                              <div v-else-if="item.data.file != ''">
                                <div
                                  v-if="getFooFileType(item.data) != 'image'"
                                >
                                  <div class="">
                                    <a
                                      target="_blank"
                                      :href="getFooFile(item.data)"
                                      >Файл</a
                                    >
                                  </div>
                                </div>

                                <img
                                  class="message__image"
                                  alt="Image message"
                                  v-else
                                  :src="getFooFile(item.data)"
                                />
                              </div>
                              <div v-else-if="item.data.sendedFile != ''">
                                <img
                                  alt="Image message"
                                  class="message__image"
                                  :src="item.data.sendedFile"
                                />

                                <img
                                  class="message__image"
                                  alt="Image message"
                                  :src="item.data.file"
                                />
                              </div>
                              <div v-if="item.buttons != ''">
                                <b-button-group
                                  v-for="(key, idx) in item.buttons"
                                  :key="idx"
                                >
                                  <b-button @click="console.log(key.action)">{{
                                    key.text
                                  }}</b-button>
                                </b-button-group>
                              </div>

                              <span class="metadata">
                                <span class="time">{{
                                  getDate(item.data.date)
                                }}</span>
                                <!--                              <span class="tick"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg></span>-->
                              </span>
                            </div>

                            <div v-else class="message sent">
                              <div v-if="item.data.text != ''">
                                {{ item.data.text }}
                              </div>
                              <div v-else-if="item.data.file != ''">
                                <div
                                  v-if="getFooFileType(item.data) != 'image'"
                                >
                                  <div
                                    class="d-flex w-100 justify-content-between"
                                  >
                                    <a
                                      target="_blank"
                                      :href="getFooFile(item.data)"
                                      >Файл</a
                                    >
                                  </div>
                                </div>

                                <img
                                  alt="Image message"
                                  class="message__image"
                                  v-else
                                  :src="getFooFile(item.data)"
                                />
                              </div>
                              <div v-else-if="item.data.sendedFile != ''">
                                <img
                                  alt="Image message"
                                  class="message__image"
                                  :src="item.data.sendedFile"
                                />
                              </div>
                              <span class="metadata">
                                <span class="time">{{
                                  getDate(item.data.date)
                                }}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <b-row
                v-if="showActions == 'true'"
                no-gutters
                class="text-center pt-2 pb-2"
              >
                <b-col v-for="(key, idx) in buttonsList" :key="idx">
                  <button
                    @click="onSendCommand(key.action)"
                    class="button"
                    style="white-space: nowrap;white-space: nowrap; width: 160px;overflow: hidden;text-overflow: ellipsis;"
                  >
                    <small>{{ key.text }}</small>
                  </button>
                </b-col>
              </b-row>
              <div class="input__group">
                <input
                  style="display: none"
                  id="files"
                  type="file"
                  name="file"
                  ref="fileInput"
                  :multiple="false"
                  @change="detectFiles($event)"
                />
                <button
                  v-if="dataSend.file == null"
                  style="color: #4149F2"
                  @click="onPickFile('fileInput')"
                >
                  <paper-clip-icon />
                </button>
                <button v-else @click="onPickFile('fileInput')">
                  <paper-clip-icon />
                </button>

                <textarea
                  required
                  v-model="dataSend.text"
                  type="text"
                  placeholder="Сообщение"
                ></textarea>

                <button style="color: #4149F2" @click="onSend()">
                  <b>Отправить</b>
                </button>
              </div>
              <button
                v-if="dialogId != null"
                id="btn__video-call"
                @click="sendVideoCall()"
                class="button button__big"
              >
                Предложить звонок
                <open-in-new-icon />
              </button>
            </div>
            <div v-if="dialogIsNull" class="alert__success">
              <span>
                Беседа завершена
              </span>
              <done-icon></done-icon>
            </div>
          </div>
        </div>
      </div>
      <button
        v-if="!showFabWindow"
        id="fab"
        @click="showFabWindow = true"
        class="sc-launcher"
      >
        <!--          <i style="color: #4149F2" class="fa fa-comments fa-lg"></i>-->
        <span>{{ dialogName ? dialogName : "Без имени" }}</span>
        <message-icon />
      </button>
      <button
        v-else
        id="fab"
        @click="showFabWindow = false"
        class="sc-launcher"
      >
        <span>{{ dialogName ? dialogName : "Без имени" }}</span>
        <cancel-icon />
      </button>
    </div>

    <div ref="messageContainer" v-else>
      <div style="padding: 0;elevation: 0;">
        <div class="elevation-0" no-body>
          <div id="messageListContainer" class="container__message-list">
            <div class="nav__toolbar">
              <b>{{ dialogName ? dialogName : "Без имени" }}</b>
              <button @click="onClose()" class="button">
                Завершить беседу
                <done-icon></done-icon>
              </button>

              <!--              <b-button @click="onClose()" variant="warning" class="mb-2">-->
              <!--                Завершить беседу-->
              <!--              </b-button>-->
            </div>
            <div
              id="listgroup-ex"
              style="position:relative; overflow-y:auto;"
              class="text-center"
            >
              <!--                    <b-button @click="loadMore()" v-if="messageListTemplate!=''">-->
              <!--                      Загрузить еще-->
              <!--                    </b-button>-->
              <div class="chat">
                <div class="chat-container">
                  <div class="conversation">
                    <div class="conversation-container">
                      <div
                        v-for="(item, idx) in messageListTemplate"
                        :key="idx"
                      >
                        <div v-if="item.by == 'input'" class="message received">
                          <div v-if="item.data.text != ''">
                            {{ item.data.text }}
                          </div>
                          <div v-else-if="item.data.file != ''">
                            <div v-if="getFooFileType(item.data) != 'image'">
                              <div class="d-flex w-100 justify-content-between">
                                <a target="_blank" :href="getFooFile(item.data)"
                                  >Файл</a
                                >
                              </div>
                            </div>

                            <img
                              alt="Image message"
                              class="message__image"
                              v-else
                              :src="getFooFile(item.data)"
                            />
                          </div>
                          <div v-else-if="item.data.sendedFile != ''">
                            <img
                              alt="Image message"
                              class="message__image"
                              :src="item.data.sendedFile"
                            />

                            <img
                              fluid-grow
                              alt="Fluid-grow image"
                              :src="item.data.file"
                            />
                          </div>
                          <div v-if="item.buttons != ''">
                            <div
                              class="button__group"
                              v-for="(key, idx) in item.buttons"
                              :key="idx"
                            >
                              <button @click="console.log(key.action)">
                                {{ key.text }}
                              </button>
                            </div>
                          </div>

                          <span class="metadata">
                            <span class="time">{{
                              getDate(item.data.date)
                            }}</span>
                            <!--                              <span class="tick"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg></span>-->
                          </span>
                        </div>

                        <div v-else class="message sent">
                          <div v-if="item.data.text != ''">
                            {{ item.data.text }}
                          </div>
                          <div v-else-if="item.data.file != ''">
                            <div v-if="getFooFileType(item.data) != 'image'">
                              <div>
                                <a target="_blank" :href="getFooFile(item.data)"
                                  >Файл</a
                                >
                              </div>
                            </div>

                            <img
                              class="message__image"
                              alt="Image message"
                              v-else
                              :src="getFooFile(item.data)"
                            />
                          </div>
                          <div v-else-if="item.data.sendedFile != ''">
                            <img
                              alt="Image message"
                              :src="item.data.sendedFile"
                            />
                          </div>
                          <span class="metadata">
                            <span class="time">{{
                              getDate(item.data.date)
                            }}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <b-row
            v-show="showActions == 'true'"
            no-gutters
            class="text-center pt-2 pb-2"
          >
            <b-col v-for="(key, idx) in buttonsList" :key="idx">
              <button
                @click="onSendCommand(key.action)"
                class="button"
                style="white-space: nowrap;white-space: nowrap; width: 160px;overflow: hidden;text-overflow: ellipsis;"
              >
                <small>{{ key.text }}</small>
              </button>
            </b-col>
          </b-row>
        </div>
        <div class="input__group">
          <input
            style="display: none"
            id="files"
            type="file"
            name="file"
            ref="fileInput"
            :multiple="false"
            @change="detectFiles($event)"
          />
          <button
            v-if="dataSend.file == null"
            style="color: #4149F2"
            @click="onPickFile('fileInput')"
          >
            <paper-clip-icon />
          </button>
          <button v-else @click="onPickFile('fileInput')">
            <paper-clip-icon />
          </button>

          <textarea
            required
            v-model="dataSend.text"
            type="text"
            placeholder="Сообщение"
          ></textarea>

          <button style="color: #4149F2" @click="onSend()">
            <b>Отправить</b>
          </button>
        </div>
        <button
          v-if="dialogId != null"
          id="btn__video-call"
          @click="sendVideoCall()"
          class="button button__big"
        >
          Предложить звонок
          <open-in-new-icon />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import axios from "axios";
import Vue from "vue";
import MenuIcon from "vue-material-design-icons/Menu.vue";
import MessageIcon from "vue-material-design-icons/MessageText.vue";
import CancelIcon from "vue-material-design-icons/Close.vue";
import PaperClipIcon from "vue-material-design-icons/Paperclip.vue";
import DoneIcon from "vue-material-design-icons/Check.vue";
import OpenInNewIcon from "vue-material-design-icons/OpenInNew.vue";

export default {
  components: {
    MenuIcon,
    MessageIcon,
    CancelIcon,
    PaperClipIcon,
    DoneIcon,
    OpenInNewIcon,
  },
  data() {
    return {
      showActions: this.$root.$el.parentElement.dataset.show_actions | false,
      dialogIsNull: false,
      buttonsList: [],
      showFabWindow: false,
      windowStatus: "Служба поддержки",
      trueSearch: 0,
      first: 1,
      dialogToken: this.$root.$el.parentElement.dataset.dtoken, // "401cf075-225e-419a-9a4a-80db8bc1d32b",
      ch_dialogToken: null,
      dialogId: this.$root.$el.parentElement.dataset.dialog, //"5d38153f0e9ed01d7c830ca7"
      token: this.$root.$el.parentElement.dataset.token,
      channelId: this.$root.$el.parentElement.dataset.channel,
      typeElement: this.$root.$el.parentElement.dataset.type,
      urlOnError: this.$root.$el.parentElement.dataset.urlonerror,
      connection: null,
      participants: [],
      titleImageUrl:
        "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
      messageList: [],
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: "",
      colors: null,
      chosenColor: null,
      alwaysScrollToBottom: false,
      messageStyling: true,
      userIsTyping: false,
      urlOnErrorEvent: "https://ic.myams.biz/",
      newMessages: [],
      commands: [],
      dialogDelete: false,
      menuItems: [{ id: "del", title: "Закрыть диалог" }],
      chatLoading: true,
      loadingNewDialog: false,
      loading: false,
      fileFoo: [],
      fileAttached: false,
      file: null,
      ws: null,
      dialogName: null,
      array_ws: [],
      dialog: {
        show: false,
        title: null,
        text: null,
        type: null,
      },
      dList: {
        show: false,
        title: null,
      },
      dataSend: {
        text: null,
        fileType: null,
        file: null,
        file64: null,
      },
      newDialogCount: 0,
      dialogsList: [],
      newDialogList: [],
      messageListTemplate: [],
      newMessageList: [],
      posts: [],
      busy: true,
      selectedDialog: [],
      server_message_count: 0,
      server_partion_count: 0,
      local_partion_count: 0,
      server_message_array: [],
      root: null,
    };
  },

  created() {
    if (this.dialogId != null) {
      this.getDialogMessages();
      console.log("dialog");
    } else if (this.channelId != null) {
      this.getChannelMessages();
      console.log("channel");
    }

    global.root = this;
  },
  methods: {
    async sendVideoCall() {
      let uuid = await this.get_uuid();
      window.open(`https://test-app-ff08f.firebaseapp.com/${uuid}`, "_blank");
      this.onSendCommand(
        `*перейдите по ссылку чтобы присоединиться к видеозвонку: https://test-app-ff08f.firebaseapp.com/${uuid}`
      );
    },
    get_uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    loadMore() {
      var array = [];
      const res = this.messageList.filter(
        (snap) => snap.id == this.local_partion_count
      );
      // console.log(res)

      for (let key in res) {
        array.push(res[key].messages);
        console.log(res[key].messages);
      }
      this.messageListTemplate = [...array, ...this.messageListTemplate];
      this.local_partion_count--;
    },
    deleteDialog: function(token, dialogId) {
      firebase_main
        .database()
        .ref(token)
        .child("dialogs")
        .once("value", function(snapshot) {})
        .then((snap) => {
          // console.log(snap.val())

          var selectedDialog = null;

          for (let key in snap.val()) {
            if (snap.val()[key].father_dialog_id == dialogId) {
              selectedDialog = key;
            }
          }

          firebase_main
            .database()
            .ref(token)
            .child("dialogs")
            .child(selectedDialog)
            .remove();
        });
    },
    getNewDialog: function() {
      var arrayND = [];
      firebase_main
        .database()
        .ref(this.token)
        .once("value", function() {})
        .then((res) => {
          for (let key in res.val().newDialog) {
            axios
              .get(
                "https://automessager.biz/api/client/info/" +
                  res.val().newDialog[key].id +
                  "/" +
                  this.token +
                  "/"
              )
              .then((snap) => {
                console.log(snap);
                arrayND.push({
                  id: res.val().newDialog[key].id,
                  avatar: snap.data.info["imageProfile"],
                  name: snap.data.info["name"],
                  owner: res.val().newDialog[key].owner,
                  role: {
                    id: res.val().newDialog[key].roleId,
                    name: res.val().newDialog[key].role,
                  },
                  urlError: res.val().newDialog[key].urlError,
                  Dkey: key,
                });
              })
              .catch((err) => console.log(err));
          }
          this.newDialogList = arrayND;
        });
    },
    getNewMessage: function(id) {
      console.log("new");
      var arrayR = [];

      this.newMessageList.forEach(function(snapshot) {
        if (snapshot.id == id) {
          arrayR.push(snapshot.count);
        }
      });

      return arrayR.toString();
    },
    MenuOnClick: function(id) {
      if (id == "del") {
        this.dialogDelete = true;
      }
    },
    getItemFile(file) {
      let fileId = file.files;

      if (fileId) {
        axios
          .get("https://automessager.biz/api/dialog/file/" + fileId)
          .then((response) => {
            this.fileFoo.push({
              id: file.id,
              url: response.data.url,
              type: response.data._type,
            });
            // console.log(this.fileFoo)
          });
      }
    },
    getFooFile: function(file) {
      return this.fileFoo
        .filter((x) => x.id === file.id)
        .map((x) => x.url)
        .toString();
    },
    getFooFileType: function(file) {
      // let id = file.files;
      return this.fileFoo
        .filter((x) => x.id === file.id)
        .map((x) => x.type)
        .toString();
    },
    onSend: function() {
      var text = this.dataSend.text;
      var file = this.dataSend.file;

      if (text != null && file != null) {
        if (this.ws.readyState == WebSocket.CLOSED) {
          this.openWebSocket(
            this.ws.url,
            '{"command":"file", "file":"' + file + '"}'
          );
          this.openWebSocket(
            this.ws.url,
            '{"command":"message", "text":"' + text + '"}'
          );
          this.nulling(2);
        } else if (this.ws.readyState == WebSocket.OPEN) {
          this.ws.send('{"command":"file", "file":"' + file + '"}');
          this.ws.send(
            '{"command":"message", "text":"' + this.dataSend.text + '"}'
          );
          this.nulling(2);
        }
      } else if (text != null) {
        console.log("text");
        if (this.ws.readyState == WebSocket.CLOSED) {
          this.openWebSocket(
            this.ws.url,
            '{"command":"message", "text":"' + text + '"}'
          );
          this.nulling(1, "text");
        } else if (this.ws.readyState == WebSocket.OPEN) {
          this.ws.send('{"command":"message", "text":"' + text + '"}');
          this.nulling(1, "text");
        }
      } else if (file != null) {
        if (this.ws.readyState == WebSocket.CLOSED) {
          this.openWebSocket(
            this.ws.url,
            '{"command":"file", "file":"' + file + '"}'
          );
          this.nulling(1, "file");
        } else if (this.ws.readyState == WebSocket.OPEN) {
          this.ws.send('{"command":"file", "file":"' + file + '"}');
          this.nulling(1, "file");
        }
      }
    },
    nulling: function(type, input) {
      if (this.dialogId == null) {
        var message_random_id = Math.random() * (1000 - 1) + 1;
        if (type === 1) {
          if (this.dataSend.text != null) {
            this.messageListTemplate = [
              ...this.messageListTemplate,
              {
                id: message_random_id,
                by: "sended",
                data: {
                  text: this.dataSend.text,
                  file: "",
                  type: "sended",
                  date: new Date(),
                  state: 1,
                },
              },
            ];
            this.dataSend.text = null;
          } else {
            if (this.dataSend.fileType == "image") {
              this.messageListTemplate = [
                ...this.messageListTemplate,
                {
                  id: message_random_id,
                  by: "sended",
                  data: {
                    text: "",
                    file: "",
                    sendedFile: this.dataSend.file64,
                    fileType: this.dataSend.fileType,
                    type: "sended",
                    date: new Date(),
                    state: 1,
                  },
                },
              ];

              this.dataSend.file = null;
              this.dataSend.fileType = null;
            } else {
              this.messageListTemplate = [
                ...this.messageListTemplate,
                {
                  id: message_random_id,
                  by: "sended",
                  data: {
                    text: "",
                    file: "",
                    sendedFile: this.dataSend.file64,
                    fileType: this.dataSend.fileType,
                    type: "sended",
                    date: new Date(),
                    state: 1,
                  },
                },
              ];

              this.dataSend.file = null;
              this.dataSend.fileType = null;
            }
          }
        } else if (type === 2) {
          if (this.dataSend.fileType == "image") {
            this.messageListTemplate = [
              ...this.messageListTemplate,
              {
                id: message_random_id,
                by: "sended",
                data: {
                  text: "",
                  file: "",
                  sendedFile: this.dataSend.file64,
                  fileType: this.dataSend.fileType,
                  type: "sended",
                  date: new Date(),
                  state: 1,
                },
              },
            ];

            this.dataSend.file = null;
            this.dataSend.fileType = null;
          } else {
            this.messageListTemplate = [
              ...this.messageListTemplate,
              {
                id: message_random_id,
                by: "sended",
                data: {
                  text: "",
                  file: "",
                  sendedFile: this.dataSend.file64,
                  fileType: this.dataSend.fileType,
                  type: "sended",
                  date: new Date(),
                  state: 1,
                },
              },
            ];

            this.dataSend.file = null;
            this.dataSend.fileType = null;
          }

          this.messageListTemplate = [
            ...this.messageListTemplate,
            {
              id: message_random_id,
              by: "sended",
              data: {
                text: this.dataSend.text,
                file: "",
                type: "sended",
                date: new Date(),
                state: 1,
              },
            },
          ];
          this.dataSend.text = null;
        }
      }
    },
    onSendCommand: function(text) {
      this.dataSend.text = text;
      if (text != null) {
        console.log("text");
        if (this.ws.readyState == WebSocket.CLOSED) {
          this.openWebSocket(
            this.ws.url,
            '{"command":"message", "text":"' + text + '"}'
          );
          this.nulling(1, "text");
        } else if (this.ws.readyState == WebSocket.OPEN) {
          this.ws.send('{"command":"message", "text":"' + text + '"}');
          this.nulling(1, "text");
        }
      }
    },
    getDate: function(dataDate) {
      var a = new Date(dataDate);
      var months = [
        "янв",
        "фев",
        "мар",
        "апр",
        "май",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ];
      var date = a.getDate();
      var month = months[a.getMonth()];

      var time = date + " " + month;
      return time;
    },
    getUTCDate: function(timestamp) {
      console.log(timestamp);
      var a = new Date(timestamp * 1000);
      var months = [
        "янв",
        "фев",
        "мар",
        "апр",
        "май",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = date + " " + month;
      return time;
    },
    onScrollLog(e) {
      console.log(e);
      if (e.target.scrollTop == 0) {
        this.loadMore();
      }
    },
    OnScroll: function() {
      // if (this.typeElement == "widget") {
      //   var container = this.$refs.messageList;
      //   setTimeout(() => (container.scrollTop = container.scrollHeight), 500);
      // } else {
      //   var container = this.$refs.messageContainer;
      //   setTimeout(() => (container.scrollTop = container.scrollHeight), 500);
      // }
    },
    setCommands: function(json) {
      this.commands = JSON.parse(json);
      //json=[{text:"Создать заявку", id:"fdgd"},{text:"Создать заявку", id:"fdgd"},{text:"Создать заявку", id:"fdgd"},]
    },

    onCommandsResult: function(idMenu, idDialog) {
      document.getElementById("onCommand").setAttribute("value", idMenu);
      document.getElementById("onCommand").dataset.dialogId = idDialog;
      document.getElementById("onCommand").click();
    },

    createDialog(token, dialogId, OwnerId, urlError, role, Dkey) {
      console.log(token, dialogId, OwnerId, urlError, role, Dkey);
      firebase_main
        .database()
        .ref(token)
        .once("value", function(snap) {})
        .then((res) => {
          // console.log(res);

          if (res.val() != null) {
            console.log("CREATE");
            const ids = {
              token: token,
              dialogId: dialogId,
              urlOnErrorEvent: urlError,
            };

            console.log(ids);
            // firebase_main.database().ref(token).child("dialogs").orderByChild('father_dialog_id').equalTo(dialogId).once("value", function (snapshot) {
            //     console.log(snapshot)
            // }).then((res)=>{
            //     console.log(res)
            // }).catch((err)=>{
            //
            // })

            axios
              .post("https://automessager.biz/api/virtual/create/", ids)
              .then((response) => {
                console.log(response);
                document
                  .getElementById("onCreateDialog")
                  .setAttribute("value", response.data.dialogId);
                document.getElementById("onCreateDialog").click();

                this.dialogsList.push({
                  father_dialog_id: dialogId,
                  avatar: response.data.info["imageProfile"],
                  dialogOwnerId: OwnerId,
                  id: response.data.dialogId,
                  last_message: "message",
                  last_message_date: "",
                  role: role,
                  name: response.data.info["name"],
                  phone: response.data.info["uid"],
                  token: response.data.dialogToken,
                });

                console.log(token);
                firebase_main
                  .database()
                  .ref(token)
                  .child("dialogs")
                  .push({
                    father_dialog_id: dialogId,
                    avatar: response.data.info["imageProfile"],
                    dialogOwnerId: OwnerId,
                    id: response.data.dialogId,
                    last_message: "message",
                    last_message_date: "",
                    role: role,
                    name: response.data.info["name"],
                    phone: response.data.info["uid"],
                    token: response.data.dialogToken,
                  })
                  .then((res) => {
                    // var arrayD = [];
                    // var arrayN = [];

                    firebase_main
                      .database()
                      .ref(token)
                      .child("newDialog")
                      .child(Dkey)
                      .remove();
                    // window.location.reload()
                  })
                  .catch((err) => console.log(err));

                // client.js
                //const WebSocket = require('ws')
                //const url = response.data.link
              })
              .catch(function(error) {
                // console.log(error);
              });
          } else {
            console.log("CREATE");
            //Если уже сущестует НЕ TokenToken
            const ids = {
              token: token,
              dialogId: dialogId,
              urlOnErrorEvent: urlError,
            };
            //
            // const headers = {
            //   'Access-Control-Allow-Origin': '*'
            // }
            axios
              .post("https://automessager.biz/api/virtual/create/", ids)
              .then((response) => {
                // store.state.dialogs.push({id: this.dialogId, token: response.data.dialogToken});
                //console.log('data', response.data.link);

                // this.openWebSocket(response.data.reconnect);

                // var array = response.data.info['formChannels'];

                this.dialogsList.push({
                  father_dialog_id: dialogId,
                  avatar: response.data.info["imageProfile"],
                  dialogOwnerId: OwnerId,
                  id: response.data.dialogId,
                  last_message: "message",
                  last_message_date: "",
                  role: role,
                  name: response.data.info["name"],
                  phone: response.data.info["uid"],
                  token: response.data.dialogToken,
                });

                firebase_main
                  .database()
                  .ref(token)
                  .set({
                    dialogs: [
                      {
                        father_dialog_id: dialogId,
                        avatar: response.data.info["imageProfile"],
                        dialogOwnerId: OwnerId,
                        id: response.data.dialogId,
                        last_message: "Нет сообщений",
                        last_message_date: "",
                        role: role,
                        name: response.data.info["name"],
                        phone: response.data.info["uid"],
                        token: response.data.dialogToken,
                      },
                    ],
                  })
                  .then((res) => {
                    console.log(res);

                    // var arrayD = [];
                    // var arrayN = [];

                    firebase_main
                      .database()
                      .ref(token)
                      .child("newDialog")
                      .child(Dkey)
                      .remove();
                  })
                  .catch((err) => console.log(err));

                // client.js
                //const WebSocket = require('ws')
                //const url = response.data.link
              })
              .catch(function(error) {
                // console.log(error);
              });
          }
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    dataFilesFoo() {
      // console.log(this.fileFoo);
    },
    openWebSocket(url, msg, type) {
      console.log(url, msg, type);

      this.ws = new ReconnectingWebSocket(url);
      console.log(this.ws);

      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
      }
      this.ws.onopen = () => {
        console.log(type);
        if (type == "open") {
          this.ws.send('{"command":"list"}');
        }
        // console.log(`WebSocket connect`)
      };

      this.ws.onerror = (error) => {
        // console.log(`WebSocket error: ${error}`)
      };

      this.ws.onmessage = (e) => {
        var message = JSON.parse(e.data);
        console.log(message);
        if (message.partionCount == null) {
          // this.local_partion_count--;
          this.server_message_count++;
          if (
            this.messageList.length ===
            parseInt(this.server_message_count - this.local_partion_count)
          ) {
            // console.log('for')
            for (let i in message) {
              var dataStore = message[i];

              // console.log(dataStore)

              if (this.dialogId == null) {
                if (dataStore.type == "input") {
                  this.messageList.push({
                    id: this.server_message_count,
                    messages: {
                      id: dataStore.id,
                      by: "sended",
                      data: dataStore,
                    },
                  });
                } else {
                  this.messageList.push({
                    id: this.server_message_count,
                    messages: {
                      id: dataStore.id,
                      by: "input",
                      data: dataStore,
                    },
                  });
                }
              } else {
                this.messageList.push({
                  id: this.server_message_count,
                  messages: {
                    id: dataStore.id,
                    by: dataStore.type,
                    data: dataStore,
                  },
                });
              }

              if (dataStore.files != "") {
                this.getItemFile(dataStore);
              }
            }
            if (
              this.messageList[this.messageList.length - 1].id ===
              this.server_partion_count
            ) {
              this.loadMore();
            }
          } else {
            // console.log(this.messageList)

            if (message.newId == null) {
              if (message.changestate) {
                // this.messageList[this.messageList.indexOf(data.id)].data.state = data.state;

                this.messageList.map((obj) =>
                  obj.id === message.id ? { ...obj, state: message.state } : obj
                );

                // this.messageList.splice(this.messageList.indexOf(data.id),1,{
                //     id: data.id,
                //     by: 'sended',
                //     data: {text: "key.data", type: 'input', date: new Date(), state:data.state}
                // });
              } else {
                if (message.type == "sended") {
                  this.messageListTemplate = [
                    ...this.messageListTemplate,
                    {
                      id: message.id,
                      by: "input",
                      data: message,
                    },
                  ];
                }

                if (message.files != "") {
                  this.getItemFile(message);
                }
              }
              // this.dataSend.text = null;
              // this.dataSend.file = null;
            } else {
              //let idReadedMessage = this.messageList.filter(x=>x.id===data.newId);

              // console.log(data);

              // this.updateLastMessage(this.dataSend.text);

              if (this.dataSend.text != null) {
                this.messageListTemplate = [
                  ...this.messageListTemplate,
                  {
                    id: message.newId,
                    by: "sended",
                    data: {
                      text: this.dataSend.text,
                      file: "",
                      type: "sended",
                      date: new Date(),
                      state: 1,
                    },
                  },
                ];
                this.dataSend.text = null;
              } else {
                if (this.dataSend.fileType == "image") {
                  this.messageListTemplate = [
                    ...this.messageListTemplate,
                    {
                      id: message.newId,
                      by: "sended",
                      data: {
                        text: "",
                        file: "",
                        sendedFile: this.dataSend.file64,
                        fileType: this.dataSend.fileType,
                        type: "sended",
                        date: new Date(),
                        state: 1,
                      },
                    },
                  ];

                  this.dataSend.file = null;
                  this.dataSend.fileType = null;
                } else {
                  this.messageListTemplate = [
                    ...this.messageListTemplate,
                    {
                      id: message.newId,
                      by: "sended",
                      data: {
                        text: "",
                        file: "",
                        sendedFile: this.dataSend.file64,
                        fileType: this.dataSend.fileType,
                        type: "sended",
                        date: new Date(),
                        state: 1,
                      },
                    },
                  ];

                  this.dataSend.file = null;
                  this.dataSend.fileType = null;
                }
              }
            }

            this.OnScroll();
          }
        } else {
          this.server_partion_count = message.partionCount;
          this.local_partion_count = message.partionCount;
        }
      };
      this.ws.onclose = function(event) {
        // console.log('соединение закрыто');
      };
      if (this.dialogId != null) {
        this.array_ws[this.dialogId] = Object(this.ws);
      } else {
        this.array_ws[this.channelId] = Object(this.ws);
      }
    },

    dialogReturn() {
      this.dialog.show = false;
      this.dialog.title = null;
      this.dialog.text = null;
      this.dialog.type = null;
    },
    dialogShow: function(type) {
      if (type == "dialogs") {
        this.dialog.show = true;
        this.dialog.title = "Новый диалог";
      }
    },
    dialogBtnActionClick: function(type) {
      if (type == "dialogs") {
        const data = {
          name: this.dialog.text,
          visible: true,
        };
        this.dialogReturn();
      }
    },
    updateLastMessage: function(message) {
      firebase_main
        .database()
        .ref(this.token)
        .child("dialogs")
        .once("value", function(snapshot) {})
        .then((snap) => {
          // console.log(snap.val())

          var selectedDialog = null;

          for (let key in snap.val()) {
            if (snap.val()[key].id == this.selectedDialog.id) {
              selectedDialog = key;
            }
          }

          firebase_main
            .database()
            .ref(this.token)
            .child("dialogs")
            .child(selectedDialog)
            .update({ last_message_text: message });
          // console.log(selectedDialog)
        });
    },
    getDialogItemColor: function(itemId) {
      var valueColor = "";
      if (itemId == this.selectedDialog.id) {
        valueColor = "accent";
      }
      return valueColor;
    },
    getDialogItemTitleColor: function(itemId) {
      var valueColor = "";
      if (itemId == this.selectedDialog.id) {
        valueColor = "white";
      } else valueColor = "black";
      return valueColor;
    },

    getNewDialogCreate: function(dialog) {
      this.createDialog(
        this.token,
        dialog.id,
        dialog.owner,
        dialog.urlError,
        dialog.role,
        dialog.Dkey
      );
    },

    getDialogMessages() {
      // console.log(dialog);

      // firebase_main.database().ref(this.token).child('newMessage').child(dialog.id).child('messages').remove();
      //
      // this.selectedDialog= dialog;

      // console.log(dialog)

      //create
      // var ids = {
      //   token: this.token,
      //   dialogId: this.dialogId,
      //   urlOnErrorEvent: this.urlOnErrorEvent
      // };

      // //load
      const ids = {
        dialogToken: this.dialogToken,
        dialogId: this.dialogId,
        token: this.token,
      };

      //
      // const headers = {
      //   'Access-Control-Allow-Origin': '*'
      // }
      axios
        .post("https://automessager.biz/api/virtual/load/", ids)
        .then((response) => {
          // console.log(response);
          // store.state.dialogs.push({id: this.dialogId, token: response.data.dialogToken});
          //console.log('data', response.data.link);

          let reconnect = response.data.reconnect;

          // console.log('RESPONSE:',response);

          this.dialogName = response.data.info["name"]
            ? response.data.info["name"]
            : "Без имени";
          this.openWebSocket(reconnect, null, "open");

          // client.js
          //const WebSocket = require('ws')
          //const url = response.data.link
        })
        .catch(function(error) {
          // console.log(error);
        });

      // console.log("OPEN_WEBSOCKET")
    },

    getChannelMessages() {
      if (this.$ls.get("chdtoken")) {
        console.log("load-token");

        this.ch_dialogToken = this.$ls.get("chdtoken");

        const tokenids = {
          token: this.token,
          dialogToken: this.ch_dialogToken,
          channelId: this.channelId,
        };
        // console.log("load token");
        axios
          .post("https://automessager.biz/api/virtual/load/", tokenids)
          .then((response) => {
            // console.log(response);
            //console.log('data', response.data.link);
            this.openWebSocket(response.data.reconnect, null, "open");
            // client.js

            //const WebSocket = require('ws')
            //const url = response.data.link
          })
          .catch(function(error) {
            // console.log(error);
          });
      } else {
        console.log("create token");

        const ids = {
          token: this.token,
          channelId: this.channelId,
          urlOnErrorEvent: this.urlOnError
            ? this.urlOnError
            : "http://yt.myams.biz:8080/",
        };

        axios
          .post("https://automessager.biz/api/virtual/create/", ids)
          .then((response) => {
            console.log(response);

            this.$ls.set("chdtoken", response.data.dialogToken);
            //console.log('data', response.data.link);
            this.openWebSocket(response.data.reconnect, null, "open");
            // client.js
            //const WebSocket = require('ws')
            //const url = response.data.link
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },

    onPickFile(type) {
      if (type == "fileInput") {
        this.$refs.fileInput.click();
      }
    },

    onClose: function() {
      if (this.ws.readyState == WebSocket.OPEN) {
        this.ws.send('{"command":"close"}');
        this.$ls.remove("chdtoken");
        this.dialogIsNull = true;
      } else {
        var ids = {
          dialogToken: this.dialogToken,
          dialogId: this.dialogId,
          token: this.token,
        };
        axios
          .post("http://automessager.biz/api/virtual/close/", ids)
          .then((res) => {
            this.$ls.remove("chdtoken");
            this.dialogIsNull = true;
          })
          .catch((err) => console.log(err));
      }
    },
    detectFiles(event) {
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Пожалуйста, добавьте файл");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        // this.file = e.target.result.split(',')[1];

        var imageTypes = ["jpg", "jpeg", "png", "bmp"];

        var extension = filename
            .split(".")
            .pop()
            .toLowerCase(),
          isTrue = imageTypes.indexOf(extension) > -1;

        if (isTrue) {
          this.dataSend.fileType = "image";
        } else {
          this.dataSend.fileType = "file";
        }

        this.dataSend.file64 = fileReader.result;
        this.dataSend.file = fileReader.result.split(",")[1];
        // console.log(this.dataSend.file)
      });
      fileReader.readAsDataURL(files[0]);
      this.fileAttached = true;
    },
    getListCommands() {
      if (this.messageListTemplate[this.messageListTemplate.length - 1]) {
        if (
          this.messageListTemplate[this.messageListTemplate.length - 1]
            .buttons != ""
        ) {
          this.buttonsList = this.messageListTemplate[
            this.messageListTemplate.length - 1
          ].data.buttons;
        }
      }
    },
  },
  updated() {
    this.getListCommands();
  },
  computed: {},
};
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
}

* {
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
}

.fab-wrapper {
  z-index: 999;
}

.fab-wrapper .actions-container {
  overflow: hidden;
  z-index: 0;
  position: relative;
}

.demo-description {
  max-width: 500px;
}

.demo-description img {
  max-width: 500px;
}

.demo-test-area {
  width: 300px;
  box-sizing: border-box;
}

.demo-test-area--text {
  box-sizing: border-box;
  width: 100%;
  margin: 0px;
  padding: 0px;
  resize: none;
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
  background: #fafbfc;
  color: #fff;
  border: 1px solid #dde5ed;
  font-size: 16px;
  padding: 16px 15px 14px;
  margin: 0;
  border-radius: 6px;
  outline: none;
  height: 150px;
  margin-bottom: 10px;
}

.demo-monster-img {
  width: 400px;
  display: block;
  margin: 60px auto;
}

.colors a {
  color: #fff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 10px;
}

.toggle a {
  text-decoration: none;
}

.messageStyling {
  font-size: small;
}

.fabDiv {
  position: fixed;
  bottom: 32px;
  right: 32px;
}

/* Messages */

.message {
  color: #000;
  clear: both;
  line-height: 18px;
  font-size: 15px;
  padding: 8px;
  position: relative;
  margin: 8px 0;
  max-width: 85%;
  word-wrap: break-word;
  z-index: -1;
}

.message:after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
}

.metadata {
  display: inline-block;
  float: right;
  padding: 0 0 0 7px;
  position: relative;
  bottom: -4px;
}

.metadata .time {
  color: rgba(0, 0, 0, 0.45);
  font-size: 11px;
  display: inline-block;
}

.metadata .tick {
  display: inline-block;
  margin-left: 2px;
  position: relative;
  top: 4px;
  height: 16px;
  width: 16px;
}

.metadata .tick svg {
  position: absolute;
  transition: 0.5s ease-in-out;
}

.metadata .tick svg:first-child {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: perspective(800px) rotateY(180deg);
  transform: perspective(800px) rotateY(180deg);
}

.metadata .tick svg:last-child {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: perspective(800px) rotateY(0deg);
  transform: perspective(800px) rotateY(0deg);
}

.metadata .tick-animation svg:first-child {
  -webkit-transform: perspective(800px) rotateY(0);
  transform: perspective(800px) rotateY(0);
}

.metadata .tick-animation svg:last-child {
  -webkit-transform: perspective(800px) rotateY(-179.9deg);
  transform: perspective(800px) rotateY(-179.9deg);
}

.message:first-child {
  margin: 16px 0 8px;
}

.message.received {
  background: #ececec;
  border-radius: 0px 5px 5px 5px;
  float: left;
}

.message.received .metadata {
  padding: 0 0 0 16px;
}

.message.received:after {
  border-width: 0px 10px 10px 0;
  border-color: transparent #ececec transparent transparent;
  top: 0;
  left: -10px;
}

.message.sent {
  background: #e1ffc7;
  border-radius: 5px 0px 5px 5px;
  float: right;
}

.message.sent:after {
  border-width: 0px 0 10px 10px;
  border-color: transparent transparent transparent #e1ffc7;
  top: 0;
  right: -10px;
}

/* Chat */

.chat {
}

.chat-container {
  height: 100%;
}

/* Conversation */

.conversation {
  height: calc(100% - 12px);
  position: relative;
  background: #fff;
  z-index: 0;
}

.conversation ::-webkit-scrollbar {
  transition: all 0.5s;
  width: 5px;
  height: 1px;
  z-index: 10;
}

.conversation ::-webkit-scrollbar-track {
  background: transparent;
}

.conversation ::-webkit-scrollbar-thumb {
  background: #b3ada7;
}

.conversation .conversation-container {
  height: calc(100% - 68px);
  overflow-x: hidden;
  padding: 0 16px;
  margin-bottom: 5px;
}

.conversation .conversation-container:after {
  content: "";
  display: table;
  clear: both;
}

.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}

.sc-launcher {
  padding: 0 20px;
  color: black;
  background-color: white;
  border: none;
  width: auto;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  right: 25px;
  bottom: 0;
  border-radius: 8px;
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;
  box-shadow: 0 0px 27px 1.5px rgba(0, 0, 0, 0.2);
}

.sc-launcher > span {
  margin: 0 4px;
}

.sc-launcher:before {
  position: relative;
  display: block;
  transition: box-shadow 0.2s ease-in-out;
}
.sc-launcher.opened:before {
  box-shadow: 0px 0px 400px 250px rgba(148, 149, 150, 0.2);
}
.sc-launcher:hover {
  box-shadow: 0 0px 27px 1.5px rgba(0, 0, 0, 0.3);
}

.sc-launcher:focus {
  outline-color: #b0a0fc;
}

.container__message-list {
  border-radius: 0;
  height: 400px;
  overflow-y: auto;
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  padding-left: 0;
  margin: 0 8px;
}

.nav__toolbar {
  display: flex;
}

.nav__toolbar > button {
  flex: 1 0 auto;
}

.nav__toolbar > b {
  margin: auto;
  padding-left: 8px;
  flex: 8 0 auto;
}

.sc-chat-window {
  width: 370px;
  height: calc(400px-20%);
  position: fixed;
  right: 25px;
  bottom: 20px;
  box-sizing: border-box;
  box-shadow: 0px 7px 40px 2px rgba(148, 149, 150, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  animation: fadeIn;
  animation-duration: 0.3s;
  animation-timing-function: ease-in-out;
}
@keyframes fadeIn {
  0% {
    display: none;
    opacity: 0;
  }
  100% {
    display: flex;
    opacity: 1;
  }
}
.sc-message--me {
  text-align: right;
}
.sc-message--them {
  text-align: left;
}
@media (max-width: 450px) {
  .sc-chat-window {
    width: 100%;
    height: 80&;
    right: 0px;
    left: 0px;
    bottom: 20px;
    border-radius: 0px;
  }
  .sc-chat-window {
    transition: 0.1s ease-in-out;
  }
}

.button {
  margin: 8px;
  border-radius: 8px;
  background-color: rgb(65, 73, 242);
  border: none;
  color: white;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
}

/* Darker background on mouse-over */
.button:hover {
  background-color: rgb(65, 73, 242);
}

.button__big {
  width: 100%;
}

.input__group {
  display: flex;
  align-content: stretch;
  background: white;
  border: 1px solid #ccc;
}

.input__group > textarea,
input,
button {
  flex: 1 0 auto;
}

.input__group > textarea {
  outline: none;
  border: none;
}

.input__group > button {
  border: none;
}

.message__image {
  width: 100%;
  height: 100%;
}

.alert__success {
  width: auto;
  height: auto;
  margin: 20px 16px;
  text-align: start;
  justify-items: center;
}

.alert__success > span {
  color: #3ca56c;
}

.button__group {
  display: flex;
  /*border: 1px solid red;*/
  overflow: hidden;
  border-radius: 4px;
}
</style>
