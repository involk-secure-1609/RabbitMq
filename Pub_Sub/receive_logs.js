const amqplib = require('amqplib');

const exchangeName = "logs";

const recieveMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'fanout', {durable: false});
  const q = await channel.assertQueue('', {exclusive: true});
  // by not mentioning a queue name a new name will be given to us automatically
  // and by mentioning exclusive=true and queue will be deleted when the connection if closed
  console.log(`Waiting for messages in queue: ${q.queue}`);
  channel.bindQueue(q.queue, exchangeName, '');
  // the last option in bindQueue is the routingKey which is none in this case 
  channel.consume(q.queue, msg => {
    if(msg.content) console.log("THe message is: ", msg.content.toString());
  }, {noAck: true})
}

recieveMsg();