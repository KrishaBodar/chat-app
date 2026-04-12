import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(
            `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`
        );

        channel = await connection.createChannel();

        console.log('✅ Connected to RabbitMQ');
    } catch (error) {
        console.error('❌ Failed to connect to RabbitMQ:', error);
    }
};

export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        console.error('❌ RabbitMQ channel is not initialized');
        return;
    }

   
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { 
        persistent: true 
    });
    
};