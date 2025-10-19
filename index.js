const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const prompt = body.prompt || 'Olá!';

        const command = new InvokeModelCommand({
            modelId: 'amazon.nova-premier-v1:0',
            body: JSON.stringify({
                messages: [{
                    role: 'user',
                    content: [{ text: prompt }]
                }],
                inferenceConfig: {
                    max_new_tokens: 1000,
                    temperature: 0.7
                }
            })
        });

        const response = await client.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.body));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                response: result.output.message.content[0].text
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};