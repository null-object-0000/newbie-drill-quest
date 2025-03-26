import { currentAudioConfig } from '@/store/config'
import { v4 as uuidv4 } from 'uuid'

function generateUUID() {
    return uuidv4().replace(/-/g, '')
}

interface AudioRecorderOptions {
    onResult?: (result: string) => void
    onError?: (error: string) => void
}

export class AudioRecorder {
    private websocket: WebSocket | null = null
    private audioContext: AudioContext | null = null
    private scriptProcessor: ScriptProcessorNode | null = null
    private audioInput: MediaStreamAudioSourceNode | null = null
    private audioStream: MediaStream | null = null
    private isRecording: boolean = false
    private options: AudioRecorderOptions

    constructor(options: AudioRecorderOptions = {}) {
        this.options = options
    }

    private connectWebSocket() {
        const { appKey, token } = currentAudioConfig.value
        if (!appKey || !token) {
            this.options.onError?.('请先配置语音识别服务的 AppKey 和 Token')
            return
        }
        const socketUrl = `wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1?token=${token}`

        this.websocket = new WebSocket(socketUrl)
        this.websocket.onopen = () => {
            const startTranscriptionMessage = {
                header: {
                    appkey: appKey,
                    namespace: "SpeechTranscriber",
                    name: "StartTranscription",
                    task_id: generateUUID(),
                    message_id: generateUUID()
                },
                payload: {
                    "format": "pcm",
                    "sample_rate": 16000,
                    "enable_intermediate_result": true,
                    "enable_punctuation_prediction": true,
                    "enable_inverse_text_normalization": true
                }
            }

            this.websocket?.send(JSON.stringify(startTranscriptionMessage))
        }

        this.websocket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if (message.header.name === "TranscriptionResultChanged" ||
                message.header.name === "TranscriptionCompleted") {
                this.options.onResult?.(message.payload.result)
            }
        }

        this.websocket.onerror = () => {
            this.options.onError?.('语音识别服务连接失败')
        }

        this.websocket.onclose = () => {
            this.websocket = null
        }
    }

    public async startRecording() {
        try {
            this.isRecording = true
            this.connectWebSocket()

            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000
            })
            this.audioInput = this.audioContext.createMediaStreamSource(this.audioStream)

            this.scriptProcessor = this.audioContext.createScriptProcessor(2048, 1, 1)
            this.scriptProcessor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0)
                const inputData16 = new Int16Array(inputData.length)
                for (let i = 0; i < inputData.length; ++i) {
                    inputData16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF
                }
                if (this.websocket?.readyState === WebSocket.OPEN) {
                    this.websocket.send(inputData16.buffer)
                }
            }

            this.audioInput.connect(this.scriptProcessor)
            this.scriptProcessor.connect(this.audioContext.destination)
        } catch (e) {
            console.error(e)
            this.options.onError?.('录音失败')
            this.isRecording = false
        }
    }

    public stopRecording() {
        this.isRecording = false

        if (this.scriptProcessor) {
            this.scriptProcessor.disconnect()
            this.scriptProcessor = null
        }
        if (this.audioInput) {
            this.audioInput.disconnect()
            this.audioInput = null
        }
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop())
            this.audioStream = null
        }
        if (this.audioContext) {
            this.audioContext.close()
            this.audioContext = null
        }
        if (this.websocket) {
            this.websocket.close()
            this.websocket = null
        }
    }

    public getRecordingStatus() {
        return this.isRecording
    }
}