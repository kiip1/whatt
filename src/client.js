/**
 * @class
 * 
 * Represents the client.
 */
class Client {
  /**
   * @constructor
   * 
   * @param {any} options Options: prefix, self_commands, queue.
   */
  constructor({ prefix = '!', self_commands = true, queue = false } = { prefix: '!', self_commands: true, queue: false }) {
    this.commands = new Map();
    this.events = {};

    this.handledMessages = new Array();

    setInterval(() => {
      if (getChat() !== null) {
        const elements = queue ? [].slice.call(getChat().children, -5) : [getChat().lastChild];

        for (const element of elements) {
          if (element.hasAttribute('data-id')) {
            if (!this.handledMessages.includes(element.getAttribute('data-id'))) {
              this.handledMessages.push(element.getAttribute('data-id'));

              const message = this.getMessageFromElement(element);

              if (message !== undefined) {
                if (self_commands ? true : element.getAttribute('data-id').startsWith('false_')) {
                  for (const [name, callback] of this.commands.entries()) {
                    if (message.content.message.startsWith(prefix + name)) {
                      callback(message, message.content.message.substring(prefix.length + name.length).split(' ').splice(1));

                      this.emit('command', [name, callback]);

                      return;
                    };
                  };
                }

                this.emit('message', message);

                this.emit(`message_${element.getAttribute('data-id').startsWith('true_') ? 'self' : 'other'}`, message);
              };
            };
          };
        };
      };
    }, 100);

    this.emit('init');
  };

  /**
   * Registers a command.
   * 
   * Callback arguments:
   * - Message
   * - arguments
   * 
   * @param {String} name The name of the command. 
   * @param {Function} callback The callback of the command.
   */
  registerCommand(name, callback) {
    this.commands.set(name, callback);
  };

  /**
   * Unregisters a command.
   * 
   * @param {String} name The name of the command.
   */
  unregisterCommand(name) {
    this.commands.delete(name);
  };

  /**
   * Emits an event to all listeners.
   * 
   * @param {String} event The event to emit.
   * @param  {...any} args The arguments to emit with it.
   */
  emit(event, ...args) {
    for (let i of this.events[event] || []) {
      i(...args)
    };
  };

  /**
   * Listens for an event.
   * 
   * Events:
   * - init | No arguments. | Emitted on init.
   * - message | Message | Emitted on message.
   * - message_self | Message | Emitted on message by bot.
   * - message_other | Message | Emitted on message by other.
   * - command | Array with entries: [name, callback] | Emitted on command.
   * 
   * @param {String} event The event to listen for. 
   * @param {Function} callback The callback that gets triggered when the event is emitted.
   */
  on(event, callback) {
    ;(this.events[event] = this.events[event] || []).push(callback)
    return () => (this.events[event] = this.events[event].filter(i => i !== callback))
  };

  /**
   * Sends a message in the current chat.
   * 
   * @param {String} message The message to send.
   */
  sendMessage(message) {
    const cachedMessage = getTextBox().textContent;

    getTextBox().textContent = message;

    getTextBox().dispatchEvent(new InputEvent('input', { bubbles: true }));

    new Promise((resolve) => {
      if (getSendButton() !== null) {
        getSendButton().click();

        getTextBox().textContent = cachedMessage;

        getTextBox().dispatchEvent(new InputEvent('input', { bubbles: true }));

        resolve();
      };
    });
  };

  /**
   * Goes to the newest chat.
   */
  gotoNewestChat() {
    for (const element of getChats().children) {
      if (element.style.transform === 'translateY(0px)') {
        return element.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      };
    };
  };

  /**
   * Parsed an element to a message.
   * 
   * @param {Element} element The element to parse to a message.
   * 
   * @return {Message} The message parsed from the element.
   */
  getMessageFromElement(element) {
    if (element.querySelector('[data-pre-plain-text]') === null) return undefined;
  
    try {
      const sender = element.querySelector('[data-pre-plain-text]').getAttribute('data-pre-plain-text').match(/\] (.*):/)[1];
      const content = element.querySelector('[data-pre-plain-text]').lastChild.children[getChat().lastChild.querySelector('[data-pre-plain-text]').lastChild.childElementCount - 2].innerText;
      const reactionContent = element.querySelector('[data-pre-plain-text]').firstChild.firstChild.firstChild.lastChild.firstChild.lastChild.innerText;
      const images = Array.from(element.querySelector('[data-pre-plain-text]').querySelectorAll('[src^=data]'));
      const timestamp = element.querySelector('[data-pre-plain-text]').getAttribute('data-pre-plain-text').match(/\[(.*)\]/)[1];
  
      return new Message(sender, new MessageContent(content, reactionContent, images), timestamp);
    } catch (error) {
      const sender = element.querySelector('[data-pre-plain-text]').getAttribute('data-pre-plain-text').match(/\] (.*):/)[1];
      const content = element.querySelector('[data-pre-plain-text]').lastChild.children[getChat().lastChild.querySelector('[data-pre-plain-text]').lastChild.childElementCount - 2].innerText;
      const images = Array.from(element.querySelector('[data-pre-plain-text]').querySelectorAll('[src^=data]'));
      const timestamp = element.querySelector('[data-pre-plain-text]').getAttribute('data-pre-plain-text').match(/\[(.*)\]/)[1];
  
      return new Message(sender, new MessageContent(content, null, images), timestamp);
    };
  };
};