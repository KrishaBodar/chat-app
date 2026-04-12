import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect(
            `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`
        );  
        const channel = await connection.createChannel();
        const queueName = 'send-otp'; 
        await channel.assertQueue(queueName, { durable: true });

        console.log('📧 Waiting for messages in send-otp...')
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());

                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASSWORD,
                        },
                });

                    await transporter.sendMail({
                        from: "Chat App",
                        to,
                        subject,
                        text: body,
                    });

                    console.log(`📩 Received message for ${to}` );
                    channel.ack(msg);
                } catch (error) {
                    console.error('❌ Error parsing message:', error);
                }
            
            }
        });
    } catch (error) {
        console.error('❌ Error in send OTP consumer:', error);
    }
}