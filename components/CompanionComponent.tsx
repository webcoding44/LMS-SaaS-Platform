'use client';

import {useEffect, useRef, useState} from 'react'
import {cn, configureAssistant, getSubjectColor} from "@/lib/utils";
import {vapi} from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, {LottieRefCurrentProps} from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import {addToSessionHistory} from "@/lib/actions/companion.actions";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [callError, setCallError] = useState("");

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if(lottieRef) {
            if(isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => {
            setCallError("");
            setIsMuted(vapi.isMuted());
            setCallStatus(CallStatus.ACTIVE);
        };

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            void addToSessionHistory(companionId).catch(() => {
                setCallError("Your lesson ended, but we couldn't save it to your journey.");
            });
        }

        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage= { role: message.role, content: message.transcript}
                setMessages((prev) => [newMessage, ...prev])
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => {
            setCallStatus(CallStatus.INACTIVE);
            setCallError(error.message || "The voice session couldn't connect. Please try again.");
        };

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, [companionId]);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }

    const handleCall = async () => {
        setCallError("");
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: "transcript" as const,
        }

        try {
            await vapi.start(configureAssistant(voice, style), assistantOverrides)
        } catch (error) {
            setCallStatus(CallStatus.INACTIVE);
            setCallError(error instanceof Error ? error.message : "The voice session couldn't connect. Please try again.");
        }
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    return (
        <section className="flex min-h-[70vh] flex-col gap-5">
            <section className="flex gap-5 max-md:flex-col">
                <div className="companion-section">
                    <div className="companion-avatar" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <div
                            className={
                            cn(
                                'absolute transition-opacity duration-500', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0', callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            )
                        }>
                            <Image src={`/icons/${subject}.svg`} alt="" width={112} height={112} className="max-sm:w-20" />
                        </div>

                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100': 'opacity-0')}>
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="companion-lottie"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-xl">{name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{topic}</p>
                    </div>
                </div>

                <div className="user-section">
                    <div className="user-avatar">
                        <Image src={userImage} alt="" width={88} height={88} className="size-[88px] rounded-full object-cover" />
                        <p className="font-semibold text-lg">
                            {userName}
                        </p>
                    </div>
                    <button type="button" className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE} aria-pressed={isMuted}>
                        <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="" width={30} height={30} />
                        <span>
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </span>
                    </button>
                    <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm">
                        <span className="text-muted-foreground">Session status</span>
                        <span role="status" aria-live="polite" className={cn("font-semibold", callStatus === CallStatus.ACTIVE ? "text-[#187c72]" : callStatus === CallStatus.CONNECTING ? "text-primary" : "text-muted-foreground")}>
                            {callStatus === CallStatus.ACTIVE ? (isMuted ? "Muted" : "Live") : callStatus === CallStatus.CONNECTING ? "Connecting" : callStatus === CallStatus.FINISHED ? "Ended" : "Ready"}
                        </span>
                    </div>
                    {callError && <p role="alert" className="text-sm leading-5 text-destructive">{callError}</p>}
                    <button
                        type="button"
                        className={cn('btn-primary w-full', callStatus === CallStatus.ACTIVE && 'bg-destructive hover:bg-destructive/90')}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                        disabled={callStatus === CallStatus.CONNECTING}
                    >
                        {callStatus === CallStatus.ACTIVE ? "End lesson" : callStatus === CallStatus.CONNECTING ? "Connecting…" : callStatus === CallStatus.FINISHED ? "Start another lesson" : "Start lesson"}
                    </button>
                </div>
            </section>

            <section className="transcript" aria-label="Lesson transcript" aria-live="polite">
                <div className="transcript-message no-scrollbar">
                    {messages.length === 0 && (
                        <p className="m-auto text-center text-sm text-muted-foreground">Your conversation will appear here when the lesson begins.</p>
                    )}
                    {messages.map((message, index) => {
                        if(message.role === 'assistant') {
                            return (
                                <p key={index} className="max-sm:text-sm">
                                    {
                                        name
                                            .split(' ')[0]
                                            .replace('/[.,]/g, ','')
                                    }: {message.content}
                                </p>
                            )
                        } else {
                           return <p key={index} className="font-medium text-primary max-sm:text-sm">
                                {userName}: {message.content}
                            </p>
                        }
                    })}
                </div>

                <div className="transcript-fade" />
            </section>
        </section>
    )
}

export default CompanionComponent
