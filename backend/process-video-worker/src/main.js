import amqp from 'amqplib';
import processVideo from './videoProcessor.js';

const AMQP_CONFIG = {
    QUEUE_NAME : 'video-proc_queue',
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
                    // { video_id: "b64cacf6-5a45-4cd7-a379-7ac479c7d036", file_name: "b64cacf6-5a45-4cd7-a379-7ac479c7d036.mp4" }
                    await processVideo(task);
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