const amqplib = require('amqplib');

const start = async () => {
  const conn = await amqplib.connect('amqp://localhost');

  const queue1 = 'tasks';
  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue1);

  // Sender
  const queue2 = 'notifications';
  const ch2 = await conn.createChannel();

  // Listener
  ch1.consume(queue1, (msg) => {
    if (msg !== null) {
      console.log('Recieved task:', msg.content.toString());

      setTimeout(function() {
        ch1.ack(msg);
        ch1.sendToQueue(queue2, Buffer.from(`${msg.content.toString()} done`));
        console.log(`Send notification: ${msg.content.toString()} done`);
    }, 5 * 1000);

    } else {
      console.log('Consumer cancelled by server');
    }
  });

}

start()
