const amqplib = require('amqplib');

const start = async () => {
  const queue = 'tasks';
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);

  // Listener
  ch1.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Recieved:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

  // Sender
  // const ch2 = await conn.createChannel();

  setInterval(() => {
    ch1.sendToQueue(queue, Buffer.from('something to do'));
  }, 1000);
}

start()