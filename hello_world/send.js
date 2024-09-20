const amqplib = require('amqplib');

const queueName = "wdj";
const msg = "wooimabouttomakeanameformyself";

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  // setting durable as false means than if there is a RabbitMq restart then the same queue wont be created again by defualt
  // means that if it was true then when we restart it there will already be a new queue with the same name present
  await channel.assertQueue(queueName, {durable: false});
  channel.sendToQueue(queueName, Buffer.from(msg));
  console.log('Sent: ', msg);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)
}

sendMsg();