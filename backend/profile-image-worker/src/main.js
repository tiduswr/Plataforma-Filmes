import amqp from 'amqplib';
import processImage from './imageProcessor.js';

const AMQP_CONFIG = {
    QUEUE_NAME : 'user-image-proc_queue',
    URL : `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
}

const connectToRabbitMQ = async () => {

    try{
        const connection = await amqp.connect(AMQP_CONFIG.URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(AMQP_CONFIG.QUEUE_NAME, { durable : true });

        console.log('Aguardando tarefas...');

        channel.consume(AMQP_CONFIG.QUEUE_NAME, async (msg) => {
            if(msg != null){                
                const task = JSON.parse(JSON.parse(msg.content));
                console.log(`\nProcessando tarefa: ${task.userId}, arquivo: ${task.fileName}`);

                try {
                    await processImage(task);

                    channel.ack(msg);
                } catch (error) {
                    console.error('Erro ao processar a tarefa:', error);
                    channel.nack(msg, false, true);
                }
            }
        })

    }catch(error){
        console.log('Erro ao se conectar no RabbitMQ: ', error)
    }

}

connectToRabbitMQ();