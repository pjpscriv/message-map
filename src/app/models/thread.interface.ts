export interface ParsedThread {
    is_still_participant?: boolean;
    thread_type?: string;
    thread_path: string;
    thread?: any; // kill
    participants?: Array<any>;
    nb_participants?: number;
    title?: string;
    messages: Array<Message>;
}

export interface ThreadInfo {
    is_still_participant: boolean;
    title: string;
    thread_id: string;
    thread_type: string;
    nb_participants: number;
    participants: Array<Person>;
}

interface Person {
    name: string
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
    reactions: Array<Reaction>;
}

export interface Reaction {
    reaction: string;
    actor: string;
}
