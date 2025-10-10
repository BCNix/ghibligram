import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

function createNewWhisper(whisper = ''){
    return {
        handle: `@Seiji 🎻`,
        profilePic: `images/seiji.jpeg`,
        likes: 0,
        rewhispers: 0,
        whisperText: whisper,
        replies: [],
        isliked: false,
        isRewhispered: false,
        isNewWhisper: true,
        uuid: uuidv4()
    }
}

export { createNewWhisper }