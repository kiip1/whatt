/**
 * @class 
 * 
 * Represents a Whatsapp message.
 */
class Message {
  /**
   * @constructor
   * 
   * @param {String} sender The name of the sender of the message.
   * @param {MessageContent} content The content of the message.
   * @param {String} timestamp The timestamp of the message.
   */
  constructor(sender, content, timestamp) {
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
  };
};

/**
 * @class 
 * 
 * Represents the content of a Whatsapp message.
 */
class MessageContent {
  /**
   * @constructor
   * 
   * @param {String} message The text message of the message.
   * @param {String} reaction The text of the message this message is reacting to, null if the message isn't reacting to another message.
   * @param {Array} images The images of the message, if there are no images, it's an empty array.
   */
  constructor(message, reaction, images) {
    this.message = message;
    this.reaction = reaction;
    this.images = images;
  };
};