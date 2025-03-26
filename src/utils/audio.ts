import { currentAudioConfig } from '@/store/config'
import { v4 as uuidv4 } from 'uuid'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/pcm'

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
    pause: () => void
    resume: () => void
    /**
     * 关闭录音，释放录音资源，当然可以不释放，后面可以连续调用 start
     */
    close: () => void
}

export class AudioRecorder {
    private websocket: WebSocket | null = null
    private isRecording: boolean = false
    private options: AudioRecorderOptions
    private audioQueue: Int16Array[] = []
    private lastDataTime: number = 0
    private isProcessing: boolean = false

    /**
     * 所有句子
     */
    private results: string[] = []

    public getResults() {
        return this.results.join(' ')
    }

    private recorder: RecorderType | undefined

    constructor(options: AudioRecorderOptions = {}) {
        this.options = options
    }

    private async connectWebSocket() {
        const { appKey, token } = currentAudioConfig.value
        if (!appKey || !token) {
            this.options.onError?.('请先配置语音识别服务的 AppKey 和 Token')
            return
        }
        const socketUrl = `wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1?token=${token}`

        this.websocket = new WebSocket(socketUrl)
        await new Promise<void>((resolve) => {
            this.websocket!.onopen = () => {
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
                console.log('发送消息', startTranscriptionMessage)

                this.websocket!.onmessage = (event) => {
                    const message = JSON.parse(event.data)
                    if (message.header.name === "TranscriptionStarted") {
                        console.log('语音识别服务连接成功')
                        resolve()
                    } else if (message.header.name === "SentenceBegin") {
                        console.log('检测到了一句话的开始', message.payload)
                        this.results[message.payload.index] = message.payload.result
                    } else if (message.header.name === "TranscriptionResultChanged") {
                        console.log('识别结果发生了变化', message.payload)
                        this.results[message.payload.index] = message.payload.result
                    } else if (message.header.name === "SentenceEnd") {
                        console.log('检测到了一句话的结束', message.payload)
                        this.results[message.payload.index] = message.payload.result
                    } else if (message.header.name === "TranscriptionCompleted") {
                        console.log('已停止了语音转写', message.payload)
                    }

                    console.log('收到消息', this.getResults())
                    this.options.onResult?.(this.getResults())
                }
            }
        })

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
            Recorder.TrafficImgUrl = null
            this.recorder = new Recorder({
                type: 'pcm',
                sampleRate: 16000,
                bitRate: 16,
                /**
                 * @param buffers 缓冲的PCM数据，为从开始录音到现在的所有pcm片段
                 * @param powerLevel 当前缓冲的音量级别0-100
                 * @param bufferDuration 已缓冲时长
                 * @param bufferSampleRate 
                 * @param newBufferIdx 本次回调新增的buffer起始索引
                 * @param asyncEnd 
                 */
                onProcess: (buffers: Int16Array[], powerLevel: number, bufferDuration: number, bufferSampleRate: number, newBufferIdx: number, asyncEnd: () => void) => {
                    for (let i = newBufferIdx; i < buffers.length; i++) {
                        this.audioQueue.push(buffers[i])
                    }
                    this.lastDataTime = Date.now()
                    this.processQueue()
                }
            }) as RecorderType

            this.recorder.open(
                () => {
                    console.log('开始录音');
                },
                (msg: string, isUserNotAllow: boolean) => { console.log('录音失败', msg, isUserNotAllow) }
            )
        } catch (e) {
            console.error(e)
        }
    }

    private async processQueue() {
        if (this.isProcessing) return
        this.isProcessing = true

        while (this.isRecording) {
            if (this.audioQueue.length > 0) {
                if (!this.websocket) {
                    await this.connectWebSocket()
                }

                const buffer = this.audioQueue.shift()!
                const frame = new ArrayBuffer(4 + buffer.byteLength)
                const view = new DataView(frame)
                view.setUint32(0, buffer.byteLength, false)
                new Int16Array(frame, 4).set(buffer)
                this.websocket?.send(frame)
                this.lastDataTime = Date.now()
            } else {
                if (Date.now() - this.lastDataTime > 5000 && this.websocket) {
                    this.websocket.close()
                    this.websocket = null
                    console.warn('超时，关闭连接')
                }
                await new Promise(resolve => setTimeout(resolve, 100))
            }
        }

        this.isProcessing = false
    }

    public async startRecording() {
        try {
            this.isRecording = true
            this.lastDataTime = Date.now()
            this.recorder?.start()
        } catch (e) {
            console.error(e)
            this.options.onError?.('录音失败')
            this.isRecording = false
        }
    }

    public async pauseRecording() {
        this.isRecording = false

        this.recorder?.pause()

        if (this.websocket) {
            this.websocket.close()
            this.websocket = null
        }
    }

    public async resumeRecording() {
        this.isRecording = true
        this.recorder?.resume()
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