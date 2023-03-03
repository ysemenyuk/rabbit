const amqplib = require('amqplib');

const start = async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const queue1 = 'notifications';
  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue1);

  // Listener
  ch1.consume(queue1, (msg) => {
    if (msg !== null) {
      console.log('Recieved notification:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

  // Sender
  const queue2 = 'tasks';
  const ch2 = await conn.createChannel();

  let count = 1
  setInterval(() => {
    ch1.sendToQueue(queue2, Buffer.from(`task ${count}`));
    console.log(`Send task ${count}`);
    count += 1
  }, 10000);
}

start()
