import { currentAudioConfig } from '@/store/config'
import { v4 as uuidv4 } from 'uuid'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/wav'

function generateUUID() {
    return uuidv4().replace(/-/g, '')
}

interface AudioRecorderOptions {
    onResult?: (result: string) => void
    onError?: (error: string) => void
}

interface RecorderType {
    open: (onSuccess?: () => void, onError?: (msg: string, isUserNotAllow: boolean) => void) => void
    /**
     * 开始录音，必须在 open 之后调用
     */
    start: () => void
    /**
     * 停止录音，必须在 start 之后调用
     */
    stop: (onSuccess?: (blob: Blob, duration: number) => void, onError?: (error: any) => void) => void
    /**
     * 关闭录音，释放录音资源，当然可以不释放，后面可以连续调用 start
     */
    close: () => void
}

export class AudioRecorder {
    private websocket: WebSocket | null = null
    private isRecording: boolean = false
    private options: AudioRecorderOptions

    private recorder: RecorderType | undefined

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

    public async prepareRecording() {
        try {
            console.log('准备录音')
            this.recorder = new Recorder({
                type: 'wav',
                sampleRate: 16000,
                bitRate: 16,
                onProcess: (buffers: Int16Array[], powerLevel: number, bufferDuration: number, bufferSampleRate: number, newBufferIdx: number, asyncEnd: () => void) => {
                    // 如果全都是空内容，就不发送，所有都是 0
                    let isAllZero = true
                    for (let i = 0; i < buffers.length; i++) {
                        const buffer = buffers[i]
                        for (let j = 0; j < buffer.length; j++) {
                            if (buffer[j] !== 0) {
                                isAllZero = false
                                break
                            }
                        }
                    }
                    if (isAllZero) {
                        console.warn('全都是空内容，不发送')
                        return 
                    }

                    if (this.websocket?.readyState === WebSocket.OPEN) {
                        for (let i = 0; i < buffers.length; i++) {
                            const buffer = buffers[i]
                            this.websocket.send(buffer)
                        }
                    }
                }
            }) as RecorderType

            this.recorder.open(
                () => {
                    console.log('开始录音');
                    this.connectWebSocket()
                },
                (msg: string, isUserNotAllow: boolean) => { console.log('录音失败', msg, isUserNotAllow) }
            )
        } catch (e) {
            console.error(e)
        }
    }

    public async startRecording() {
        try {
            this.isRecording = true
            this.recorder?.start()
        } catch (e) {
            console.error(e)
            this.options.onError?.('录音失败')
            this.isRecording = false
        }
    }

    public stopRecording() {
        this.isRecording = false

        if (this.recorder) {
            this.recorder.stop(
                (blob: Blob, duration: number) => {
                    console.log('录音结束', blob, duration)
                },
                (error: any) => {
                    console.error('录音结束失败', error)
                    this.options.onError?.('录音结束失败')
                }
            )
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