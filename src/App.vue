<template>
  <div :style="{ width: typeElement === 'widget' ? '335px' : null }">
    <div
      v-show="
        (typeElement === 'widget' && showFabWindow) || typeElement !== 'widget'
      "
      :class="{
        'sc-chat-window': typeElement === 'widget',
        opened: typeElement === 'widget' && showFabWindow,
        closed: typeElement === 'widget' && !showFabWindow,
      }"
    >
      <div v-if="!dialogueEnded" ref="chatWindow">
        <div id="messageListContainer" class="container__message-list">
          <div class="nav__toolbar">
            <b>{{ dialogName ? dialogName : 'Без имени' }}</b>
            <button @click="onClose()" class="button">
              Завершить беседу
              <done-icon></done-icon>
            </button>
          </div>
          <commands-modal v-if="showCommands"
                          :commands="commands"
                          @clickOutside="outSideClickHandler"
                          @clickCommand="(showCommands = false), onCommandCallbackHandler($event.id, dialogId)">
          </commands-modal>

          <div ref="messageList" style="position: relative; overflow-y: auto">
            <div class="chat">
              <div class="chat-container">
                <div class="conversation">
                  <div class="conversation-container">
                    <div
                      v-for="(item, idx) in messageListTemplate"
                      :key="idx"
                      :class="{
                        received: item.by === 'input',

                        sent: item.by !== 'input',
                      }"
                      class="message"
                    >
                      <div v-if="item.data.text" v-html="item.data.text" />

                      <div v-else-if="item.data.files">
                        <div v-if="getFooFileType(item.data) != 'image'">
                          <div
                            style="
                              display: flex;
                              width: 100%;
                              justify-content: space-between;
                            "
                          >
                            <a :href="getFooFile(item.data)">Файл</a>
                          </div>
                        </div>

                        <img
                          v-else
                          class="message__image"
                          alt="Image message"
                          :src="getFooFile(item.data)"
                        />
                      </div>

                      <div v-else-if="item.data.sendedFile">
                        <img
                          alt="Image"
                          class="message__image"
                          :src="item.data.sendedFile"
                        />
                      </div>
                      <div v-if="item.buttons">
                        <div v-for="(key, idx) in item.buttons" :key="idx">
                          <button @click="console.log(key.action)">
                            {{ key.text }}
                          </button>
                        </div>
                      </div>
                      <span class="metadata">
                        <span class="time">{{ getDate(item.data.date) }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert__success">
        <span> Диалог завершен </span>
        <done-icon></done-icon>
      </div>
      <div
        v-if="showActions"
        style="text-align: center; padding-top: 16px; padding-bottom: 16px"
      >
        <div v-for="(key, idx) in buttonsList" :key="idx">
          <button
            @click="onSendCommand(key.action)"
            class="button"
            style="
              width: 160px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            <small>{{ key.text }}</small>
          </button>
        </div>
      </div>

      <div v-if="!dialogueEnded" class="input__group">
        <input
          ref="fileInput"
          type="file"
          :multiple="false"
          style="display: none"
          @change="detectFiles($event)"
        />

        <button
          :style="{ color: !dataSend.file ? '#4149F2' : 'inherit' }"
          style="background: white; cursor: pointer"
          @click="onPickFile('fileInput')"
        >
          <paper-clip-icon />
        </button>

        <textarea
          v-model="dataSend.text"
          @keyup.ctrl.enter="onSendMessage()"
          placeholder="Сообщение"
          required
        ></textarea>

        <button
          style="background: white;color: #4149f2; cursor: pointer"
          @click="onSendMessage()"
        >
          <b>Отправить</b>
        </button>

        <span @click="showCommands = !showCommands" style="padding: 0 8px">
          <menu-icon> </menu-icon>
        </span>
      </div>

      <button
        id="btn__video-call"
        v-if="0"
        @click="sendVideoCall()"
        class="button button__big"
      >
        Предложить звонок

        <open-in-new-icon />
      </button>
    </div>

    <button
      v-if="typeElement === 'widget'"
      @click="showFabWindow = !showFabWindow"
      class="sc-launcher"
    >
      <span>{{ dialogName || 'Без имени' }}</span>
      <cancel-icon />
    </button>
  </div>
</template>

<script>
import axios from 'axios';

import DoneIcon from './components/Icons/DoneIcon.vue';
import PaperClipIcon from './components/Icons/PaperClip.vue';
import CancelIcon from './components/Icons/CancelIcon.vue';
import OpenInNewIcon from './components/Icons/OpenInNewIcon.vue';
import MenuIcon from './components/Icons/MenuIcon.vue';

import CommandsModal from './components/CommandsModal'

export default {
  components: {
    CommandsModal,
    CancelIcon,
    PaperClipIcon,
    DoneIcon,
    OpenInNewIcon,
    MenuIcon,
  },
  data() {
    return {
      root: null,
      dialogueEnded: false,
      showFabWindow: false,
      fileAttached: false,
      file: null,
      ws: null,
      dialogName: null,
      messageList: [],
      commands: [],
      showCommands: false,
      fileFoo: [],
      buttonsList: [],
      array_ws: [],
      messageListTemplate: [],
      dataSend: {
        text: null,
        fileType: null,
        file: null,
        file64: null,
      },
      showActions: this.$root.$el.parentElement.dataset.show_actions | false,
      dialogToken: this.$root.$el.parentElement.dataset.dtoken, // "401cf075-225e-419a-9a4a-80db8bc1d32b",
      dialogId: this.$root.$el.parentElement.dataset.dialog, //"5d38153f0e9ed01d7c830ca7"
      token: this.$root.$el.parentElement.dataset.token,
      channelId: this.$root.$el.parentElement.dataset.channel,
      typeElement: this.$root.$el.parentElement.dataset.type,
      urlOnError: this.$root.$el.parentElement.dataset.urlonerror,
      urlOnErrorEvent: 'https://ic.myams.biz/',
      server_message_count: 0,
      server_partion_count: 0,
      local_partion_count: 0,
      server_message_array: [],
      /**
       * @todo callback function for commands
       */
      onCommandCallbackHandler: null,
    };
  },

  created() {
    if (this.dialogId) {
      this.getDialogMessages();
    } else if (this.channelId) {
      this.getChannelMessages();
    }
    global.LoyamsChat = this;
  },

  methods: {
    outSideClickHandler() {
      this.showCommands = false;
    },
    async sendVideoCall() {
      const uuid = await this.get_uuid();

      const url = `https://test-app-ff08f.firebaseapp.com/${uuid}`;

      this.onSendCommand(
        `*перейдите по ссылку чтобы присоединиться к видеозвонку: ${url}`
      );

      window.open(url, '_blank');
    },

    get_uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;

        return v.toString(16);
      });
    },

    /**

     * @todo needs to refactor

     */

    loadMore() {
      var array = [];

      /*

      const res = this.messageList.filter(

        (v) => v.id == this.local_partion_count

      );

      */

      for (let message of this.messageList) {
        array.push(message.messages);
      }

      this.messageListTemplate = [...array, ...this.messageListTemplate];

      //this.local_partion_count--;
    },

    getItemFile(file) {
      let fileId = file.files;

      if (fileId) {
        axios
          .get('https://automessager.biz/api/dialog/file/' + fileId)
          .then((response) => {
            this.fileFoo.push({
              id: file.id,

              type: response.data._type,
            });
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
      return this.fileFoo

        .filter((x) => x.id === file.id)

        .map((x) => x.type)

        .toString();
    },

    onSendMessage: function(text = this.dataSend.text) {
      var file = this.dataSend.file;

      if (text && file) {
        if (this.ws.readyState == WebSocket.CLOSED) {
          this.openWebSocket(
            this.ws.url,

            '{"command":"file", "file":"' + file + '"}'
          );

          this.openWebSocket(
            this.ws.url,

            '{"command":"message", "text":"' +
              text.replace(/\n/g, '<br/>') +
              '"}'
          );

          this.nulling(2);
        } else if (this.ws.readyState == WebSocket.OPEN) {
          this.ws.send('{"command":"file", "file":"' + file + '"}');

          this.ws.send(
            '{"command":"message", "text":"' +
              text.replace(/\n/g, '<br/>') +
              '"}'
          );

          this.nulling(2);
        }
      } else if (text) {
        if (this.ws.readyState == WebSocket.CLOSED) {
          this.openWebSocket(
            this.ws.url,

            '{"command":"message", "text":"' +
              text.replace(/\n/g, '<br/>') +
              '"}'
          );

          this.nulling(1, 'text');
        } else if (this.ws.readyState == WebSocket.OPEN) {
          this.ws.send(
            '{"command":"message", "text":"' +
              text.replace(/\n/g, '<br/>') +
              '"}'
          );

          this.nulling(1, 'text');
        }
      } else if (file) {
        if (this.ws.readyState == WebSocket.CLOSED) {
          this.openWebSocket(
            this.ws.url,

            '{"command":"file", "file":"' + file + '"}'
          );

          this.nulling(1, 'file');
        } else if (this.ws.readyState == WebSocket.OPEN) {
          this.ws.send('{"command":"file", "file":"' + file + '"}');

          this.nulling(1, 'file');
        }
      }
    },

    /**

     * @todo needs to refactor

     */

    nulling: function(type, input) {
      if (this.dialogId == null) {
        const message_random_id = this.get_uuid();

        if (type === 1) {
          if (this.dataSend.text) {
            this.messageListTemplate = [
              ...this.messageListTemplate,

              {
                id: message_random_id,

                by: 'sended',

                data: {
                  text: this.dataSend.text.replace(/\n/g, '<br/>'),

                  file: '',

                  type: 'sended',

                  date: new Date(),

                  state: 1,
                },
              },
            ];

            this.dataSend.text = null;
          } else {
            if (this.dataSend.fileType == 'image') {
              this.messageListTemplate = [
                ...this.messageListTemplate,

                {
                  id: message_random_id,

                  by: 'sended',

                  data: {
                    text: '',

                    file: '',

                    sendedFile: this.dataSend.file64,

                    fileType: this.dataSend.fileType,

                    type: 'sended',

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

                  by: 'sended',

                  data: {
                    text: '',

                    file: '',

                    sendedFile: this.dataSend.file64,

                    fileType: this.dataSend.fileType,

                    type: 'sended',

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
          if (this.dataSend.fileType == 'image') {
            this.messageListTemplate = [
              ...this.messageListTemplate,

              {
                id: message_random_id,

                by: 'sended',

                data: {
                  text: '',

                  file: '',

                  sendedFile: this.dataSend.file64,

                  fileType: this.dataSend.fileType,

                  type: 'sended',

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

                by: 'sended',

                data: {
                  text: '',

                  file: '',

                  sendedFile: this.dataSend.file64,

                  fileType: this.dataSend.fileType,

                  type: 'sended',

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

              by: 'sended',

              data: {
                text: this.dataSend.text.replace(/\n/g, '<br/>'),

                file: '',

                type: 'sended',

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
        console.log('text');

        if (this.ws.readyState == WebSocket.CLOSED) {
          this.openWebSocket(
            this.ws.url,

            '{"command":"message", "text":"' + text + '"}'
          );

          this.nulling(1, 'text');
        } else if (this.ws.readyState == WebSocket.OPEN) {
          this.ws.send('{"command":"message", "text":"' + text + '"}');

          this.nulling(1, 'text');
        }
      }
    },

    getDate: function(dataDate) {
      var a = new Date(dataDate);

      var months = [
        'янв',

        'фев',

        'мар',

        'апр',

        'май',

        'июн',

        'июл',

        'авг',

        'сен',

        'окт',

        'ноя',

        'дек',
      ];

      var date = a.getDate();

      var month = months[a.getMonth()];

      var time = date + ' ' + month;

      return time;
    },

    setCommands: function(commands, callback) {
      this.onCommandCallbackHandler = callback;

      if (typeof commands === 'string') {
        this.commands = JSON.parse(json);
      } else if (Array.isArray(commands)) {
        this.commands = commands;
      } else {
        this.commands = [];
      }
      this.commands.push({ text: 'Предложить звонок', id: 0 });
    },

    onCommandsResult: function(idMenu, idDialog) {
      document.getElementById('onCommand').setAttribute('value', idMenu);

      document.getElementById('onCommand').dataset.dialogId = idDialog;

      document.getElementById('onCommand').click();

      this.showCommands = false;
    },

    openWebSocket(url, msg, type) {
      this.ws = new ReconnectingWebSocket(url);

      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
      }

      this.ws.onopen = () => {
        if (type == 'open') {
          this.ws.send('{"command":"list"}');
        }
      };

      this.ws.onerror = (error) => {
        console.error(error);
      };

      this.ws.onmessage = (e) => {
        const message = JSON.parse(e.data);

        if (message.partionCount == null) {
          this.server_message_count++;

          for (let i in message) {
            var dataStore = message[i];

            if (this.dialogId == null) {
              if (dataStore.type == 'input') {
                this.messageList.push({
                  id: this.server_message_count,

                  messages: {
                    id: dataStore.id,

                    by: 'sended',

                    data: dataStore,
                  },
                });
              } else {
                this.messageList.push({
                  id: this.server_message_count,

                  messages: {
                    id: dataStore.id,

                    by: 'input',

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

            if (dataStore.files != '') {
              this.getItemFile(dataStore);
            }
          }

          if (
            this.messageList[this.messageList.length - 1].id ===
            this.server_partion_count
          ) {
            this.loadMore();
          }

          if (message.newId == null) {
            if (message.changestate) {
              this.messageList.map((obj) =>
                obj.id === message.id ? { ...obj, state: message.state } : obj
              );
            } else {
              if (message.type == 'sended') {
                this.messageListTemplate = [
                  ...this.messageListTemplate,

                  {
                    id: message.id,

                    by: 'input',

                    data: message,
                  },
                ];
              }

              if (message.files != '') {
                this.getItemFile(message);
              }
            }
          } else {
            if (this.dataSend.text) {
              this.messageListTemplate = [
                ...this.messageListTemplate,

                {
                  id: message.newId,

                  by: 'sended',

                  data: {
                    text: this.dataSend.text.replace(/\n/g, '<br/>'),

                    file: '',

                    type: 'sended',

                    date: new Date(),

                    state: 1,
                  },
                },
              ];

              this.dataSend.text = null;
            } else {
              this.messageListTemplate = [
                ...this.messageListTemplate,

                {
                  id: message.newId,

                  by: 'sended',

                  data: {
                    text: '',

                    file: '',

                    sendedFile: this.dataSend.file64,

                    fileType: this.dataSend.fileType,

                    type: 'sended',

                    date: new Date(),

                    state: 1,
                  },
                },
              ];

              this.dataSend.file = null;

              this.dataSend.fileType = null;
            }
          }

          const messageListRef = this.$refs.messageList;

          this.$nextTick(() => {
            messageListRef.scrollTop = messageListRef.scrollHeight + 100;
          });
        } else {
          this.server_partion_count = message.partionCount;

          this.local_partion_count = message.partionCount;
        }
      };

      this.ws.onclose = function(event) {
        console.info('ws onclose: ', event);
      };

      if (this.dialogId != null) {
        this.array_ws[this.dialogId] = Object(this.ws);
      } else {
        this.array_ws[this.channelId] = Object(this.ws);
      }
    },

    /**

     * needs to refactor

     */

    getDialogMessages() {
      // //load

      const ids = {
        dialogToken: this.dialogToken,

        dialogId: this.dialogId,

        token: this.token,
      };

      axios

        .post('https://automessager.biz/api/virtual/load/', ids)

        .then((response) => {
          let reconnect = response.data.reconnect;

          this.dialogName = response.data.info['name']
            ? response.data.info['name']
            : 'Без имени';

          this.openWebSocket(reconnect, null, 'open');
        });
    },

    getChannelMessages() {
      if (localStorage.getItem('chdtoken')) {
        const channelDialogToken = JSON.parse(localStorage.getItem('chdtoken'));

        const tokenids = {
          token: this.token,

          dialogToken: channelDialogToken,

          channelId: this.channelId,
        };

        axios

          .post('https://automessager.biz/api/virtual/load/', tokenids)

          .then((response) => {
            this.openWebSocket(response.data.reconnect, null, 'open');
          });
      } else {
        const ids = {
          token: this.token,

          channelId: this.channelId,

          urlOnErrorEvent: this.urlOnError
            ? this.urlOnError
            : 'http://yt.myams.biz:8080/',
        };

        axios

          .post('https://automessager.biz/api/virtual/create/', ids)

          .then((response) => {
            console.log(response);

            localStorage.setItem(
              'chdtoken',

              JSON.stringify(response.data.dialogToken)
            );

            this.openWebSocket(response.data.reconnect, null, 'open');
          });
      }
    },

    onPickFile(type) {
      if (type == 'fileInput') {
        this.$refs.fileInput.click();
      }
    },

    onClose: function() {
      if (this.ws.readyState == WebSocket.OPEN) {
        this.ws.send('{"command":"close"}');

        localStorage.removeItem('chdtoken');

        this.dialogueEnded = true;

        setTimeout(() => {
          this.$destroy();

          /**
           * @todo remove dom element from destroy$
           */
          this.$el.parentNode.removeChild(this.$el);
        }, 2000)
      } else {
        var ids = {
          dialogToken: this.dialogToken,

          dialogId: this.dialogId,

          token: this.token,
        };

        axios

          .post('http://automessager.biz/api/virtual/close/', ids)

          .then((res) => {
            localStorage.removeItem('chdtoken');

            this.dialogueEnded = true;
          });
      }
    },

    detectFiles(event) {
      const files = event.target.files;

      let filename = files[0].name;

      if (filename.lastIndexOf('.') <= 0) {
        return alert('Пожалуйста, добавьте файл');
      }

      const fileReader = new FileReader();

      fileReader.addEventListener('load', () => {
        var imageTypes = ['jpg', 'jpeg', 'png', 'bmp'];

        var extension = filename

            .split('.')

            .pop()

            .toLowerCase(),
          isTrue = imageTypes.indexOf(extension) > -1;

        if (isTrue) {
          this.dataSend.fileType = 'image';
        } else {
          this.dataSend.fileType = 'file';
        }

        this.dataSend.file64 = fileReader.result;

        this.dataSend.file = fileReader.result.split(',')[1];
      });

      fileReader.readAsDataURL(files[0]);

      this.fileAttached = true;
    },

    /**

     * @todo

     */

    getListCommands() {
      if (this.messageListTemplate[this.messageListTemplate.length - 1]) {
        if (
          this.messageListTemplate[this.messageListTemplate.length - 1].buttons
        ) {
          this.buttonsList = this.messageListTemplate[
            this.messageListTemplate.length - 1
          ].data.buttons;
        }
      }
    },
  },

  /**

   * @todo find an optimal solution

   */

  updated() {
    //this.getListCommands();
  },
};
</script>

<style>
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
  content: '';
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
  content: '';
  display: table;
  clear: both;
}

.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}

.sc-launcher {
  display: flex;
  justify-content: center;
  align-items: center;
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
  background-color: white;
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
  margin: 0;
}

.nav__toolbar {
  display: flex;
  background: white;
  padding-left: 8px;
}

.nav__toolbar > button {
  flex: 1 0 auto;
}

.nav__toolbar > b {
  margin: auto;
  padding-left: 8px;
  flex: 8 0 auto;
}

/**
* 20vh = 20% ?
 */

.sc-chat-window {
  width: 370px;
  position: fixed;
  right: 25px;
  bottom: 20px;
  box-sizing: border-box;
  /*box-shadow: 0px 7px 40px 2px rgba(148, 149, 150, 0.1); */
  margin-bottom: 50px;
  padding: 0;
  box-shadow: 0px 0px 27px 1.5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
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

/**
* height: 80& --> height: 80%
 */

@media (max-width: 450px) {
  .sc-chat-window {
    width: 100%;
    height: 80%;
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
  display: flex;
  background: white;
  justify-content: center;
  align-items: center;
  gap: 8px;
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

.input__group > span {
  margin: auto;
}

.message__image {
  width: 100%;
  height: 100%;
}

.alert__success {
  display: flex;
  width: 100%;
  height: auto;
  margin: 20px 16px;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
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
