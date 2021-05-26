export interface Thread {
    is_still_participant?: any;
    thread_type?: any;
    thread?: any;
    participants?: any;
    nb_participants?: number;
    title?: any;
    messages: Array<Message>;
}

export interface Message {
    sender_name: string;
    timestamp?: any;
    timestamp_ms?: any;
    type: any;
    photos: any;
    videos: any;
    files: any;
    media: string;

    content: any;
    message: string;
    length: string;
}