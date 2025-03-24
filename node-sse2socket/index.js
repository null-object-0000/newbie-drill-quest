const WebSocket = require('ws');
const OpenAI = require('openai');

// WebSocket 服务器
const wss = new WebSocket.Server({ port: 18780 });
let clients = new Map(); // 使用 Map 存储客户端和其对应的 SSE 流
let clientStates = new Map(); // 使用 Map 存储客户端的对话状态

// 配置 OpenAI 客户端
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: 'sk-93b1e770e4b84470baa224e7a2f647f2'
});

// SSE 连接函数
async function connectToSSE(ws, data) {
    try {
        // 如果该客户端正在处理消息，直接返回
        if (clientStates.get(ws)) {
            ws.send(JSON.stringify({ error: '当前会话尚未结束，请等待完成后再发送新消息' }));
            return;
        }
        
        // 设置客户端状态为正在处理
        clientStates.set(ws, true);

        const apiConfig = JSON.parse(data);
        const stream = await openai.chat.completions.create({
            ...apiConfig,
            stream: true
        });

        // 将新的流与客户端关联
        clients.set(ws, stream);

        try {
            for await (const chunk of stream) {
                const message = JSON.stringify(chunk);
                // 只发送给对应的客户端
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(message);
                }
            }
        } finally {
            // 流式响应结束后清理状态
            clients.set(ws, null);
            clientStates.set(ws, false);
        }
    } catch (error) {
        console.error('SSE connection error:', error);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ error: 'SSE connection error' }));
        }
        // 发生错误时也要清理状态
        clientStates.set(ws, false);
    }
}

// WebSocket 连接管理
wss.on('connection', (ws) => {
    clients.set(ws, null); // 初始时设置为 null
    clientStates.set(ws, false); // 初始时设置为未处理状态
    console.log('New WebSocket client connected');

    // 处理客户端消息
    ws.on('message', (message) => {
        try {
            const messageStr = message.toString();
            connectToSSE(ws, messageStr);
        } catch (error) {
            console.error('Error processing client message:', error);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ error: 'Error processing message' }));
            }
        }
    });

    ws.on('close', () => {
        // 关闭该客户端的 SSE 流
        const stream = clients.get(ws);
        if (stream) {
            stream.controller.abort();
        }
        clients.delete(ws);
        console.log('WebSocket client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:18780');