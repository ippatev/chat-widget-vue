<template>
  <div  class="commands-modal" style="z-index: 999">
    <div class="commands-modal-content" v-click-outside="clickOutside">
      <ul @click.stop>
        <li
            v-for="item in commands"
            :key="item.id"
            @click="clickCommandsItem(item)"
        >
          <b>{{ item.text }}</b>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside';

export default {
  name: "CommandsModal",
  props: {
    commands: {
      type: Array,
      required: true
    }
  },
  methods: {
    clickOutside() {
      this.$emit('clickOutside', true)
    },
    clickCommandsItem(item) {
      this.$emit('clickCommand', item)
    }
  }
}
</script>

<style scoped>
.commands-modal {
  position: absolute; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  -webkit-animation-name: fadeIn; /* Fade in the background */
  -webkit-animation-duration: 0.4s;
  animation-name: fadeIn;
  animation-duration: 0.4s;
}

/* Modal Content */
.commands-modal-content {
  position: absolute;
  bottom: 0;
  background-color: #fefefe;
  width: 100%;
  -webkit-animation-name: slideIn;
  -webkit-animation-duration: 0.4s;
  animation-name: slideIn;
  animation-duration: 0.4s;
}

.commands-modal-content > ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.commands-modal-content li {
  padding: 8px 16px;
}

/* The Close Button */
.close {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.commands-modal-header {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}

.commands-modal-body {
  padding: 2px 16px;
}

.commands-modal-footer {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}

/* Add Animation */
@-webkit-keyframes slideIn {
  from {
    bottom: -300px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    bottom: -300px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>